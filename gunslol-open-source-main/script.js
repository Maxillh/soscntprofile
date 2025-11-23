let hasUserInteracted = false;

function initMedia() {
  console.log("initMedia called");
  const backgroundMusic = document.getElementById('background-music');
  const backgroundVideo = document.getElementById('background');
  if (!backgroundMusic || !backgroundVideo) {
    console.error("Media elements not found");
    return;
  }
  backgroundMusic.volume = 0.3;
  backgroundVideo.muted = true; 

  
  backgroundVideo.play().catch(err => {
    console.error("Failed to play background video:", err);
  });
}

// Custom cursor and cursor-trail removed — using native system cursor.

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  // resetViewsBtn removed (Reset button removed from HTML)
  const backgroundMusic = document.getElementById('background-music');
  const hackerMusic = document.getElementById('hacker-music');
  const rainMusic = document.getElementById('rain-music');
  const animeMusic = document.getElementById('anime-music');
  const carMusic = document.getElementById('car-music');
  const homeButton = document.getElementById('home-theme');
  const hackerButton = document.getElementById('hacker-theme');
  const rainButton = document.getElementById('rain-theme');
  // Animations/themes 4 and 5 removed — keep only 1..3
  const resultsButtonContainer = document.getElementById('results-button-container');
  const resultsButton = document.getElementById('results-theme');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const hackerOverlay = document.getElementById('hacker-overlay');
  const snowOverlay = document.getElementById('snow-overlay');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const skillsBlock = document.getElementById('skills-block');
  const pythonBar = document.getElementById('python-bar');
  const cppBar = document.getElementById('cpp-bar');
  const csharpBar = document.getElementById('csharp-bar');
  const resultsHint = document.getElementById('results-hint');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');

  // Robust touch detection to avoid ReferenceError if code checks this later.
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0);

  
  // Custom cursor behavior removed — the site uses the native cursor now.


  const startMessage = "click here";
  let startTextContent = '';
  let startIndex = 0;
  let startCursorVisible = true;

  function typeWriterStart() {
    if (startIndex < startMessage.length) {
      startTextContent = startMessage.slice(0, startIndex + 1);
      startIndex++;
    }
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
    setTimeout(typeWriterStart, 100);
  }


  setInterval(() => {
    startCursorVisible = !startCursorVisible;
    startText.textContent = startTextContent + (startCursorVisible ? '|' : ' ');
  }, 500);


  function initializeVisitorCounter() {
    console.log('initializeVisitorCounter called');

    const visitorEl = visitorCount;
    if (!visitorEl) {
      console.error('visitor-count element not found');
      return;
    }

      // Show cached value immediately (reduces flicker)
      const cachedInitial = localStorage.getItem('cachedVisitorCount');
      if (cachedInitial) {
        visitorEl.textContent = Number(cachedInitial).toLocaleString();
      }

      const localCountUrl = 'http://localhost:3000/count';
      const localHitUrl = 'http://localhost:3000/hit';
      console.log('Trying local counter (GET):', localCountUrl);

      // Decide whether this browser has already incremented the counter
      const incrementFlag = 'hasIncremented_v1';
      const hasIncremented = !!localStorage.getItem(incrementFlag);

      // Helper to update UI and cache
      function applyAndCache(value) {
        visitorEl.textContent = Number(value).toLocaleString();
        try { localStorage.setItem('cachedVisitorCount', String(value)); } catch(e){}
      }

      // Try local server first: read then optionally hit
      fetch(localCountUrl)
        .then(res => res.json())
        .then(data => {
          console.log('Local count response', data);
          if (data && typeof data.value !== 'undefined') {
            applyAndCache(data.value);
          }
          if (!hasIncremented) {
            // increment once per browser
            return fetch(localHitUrl)
              .then(res => res.json())
              .then(hitData => {
                if (hitData && typeof hitData.value !== 'undefined') {
                  console.log('Local hit response', hitData);
                  applyAndCache(hitData.value);
                  try { localStorage.setItem(incrementFlag, 'true'); } catch(e){}
                }
              });
          }
          return null;
        })
        .catch(err => {
          console.warn('Local counter failed, falling back to CountAPI or cache:', err);

          // Fallback: CountAPI. Use get vs hit depending on increment flag.
          const namespace = 'gunslol-open-source-main';
          const key = 'profile_views';
          if (!hasIncremented) {
            const fallbackHit = `https://api.countapi.xyz/hit/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`;
            console.log('Fallback to CountAPI hit URL:', fallbackHit);
            fetch(fallbackHit)
              .then(res => res.json())
              .then(data => {
                console.log('CountAPI hit response', data);
                if (data && typeof data.value !== 'undefined') {
                  applyAndCache(data.value);
                  try { localStorage.setItem(incrementFlag, 'true'); } catch(e){}
                }
              })
              .catch(err2 => {
                console.warn('CountAPI hit failed too:', err2);
                const cached = localStorage.getItem('cachedVisitorCount') || visitorEl.textContent || '0';
                visitorEl.textContent = Number(cached).toLocaleString();
              });
          } else {
            // Just read the CountAPI value without incrementing
            const fallbackGet = `https://api.countapi.xyz/get/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`;
            console.log('Fallback to CountAPI get URL:', fallbackGet);
            fetch(fallbackGet)
              .then(res => res.json())
              .then(data => {
                console.log('CountAPI get response', data);
                if (data && typeof data.value !== 'undefined') {
                  applyAndCache(data.value);
                }
              })
              .catch(err3 => {
                console.warn('CountAPI get failed too:', err3);
                const cached = localStorage.getItem('cachedVisitorCount') || visitorEl.textContent || '0';
                visitorEl.textContent = Number(cached).toLocaleString();
              });
          }
        });
  }


  initializeVisitorCounter();

  // Provide an immediate, accessible fallback so the name/bio are visible
  // even if the typewriter animation doesn't run or the user hasn't clicked.
  // The typewriter still runs later (on start screen click) and will replace
  // these fallback values with the animated text.
  try {
    if (profileName && profileName.textContent.trim() === '') {
      profileName.textContent = 'soscnt';
    }
    if (profileBio && profileBio.textContent.trim() === '') {
      profileBio.textContent = '@soscnt everywhere';
    }
  } catch (e) {
    console.warn('Failed to set fallback profile text', e);
  }


  startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen click:", err);
    });
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    if (!isTouchDevice) {
      try {
        if (typeof cursorTrailEffect === 'function') {
          new cursorTrailEffect({
            length: 10,
            size: 8,
            speed: 0.2
          });
          console.log("Cursor trail initialized");
        }
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }
    typeWriterName();
    typeWriterBio();
  });

  // Reset profile views handler removed because the button was removed from the UI.

  startScreen.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startScreen.classList.add('hidden');
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(err => {
      console.error("Failed to play music after start screen touch:", err);
    });
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => {
        profileBlock.classList.add('profile-appear');
        profileContainer.classList.add('orbit');
      }}
    );
    if (!isTouchDevice) {
      try {
        if (typeof cursorTrailEffect === 'function') {
          new cursorTrailEffect({
            length: 10,
            size: 8,
            speed: 0.2
          });
          console.log("Cursor trail initialized");
        }
      } catch (err) {
        console.error("Failed to initialize cursor trail effect:", err);
      }
    }
    typeWriterName();
    typeWriterBio();
  });


  const name = "soscnt";
  let nameText = '';
  let nameIndex = 0;
  let isNameDeleting = false;
  let nameCursorVisible = true;

  function typeWriterName() {
    if (!isNameDeleting && nameIndex < name.length) {
      nameText = name.slice(0, nameIndex + 1);
      nameIndex++;
    } else if (isNameDeleting && nameIndex > 0) {
      nameText = name.slice(0, nameIndex - 1);
      nameIndex--;
    } else if (nameIndex === name.length) {
      isNameDeleting = true;
      setTimeout(typeWriterName, 10000);
      return;
    } else if (nameIndex === 0) {
      isNameDeleting = false;
    }
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileName.classList.add('glitch');
      setTimeout(() => profileName.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterName, isNameDeleting ? 150 : 300);
  }

  setInterval(() => {
    nameCursorVisible = !nameCursorVisible;
    profileName.textContent = nameText + (nameCursorVisible ? '|' : ' ');
  }, 500);


  const bioMessages = [
    "@soscnt everywhere",
    "hey hey hey!"
  ];
  let bioText = '';
  let bioIndex = 0;
  let bioMessageIndex = 0;
  let isBioDeleting = false;
  let bioCursorVisible = true;

  function typeWriterBio() {
    if (!isBioDeleting && bioIndex < bioMessages[bioMessageIndex].length) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex + 1);
      bioIndex++;
    } else if (isBioDeleting && bioIndex > 0) {
      bioText = bioMessages[bioMessageIndex].slice(0, bioIndex - 1);
      bioIndex--;
    } else if (bioIndex === bioMessages[bioMessageIndex].length) {
      isBioDeleting = true;
      setTimeout(typeWriterBio, 2000);
      return;
    } else if (bioIndex === 0 && isBioDeleting) {
      isBioDeleting = false;
      bioMessageIndex = (bioMessageIndex + 1) % bioMessages.length;
    }
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
    if (Math.random() < 0.1) {
      profileBio.classList.add('glitch');
      setTimeout(() => profileBio.classList.remove('glitch'), 200);
    }
    setTimeout(typeWriterBio, isBioDeleting ? 75 : 150);
  }

  setInterval(() => {
    bioCursorVisible = !bioCursorVisible;
    profileBio.textContent = bioText + (bioCursorVisible ? '|' : ' ');
  }, 500);


  let currentAudio = backgroundMusic;
  let isMuted = false;

  volumeIcon.addEventListener('click', () => {
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeIcon.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isMuted = !isMuted;
    currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeSlider.addEventListener('input', () => {
    currentAudio.volume = volumeSlider.value;
    isMuted = false;
    currentAudio.muted = false;
    volumeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  // Make the transparency icon clickable: toggle between "transparent" (0)
  // and the last non-zero transparency value. Updates the slider and
  // leverages the existing `input` handler to apply styles safely.
  const transparencyIcon = document.querySelector('.transparency-icon');
  let lastTransparency = transparencySlider ? Number(transparencySlider.value) : 0.7;
  if (transparencyIcon) {
    transparencyIcon.style.cursor = 'pointer';
    transparencyIcon.addEventListener('click', () => {
      try {
        const current = Number(transparencySlider.value || lastTransparency || 0.7);
        if (current > 0.05) {
          lastTransparency = current;
          transparencySlider.value = 0;
        } else {
          transparencySlider.value = lastTransparency || 0.7;
        }
        // Trigger the same logic as the user moving the slider.
        transparencySlider.dispatchEvent(new Event('input'));
        console.log('Transparency toggled via icon. New value:', transparencySlider.value);
      } catch (err) {
        console.error('Transparency toggle failed:', err);
      }
    });
    transparencyIcon.addEventListener('touchstart', (e) => {
      e.preventDefault();
      transparencyIcon.click();
    });
  } else {
    console.warn('transparencyIcon not found');
  }


  if (transparencySlider) {
    transparencySlider.addEventListener('input', () => {
      const opacity = transparencySlider.value;
      if (opacity == 0) {
        profileBlock.style.background = 'rgba(0, 0, 0, 0)';
        profileBlock.style.borderOpacity = '0';
        profileBlock.style.borderColor = 'transparent';
        profileBlock.style.backdropFilter = 'none';
        skillsBlock.style.background = 'rgba(0, 0, 0, 0)';
        skillsBlock.style.borderOpacity = '0';
        skillsBlock.style.borderColor = 'transparent';
        skillsBlock.style.backdropFilter = 'none';
     
        profileBlock.style.pointerEvents = 'auto';
        socialIcons.forEach(icon => {
          icon.style.pointerEvents = 'auto';
          icon.style.opacity = '1';
        });
        badges.forEach(badge => {
          badge.style.pointerEvents = 'auto';
          badge.style.opacity = '1';
        });
        profilePicture.style.pointerEvents = 'auto';
        profilePicture.style.opacity = '1';
        profileName.style.opacity = '1';
        profileBio.style.opacity = '1';
        visitorCount.style.opacity = '1';
      } else {
        profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
        profileBlock.style.borderOpacity = opacity;
        profileBlock.style.borderColor = '';
        profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
        skillsBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
        skillsBlock.style.borderOpacity = opacity;
        skillsBlock.style.borderColor = '';
        skillsBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
        profileBlock.style.pointerEvents = 'auto';
        socialIcons.forEach(icon => {
          icon.style.pointerEvents = 'auto';
          icon.style.opacity = '1';
        });
        badges.forEach(badge => {
          badge.style.pointerEvents = 'auto';
          badge.style.opacity = '1';
        });
        profilePicture.style.pointerEvents = 'auto';
        profilePicture.style.opacity = '1';
        profileName.style.opacity = '1';
        profileBio.style.opacity = '1';
        visitorCount.style.opacity = '1';
      }
    });
  } else {
    // No transparency slider in DOM — ensure default appearance remains visible.
    profileBlock.style.background = 'rgba(0,0,0,0.7)';
    skillsBlock.style.background = 'rgba(0,0,0,0.7)';
  }


  function switchTheme(videoSrc, audio, themeClass, overlay = null, overlayOverProfile = false) {
    let primaryColor;
    switch (themeClass) {
      case 'home-theme':
        primaryColor = '#00CED1';
        break;
      case 'hacker-theme':
        primaryColor = '#22C55E';
        break;
      case 'rain-theme':
        primaryColor = '#1E3A8A';
        break;
      case 'anime-theme':
        primaryColor = '#DC2626';
        break;
      case 'car-theme':
        primaryColor = '#EAB308';
        break;
      default:
        primaryColor = '#00CED1';
    }
    document.documentElement.style.setProperty('--primary-color', primaryColor);

    gsap.to(backgroundVideo, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        backgroundVideo.src = videoSrc;

        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = audio;
        currentAudio.volume = volumeSlider.value;
        currentAudio.muted = isMuted;
        currentAudio.play().catch(err => console.error("Failed to play theme music:", err));

        document.body.classList.remove('home-theme', 'hacker-theme', 'rain-theme', 'anime-theme', 'car-theme');
        document.body.classList.add(themeClass);

        hackerOverlay.classList.add('hidden');
        snowOverlay.classList.add('hidden');
        profileBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        skillsBlock.style.zIndex = overlayOverProfile ? 10 : 20;
        if (overlay) {
          overlay.classList.remove('hidden');
        }

        if (themeClass === 'hacker-theme') {
          resultsButtonContainer.classList.remove('hidden');
        } else {
          resultsButtonContainer.classList.add('hidden');
          skillsBlock.classList.add('hidden');
          resultsHint.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.to(profileBlock, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
        }

        gsap.to(backgroundVideo, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            profileContainer.classList.remove('orbit');
            void profileContainer.offsetWidth;
            profileContainer.classList.add('orbit');
          }
        });
      }
    });
  }

  // Color-only theme switcher: set CSS variables only (no video/audio/class changes).
  function applyColorScheme(primary, secondary, cursorHue) {
    try {
      document.documentElement.style.setProperty('--primary-color', primary);
      document.documentElement.style.setProperty('--secondary-color', secondary);
      if (typeof cursorHue !== 'undefined') {
        document.documentElement.style.setProperty('--cursor-hue', cursorHue);
      }
      console.log('Applied color scheme', primary, secondary, cursorHue);
    } catch (err) {
      console.error('Failed to apply color scheme:', err);
    }
  }

  if (homeButton) {
    homeButton.addEventListener('click', () => {
      applyColorScheme('#00CED1', '#FF6B9E', '180deg');
    });
    homeButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      applyColorScheme('#00CED1', '#FF6B9E', '180deg');
    });
  } else {
    console.warn('homeButton not found');
  }

  if (hackerButton) {
    hackerButton.addEventListener('click', () => {
      applyColorScheme('#22C55E', '#2DD4BF', '120deg');
    });
    hackerButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      applyColorScheme('#22C55E', '#2DD4BF', '120deg');
    });
  } else {
    console.warn('hackerButton not found');
  }

  if (rainButton) {
    rainButton.addEventListener('click', () => {
      applyColorScheme('#1E3A8A', '#2563EB', '240deg');
    });
    rainButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      applyColorScheme('#1E3A8A', '#2563EB', '240deg');
    });
  } else {
    console.warn('rainButton not found');
  }

  // Buttons for themes 4 and 5 removed — no handlers necessary.

 
  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    gsap.to(element, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
  profileBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, profileBlock);
  });

  skillsBlock.addEventListener('mousemove', (e) => handleTilt(e, skillsBlock));
  skillsBlock.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleTilt(e, skillsBlock);
  });

  profileBlock.addEventListener('mouseleave', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  profileBlock.addEventListener('touchend', () => {
    gsap.to(profileBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });

  skillsBlock.addEventListener('mouseleave', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  skillsBlock.addEventListener('touchend', () => {
    gsap.to(skillsBlock, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  });


  profilePicture.addEventListener('mouseenter', () => {
    glitchOverlay.style.opacity = '1';
    setTimeout(() => {
      glitchOverlay.style.opacity = '0';
    }, 500);
  });


  profilePicture.addEventListener('click', () => {
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

  profilePicture.addEventListener('touchstart', (e) => {
    e.preventDefault();
    profileContainer.classList.remove('fast-orbit');
    profileContainer.classList.remove('orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => {
      profileContainer.classList.remove('fast-orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('orbit');
    }, 500);
  });

 
  let isShowingSkills = false;
  resultsButton.addEventListener('click', () => {
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  });

  resultsButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!isShowingSkills) {
      gsap.to(profileBlock, {
        x: -100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          profileBlock.classList.add('hidden');
          skillsBlock.classList.remove('hidden');
          gsap.fromTo(skillsBlock,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          gsap.to(pythonBar, { width: '87%', duration: 2, ease: 'power2.out' });
          gsap.to(cppBar, { width: '75%', duration: 2, ease: 'power2.out' });
          gsap.to(csharpBar, { width: '80%', duration: 2, ease: 'power2.out' });
        }
      });
      resultsHint.classList.remove('hidden');
      isShowingSkills = true;
    } else {
      gsap.to(skillsBlock, {
        x: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          skillsBlock.classList.add('hidden');
          profileBlock.classList.remove('hidden');
          gsap.fromTo(profileBlock,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
      resultsHint.classList.add('hidden');
      isShowingSkills = false;
    }
  });


  typeWriterStart();

  // Defensive: ensure the start screen is visible on load in case CSS or
  // earlier code accidentally hid it. This guarantees the user sees the
  // startup overlay and its text until they click/tap to proceed.
  try {
    if (startScreen) {
      startScreen.classList.remove('hidden');
      startScreen.style.display = 'flex';
      startScreen.style.zIndex = '99999';
    }
    if (startText && (!startText.textContent || startText.textContent.replace(/\|/g, '').trim().length === 0)) {
      startText.textContent = startMessage;
    }
  } catch (err) {
    console.warn('Failed to enforce start-screen visibility:', err);
  }
  // Debug info: log start-screen state to help diagnose visibility issues.
  try {
    if (startScreen) {
      const cs = window.getComputedStyle(startScreen);
      console.log('DEBUG startScreen exists. classes=', startScreen.className, 'inlineDisplay=', startScreen.style.display, 'computedDisplay=', cs.display, 'opacity=', cs.opacity, 'visibility=', cs.visibility, 'zIndex=', cs.zIndex);
    } else {
      console.log('DEBUG startScreen element NOT FOUND');
    }
    if (startText) console.log('DEBUG startText:', startText.textContent);
  } catch (e) {
    console.warn('DEBUG failed reading start-screen state:', e);
  }

  // Fail-safe: if the typewriter text hasn't appeared after 2s (e.g. due to
  // timing issues or a race), write the full text so the UI isn't just a
  // blinking cursor. This covers the start-screen text, profile name and bio.
  setTimeout(() => {
    try {
      if (startText && startText.textContent.replace(/\|/g, '').trim().length === 0) {
        startText.textContent = startMessage;
      }
      if (profileName && profileName.textContent.replace(/\|/g, '').trim().length <= 1) {
        profileName.textContent = name;
      }
      if (profileBio && profileBio.textContent.replace(/\|/g, '').trim().length <= 1) {
        profileBio.textContent = bioMessages[0];
      }
    } catch (err) {
      console.error('Typewriter fallback failed:', err);
    }
  }, 2000);
});