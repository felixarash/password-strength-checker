document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const checkBtn = document.getElementById('checkBtn');
  const resultEl = document.getElementById('result');
  const toggleBtn = document.getElementById('togglePw');
  const eyeOpen = document.getElementById('eyeOpen');
  const eyeClosed = document.getElementById('eyeClosed');
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  async function checkStrength() {
    const password = passwordInput.value || '';
    resultEl.textContent = 'Checking...';
    resultEl.className = 'mt-2 text-center text-gray-600';
    try {
      const resp = await fetch('/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await resp.json();
      resultEl.textContent = data.rating;
      let colorClass = 'text-gray-700';
      if (data.color === 'red') colorClass = 'text-red-600';
      else if (data.color === 'orange') colorClass = 'text-orange-500';
      else if (data.color === 'green') colorClass = 'text-green-600';
      resultEl.className = `mt-2 text-center font-semibold ${colorClass}`;
    } catch (e) {
      resultEl.textContent = 'Error checking password strength.';
      resultEl.className = 'mt-2 text-center text-red-600';
    }
  }

  checkBtn.addEventListener('click', checkStrength);
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkStrength();
    }
  });

  // Toggle password visibility
  toggleBtn && toggleBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    if (eyeOpen && eyeClosed) {
      eyeOpen.classList.toggle('hidden', !isHidden);
      eyeClosed.classList.toggle('hidden', isHidden);
    }
    toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });

  // Theme handling
  function updateThemeIcon(isDark) {
    if (sunIcon && moonIcon) {
      sunIcon.classList.toggle('hidden', isDark);
      moonIcon.classList.toggle('hidden', !isDark);
    }
  }

  function setInitialTheme() {
    const userPref = localStorage.getItem('theme');
    const systemPrefDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = userPref ? userPref === 'dark' : systemPrefDark;
    document.documentElement.classList.toggle('dark', isDark);
    updateThemeIcon(isDark);
  }

  setInitialTheme();

  themeToggle && themeToggle.addEventListener('click', () => {
    const nowDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nowDark);
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
    updateThemeIcon(nowDark);
  });
});