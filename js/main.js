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

  // Aspetta che il video sia caricato e bloccalo sul primo frame
  backgroundVideo.addEventListener('loadedmetadata', () => {
    videoReady = true;
    console.log('✅ Video caricato - bloccato sul primo frame');
    console.log('Durata video:', backgroundVideo.duration, 'secondi');
    console.log('Dimensioni video:', backgroundVideo.videoWidth + 'x' + backgroundVideo.videoHeight);
    
    // Blocca sul primo frame
    backgroundVideo.currentTime = 0;
    backgroundVideo.pause();
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

  // Funzione per aggiornare il tempo del video basato sullo scroll - DISABILITATA
  function updateVideoTime() {
    // Video bloccato sul primo frame - non aggiornare più
    return;
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

  // HAMBURGER MENU
  const hamburger = document.getElementById('hamburger');
  const pageNav = document.getElementById('pageNav');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('active');
    pageNav.classList.toggle('show');
  });

  // Chiudi menu quando si clicca fuori
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !pageNav.contains(e.target) && menuOpen) {
      menuOpen = false;
      hamburger.classList.remove('active');
      pageNav.classList.remove('show');
    }
  });

  // NAVIGAZIONE TIPO POWERPOINT - SEZIONI CHE SI SOSTITUISCONO COMPLETAMENTE
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section-page');
  const transitionOverlay = document.getElementById('transitionOverlay');
  let currentSectionIndex = 0;
  let isTransitioning = false;

  // Funzione per mostrare una sezione specifica (tipo slide PowerPoint)
  function showSection(sectionIndex) {
    if (isTransitioning || sectionIndex === currentSectionIndex || sectionIndex < 0 || sectionIndex >= sections.length) {
      return;
    }
    
    isTransitioning = true;
    
    // Attiva overlay di transizione
    transitionOverlay.classList.add('active');
    
    setTimeout(() => {
      // Nascondi tutte le sezioni
      sections.forEach(section => section.classList.remove('active'));
      
      // Mostra nuova sezione
      sections[sectionIndex].classList.add('active');
      
      // Aggiorna pulsanti navigazione
      navButtons.forEach((btn, index) => {
        btn.classList.toggle('active', index === sectionIndex);
      });
      
      // Aggiorna indice corrente
      currentSectionIndex = sectionIndex;
      
      // Chiudi menu se aperto
      if (menuOpen) {
        menuOpen = false;
        hamburger.classList.remove('active');
        pageNav.classList.remove('show');
      }
      
      setTimeout(() => {
        // Rimuovi overlay
        transitionOverlay.classList.remove('active');
        isTransitioning = false;
      }, 200);
      
    }, 200); // Tempo per completare fade
  }

  // Event listeners per i pulsanti di navigazione
  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showSection(index);
    });
  });

  // Navigazione con le frecce della tastiera
  document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    
    if (e.key === 'ArrowDown' && currentSectionIndex < sections.length - 1) {
      showSection(currentSectionIndex + 1);
    } else if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
      showSection(currentSectionIndex - 1);
    }
  });

  // Navigazione con rotella del mouse
  let wheelTimeout;
  let wheelDelta = 0;
  document.addEventListener('wheel', (e) => {
    if (isTransitioning) {
      e.preventDefault();
      return;
    }
    
    wheelDelta += e.deltaY;
    
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (Math.abs(wheelDelta) > 500) { // Soglia alta per evitare cambi accidentali
        e.preventDefault();
        
        if (wheelDelta > 0 && currentSectionIndex < sections.length - 1) {
          showSection(currentSectionIndex + 1);
        } else if (wheelDelta < 0 && currentSectionIndex > 0) {
          showSection(currentSectionIndex - 1);
        }
        wheelDelta = 0;
      }
    }, 150);
  }, { passive: false });

  // Inizializza la prima sezione come attiva
  sections[0].classList.add('active');
  navButtons[0].classList.add('active');

  // NAVIGAZIONE SEZIONI CON SCROLL CONTINUO E TRANSIZIONI
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section-page');
  const transitionOverlay = document.getElementById('transitionOverlay');
  let currentSectionIndex = 0;
  let isTransitioning = false;

  // Funzione per navigare a una sezione specifica con effetto dissolvenza
  function scrollToSection(sectionIndex, withTransition = true) {
    if (isTransitioning || sectionIndex === currentSectionIndex) return;
    
    const targetSection = sections[sectionIndex];
    if (!targetSection) return;solo il limone
  function onScroll() {
    // updateVideoTime(); // Disabilitato - video bloccato) {
      // Avvia transizione
      isTransitioning = true;
      transitionOverlay.classList.add('active');
      
      // Aggiungi effetto fade alle sezioni
      sections.forEach((section, index) => {
        if (index === currentSectionIndex) {
          section.classList.add('fade-out');
        }
      });
      
      setTimeout(() => {
        // Esegui lo scroll durante la dissolvenza
        targetSection.scrollIntoView({ 
          behavior: 'auto', // Istantaneo durante la dissolvenza
          block: 'start'
        });
        
        // Rimuovi effetti fade
        sections.forEach(section => {
          section.classList.remove('fade-out', 'fade-in');
        });
        
        // Aggiungi fade-in alla nuova sezione
        targetSection.classList.add('fade-in');
        
        setTimeout(() => {
          // Termina transizione
          transitionOverlay.classList.remove('active');
          targetSection.classList.remove('fade-in');
          isTransitioning = false;
          
          // Aggiorna stato
          updateActiveSection(sectionIndex);
        }, 100);
      }, 300); // Durata dissolvenza
    } else {
      // Scroll normale senza transizione
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      updateActiveSection(sectionIndex);
    }
  }
  
  function updateActiveSection(sectionIndex) {
    // Aggiorna stato attivo nei pulsanti
    navButtons.forEach((btn, index) => {
      btn.classList.toggle('active', index === sectionIndex);
    });
    
    currentSectionIndex = sectionIndex;
    
    // Chiudi il menu dopo la navigazione
    if (menuOpen) {
      menuOpen = false;
      hamburger.classList.remove('active');
      pageNav.classList.remove('show');
    }
  }

  // Event listeners per i pulsanti di navigazione
  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      scrollToSection(index);
    });
  });

  // Osserva quale sezione è attualmente visibile
  const observerOptions = {
    threshold: 0.7, // Sezione deve essere 70% visibile
    rootMargin: '0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isTransitioning) {
        const sectionId = entry.target.id;
        const sectionIndex = parseInt(sectionId.split('-')[1]);
        
        if (sectionIndex !== currentSectionIndex) {
          updateActiveSection(sectionIndex);
        }
      }
    });
  }, observerOptions);

  // Osserva tutte le sezioni
  sections.forEach(section => {
    sectionObserver.observe(section);
  });

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
    if (isTransitioning) return;
    
    if (e.key === 'ArrowDown' && currentSectionIndex < sections.length - 1) {
      scrollToSection(currentSectionIndex + 1, true);
    } else if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
      scrollToSection(currentSectionIndex - 1, true);
    }
  });

  // Navigazione con rotella del mouse
  let wheelTimeout;
  let wheelDelta = 0;
  document.addEventListener('wheel', (e) => {
    if (isTransitioning) {
      e.preventDefault();
      return;
    }
    
    wheelDelta += e.deltaY;
    
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (Math.abs(wheelDelta) > 400) { // Soglia più alta per evitare cambi accidentali
        e.preventDefault();
        
        if (wheelDelta > 0 && currentSectionIndex < sections.length - 1) {
          scrollToSection(currentSectionIndex + 1, true);
        } else if (wheelDelta < 0 && currentSectionIndex > 0) {
          scrollToSection(currentSectionIndex - 1, true);
        }
        wheelDelta = 0;
      }
    }, 150);
  }, { passive: false });

  // Imposta posizioni iniziali
  updateVideoTime();
  updateLemonPosition();

  console.log('✅ Sito matrimonio con scroll continuo caricato!');
  console.log('Sezioni disponibili:', sections.length);

  // Qui in futuro:
  // - validazioni  
  // - gestione form
});
