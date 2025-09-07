// Landing page logic: persist UI language and navigate to /app.html
(function(){
  const uiSel = document.getElementById('landingUiLanguage');
  const learnBtn = document.getElementById('learnNowBtn');

  try {
    const saved = localStorage.getItem('uiLang');
    if (saved && uiSel) uiSel.value = saved;
  } catch {}

  if (uiSel) {
    uiSel.addEventListener('change', () => {
      try { localStorage.setItem('uiLang', uiSel.value); } catch {}
    });
  }

  if (learnBtn) {
    learnBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (uiSel) {
        try { localStorage.setItem('uiLang', uiSel.value); } catch {}
      }
      window.location.href = '/app.html';
    });
  }
})();
