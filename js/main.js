document.addEventListener("DOMContentLoaded", () => {
  console.log("🎬 Sito matrimonio caricato - Nuova struttura");

  // Elementi del DOM
  const hamburger = document.getElementById('hamburger');
  const pageNav = document.getElementById('pageNav');
  const detailsSection = document.getElementById('detailsSection');
  const introVideo = document.getElementById('introVideo');
  let menuOpen = false;

  // === SISTEMA TRANSIZIONI PAGINA ===
  const getOrCreatePageTransition = () => {
    // Prima prova a trovare l'overlay fisso nell'HTML
    let overlay = document.getElementById('pageTransitionOverlay');
    
    // Se non esiste, crealo dinamicamente (fallback)
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      overlay.id = 'pageTransitionOverlay';
      document.body.appendChild(overlay);
      console.log('🎭 Overlay creato dinamicamente');
    } else {
      console.log('🎭 Overlay trovato nell\'HTML');
    }
    
    return overlay;
  };

  // Verifica se siamo arrivati da una transizione
  const isFromTransition = () => {
    const overlay = document.getElementById('pageTransitionOverlay');
    return overlay && overlay.classList.contains('active');
  };

  const navigateWithTransition = (url) => {
    const overlay = getOrCreatePageTransition();
    
    console.log(`🔄 Iniziando transizione verso: ${url}`);
    
    // Segna che stiamo navigando (per la pagina di destinazione)
    sessionStorage.setItem('transitioning', 'true');
    
    // Chiudi il menu se aperto
    if (menuOpen) {
      toggleMenu();
    }
    
    // SUBITO: attiva l'overlay verde per coprire tutto
    overlay.classList.add('active');
    console.log('🎭 Overlay attivato immediatamente');
    
    // Dopo poco, inizia fade out pagina sotto l'overlay
    setTimeout(() => {
      document.body.classList.add('page-transitioning');
      document.body.classList.add('fade-out');
    }, 100);
    
    // Naviga dopo che tutto è coperto
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  // Intercetta i click sui link di navigazione
  const setupPageTransitions = () => {
    // Links nel menu hamburger
    const navLinks = document.querySelectorAll('.nav-link:not(.rsvp-btn)');
    const rsvpButtons = document.querySelectorAll('.rsvp-btn');
    const backLinks = document.querySelectorAll('.nav-back');
    
    [...navLinks, ...rsvpButtons, ...backLinks].forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Solo per link interni (non esterni)
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          e.preventDefault();
          navigateWithTransition(href);
        }
      });
    });
  };

  // Effetto di entrata quando la pagina si carica
  const handlePageEntry = () => {
    console.log('🚀 Iniziando handlePageEntry');
    
    // Rimuovi classi di transizione precedenti
    document.body.classList.remove('page-transitioning', 'fade-out');
    
    let overlay = document.getElementById('pageTransitionOverlay');
    
    // Se non c'è overlay, non fare niente (caricamento normale)
    if (!overlay) {
      console.log('⚡ Nessun overlay - caricamento normale');
      return;
    }
    
    // Se l'overlay non è attivo, attivalo solo se siamo in navigazione
    const isNavigating = overlay.classList.contains('active') || 
                        document.body.classList.contains('fade-out') ||
                        sessionStorage.getItem('transitioning') === 'true';
    
    if (!isNavigating) {
      console.log('⚡ Caricamento diretto - nessuna transizione');
      overlay.classList.remove('active'); // Assicurati che sia nascosto
      return;
    }
    
    console.log('🔄 Gestendo arrivo da transizione');
    
    // Rimuovi flag di navigazione
    sessionStorage.removeItem('transitioning');
    
    // L'overlay dovrebbe già essere attivo, la pagina deve solo apparire
    overlay.classList.add('active'); // Assicurati sia attivo
    
    // Aspetta che tutto sia pronto, poi rimuovi l'overlay
    setTimeout(() => {
      console.log('✅ Rimuovendo overlay');
      overlay.classList.remove('active');
      
      console.log('✨ Transizione completata');
    }, 300); // Tempo per far caricare la pagina
  };

  // === GESTIONE VIDEO INTRO ===
  if (introVideo) {
    // Rileva il browser per debug
    const browserName = navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                       navigator.userAgent.includes('Edge') ? 'Edge' : 
                       navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Altro';
    
    console.log(`🌐 Browser rilevato: ${browserName}`);

    // Tenta di riprodurre il video automaticamente
    const tryToPlayVideo = async () => {
      try {
        await introVideo.play();
        console.log('🎥 Video avviato automaticamente');
      } catch (error) {
        console.warn(`⚠️ Autoplay bloccato da ${browserName}:`, error.message);
        
        if (browserName === 'Chrome') {
          console.log('💡 Chrome ha politiche autoplay rigide - mostrando pulsante play');
        }
        
        console.log('👆 Clicca per avviare il video');
        showPlayButton();
      }
    };

    // Funzione per mostrare il pulsante play
    const showPlayButton = () => {
      // Rimuovi eventuali pulsanti esistenti
      const existingButton = document.querySelector('.play-button-overlay');
      if (existingButton) existingButton.remove();
      
      const playButton = document.createElement('div');
      playButton.className = 'play-button-overlay';
      playButton.innerHTML = `
        <div class="play-button">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <p>Clicca per riprodurre il video</p>
        </div>
      `;
      
      const videoContainer = introVideo.parentElement;
      videoContainer.appendChild(playButton);
      
      playButton.addEventListener('click', async () => {
        try {
          await introVideo.play();
          playButton.remove();
          console.log('▶️ Video avviato manualmente dall\'utente');
        } catch (error) {
          console.error('❌ Errore riproduzione manuale:', error);
        }
      });
    };

    // Event listeners per il video
    introVideo.addEventListener('loadeddata', () => {
      console.log('🎥 Video intro caricato correttamente');
      tryToPlayVideo();
    });

    introVideo.addEventListener('play', () => {
      console.log('▶️ Video in riproduzione');
      // Rimuovi il pulsante play se presente
      const playButton = document.querySelector('.play-button-overlay');
      if (playButton) playButton.remove();
    });

    introVideo.addEventListener('pause', () => {
      console.log('⏸️ Video in pausa');
    });

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
    
    introVideo.addEventListener('error', (e) => {
      console.error('❌ Errore caricamento video:', e);
      console.error('Dettagli errore:', {
        networkState: introVideo.networkState,
        readyState: introVideo.readyState,
        error: introVideo.error
      });
      
      // Mostra messaggio di errore all'utente
      showErrorMessage();
    });

    // Funzione per mostrare messaggio di errore
    const showErrorMessage = () => {
      const errorMessage = document.createElement('div');
      errorMessage.className = 'video-error-message';
      errorMessage.innerHTML = `
        <div class="error-content">
          <p>⚠️ Impossibile caricare il video</p>
          <button onclick="location.reload()">Ricarica pagina</button>
        </div>
      `;
      
      const videoContainer = introVideo.parentElement;
      videoContainer.appendChild(errorMessage);
    };
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

  // === INIZIALIZZAZIONE TRANSIZIONI ===
  setupPageTransitions();
  handlePageEntry();

  // Smooth scrolling per l'eventuale scroll interno
  const smoothScroll = () => {
    const scrollTarget = detailsSection.offsetTop;
    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  };


  console.log('✅ JavaScript inizializzato!');
});