document.addEventListener("DOMContentLoaded", () => {
  console.log("🎬 Sito matrimonio caricato - Nuova struttura");

  // Elementi del DOM
  const hamburger = document.getElementById('hamburger');
  const pageNav = document.getElementById('pageNav');
  const detailsSection = document.getElementById('detailsSection');
  const introVideo = document.getElementById('introVideo');
  let menuOpen = false;

  // === AUTO-SCROLL ALLA FINE DEL VIDEO ===
  if (introVideo) {
    introVideo.addEventListener('ended', () => {
      console.log('🎬 Video terminato, sblocco scroll e avvio auto-scroll...');
      
      // Sblocca lo scroll
      document.body.classList.remove('scroll-locked');
      console.log('🔓 Scroll sbloccato');
      
      // Piccolo delay per assicurarsi che lo scroll sia abilitato
      setTimeout(() => {
        // Scroll smooth verso la sezione dettagli
        detailsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        console.log('📍 Scroll automatico verso la sezione dettagli');
      }, 100);
    });

    // Log quando il video è pronto
    introVideo.addEventListener('loadeddata', () => {
      console.log('🎥 Video intro caricato correttamente');
    });
    
    introVideo.addEventListener('error', (e) => {
      console.error('Errore caricamento video:', e);
    });
  }

  // L'hamburger menu è sempre visibile

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