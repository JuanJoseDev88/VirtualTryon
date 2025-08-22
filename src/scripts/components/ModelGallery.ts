// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const modelsGrid = document.querySelector('.models-grid') as HTMLElement;
    const modelCards = document.querySelectorAll('.model-card');
    let selectedModel: string | null = null;

    // Handle model type changes
    document.addEventListener('modelTypeChanged', (e) => {
      const customEvent = e as CustomEvent;
      const selectedType = customEvent.detail.type;
      if (modelsGrid) {
        modelsGrid.dataset.currentType = selectedType;
      }
      
      // Clear selection when switching types
      modelCards.forEach(card => card.classList.remove('selected'));
      selectedModel = null;
    });

    // Handle model selection
    modelCards.forEach(card => {
      card.addEventListener('click', () => {
        const modelType = (card as HTMLElement).dataset.modelType;
        const currentType = modelsGrid?.dataset.currentType;
        
        // Only allow selection if model type matches current type
        if (modelType === currentType) {
          modelCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedModel = (card as HTMLElement).dataset.modelId || null;
          
          // Emit selection event
          document.dispatchEvent(new CustomEvent('modelSelected', {
            detail: { 
              modelId: selectedModel,
              modelType: modelType
            }
          }));
        }
      });
    });
  });
}