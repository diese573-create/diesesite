document.addEventListener("DOMContentLoaded", () => {
    const carousel1 = document.querySelector('.carousel1');
    if (!carousel1) return;
  
    const prev1 = carousel1.querySelector('.prev1');
    const next1 = carousel1.querySelector('.next1');
    const images1 = carousel1.querySelectorAll('.carousel1-images img');
    let index1 = 0;
  
    function showCarousel1Image(i) {
      images1.forEach((img, idx) => {
        img.classList.toggle('active1', idx === i);
      });
    }
  
    prev1.addEventListener('click', () => {
      index1 = (index1 - 1 + images1.length) % images1.length;
      showCarousel1Image(index1);
    });
  
    next1.addEventListener('click', () => {
      index1 = (index1 + 1) % images1.length;
      showCarousel1Image(index1);
    });
  
    // Initial display
    showCarousel1Image(index1);
  });
  