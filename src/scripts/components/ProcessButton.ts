// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
    if (!processBtn) return;
    
    let hasModel = false;
    let hasClothes = false;

    // Check if both model and clothes are selected
    function updateButtonState() {
      processBtn.disabled = !(hasModel && hasClothes);
      processBtn.classList.toggle('ready', hasModel && hasClothes);
    }

    // Listen for model selection
    document.addEventListener('modelSelected', () => {
      hasModel = true;
      updateButtonState();
    });

    // Listen for clothes selection
    document.addEventListener('clothesSelected', () => {
      hasClothes = true;
      updateButtonState();
    });

    // Handle button click
    processBtn.addEventListener('click', () => {
      if (processBtn.disabled) return;

      processBtn.classList.add('processing');
      
      // Simulate processing time
      setTimeout(() => {
        processBtn.classList.remove('processing');
        processBtn.classList.add('completed');
        
        // Reset after showing completion
        setTimeout(() => {
          processBtn.classList.remove('completed');
        }, 2000);
      }, 3000);
    });

    // Reset selections when model type changes
    document.addEventListener('modelTypeChanged', () => {
      hasModel = false;
      updateButtonState();
    });
  });
}