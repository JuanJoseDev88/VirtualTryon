// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.type-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const selectedType = (tab as HTMLElement).dataset.type;
        // Emit custom event for other components to listen to
        document.dispatchEvent(new CustomEvent('modelTypeChanged', {
          detail: { type: selectedType }
        }));
      });
    });
  });
}
