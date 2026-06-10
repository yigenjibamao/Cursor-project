/**
 * 奶茶与年轻人 - 主交互脚本
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initCounterAnimation();
  initBarChart();
  initProgressBars();
  initQuiz();
  initBackToTop();
});

/* ===== 导航栏 ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  initScrollSpy(navLinks);
}

/* ===== 滚动高亮当前区域 ===== */
function initScrollSpy(navLinks) {
  const links = Array.from(navLinks.querySelectorAll('a'));
  const sections = links
    .map(link => {
      const id = link.getAttribute('href').slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ===== 滚动渐入动画 ===== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ===== 数字计数动画 ===== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ===== 柱状图动画 ===== */
function initBarChart() {
  const barItems = document.querySelectorAll('.bar-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          barItems.forEach((item, index) => {
            setTimeout(() => {
              const value = item.dataset.value;
              item.style.setProperty('--bar-width', `${value}%`);
              item.classList.add('animated');
            }, index * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const chart = document.getElementById('barChart');
  if (chart) observer.observe(chart);
}

/* ===== 进度条动画 ===== */
function initProgressBars() {
  const progressFills = document.querySelectorAll('.progress-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.progress-fill');
          fills.forEach((fill, index) => {
            setTimeout(() => {
              fill.style.width = `${fill.dataset.width}%`;
            }, index * 200);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.health-card').forEach(card => {
    observer.observe(card);
  });
}

/* ===== 互动测试 ===== */
function initQuiz() {
  const steps = document.querySelectorAll('.quiz-step');
  const result = document.getElementById('quizResult');
  const progressBar = document.getElementById('quizProgress');
  const restartBtn = document.getElementById('quizRestart');

  let currentStep = 1;
  let totalScore = 0;

  const personalities = {
    low: {
      icon: '🌿',
      title: '理性品鉴家',
      desc: '你对奶茶保持着克制与品味，更注重健康与品质。偶尔的一杯，是你的小奖励，而非日常依赖。'
    },
    medium: {
      icon: '☕',
      title: '平衡爱好者',
      desc: '你享受奶茶带来的快乐，也懂得适度。三五好友，一杯经典，就是你理想的生活节奏。'
    },
    high: {
      icon: '🧋',
      title: '资深奶茶党',
      desc: '奶茶是你生活的重要组成部分！新品必尝、限定必追，你是朋友圈里的奶茶情报官。'
    },
    extreme: {
      icon: '👑',
      title: '奶茶传说',
      desc: '对你来说，奶茶不仅是饮品，更是一种信仰。全糖去冰加双份小料——这，就是你的态度。'
    }
  };

  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', () => {
      const step = option.closest('.quiz-step');
      step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      totalScore += parseInt(option.dataset.score, 10);

      setTimeout(() => {
        if (currentStep < 3) {
          step.classList.remove('active');
          currentStep++;
          document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
          progressBar.style.width = `${(currentStep / 3) * 100}%`;
        } else {
          showResult();
        }
      }, 400);
    });
  });

  function showResult() {
    steps.forEach(s => s.classList.remove('active'));
    result.classList.remove('hidden');
    progressBar.style.width = '100%';

    const avgScore = totalScore / 3;
    let personality;

    if (avgScore <= 1.5) personality = personalities.low;
    else if (avgScore <= 2.5) personality = personalities.medium;
    else if (avgScore <= 3.5) personality = personalities.high;
    else personality = personalities.extreme;

    document.getElementById('resultIcon').textContent = personality.icon;
    document.getElementById('resultTitle').textContent = personality.title;
    document.getElementById('resultDesc').textContent = personality.desc;
  }

  restartBtn.addEventListener('click', () => {
    currentStep = 1;
    totalScore = 0;
    result.classList.add('hidden');
    steps.forEach(s => s.classList.remove('active'));
    document.querySelector('[data-step="1"]').classList.add('active');
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    progressBar.style.width = '33%';
  });
}

/* ===== 回到顶部 ===== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
