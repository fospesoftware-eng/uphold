// The Porsche Design System runtime injects its own favicon / meta-icon links
// into <head> at load time, which overrides the static favicon in index.html.
// This keeps the Uphold favicon enforced even after Porsche injects its own.

const FAVICON = '/favicon_uphold.png';
const isOurs = (href: string | null) => !!href && href.includes('favicon_uphold');

function apply() {
  // Drop any icon links that aren't ours (e.g. Porsche CDN icons).
  document
    .querySelectorAll<HTMLLinkElement>("link[rel~='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']")
    .forEach(el => {
      if (!isOurs(el.getAttribute('href'))) el.remove();
    });

  // Drop Porsche's web manifest (it declares its own icons/theme).
  document
    .querySelectorAll<HTMLLinkElement>("link[rel='manifest']")
    .forEach(el => {
      if ((el.getAttribute('href') ?? '').includes('porsche')) el.remove();
    });

  // Ensure ours is present.
  if (!document.querySelector("link[rel='icon'][href*='favicon_uphold']")) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = FAVICON;
    document.head.appendChild(link);
  }
}

export function enforceFavicon() {
  apply();

  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (
          node instanceof HTMLLinkElement &&
          /icon|manifest/.test(node.rel) &&
          !isOurs(node.getAttribute('href'))
        ) {
          apply();
          return;
        }
      }
    }
  });

  observer.observe(document.head, { childList: true });
}
