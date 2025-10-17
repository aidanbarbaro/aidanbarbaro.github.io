// Handle fade-in on scroll and skill-bar animation + theme toggle + form handling
document.addEventListener('DOMContentLoaded', function(){
  const faders = document.querySelectorAll('.fade-in');
  const bars = document.querySelectorAll('.bar');
  const appearOptions = {threshold:0.15};
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        // animate bars when skills section becomes visible
        if(entry.target.querySelectorAll){
          const localBars = entry.target.querySelectorAll('.bar');
          localBars.forEach(b => {
            const value = b.getAttribute('data-value') || 0;
            const fill = b.querySelector('.bar-fill');
            fill.style.width = value + '%';
          });
        }
        obs.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach(f => observer.observe(f));

  // Theme toggle
  const toggle = document.getElementById('theme-toggle');
  function setTheme(theme){
    if(theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('site-theme', theme);
  }
  // init theme from localStorage or prefers-color-scheme
  const stored = localStorage.getItem('site-theme');
  if(stored) setTheme(stored);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  toggle.addEventListener('click', () => {
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(now);
  });

  // Contact form AJAX (progressive enhancement)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {'Accept': 'application/json'}
    }).then(response => {
      if(response.ok){
        status.textContent = 'Thanks — your message has been sent.';
        form.reset();
      } else {
        response.json().then(data => {
          status.textContent = data.error || 'Oops, there was a problem sending your message.';
        }).catch(()=> status.textContent = 'Oops, there was a problem sending your message.');
      }
    }).catch(()=> status.textContent = 'Network error — please try again later.');
  });
});
