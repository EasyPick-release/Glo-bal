document.addEventListener("DOMContentLoaded", () => {
  console.log("🎬 Sito matrimonio caricato - Nuova struttura");

  // Elementi del DOM
  const hamburger = document.getElementById('hamburger');
  const pageNav = document.getElementById('pageNav');
  const detailsSection = document.getElementById('detailsSection');
  const introVideo = document.getElementById('introVideo');
  let menuOpen = false;

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