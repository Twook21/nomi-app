import React from 'react';

export const ThemeScript = () => {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Error applying theme from localStorage', e);
      }
    })();
  `;

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} />
  );
};