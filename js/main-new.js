document.addEventListener("DOMContentLoaded", () => {
  console.log("Sito matrimonio caricato - Sistema PowerPoint");


  //window.addEventListener('scroll', updateLemonPosition);
  //window.addEventListener('resize', updateLemonPosition);

  // HAMBURGER MENU
  const hamburger = document.getElementById('hamburger');
  const pageNav = document.getElementById('pageNav');
  let menuOpen = false;

  if (hamburger && pageNav) {
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      hamburger.classList.toggle('active');
      pageNav.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !pageNav.contains(e.target) && menuOpen) {
        menuOpen = false;
        hamburger.classList.remove('active');
        pageNav.classList.remove('show');
      }
    });
  }

  // NAVIGAZIONE TIPO POWERPOINT
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.section-page');
  const transitionOverlay = document.getElementById('transitionOverlay');
  let currentSectionIndex = 0;
  let isTransitioning = false;

  function showSection(sectionIndex) {
    if (isTransitioning || sectionIndex === currentSectionIndex || sectionIndex < 0 || sectionIndex >= sections.length) {
      return;
    }
    
    console.log(`🎭 Transizione: ${currentSectionIndex} → ${sectionIndex}`);
    isTransitioning = true;
    
    if (transitionOverlay) {
      transitionOverlay.classList.add('active');
    }
    
    setTimeout(() => {
      sections.forEach(section => section.classList.remove('active'));
      sections[sectionIndex].classList.add('active');
      
      navButtons.forEach((btn, index) => {
        btn.classList.toggle('active', index === sectionIndex);
      });
      
      currentSectionIndex = sectionIndex;
      
      if (menuOpen) {
        menuOpen = false;
        hamburger?.classList.remove('active');
        pageNav?.classList.remove('show');
      }
      
      setTimeout(() => {
        if (transitionOverlay) {
          transitionOverlay.classList.remove('active');
        }
        isTransitioning = false;
        console.log(`✅ Transizione completata - Sezione ${sectionIndex} attiva`);
      }, 200);
      
    }, 200);
  }

  navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showSection(index);
    });
  });

  // Navigazione con tastiera
  document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    
    if (e.key === 'ArrowDown' && currentSectionIndex < sections.length - 1) {
      showSection(currentSectionIndex + 1);
    } else if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
      showSection(currentSectionIndex - 1);
    }
  });

  // Navigazione con rotella mouse
  let wheelTimeout;
  let wheelDelta = 0;
  //document.addEventListener('wheel', (e) => {
  //  if (isTransitioning) {
  //    e.preventDefault();
  //    return;
  //  }
  //  
  //  wheelDelta += e.deltaY;
  //  
  //  clearTimeout(wheelTimeout);
  //  wheelTimeout = setTimeout(() => {
  //    if (Math.abs(wheelDelta) > 500) {
  //      e.preventDefault();
  //      
  //      if (wheelDelta > 0 && currentSectionIndex < sections.length - 1) {
  //        showSection(currentSectionIndex + 1);
  //      } else if (wheelDelta < 0 && currentSectionIndex > 0) {
  //        showSection(currentSectionIndex - 1);
  //      }
  //      wheelDelta = 0;
  //    }
  //  }, 150);
  //}, { passive: false });
//
  // Inizializzazione
  if (sections.length > 0) {
    sections[0].classList.add('active');
  }
  if (navButtons.length > 0) {
    navButtons[0].classList.add('active');
  }
  

  console.log('✅ Sistema PowerPoint inizializzato!');
  console.log('Sezioni disponibili:', sections.length);
});