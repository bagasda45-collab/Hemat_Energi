/**
 * Main JavaScript File - Smooth Interactions & Animations
 * Handles navigation, keyboard accessibility, smooth scroll reveal, and the energy simulator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navbar Toggle with Smooth State
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close on navigation click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key press (R-32)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // 2. Smooth Number Counter for Interactive Simulator
  const calcCheckboxes = document.querySelectorAll('.calc-check');
  const resultValue = document.getElementById('simResultValue');
  const resultDesc = document.getElementById('simResultDesc');
  const resultBox = document.querySelector('.calc-result-box');

  let currentWattDisplay = 0;
  let counterAnimationId = null;

  function animateWattNumber(targetValue) {
    if (counterAnimationId) {
      cancelAnimationFrame(counterAnimationId);
    }

    const startValue = currentWattDisplay;
    const duration = 300; // ms
    const startTime = performance.now();

    if (resultBox) {
      resultBox.classList.add('is-updating');
      setTimeout(() => resultBox.classList.remove('is-updating'), 250);
    }

    function updateFrame(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.round(startValue + (targetValue - startValue) * easeProgress);

      currentWattDisplay = currentNumber;

      if (targetValue === 0) {
        resultValue.textContent = '0 Watt';
      } else {
        resultValue.textContent = `± ${currentNumber} Watt`;
      }

      if (progress < 1) {
        counterAnimationId = requestAnimationFrame(updateFrame);
      }
    }

    counterAnimationId = requestAnimationFrame(updateFrame);
  }

  if (calcCheckboxes.length > 0 && resultValue && resultDesc) {
    function updateCalculator() {
      let totalWatts = 0;
      let checkedCount = 0;

      calcCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          totalWatts += parseInt(checkbox.dataset.watt || '0', 10);
          checkedCount += 1;
        }
      });

      animateWattNumber(totalWatts);

      if (checkedCount === 0) {
        resultDesc.textContent = 'Pilih satu atau lebih kebiasaan di atas untuk melihat potensi penghematan kelas.';
      } else {
        resultDesc.textContent = `Setara dengan mencegah pemborosan listrik ${(totalWatts * 5).toLocaleString('id-ID')} Watt-jam setiap hari sekolah (5 jam pelajaran).`;
      }
    }

    calcCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateCalculator);
    });

    // Initial run
    updateCalculator();
  }

  // 3. Smooth Intersection Observer (Scroll Reveal)
  const revealElements = document.querySelectorAll('.feature-card, .phase-item, .mapel-card, .about-content, .team-badge-box');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }
});
