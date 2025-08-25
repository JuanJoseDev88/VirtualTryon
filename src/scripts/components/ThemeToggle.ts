// Standalone theme toggle behavior: initialize theme and bind all theme toggle buttons
export function initThemeToggle() {
  if (typeof document === 'undefined') return;
  const themeToggles = Array.from(document.querySelectorAll('.theme-toggle')) as HTMLElement[];
  const THEME_KEY = 'vtryon-theme';

  const applyTheme = (theme: 'dark' | 'light') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      themeToggles.forEach(t => t.setAttribute('aria-pressed', 'true'));
    } else {
      document.documentElement.classList.remove('dark');
      themeToggles.forEach(t => t.setAttribute('aria-pressed', 'false'));
    }
  };

  // Initialize theme
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  } catch (err) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }

  // Bind toggles
  if (themeToggles.length) {
    themeToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isDark = document.documentElement.classList.contains('dark');
        const next = isDark ? 'light' : 'dark';
        applyTheme(next as any);
        try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
      });
    });
  }
}

// Auto-init when module is imported in the browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => initThemeToggle());
}
