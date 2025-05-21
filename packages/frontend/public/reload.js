// Force cache refresh
console.log("Cache refresh script loaded: " + new Date().toISOString());
// Add timestamp to all script URLs
document.addEventListener('DOMContentLoaded', () => {
  const timestamp = new Date().getTime();
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src && !src.includes('reload.js')) {
      script.setAttribute('src', src.includes('?') ? src + '&v=' + timestamp : src + '?v=' + timestamp);
    }
  });
});