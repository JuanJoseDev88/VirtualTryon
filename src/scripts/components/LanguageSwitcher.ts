// Check if we're in the browser environment
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    // Import i18n client
    const { default: i18n } = await import('../../i18n/client');
    
    const switcher = document.getElementById('languageSwitcher');
    const toggle = document.getElementById('langToggle');
    const dropdown = document.getElementById('langDropdown');
    const currentLangSpan = document.getElementById('currentLang');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!switcher || !toggle || !dropdown || !currentLangSpan) return;
    
    // Language display mapping
    const langDisplay: Record<string, string> = {
      'en': 'EN',
      'es': 'ES'
    };
    
    // Initialize current language display
    const updateCurrentLanguageDisplay = (language: string) => {
      currentLangSpan.textContent = langDisplay[language] || 'EN';
      
      // Update active state in dropdown
      langOptions.forEach(option => {
        const optionLang = (option as HTMLElement).dataset.lang;
        option.classList.toggle('active', optionLang === language);
      });
    };
    
    // Set initial language display
    const currentLang = i18n.getCurrentLanguage();
    updateCurrentLanguageDisplay(currentLang);
    
    // Toggle dropdown
    const toggleDropdown = (e: Event) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    };
    
    // Close dropdown when clicking outside
    const closeDropdown = (e: Event) => {
      if (!switcher.contains(e.target as Node)) {
        switcher.classList.remove('open');
      }
    };
    
    // Handle language selection
    const handleLanguageSelect = async (e: Event) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const button = target.closest('.lang-option') as HTMLElement;
      
      if (!button) return;
      
      const selectedLang = button.dataset.lang;
      if (!selectedLang) return;
      
      try {
        // Change language
        await i18n.setLanguage(selectedLang as any);
        
        // Update display
        updateCurrentLanguageDisplay(selectedLang);
        
        // Close dropdown
        switcher.classList.remove('open');
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
        
        console.log(`Language changed to: ${selectedLang}`);
      } catch (error) {
        console.error('Failed to change language:', error);
      }
    };
    
    // Listen for language changes from other sources
    i18n.onLanguageChange((language) => {
      updateCurrentLanguageDisplay(language);
    });
    
    // Event listeners
    toggle.addEventListener('click', toggleDropdown);
    document.addEventListener('click', closeDropdown);
    
    langOptions.forEach(option => {
      option.addEventListener('click', handleLanguageSelect);
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && switcher.classList.contains('open')) {
        switcher.classList.remove('open');
        toggle.focus();
      }
    });
    
    // Keyboard navigation for dropdown
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const options = Array.from(langOptions) as HTMLElement[];
        const currentIndex = options.findIndex(option => option === document.activeElement);
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        }
        
        options[nextIndex].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        (document.activeElement as HTMLElement).click();
      }
    });
    
    console.log('Language switcher initialized');
  });
}