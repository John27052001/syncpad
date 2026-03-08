import Script from 'next/script';

export function ThemeScript() {
  return (
    <Script
      id="syncpad-theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            try {
              var theme = localStorage.getItem('syncpad-theme');
              if (!theme) theme = 'dark';
              document.documentElement.dataset.theme = theme;
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}

