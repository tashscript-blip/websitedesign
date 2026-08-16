// ================================================================
// TRANSLATION ENGINE
// ================================================================

(function() {
  'use strict';

  // Get the user's preferred language
  function getUserLanguage() {
    // 1. Check localStorage for saved preference
    const saved = localStorage.getItem('lgc_language');
    if (saved && translations[saved]) {
      return saved;
    }

    // 2. Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0]; // 'en-US' → 'en'

    // 3. Check if we support this language
    if (translations[langCode]) {
      return langCode;
    }

    // 4. Fallback to English
    return 'en';
  }

  // Apply translations to all elements with data-i18n attribute
  function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    // Get all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        // If the translation contains HTML (like <span>), we need to set it as innerHTML
        // Otherwise, use textContent to prevent XSS
        if (t[key].includes('<')) {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Special case: placeholder translations
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(function(el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.placeholder = t[key];
      }
    });

    // Update the language switcher to reflect current language
    const switcher = document.getElementById('language-switcher');
    if (switcher) {
      switcher.value = lang;
    }

    // Save preference
    localStorage.setItem('lgc_language', lang);
  }

  // Initialize the language switcher
  function initLanguageSwitcher() {
    const switcher = document.getElementById('language-switcher');
    if (!switcher) return;

    // Populate options from translations object
    const currentLang = getUserLanguage();
    // We'll keep the static options for now

    // Set current value
    switcher.value = currentLang;

    // Listen for changes
    switcher.addEventListener('change', function() {
      const lang = this.value;
      if (translations[lang]) {
        applyTranslations(lang);
      }
    });
  }

  // Detect and apply
  const lang = getUserLanguage();
  applyTranslations(lang);

  // Initialize switcher after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }

})();