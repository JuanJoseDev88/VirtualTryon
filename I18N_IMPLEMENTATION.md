# Vtryon Internationalization (i18n) Implementation

## Overview
This document describes the comprehensive internationalization system implemented for the Vtryon virtual try-on application, supporting English and Spanish languages.

## Features Implemented

### 🌍 Languages Supported
- **English (en)** - Default language
- **Spanish (es)** - Secondary language

### 🏗️ Architecture Components

#### 1. Language Files
- `src/i18n/en.json` - English translations
- `src/i18n/es.json` - Spanish translations

#### 2. Server-side i18n (`src/i18n/index.ts`)
- Language detection from browser headers
- Translation functions for Astro server-side rendering
- Language validation and fallback mechanisms

#### 3. Client-side i18n (`src/i18n/client.ts`)
- Dynamic language switching in the browser
- Real-time translation updates without page reload
- LocalStorage for language preference persistence
- DOM element translation via data attributes

#### 4. Language Switcher Component
- `src/components/LanguageSwitcher.astro` - Visual language switcher
- `src/scripts/components/LanguageSwitcher.ts` - Interactive functionality
- Accessible dropdown with keyboard navigation
- Visual feedback and smooth transitions

## Implementation Details

### Data Attributes System
All translatable elements use data attributes for client-side updates:

```html
<!-- Text content -->
<h1 data-i18n="landing.hero.title">Experience the Future of</h1>

<!-- Image alt attributes -->
<img data-i18n-alt="app.imageAlt.modelPreview" alt="Model preview">

<!-- Form placeholders -->
<input data-i18n-placeholder="form.search" placeholder="Search...">

<!-- Title attributes -->
<button data-i18n-title="button.reset" title="Reset Selection">
```

### Translation Key Structure
Hierarchical organization for easy maintenance:

```javascript
{
  "common": {
    "brand": "Vtryon",
    "loading": "Loading..."
  },
  "landing": {
    "hero": {
      "title": "Experience the Future of",
      "titleHighlight": "Virtual Fashion"
    }
  },
  "app": {
    "header": {
      "title": "Virtual Try-On Studio"
    }
  }
}
```

### Usage Examples

#### Server-side (Astro components)
```astro
---
import { detectLanguage, createTranslator } from '../i18n/index';

const language = detectLanguage(Astro.request.headers.get('accept-language'));
const t = createTranslator(language);
---

<h1 data-i18n="landing.hero.title">{t('landing.hero.title')}</h1>
```

#### Client-side (TypeScript)
```typescript
import i18n from '../i18n/client';

// Change language
await i18n.setLanguage('es');

// Get translation
const text = await i18n.translate('landing.hero.title');

// Listen for language changes
i18n.onLanguageChange((language) => {
  console.log(`Language changed to: ${language}`);
});
```

## File Updates Made

### Pages
- ✅ `src/pages/index.astro` - Landing page with full i18n support
- ✅ `src/pages/app.astro` - Application page with i18n support

### Components
- ✅ `src/components/Header.astro` - Header with language switcher
- ✅ `src/components/ProcessButton.astro` - Button with translatable text
- ✅ `src/components/ModelTypeSelector.astro` - Model type selector
- ✅ `src/components/ClothingCategory.astro` - Category selector
- ✅ `src/components/LanguageSwitcher.astro` - New language switcher component

### Scripts
- ✅ `src/scripts/components/LandingPage.ts` - Enhanced with i18n support
- ✅ `src/scripts/components/LanguageSwitcher.ts` - New interactive component

## Browser Compatibility

The i18n system includes:
- Server-side rendering fallbacks
- Progressive enhancement for client-side features
- SSR-safe browser API access
- LocalStorage with fallback mechanisms

## Testing the Implementation

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Language Switching
1. Open the application in browser
2. Click the language switcher (EN/ES) in the navigation
3. Observe real-time translation updates
4. Refresh page to verify language persistence

### 3. Test Server-side Detection
1. Change browser language preference to Spanish
2. Open new incognito/private window
3. Navigate to the application
4. Page should load in Spanish by default

## Language Files Content

### Covered Text Areas
- ✅ Navigation menus
- ✅ Hero section content
- ✅ Feature descriptions
- ✅ How-it-works steps
- ✅ Demo section
- ✅ Call-to-action content
- ✅ Footer links and information
- ✅ Application interface elements
- ✅ Button labels and states
- ✅ Form labels and placeholders
- ✅ Error and success messages
- ✅ Image alt attributes
- ✅ Tooltip text

## Technical Features

### Memory Management
- Efficient translation loading (only loads needed languages)
- Caching of loaded translations
- Automatic cleanup of event listeners

### Performance
- Lazy loading of translation files
- Minimal JavaScript bundle impact
- Server-side rendering for SEO
- Progressive enhancement

### Accessibility
- Proper ARIA labels for language switcher
- Keyboard navigation support
- Screen reader compatibility
- Language attributes on HTML elements

## Future Enhancements

### Potential Additions
- Date/time formatting per locale
- Number formatting (currency, percentages)
- RTL language support
- Pluralization rules
- Language detection from URL parameters
- Additional language support (French, German, etc.)

---

The internationalization system is now fully functional and ready for production use. Users can seamlessly switch between English and Spanish with real-time updates and persistent language preferences.