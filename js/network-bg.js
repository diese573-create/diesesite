const canvas = document.getElementById('network-bg');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Configuration différente par section
const sectionSettings = {
  hero: {
    bgColor: '#001f3f',
    pointColor: '#23b9e6',
  },
  partners: {
    bgColor: '#0b3d91',
    pointColor: '#ffaa00',
  },
  process: {
    bgColor: '#004080',
    pointColor: '#00ffaa',
  }
};

// Points et autres constantes
let points = [];
let maxPoints = 40;
let maxDistance = 150;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function initPoints() {
  points = [];
  for (let i=0; i<maxPoints; i++) {
    points.push({
      x: random(0, canvas.width),
      y: random(0, canvas.height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3)
    });
  }
}

initPoints();

// Section courante
let currentSection = 'hero';

function draw() {
  const settings = sectionSettings[currentSection] || sectionSettings.hero;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fond
  ctx.fillStyle = settings.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Points
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = settings.pointColor;
    ctx.shadowColor = settings.pointColor;
    ctx.shadowBlur = 8;
    ctx.fill();
  });

  // Lignes entre points proches
  for(let i=0; i<maxPoints; i++) {
    for(let j=i+1; j<maxPoints; j++) {
      const p1 = points[i];
      const p2 = points[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if(dist < maxDistance) {
        ctx.strokeStyle = `rgba(255,255,255, ${(maxDistance - dist) / maxDistance * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  // Déplacement points
  points.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });

  requestAnimationFrame(draw);
}

draw();

// Observer pour détecter la section visible
const sections = document.querySelectorAll('section[id]');
const observerOptions = { threshold: 0.6 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      currentSection = entry.target.id;
      // Réinitialiser points pour chaque changement si tu veux
      initPoints();
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));



const images = document.querySelectorAll('.partners img');
const descBox = document.getElementById('description-box');
const descText = descBox.querySelector('.desc-text');

// Trouve l'image "Association"
const defaultImg = [...images].find(img => img.alt.toLowerCase() === "association");

// Positionne dynamiquement la flèche sous l'image ciblée
function updateArrowPosition(img) {
  const imgRect = img.getBoundingClientRect();
  const descRect = descBox.getBoundingClientRect();

  let arrowPos = imgRect.left + imgRect.width / 2 - descRect.left;

  // Empêcher la flèche de dépasser les bords (20px padding)
  const minPos = 20;
  const maxPos = descRect.width - 20;
  arrowPos = Math.min(Math.max(arrowPos, minPos), maxPos);

  // Appliquer la position via variable CSS
  descBox.style.setProperty('--arrow-left', arrowPos + 'px');
}

// Définit la description et la position par défaut (association)
function setDefaultDescription() {
  descText.innerHTML = defaultImg.getAttribute('data-desc');
  updateArrowPosition(defaultImg);
}

// Initialisation au chargement de la page
window.addEventListener('load', () => {
  setDefaultDescription();
});

// Gestion du survol des images
images.forEach(img => {
  img.addEventListener('mouseenter', () => {
    descText.innerHTML = img.getAttribute('data-desc');
    updateArrowPosition(img);
  });
});

// Recalculer la position de la flèche en cas de redimensionnement (responsive)
window.addEventListener('resize', () => {
  // Si la description est celle de l'association, repositionne la flèche
  if (descText.textContent === defaultImg.getAttribute('data-desc')) {
    updateArrowPosition(defaultImg);
  }
});








document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
  
    function animateCounters() {
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = 50; // plus petit = plus rapide
        const stepTime = 20;
        const increment = target / speed;
  
        function updateCount() {
          count += increment;
          if (count < target) {
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, stepTime);
          } else {
            counter.innerText = target;
          }
        }
  
        updateCount();
      });
    }
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          hasAnimated = true;
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
  
    const statsSection = document.querySelector('.stats-carousel-section');
    observer.observe(statsSection);
  });
  