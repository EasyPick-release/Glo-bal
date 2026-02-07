document.addEventListener("DOMContentLoaded", () => {
  console.log("🎬 Sito matrimonio caricato - Nuova struttura");

  // Elementi del DOM
  const hamburger = document.getElementById('hamburger');
  const pageNav = document.getElementById('pageNav');
  const detailsSection = document.getElementById('detailsSection');
  let menuOpen = false;

  // Interseztion Observer per gestire la visibilità del menu hamburger
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Il menu appare quando il 30% della sezione è visibile
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'detailsSection') {
        if (entry.isIntersecting) {
          // Mostra il menu hamburger quando arriviamo alla sezione dettagli
          hamburger.style.display = 'flex';
          hamburger.classList.add('visible');
          console.log('📱 Menu hamburger ora visibile');
        } else {
          // Nascondi il menu hamburger quando non siamo nella sezione dettagli  
          hamburger.style.display = 'none';
          hamburger.classList.remove('visible');
          // Chiudi il menu se è aperto
          if (menuOpen) {
            toggleMenu();
          }
          console.log('📱 Menu hamburger nascosto');
        }
      }
    });
  }, observerOptions);

  // Avvia l'osservazione della sezione dettagli
  if (detailsSection) {
    observer.observe(detailsSection);
  }

  // Gestione del menu hamburger
  function toggleMenu() {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('active');
    pageNav.classList.toggle('show');
    console.log('🍔 Menu ' + (menuOpen ? 'aperto' : 'chiuso'));
  }

  // Event listeners
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Chiudi il menu cliccando fuori
  document.addEventListener('click', (e) => {
    if (menuOpen && 
        !hamburger.contains(e.target) && 
        !pageNav.contains(e.target)) {
      toggleMenu();
    }
  });

  // Chiudi il menu quando si clicca su un link
  if (pageNav) {
    const navLinks = pageNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (menuOpen) {
          toggleMenu();
        }
      });
    });
  }

  // Smooth scrolling per l'eventuale scroll interno
  const smoothScroll = () => {
    const scrollTarget = detailsSection.offsetTop;
    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  };

  // Gestione del video intro (opzionale: pausa/play on hover)
  const introVideo = document.getElementById('introVideo');
  if (introVideo) {
    introVideo.addEventListener('error', (e) => {
      console.error('Errore caricamento video:', e);
      // Fallback: mostra un messaggio o un'immagine
    });

    // Log quando il video è pronto
    introVideo.addEventListener('loadeddata', () => {
      console.log('🎥 Video intro caricato correttamente');
    });
  }

  console.log('✅ JavaScript inizializzato!');
});