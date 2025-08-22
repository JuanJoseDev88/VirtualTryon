// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const modelDisplay = document.getElementById('modelDisplay');
    const modelPreview = document.getElementById('modelPreview') as HTMLElement;
    const modelImage = document.getElementById('modelImage') as HTMLImageElement;
    const modelBadge = document.getElementById('modelBadge') as HTMLElement;
    const clothingOverlay = document.getElementById('clothingOverlay') as HTMLElement;
    const clothingImage = document.getElementById('clothingImage') as HTMLImageElement;
    const emptyState = modelDisplay?.querySelector('.empty-state') as HTMLElement;
    const resetBtn = document.getElementById('resetBtn');
    
    let currentModel: { id: string; name: string; image: string } | null = null;
    let currentClothing: { id: string; name: string; image: string } | null = null;

    // Model data mapping
    const modelData: Record<string, { name: string; image: string }> = {
      '1': { name: 'Sarah', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600' },
      '2': { name: 'Emma', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=600' },
      '3': { name: 'Michael', image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400&h=600' },
      '4': { name: 'David', image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=600' }
    };

    // Clothing data mapping
    const clothingData: Record<string, { name: string; image: string }> = {
      '1': { name: 'Classic White Shirt', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300&h=400' },
      '2': { name: 'Summer Blouse', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=400' },
      '3': { name: 'Denim Jeans', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=300&h=400' },
      '4': { name: 'Elegant Dress', image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg?auto=compress&cs=tinysrgb&w=300&h=400' }
    };

    function showModel(modelId: string) {
      const model = modelData[modelId];
      if (!model) return;

      currentModel = { id: modelId, ...model };
      
      if (modelImage) modelImage.src = model.image;
      if (modelBadge) modelBadge.textContent = `Model: ${model.name}`;
      
      if (emptyState) emptyState.style.display = 'none';
      if (modelPreview) modelPreview.style.display = 'block';
      
      // Add entrance animation
      if (modelPreview) {
        modelPreview.style.opacity = '0';
        modelPreview.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
          if (modelPreview) {
            modelPreview.style.opacity = '1';
            modelPreview.style.transform = 'scale(1)';
          }
        }, 100);
      }
    }

    function showClothing(itemId: string) {
      const clothing = clothingData[itemId];
      if (!clothing || !currentModel) return;

      currentClothing = { id: itemId, ...clothing };
      
      if (clothingImage) clothingImage.src = clothing.image;
      if (clothingOverlay) clothingOverlay.style.display = 'block';
      
      // Add clothing animation
      if (clothingOverlay) {
        clothingOverlay.style.opacity = '0';
        clothingOverlay.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          if (clothingOverlay) {
            clothingOverlay.style.opacity = '1';
            clothingOverlay.style.transform = 'scale(1)';
          }
        }, 100);
      }
    }

    function resetView() {
      currentModel = null;
      currentClothing = null;
      
      if (modelPreview) modelPreview.style.display = 'none';
      if (clothingOverlay) clothingOverlay.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
    }

    // Event listeners
    document.addEventListener('modelSelected', (e) => {
      const customEvent = e as CustomEvent;
      showModel(customEvent.detail.modelId);
    });

    document.addEventListener('clothesSelected', (e) => {
      const customEvent = e as CustomEvent;
      showClothing(customEvent.detail.itemId);
    });

    document.addEventListener('modelTypeChanged', () => {
      resetView();
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', resetView);
    }
  });
}
