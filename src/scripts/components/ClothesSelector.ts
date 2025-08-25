// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const clothesGrid = document.querySelector('.clothes-grid') as HTMLElement;
    const emptyState = document.querySelector('.empty-state') as HTMLElement;
    const clothesItems = document.querySelectorAll('.clothes-item');
    const imageUploadInput = document.getElementById('imageUpload') as HTMLInputElement;

    // Update visibility based on active category
    function updateClothesVisibility(activeCategory: string) {
      if (clothesGrid) {
        clothesGrid.dataset.activeCategory = activeCategory;
      }
      
      const visibleItems = Array.from(clothesItems).filter(item => 
        (item as HTMLElement).dataset.category === activeCategory
      );
      
      if (visibleItems.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        if (clothesGrid) clothesGrid.style.display = 'none';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        if (clothesGrid) clothesGrid.style.display = 'grid';
      }
    }

    // Listen for category changes
    document.addEventListener('categorySelected', (e) => {
      const customEvent = e as CustomEvent;
      updateClothesVisibility(customEvent.detail.category);
      document.dispatchEvent(new CustomEvent('clothesSelected', {
        detail: { category: customEvent.detail.category }
      }));
    });

    // Handle try-on button clicks
    clothesItems.forEach(item => {
      const tryOnBtn = item.querySelector('.try-on-btn');
      tryOnBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const itemId = (item as HTMLElement).dataset.itemId;
        document.dispatchEvent(new CustomEvent('clothesSelected', {
          detail: { itemId }
        }));
      });
    });

    // Handle image upload
    if (imageUploadInput) {
      imageUploadInput.addEventListener('change', () => {
        if (imageUploadInput.files && imageUploadInput.files.length > 0) {
          document.dispatchEvent(new CustomEvent('imageUploaded'));
        }
      });
    }

    // Initialize with first category
    updateClothesVisibility('tops');
  });
}