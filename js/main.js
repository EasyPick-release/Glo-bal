document.addEventListener("DOMContentLoaded", () => {
  console.log("Sito matrimonio caricato");

  // Video di sfondo controllato dallo scroll (tutti i dispositivi)
  const backgroundVideo = document.getElementById('background-video');
  let videoReady = false;

  if (!backgroundVideo) {
    console.error('ERRORE: Video element non trovato! Controlla che ci sia <video id="background-video"> nell\'HTML');
    return;
  }
  
  console.log('Video element trovato:', backgroundVideo);
  console.log('Video src:', backgroundVideo.querySelector('source')?.src || 'Nessuna source trovata');

  // Aspetta che il video sia caricato
  backgroundVideo.addEventListener('loadedmetadata', () => {
    videoReady = true;
    console.log('✅ Video caricato con successo!');
    console.log('Durata video:', backgroundVideo.duration, 'secondi');
    console.log('Dimensioni video:', backgroundVideo.videoWidth + 'x' + backgroundVideo.videoHeight);
    updateVideoTime(); // Imposta il frame iniziale
  });

  // Debug: eventi di caricamento video
  backgroundVideo.addEventListener('loadstart', () => console.log('📥 Inizio caricamento video...'));
  backgroundVideo.addEventListener('canplay', () => console.log('▶️ Video pronto per la riproduzione'));
  
  // Gestione errori video
  backgroundVideo.addEventListener('error', (e) => {
    console.error('Errore caricamento video:', e);
    // Ripristina lo sfondo immagine come fallback
    document.body.style.background = "#ffffff url('assets/tovaglia2.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  });
    backgroundVideo.addEventListener('error', (e) => {
      console.error('Errore caricamento prova.mp4:', e);
      // Ripristina lo sfondo immagine come fallback
      document.body.style.background = "#ffffff url('assets/tovaglia2.jpg')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    });

  // Funzione per aggiornare il tempo del video basato sullo scroll
  function updateVideoTime() {
    if (!videoReady || !backgroundVideo || !backgroundVideo.duration) {
      console.log('⚠️ Video non pronto o durata non disponibile');
      return;
    }

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;
    
    let scrollPercent;
    if (maxScroll <= 0) {
      scrollPercent = 0;
    } else {
      scrollPercent = window.scrollY / maxScroll;
    }
    
    const clampedPercent = Math.min(Math.max(scrollPercent, 0), 1);
    
    // Calcola il tempo del video basato sulla percentuale di scroll
    const videoTime = clampedPercent * backgroundVideo.duration;
    const oldTime = backgroundVideo.currentTime;
    
    // NUOVO: Debug dettagliato del seeking
    console.log('🔍 PRIMA - currentTime:', backgroundVideo.currentTime.toFixed(2));
    console.log('🔍 SEEKABLE:', backgroundVideo.seekable.length > 0 ? 
                `${backgroundVideo.seekable.start(0).toFixed(2)}-${backgroundVideo.seekable.end(0).toFixed(2)}` : 'NO');
    
    try {
      backgroundVideo.currentTime = videoTime;
      
      // Forza il refresh del video
      setTimeout(() => {
        console.log('🔍 DOPO - currentTime:', backgroundVideo.currentTime.toFixed(2));
        console.log('🔍 DIFFERENZA:', Math.abs(backgroundVideo.currentTime - videoTime).toFixed(3));
        
        // Se il seeking non funziona, prova un approccio alternativo
        if (Math.abs(backgroundVideo.currentTime - videoTime) > 0.5) {
          console.warn('⚠️ Seeking non preciso, provo approccio alternativo...');
          
          // Pausa e riproduci per forzare il refresh
          backgroundVideo.pause();
          backgroundVideo.currentTime = videoTime;
          backgroundVideo.play().then(() => {
            backgroundVideo.pause();
          }).catch(e => console.log('Play/pause fallito:', e));
        }
      }, 50);
      
    } catch (error) {
      console.error('❌ Errore nel seeking:', error);
    }
    
    console.log('🎬 Scroll:', (clampedPercent * 100).toFixed(1) + '%', 
                '| Target:', videoTime.toFixed(2) + 's', 
                '| Actual:', backgroundVideo.currentTime.toFixed(2) + 's');
  }

  // Limone che rotola lungo un arco durante lo scroll
  const lemon = document.getElementById('lemon');
  let rotation = 0;
  
  function updateLemonPosition() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;
    
    let scrollPercent = 0;
    if (maxScroll > 0) {
      scrollPercent = window.scrollY / maxScroll;
    }
    
    const clampedPercent = Math.min(Math.max(scrollPercent, 0), 1);
    
    const startX = window.innerWidth - 100;
    const startY = 30;
    const endX = window.innerWidth + 80;
    const endY = window.innerHeight - 100;
    
    const currentX = startX + (endX - startX) * clampedPercent;
    
    const arcHeight = 150;
    const currentY = startY + 
      (endY - startY) * clampedPercent + 
      Math.sin(clampedPercent * Math.PI) * arcHeight;
    
    rotation = clampedPercent * 720;
    
    lemon.style.left = `${currentX}px`;
    lemon.style.top = `${currentY}px`;
    lemon.style.transform = `rotate(${rotation}deg)`;
  }

  // Listener per lo scroll che aggiorna video e limone
  function onScroll() {
    updateVideoTime();
    updateLemonPosition();
  }

  // Listener per ridimensionamento finestra
  function onResize() {
    updateLemonPosition();
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);
  
  // Imposta posizioni iniziali
  updateVideoTime();
  updateLemonPosition();

  // NAVIGAZIONE PAGINE CON EFFETTI DI DISSOLVENZA
  const navButtons = document.querySelectorAll('.nav-btn');
  const pages = document.querySelectorAll('.page');
  let currentPageIndex = 0;

  function showPage(pageIndex) {
    // Nascondi la pagina corrente
    pages[currentPageIndex].classList.remove('active');
    navButtons[currentPageIndex].classList.remove('active');
    
    // Mostra la nuova pagina dopo un piccolo ritardo per l'effetto
    setTimeout(() => {
      pages[pageIndex].classList.add('active');
      navButtons[pageIndex].classList.add('active');
      currentPageIndex = pageIndex;
    }, 100);
  }

  // Aggiungi event listeners ai pulsanti di navigazione
  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (index !== currentPageIndex) {
        showPage(index);
      }
    });
  });

  // Navigazione con le frecce della tastiera
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentPageIndex < pages.length - 1) {
      showPage(currentPageIndex + 1);
    } else if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
      showPage(currentPageIndex - 1);
    }
  });

  // Cambio automatico delle pagine ogni 10 secondi (opzionale)
  let autoSlideInterval;
  
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      const nextPage = (currentPageIndex + 1) % pages.length;
      showPage(nextPage);
    }, 8000); // 8 secondi
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  // Avvia il cambio automatico dopo 3 secondi di inattività
  let inactivityTimer;
  
  function resetInactivityTimer() {
    stopAutoSlide();
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
      startAutoSlide();
    }, 3000);
  }

  // Reset timer su interazione utente
  navButtons.forEach(button => {
    button.addEventListener('click', resetInactivityTimer);
  });
  
  document.addEventListener('keydown', resetInactivityTimer);
  document.addEventListener('mousemove', resetInactivityTimer);

  // Avvia il timer iniziale
  resetInactivityTimer();

  // Qui in futuro:
  // - validazioni
  // - gestione form
});
