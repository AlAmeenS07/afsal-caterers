document.addEventListener('DOMContentLoaded', () => {
    
    // ====== Hamburger Mobile Menu ======
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('active');
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('active');
            });
        });
    }

    // ====== Sticky Header ======
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // Testimonial marquee is now handled purely by CSS animations (see style.css)

    // ====== Google Drive Gallery Integration ======
    // INSTRUCTIONS TO ENABLE:
    // 1. Go to script.google.com, create a new project.
    // 2. Paste the Apps Script code (see documentation).
    // 3. Deploy as Web App, copy the URL here.
    const GOOGLE_APPS_SCRIPT_URL = ''; // ← Paste your URL here

    const galleryGrid = document.getElementById('google-drive-gallery');
    
    if (galleryGrid && GOOGLE_APPS_SCRIPT_URL) {
        fetch(GOOGLE_APPS_SCRIPT_URL)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.length) return;
                galleryGrid.innerHTML = '';
                data.forEach(imgUrl => {
                    const div = document.createElement('div');
                    div.className = 'gallery-item';
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = 'Event Gallery Image';
                    img.loading = 'lazy';
                    div.appendChild(img);
                    galleryGrid.appendChild(div);
                });
            })
            .catch(err => console.error('Gallery fetch error:', err));
    }

    // ====== Enquiry Form — sends to WhatsApp ======
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name    = (document.getElementById('name')?.value || '').trim();
            const phone   = (document.getElementById('phone')?.value || '').trim();
            const date    = (document.getElementById('date')?.value || '').trim();
            const person  = (document.getElementById('person')?.value || '').trim();
            const message = (document.getElementById('message')?.value || '').trim();
            
            const text = encodeURIComponent(
                `Hello Afsel Caterers! 🎉\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nPersons: ${person}\nMessage: ${message}`
            );
            // ← Replace with your actual WhatsApp number
            window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
        });
    }

    // ====== Newsletter Form ======
    document.querySelectorAll('.footer-newsletter').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            alert('Thank you for subscribing! We will keep you updated.');
            form.reset();
        });
    });
});
