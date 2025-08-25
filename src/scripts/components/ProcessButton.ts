// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  let hasModel = false;
  let hasClothes = false;
  let hasImageUploaded = false;

  // Check if both model and clothes are selected
  function updateButtonState() {
    const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
    if (!processBtn) return;
    processBtn.disabled = !(hasModel && hasClothes && hasImageUploaded);
    processBtn.classList.toggle('ready', hasModel && hasClothes && hasImageUploaded);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const processBtn = document.getElementById('processBtn') as HTMLButtonElement;
    if (!processBtn) return;
    
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

    // Listen for image upload
    document.addEventListener('imageUploaded', () => {
      hasImageUploaded = true;
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
      hasClothes = false;
      hasImageUploaded = false;
      updateButtonState();
    });

    // Initial state update
    updateButtonState();
  });
}