/* ==========================================================================
   SANYUKA DECOR FLORISTS - INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. GALLERY FILTER LOGIC
     ------------------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  function applyFilter(filterValue) {
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
        // Hide instantly so only the active tab's cards are in the layout
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from other buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      applyFilter(button.getAttribute('data-filter'));
    });
  });

  // Apply the active tab's filter on initial load
  const activeButton = document.querySelector('.filter-btn.active');
  if (activeButton) {
    applyFilter(activeButton.getAttribute('data-filter'));
  }

  /* ------------------------------------------------------------------------
     1b. SPECIALTY TILE LINKS -> GALLERY TABS
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.specialty-card[data-filter]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();

      const filter = card.getAttribute('data-filter');
      const targetButton = document.querySelector(`.filter-btn[data-filter="${filter}"]`);

      // Activate the matching gallery tab
      filterButtons.forEach(btn => btn.classList.remove('active'));
      if (targetButton) {
        targetButton.classList.add('active');
        applyFilter(filter);
      }

      // Smooth-scroll to the gallery section
      const gallery = document.getElementById('gallery');
      if (gallery) {
        gallery.scrollIntoView({ behavior: 'smooth' });
      }
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
    preferencesArea.value = `I would like to order: "${itemTitle}".`;
    
    customDialog.showModal();
  });


  /* ------------------------------------------------------------------------
     3. BESPOKE REQUEST DIALOG LOGIC
     ------------------------------------------------------------------------ */
  const customRequestDialog = document.getElementById('custom-request-dialog');
  const closeCustomBtn = document.getElementById('close-custom-btn');

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

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('c-name').value;
      
      // Simulate API request call
      showToast(`Thank you, ${nameInput}! Your message has been sent successfully.`);
      contactForm.reset();
    });
  }

  customRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('cr-name').value.trim();
    const fulfillment = document.querySelector('input[name="cr-fulfillment"]:checked').value;
    const notes = document.getElementById('cr-desc').value.trim();

    // Compose the order message and open WhatsApp with it pre-filled
    const message = `New Order Request\n\nName: ${nameInput}\nFulfillment: ${fulfillment}\nNotes: ${notes}`;
    const whatsappUrl = `https://wa.me/256714008799?text=${encodeURIComponent(message)}`;

    customRequestDialog.close();
    window.open(whatsappUrl, '_blank');
    showToast(`Order sent to WhatsApp, ${nameInput}! We'll confirm your ${fulfillment.toLowerCase()} shortly.`);
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

  /* ------------------------------------------------------------------------
     6. FLUSH SECTION SCROLL (align section tops with header bottom)
     ------------------------------------------------------------------------ */
  function syncScrollPadding() {
    const docEl = document.documentElement;
    const header = document.querySelector('.glass-header');
    if (!header) return;
    const headerRect = header.getBoundingClientRect();
    // The scaled logo visually extends past the header bar; measure its bottom
    const logo = header.querySelector('.logo-img');
    let bottom = headerRect.height;
    if (logo) {
      bottom = Math.max(bottom, logo.getBoundingClientRect().bottom - headerRect.top);
    }
    docEl.style.scrollPaddingTop = bottom + 'px';
  }

  syncScrollPadding();
  window.addEventListener('load', syncScrollPadding);
  window.addEventListener('resize', syncScrollPadding);

});
