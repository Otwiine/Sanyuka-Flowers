/* ==========================================================================
   SANYUKA DECOR FLORISTS - INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. GALLERY FILTER LOGIC
     ------------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from other buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Show card
          card.style.display = 'block';
          // Force a reflow to re-trigger scale-in if needed
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          // Hide card with transition
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          // Wait for transition, then set display none
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });


  /* ------------------------------------------------------------------------
     2. LIGHTBOX DIALOG LOGIC
     ------------------------------------------------------------------------ */
  const lightboxDialog = document.getElementById('lightbox-dialog');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxPrice = document.getElementById('lightbox-price');
  const dialogOrderBtn = document.getElementById('dialog-order-btn');

  // Attach event listeners to all 'View Details' buttons
  const viewDetailBtns = document.querySelectorAll('.btn-card-view');
  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const img = btn.getAttribute('data-img');
      const price = btn.getAttribute('data-price');
      const category = btn.parentElement.querySelector('.card-category').innerText;

      // Populate Lightbox data
      lightboxImg.src = img;
      lightboxImg.alt = title;
      lightboxTag.innerText = category;
      lightboxTitle.innerText = title;
      lightboxDesc.innerText = desc;
      lightboxPrice.innerText = price;

      // Show Lightbox Dialog in top-layer
      lightboxDialog.showModal();
    });
  });

  // Close lightbox event
  closeLightboxBtn.addEventListener('click', () => {
    lightboxDialog.close();
  });

  // Close lightbox by clicking backdrop
  lightboxDialog.addEventListener('click', (e) => {
    const rect = lightboxDialog.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      lightboxDialog.close();
    }
  });

  // Open custom request form from Lightbox Order button
  dialogOrderBtn.addEventListener('click', () => {
    const itemTitle = lightboxTitle.innerText;
    lightboxDialog.close();
    
    // Open Custom Request Dialog and prepopulate preferences
    const customDialog = document.getElementById('custom-request-dialog');
    const preferencesArea = document.getElementById('cr-desc');
    preferencesArea.value = `I would like to order the arrangement: "${itemTitle}". Please let me know details.`;
    
    customDialog.showModal();
  });


  /* ------------------------------------------------------------------------
     3. BESPOKE REQUEST DIALOG LOGIC
     ------------------------------------------------------------------------ */
  const customRequestDialog = document.getElementById('custom-request-dialog');
  const openCustomBtn = document.getElementById('open-custom-btn');
  const closeCustomBtn = document.getElementById('close-custom-btn');

  openCustomBtn.addEventListener('click', () => {
    customRequestDialog.showModal();
  });

  closeCustomBtn.addEventListener('click', () => {
    customRequestDialog.close();
  });

  // Close custom dialog by clicking backdrop
  customRequestDialog.addEventListener('click', (e) => {
    const rect = customRequestDialog.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      customRequestDialog.close();
    }
  });


  /* ------------------------------------------------------------------------
     4. FORM SUBMISSION & FEEDBACK SYSTEM
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const customRequestForm = document.getElementById('custom-request-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('c-name').value;
    
    // Simulate API request call
    showToast(`Thank you, ${nameInput}! Your message has been sent successfully.`);
    contactForm.reset();
  });

  customRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('cr-name').value;
    const deliveryArea = document.getElementById('cr-delivery').value;
    
    customRequestDialog.close();
    showToast(`Inquiry received, ${nameInput}! Our team will WhatsApp you within 30 minutes regarding delivery in ${capitalize(deliveryArea)}.`);
    customRequestForm.reset();
  });

  // Toast Helper function
  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${message}</span>
      <button style="background:none; border:none; color:inherit; font-size:1.2rem; cursor:pointer; margin-left:12px;" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // Capitalize Helper
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  /* ------------------------------------------------------------------------
     5. SCROLL ENTRY EFFECT FALLBACK (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const supportsScrollTimeline = 
    window.CSS && 
    CSS.supports('(animation-timeline: view()) and (animation-range: entry)');

  if (!supportsScrollTimeline) {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    // Set initial state for reveal elements
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Unobserve after animating in once
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // Viewport
      threshold: 0.15 // Trigger when 15% of the element is visible
    });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

});
