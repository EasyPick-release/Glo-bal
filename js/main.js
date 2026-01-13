document.addEventListener("DOMContentLoaded", () => {
  console.log("Sito matrimonio caricato");

  // Rileva se è mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.innerWidth <= 768 || 
                   ('ontouchstart' in window);

  console.log('Dispositivo mobile:', isMobile);

  // Video di sfondo controllato dallo scroll (solo desktop)
  const backgroundVideo = document.getElementById('background-video');
  let videoReady = false;

  if (isMobile) {
    console.log('📱 Mobile rilevato: uso sfondo immagine invece del video');
    // Forza sfondo immagine su mobile
    document.body.style.background = "#ffffff url('assets/tovaglia2.jpg')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";
    
    if (backgroundVideo) {
      backgroundVideo.style.display = 'none';
    }
  } else {
    // Solo desktop: gestisce il video
    if (!backgroundVideo) {
      console.error('ERRORE: Video element non trovato! Controlla che ci sia <video id="background-video"> nell\'HTML');
      return;
    }
    
    console.log('Video element trovato:', backgroundVideo);
    console.log('Video src:', backgroundVideo.querySelector('source')?.src || 'Nessuna source trovata');

    // Aspetta che il video sia caricato (solo desktop)
    backgroundVideo.addEventListener('loadedmetadata', () => {
      videoReady = true;
      console.log('✅ Video prova.mp4 caricato con successo!');
      console.log('Durata video:', backgroundVideo.duration, 'secondi');
      console.log('Dimensioni video:', backgroundVideo.videoWidth + 'x' + backgroundVideo.videoHeight);
      updateVideoTime(); // Imposta il frame iniziale
    });

    // Debug: eventi di caricamento video
    backgroundVideo.addEventListener('loadstart', () => console.log('📥 Inizio caricamento video...'));
    backgroundVideo.addEventListener('canplay', () => console.log('▶️ Video pronto per la riproduzione'));
    
    // Gestione errori video
    backgroundVideo.addEventListener('error', (e) => {
      console.error('Errore caricamento prova.mp4:', e);
      // Ripristina lo sfondo immagine come fallback
      document.body.style.background = "#ffffff url('assets/tovaglia2.jpg')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    });
  }
  
  // Funzione per aggiornare il tempo del video basato sullo scroll (solo desktop)
  function updateVideoTime() {
    if (isMobile || !videoReady || !backgroundVideo || !backgroundVideo.duration) {
      if (!isMobile) console.log('⚠️ Video non pronto o durata non disponibile');
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


  // Listener per lo scroll che aggiorna video (desktop)
  function onScroll() {
    if (!isMobile) updateVideoTime();
  }

  // Listener per ridimensionamento finestr

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);
  
  // Imposta posizioni iniziali
  if (!isMobile) updateVideoTime();

  // Qui in futuro:
  // - validazioni
  // - gestione form
});
