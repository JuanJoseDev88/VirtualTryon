// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const selectedCategory = (button as HTMLElement).dataset.category;
        document.dispatchEvent(new CustomEvent('categorySelected', {
          detail: { category: selectedCategory }
        }));
      });
    });
  });
}
