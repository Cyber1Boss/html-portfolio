// 1. GLOBAL CSS INJECTION
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    #lang-bar {
      display: flex !important; gap: 10px !important; padding: 15px !important;
      justify-content: center !important; flex-wrap: wrap !important;
      position: sticky !important; top: 0 !important; background: white !important; z-index: 10000 !important; // Added the styling to keep your flags "stuck" at the top so they aren't hidden by lang selector
    }
    #lang-bar img {
      width: 28px !important; height: 28px !important; border-radius: 50% !important;
      cursor: pointer !important; transition: transform 0.2s ease !important;
      filter: saturate(70%) !important; border: 1px solid #eee !important; object-fit: cover !important;
    }
    #lang-bar img:hover { transform: scale(1.2) !important; filter: saturate(100%) !important; }
    
    /* [ADDED] Logic to hide the Google Translate attribution bar for a cleaner UI */
    .goog-te-banner-frame { display: none !important; }
    body { top: 0 !important; }
  `;
  document.head.appendChild(style);
})();

// 2. INJECT THE FLAGS
window.addEventListener('DOMContentLoaded', function() {
  var langBar = document.getElementById('lang-bar');
  if (langBar) {
    langBar.innerHTML = `
      <img src="https://flagcdn.com/w40/us.png" onclick="changeLanguage('en')" title="English">
      <img src="https://flagcdn.com/w40/pl.png" onclick="changeLanguage('pl')" title="Polish">
      <img src="https://flagcdn.com/w40/it.png" onclick="changeLanguage('it')" title="Italian">
      <img src="https://flagcdn.com/w40/de.png" onclick="changeLanguage('de')" title="German">
      <img src="https://flagcdn.com/w40/ru.png" onclick="changeLanguage('ru')" title="Russian">
      <img src="https://flagcdn.com/w40/es.png" onclick="changeLanguage('es')" title="Español">
      <img src="https://flagcdn.com/w40/pt.png" onclick="changeLanguage('pt')" title="Portuguese">
      <img src="https://flagcdn.com/w40/cn.png" onclick="changeLanguage('zh-CN')" title="Chinese">
      <img src="https://flagcdn.com/w40/jp.png" onclick="changeLanguage('ja')" title="Japanese">
      <img src="https://flagcdn.com/w40/mn.png" onclick="changeLanguage('mn')" title="Mongolian">
      <div id="google_translate_element" style="display:none;"></div>
    `;
  }
});

// 3. TRANSLATION LOGIC
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,pl,it,de,ru,es,pt,zh-CN,ja,mn'
  }, 'google_translate_element');
}

// [UPDATED] Function now includes a check/retry loop to ensure it doesn't fail if Google is slow
function changeLanguage(langCode) {
    var select = document.querySelector('.goog-te-combo');
  
    if (select) {
        // [UPDATED] Direct selection logic
        select.value = langCode;
        select.dispatchEvent(new Event('change'));

        // [NEW: Hides the Google bar after click]
        setTimeout(function() {
            var banner = document.querySelector(".goog-te-banner-frame");
            if (banner) banner.style.display = 'none';
            document.body.style.top = '0';
        }, 100); 66    
    
        // [UPDATED] Cookie persistence logic for sub-pages
        document.cookie = "googtrans=/en/" + langCode + "; path=/; domain=" + location.hostname;
        document.cookie = "googtrans=/en/" + langCode + "; path=/;";
    } else {
    // [ADDED] Retry loop: waits 500ms if the Google Widget isn't ready yet
        setTimeout(function() {
            changeLanguage(langCode);
            }, 500);
  }
}

// 4. [UPDATED] Page load logic: wait 1.5s to ensure Google has rendered the hidden menu
window.addEventListener('load', function() {
    var cookieValue = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    if (cookieValue) {
        var lang = cookieValue.split('/')[2];
        setTimeout(function() { changeLanguage(lang); }, 1500);
    }
    });

// 5. LOAD GOOGLE ENGINE
var script = document.createElement('script');
script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
document.body.appendChild(script);
