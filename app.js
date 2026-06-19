document.addEventListener('DOMContentLoaded', () => {
  
  // --- State Variables ---
  let currentStep = 1;
  const totalSteps = 4;
  const quizAnswers = {
    transport: 0,
    diet: 0,
    energy: 0,
    shopping: 0
  };
  
  // Benchmark Baseline Values (Average citizen)
  const defaultAnswers = {
    transport: 1.1,
    diet: 1.3,
    energy: 1.1,
    shopping: 0.8
  };

  // --- DOM Elements ---
  const menuToggle = document.getElementById('menu-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link-item');
  
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizProgress = document.getElementById('quiz-progress');
  const btnBack = document.getElementById('quiz-back');
  const btnNext = document.getElementById('quiz-next');
  
  const scoreDisplay = document.getElementById('score-display');
  const impactGrade = document.getElementById('impact-grade');
  const impactSummaryText = document.getElementById('impact-summary-text');
  
  const gaugeCircle = document.getElementById('gauge-circle');
  const gaugePercent = document.getElementById('gauge-percent');
  
  const breakdownVals = {
    transport: document.getElementById('breakdown-val-transport'),
    diet: document.getElementById('breakdown-val-diet'),
    energy: document.getElementById('breakdown-val-energy'),
    shopping: document.getElementById('breakdown-val-shopping')
  };
  
  const breakdownBars = {
    transport: document.getElementById('breakdown-bar-transport'),
    diet: document.getElementById('breakdown-bar-diet'),
    energy: document.getElementById('breakdown-bar-energy'),
    shopping: document.getElementById('breakdown-bar-shopping')
  };
  
  const insightCards = document.querySelectorAll('.insight-card');
  const insightsList = document.getElementById('insights-list');
  
  const streakEmoji = document.getElementById('streak-emoji');
  const streakCount = document.getElementById('streak-count');
  const checklistProgress = document.getElementById('checklist-progress');
  const checklistItems = document.querySelectorAll('.checklist-item');

  // --- 1. Hamburger Navigation Overlay ---
  function toggleMenu() {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
  }

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('active');
      navOverlay.classList.remove('remove');
      navOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // --- 2. Scroll Reveal Effects ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 3. Onboarding Quiz Interaction ---
  
  // Set quiz options click listener
  quizSteps.forEach(stepEl => {
    const options = stepEl.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        // Remove selected class from other options in this step
        options.forEach(o => o.classList.remove('selected'));
        // Select clicked option
        opt.classList.add('selected');
        
        // Save value
        const val = parseFloat(opt.getAttribute('data-value'));
        const category = stepEl.getAttribute('data-category');
        quizAnswers[category] = val;
        
        // Enable next button
        btnNext.removeAttribute('disabled');
      });
    });
  });

  // Nav buttons click listeners
  btnNext.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateQuizUI();
    } else {
      // Final step: Calculate footprint and transition
      calculateAndShowFootprint();
      
      // Smooth scroll to dashboard
      setTimeout(() => {
        document.getElementById('dashboard-section').scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  });

  btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateQuizUI();
    }
  });

  function updateQuizUI() {
    // Show current step element, hide others
    quizSteps.forEach(stepEl => {
      const stepNum = parseInt(stepEl.getAttribute('data-step'));
      if (stepNum === currentStep) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
    });

    // Update Progress Bar
    const progressPercent = (currentStep / totalSteps) * 100;
    quizProgress.style.width = `${progressPercent}%`;

    // Update buttons disabled status
    if (currentStep === 1) {
      btnBack.setAttribute('disabled', 'true');
    } else {
      btnBack.removeAttribute('disabled');
    }

    // Check if option in current step is already selected
    const currentStepEl = document.querySelector(`.quiz-step[data-step="${currentStep}"]`);
    const hasSelection = currentStepEl.querySelector('.quiz-option.selected') !== null;
    
    if (hasSelection) {
      btnNext.removeAttribute('disabled');
    } else {
      btnNext.setAttribute('disabled', 'true');
    }

    // Change next button text on final step
    if (currentStep === totalSteps) {
      btnNext.innerHTML = `
        Calculate Impact
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke: currentColor; stroke-width: 2px;">
          <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    } else {
      btnNext.innerHTML = `
        Next Step
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke: currentColor; stroke-width: 2px;">
          <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
  }

  // --- 4. Ledger Calculations & Dashboard Generation ---
  
  function animateNumber(element, start, end, duration, decimals = 1) {
    if (!element) return;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = progress * (end - start) + start;
      element.textContent = current.toFixed(decimals);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  function calculateAndShowFootprint() {
    const t = quizAnswers.transport;
    const d = quizAnswers.diet;
    const e = quizAnswers.energy;
    const s = quizAnswers.shopping;
    const total = t + d + e + s;
    
    // Save to LocalStorage
    localStorage.setItem('ecoTrack_answers', JSON.stringify(quizAnswers));
    localStorage.setItem('ecoTrack_completed', 'true');
    
    renderDashboard(total, t, d, e, s);
    reorderInsights(t, d, e, s);
  }

  function renderDashboard(total, t, d, e, s) {
    // 1. Grade Badge
    // A: < 2.0 (Planetary sustainable target)
    // B: 2.0 - 3.5
    // C: 3.5 - 5.5
    // D: > 5.5
    let grade = '';
    let gradeClass = '';
    let summaryText = '';

    if (total <= 2.0) {
      grade = 'Eco Champion (Planetary Safe)';
      summaryText = `Your annual emissions footprint is **${total.toFixed(1)} tonnes CO₂e**. This is well within the sustainable ecological limit of 2.0 tonnes. Outstanding effort!`;
    } else if (total <= 3.8) {
      grade = 'Eco Conscious (Moderate Impact)';
      summaryText = `Your annual emissions footprint is **${total.toFixed(1)} tonnes CO₂e**. While below average, you are slightly exceeding the 2.0-tonne sustainable target. Explore our strategic insights below.`;
    } else if (total <= 5.8) {
      grade = 'Standard Consumer (Average Impact)';
      summaryText = `Your annual emissions footprint is **${total.toFixed(1)} tonnes CO₂e**. This aligns closely with regional average values. Implementing small swaps will yield huge environmental relief.`;
    } else {
      grade = 'High Impact (Action Required)';
      summaryText = `Your annual emissions footprint is **${total.toFixed(1)} tonnes CO₂e**. This is double the target ecological allowance. Focus on the transit and heating changes detailed in insights.`;
    }

    impactGrade.textContent = grade;
    
    // Animate large total number
    const currentValStr = scoreDisplay.textContent;
    const currentVal = parseFloat(currentValStr) || 0;
    animateNumber(scoreDisplay, currentVal, total, 1000, 1);
    
    // Update summary text
    // Replace markdown bold syntax with HTML
    impactSummaryText.innerHTML = summaryText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 2. SVG Gauge Ring Animation
    // Target sustainable max is 2.0 tonnes. Max chart capacity represents 8.0 tonnes.
    const maxCapacity = 8.0;
    const targetMax = 2.0;
    
    // Display percent of target sustainable max in the circle
    const percentOfTarget = Math.round((total / targetMax) * 100);
    gaugePercent.textContent = `${percentOfTarget}%`;

    // Fill gauge circle based on percentage of 8.0 tonnes
    // Stroke dasharray perimeter = 596.9
    const chartPercent = Math.min((total / maxCapacity) * 100, 100);
    const circlePerimeter = 596.9;
    const offset = circlePerimeter - (circlePerimeter * chartPercent) / 100;
    gaugeCircle.style.strokeDashoffset = offset;

    // Change gauge color depending on performance
    if (total <= 2.0) {
      gaugeCircle.style.stroke = 'var(--accent)';
    } else if (total <= 4.5) {
      gaugeCircle.style.stroke = 'var(--warm-accent)';
    } else {
      gaugeCircle.style.stroke = 'var(--danger)';
    }

    // 3. Category Breakdowns
    const categories = [
      { name: 'transport', val: t, max: 2.0 },
      { name: 'diet', val: d, max: 2.5 },
      { name: 'energy', val: e, max: 2.5 },
      { name: 'shopping', val: s, max: 2.0 }
    ];

    categories.forEach(cat => {
      const displayVal = breakdownVals[cat.name];
      const bar = breakdownBars[cat.name];
      if (displayVal && bar) {
        const curBarVal = parseFloat(displayVal.textContent) || 0;
        animateNumber(displayVal, curBarVal, cat.val, 1000, 1);
        
        const barWidth = Math.min((cat.val / cat.max) * 100, 100);
        bar.style.width = `${barWidth}%`;

        // Bar colors
        if (cat.val / cat.max > 0.7) {
          bar.style.backgroundColor = 'var(--danger)';
        } else if (cat.val / cat.max > 0.4) {
          bar.style.backgroundColor = 'var(--warm-accent)';
        } else {
          bar.style.backgroundColor = 'var(--accent)';
        }
      }
    });
  }

  // --- 5. Custom Insights Sorting Engine ---
  
  function reorderInsights(t, d, e, s) {
    const scores = {
      transport: t,
      diet: d,
      energy: e,
      shopping: s
    };

    // Extract DOM cards
    const cards = Array.from(insightCards);
    
    // Sort cards based on user emission score (descending)
    cards.sort((a, b) => {
      const catA = a.getAttribute('data-category');
      const catB = b.getAttribute('data-category');
      return (scores[catB] || 0) - (scores[catA] || 0);
    });

    // Clear insights-list container and append sorted cards
    insightsList.innerHTML = '';
    cards.forEach((card, index) => {
      // Re-assign elegant numbers 01, 02, etc. based on new order
      const numberEl = card.querySelector('.insight-number');
      if (numberEl) {
        numberEl.textContent = `0${index + 1}`;
      }
      insightsList.appendChild(card);
    });

    // Rebind expand listeners
    bindInsightListeners();
  }

  function bindInsightListeners() {
    const cards = document.querySelectorAll('.insight-card');
    cards.forEach(card => {
      // Remove any existing click handlers
      const oldHeader = card.querySelector('.insight-header');
      const newHeader = oldHeader.cloneNode(true);
      oldHeader.parentNode.replaceChild(newHeader, oldHeader);

      newHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Collapse all other cards
        cards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('expanded');
          }
        });

        // Toggle this card
        card.classList.toggle('expanded');
      });
    });
  }

  // Initial binding
  bindInsightListeners();

  // --- 6. Daily Operations Checklist & LocalStorage Persistence ---
  
  // Checklist values (kg CO2 saved)
  const checklistValues = {
    'action-1': 5,
    'action-2': 3,
    'action-3': 2,
    'action-4': 1
  };

  // Load saved checklist state
  let dailyStates = JSON.parse(localStorage.getItem('ecoTrack_dailyActions')) || {};
  let streak = parseInt(localStorage.getItem('ecoTrack_streak')) || 0;
  let lastCompletedDate = localStorage.getItem('ecoTrack_lastCompletedDate') || '';

  // Setup checklist UI elements on load
  function initChecklist() {
    let completedCount = 0;
    
    checklistItems.forEach(item => {
      const id = item.getAttribute('data-action-id');
      if (dailyStates[id] === true) {
        item.classList.add('checked');
        completedCount++;
      } else {
        item.classList.remove('checked');
      }

      // Add click handler
      item.addEventListener('click', () => {
        toggleChecklistItem(item);
      });
    });

    updateChecklistProgress(completedCount);
    updateStreakUI();
  }

  function toggleChecklistItem(item) {
    const id = item.getAttribute('data-action-id');
    const isChecked = item.classList.contains('checked');
    
    if (isChecked) {
      item.classList.remove('checked');
      dailyStates[id] = false;
    } else {
      item.classList.add('checked');
      dailyStates[id] = true;
    }

    localStorage.setItem('ecoTrack_dailyActions', JSON.stringify(dailyStates));
    
    // Recalculate completed count
    const completedCount = Object.values(dailyStates).filter(Boolean).length;
    updateChecklistProgress(completedCount);

    // Check streak trigger (all 4 completed)
    evaluateStreak(completedCount);
  }

  function updateChecklistProgress(count) {
    checklistProgress.textContent = `${count} of 4 Completed`;
  }

  function evaluateStreak(completedCount) {
    const today = new Date().toDateString();

    if (completedCount === 4) {
      if (lastCompletedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastCompletedDate === yesterdayStr) {
          // Increment streak
          streak++;
        } else if (lastCompletedDate === '') {
          // First streak
          streak = 1;
        } else {
          // Missed yesterday, reset streak to 1
          streak = 1;
        }

        lastCompletedDate = today;
        localStorage.setItem('ecoTrack_streak', streak);
        localStorage.setItem('ecoTrack_lastCompletedDate', lastCompletedDate);
        updateStreakUI();
        
        // Smooth scroll to streak card for visual feedback
        document.getElementById('actions-section').scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If they unchecked an item today and had completed today, decrement streak
      if (lastCompletedDate === today) {
        streak = Math.max(0, streak - 1);
        lastCompletedDate = ''; // Clear completion for today
        localStorage.setItem('ecoTrack_streak', streak);
        localStorage.setItem('ecoTrack_lastCompletedDate', lastCompletedDate);
        updateStreakUI();
      }
    }
  }

  function updateStreakUI() {
    streakCount.textContent = streak;
    if (streak > 0) {
      streakEmoji.textContent = '🔥';
      streakEmoji.style.color = 'var(--danger-light)';
    } else {
      streakEmoji.textContent = '🌱';
      streakEmoji.style.color = '';
    }
  }

  // Check if streak is broken (e.g. they missed a calendar day)
  function checkStreakValidity() {
    if (lastCompletedDate) {
      const today = new Date();
      const lastDate = new Date(lastCompletedDate);
      
      // Calculate diff in days
      const timeDiff = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // If more than 1 day apart and lastCompletedDate is not today/yesterday, reset streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompletedDate !== today.toDateString() && lastCompletedDate !== yesterday.toDateString()) {
        streak = 0;
        localStorage.setItem('ecoTrack_streak', streak);
        updateStreakUI();
      }
    }
  }

  // --- 7. Page Load Initializer ---
  
  function initApp() {
    checkStreakValidity();
    initChecklist();

    const savedAnswers = localStorage.getItem('ecoTrack_answers');
    const isCompleted = localStorage.getItem('ecoTrack_completed') === 'true';

    if (isCompleted && savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      Object.assign(quizAnswers, answers);
      
      // Pre-select options in the quiz
      Object.keys(quizAnswers).forEach(cat => {
        const value = quizAnswers[cat];
        const stepEl = document.querySelector(`.quiz-step[data-category="${cat}"]`);
        if (stepEl) {
          const opt = stepEl.querySelector(`.quiz-option[data-value="${value}"]`);
          if (opt) opt.classList.add('selected');
        }
      });
      
      // Set quiz progress to full
      currentStep = totalSteps;
      updateQuizUI();
      
      // Render dashboard with user calculation
      const total = quizAnswers.transport + quizAnswers.diet + quizAnswers.energy + quizAnswers.shopping;
      renderDashboard(total, quizAnswers.transport, quizAnswers.diet, quizAnswers.energy, quizAnswers.shopping);
      reorderInsights(quizAnswers.transport, quizAnswers.diet, quizAnswers.energy, quizAnswers.shopping);
    } else {
      // Load dashboard with default benchmark baseline values
      const total = defaultAnswers.transport + defaultAnswers.diet + defaultAnswers.energy + defaultAnswers.shopping;
      renderDashboard(total, defaultAnswers.transport, defaultAnswers.diet, defaultAnswers.energy, defaultAnswers.shopping);
      
      // Add a visual indicator to badge
      impactGrade.textContent = 'Global Average';
      impactSummaryText.innerHTML = `This display represents **benchmark averages** (${total.toFixed(1)} tonnes CO₂e/yr). Complete the onboarding quiz above to see your exact carbon impact.`;
    }
  }

  initApp();
});
