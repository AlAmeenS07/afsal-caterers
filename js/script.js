/**
 * AFSAL CATERERS & EVENTS - Interactive Core Scripts
 * Clean, lightweight vanilla JS for luxury UX
 */

document.addEventListener('DOMContentLoaded', () => {

    // ====== Standard Sticky Site Header on Scroll ======
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        const isScrolled = window.scrollY > 20;
        if (header) {
            header.classList.toggle('scrolled', isScrolled);
        }
    });

    // ====== Mobile Drawer Menu ======
    const hamburgers = document.querySelectorAll('.hamburger');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

    function toggleMobileMenu() {
        if (!mobileDrawer) return;
        hamburgers.forEach(h => h.classList.toggle('open'));
        mobileDrawer.classList.toggle('active');
        if (mobileBackdrop) mobileBackdrop.classList.toggle('active');
        document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
    }

    hamburgers.forEach(btn => {
        btn.addEventListener('click', toggleMobileMenu);
    });
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer && mobileDrawer.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ====== Hero Video Landing (Pure Muted Ambient Background Video) ======
    const heroBgVideo = document.getElementById('heroBgVideo');
    if (heroBgVideo) {
        heroBgVideo.muted = true;
        heroBgVideo.defaultMuted = true;
        heroBgVideo.volume = 0;
        heroBgVideo.play().catch(() => {});
    }

    // ====== Seamless Clients Marquee (Single HTML Source, Zero Duplication) ======
    const marqueeContainers = document.querySelectorAll('.marquee-container');
    marqueeContainers.forEach(container => {
        const track = container.querySelector('.marquee-track');
        if (track && !container.dataset.cloned) {
            container.dataset.cloned = 'true';
            const clone = track.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            container.appendChild(clone);
        }
    });

    // ====== FAQ Accordion ======
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close other open faqs
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ====== Gallery Filtering & Lightbox Modal ======
    const galleryTabs = document.querySelectorAll('.gallery-tab-btn');
    const galleryCards = document.querySelectorAll('.gallery-photo-card');
    const lightbox = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-main-img');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxSubtitle = document.querySelector('.lightbox-subtitle');
    const lightboxClose = document.querySelector('.lightbox-close-btn');
    const lightboxPrev = document.querySelector('.lightbox-prev-btn');
    const lightboxNext = document.querySelector('.lightbox-next-btn');

    let currentGalleryIndex = 0;
    let visibleGalleryItems = [];

    function updateVisibleGallery() {
        visibleGalleryItems = Array.from(galleryCards).filter(c => c.style.display !== 'none');
    }

    if (galleryTabs.length && galleryCards.length) {
        updateVisibleGallery();

        galleryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                galleryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter') || 'all';

                galleryCards.forEach(card => {
                    const category = card.getAttribute('data-category') || '';
                    if (filter === 'all' || category.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });

                updateVisibleGallery();
            });
        });

        // Lightbox open
        galleryCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.gallery-photo-thumb');
                const title = card.querySelector('h4')?.textContent || 'Afsal Caterers Event';
                const subtitle = card.querySelector('p')?.textContent || 'Real Event Showcase';
                const src = img?.getAttribute('src') || '';

                updateVisibleGallery();
                currentGalleryIndex = visibleGalleryItems.indexOf(card);
                if (currentGalleryIndex === -1) currentGalleryIndex = 0;

                openLightbox(src, title, subtitle);
            });
        });
    }

    function openLightbox(src, title, subtitle) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxSubtitle) lightboxSubtitle.textContent = subtitle;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showLightboxItem(index) {
        if (!visibleGalleryItems.length) return;
        if (index < 0) index = visibleGalleryItems.length - 1;
        if (index >= visibleGalleryItems.length) index = 0;
        currentGalleryIndex = index;

        const card = visibleGalleryItems[currentGalleryIndex];
        const img = card.querySelector('.gallery-photo-thumb');
        const title = card.querySelector('h4')?.textContent || 'Afsal Caterers Event';
        const subtitle = card.querySelector('p')?.textContent || 'Real Event Showcase';

        if (img && lightboxImg) {
            lightboxImg.src = img.getAttribute('src');
            if (lightboxTitle) lightboxTitle.textContent = title;
            if (lightboxSubtitle) lightboxSubtitle.textContent = subtitle;
        }
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => showLightboxItem(currentGalleryIndex - 1));
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => showLightboxItem(currentGalleryIndex + 1));
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard navigation for Lightbox
    window.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightboxItem(currentGalleryIndex - 1);
        if (e.key === 'ArrowRight') showLightboxItem(currentGalleryIndex + 1);
    });

    // ====== Menu Filter & Live Search ======
    const menuSearchInput = document.getElementById('menuSearchInput');
    const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
    const categoryGroups = document.querySelectorAll('.category-group');
    const dishCards = document.querySelectorAll('.dish-card');

    function filterMenu() {
        const query = (menuSearchInput?.value || '').toLowerCase().trim();
        const activeTab = document.querySelector('.menu-tab-btn.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';

        categoryGroups.forEach(group => {
            const groupId = group.getAttribute('data-category-id');
            const dishesInGroup = group.querySelectorAll('.dish-card');
            let anyMatchedInGroup = false;

            // Check if this group matches the tab filter
            const matchesCategory = (activeCategory === 'all' || activeCategory === groupId);

            dishesInGroup.forEach(dish => {
                const title = dish.querySelector('h4')?.textContent.toLowerCase() || '';
                const desc = dish.querySelector('p')?.textContent.toLowerCase() || '';
                const matchesSearch = !query || title.includes(query) || desc.includes(query);

                if (matchesCategory && matchesSearch) {
                    dish.style.display = 'flex';
                    anyMatchedInGroup = true;
                } else {
                    dish.style.display = 'none';
                }
            });

            // If no dishes matched in this group or category doesn't match, hide group header
            group.style.display = (matchesCategory && anyMatchedInGroup) ? 'block' : 'none';
        });
    }

    if (menuTabBtns.length) {
        menuTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                menuTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterMenu();
            });
        });
    }

    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', filterMenu);
    }

    // ====== Global Toast Notification Helper ======
    window.showToastNotice = function(message, duration = 3500) {
        let toast = document.getElementById('globalSiteToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'globalSiteToast';
            toast.className = 'site-toast-notice';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    };

    // Helper to sanitize HTML for UI rendering
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ====== Booking Inquiry Form (Formspree Email Integration) ======
    const bookingForm = document.getElementById('bookingInquiryForm');
    if (bookingForm) {
        const nameInput = document.getElementById('clientName');
        const phoneInput = document.getElementById('clientPhone');
        const phoneError = document.getElementById('phoneErrorMsg');
        const eventTypeSelect = document.getElementById('eventType');
        const eventDateInput = document.getElementById('eventDate');
        const locationInput = document.getElementById('eventLocation');
        const guestCountInput = document.getElementById('guestCount');
        const notesInput = document.getElementById('eventNotes');
        const submitBtn = document.getElementById('submitEnquiryBtn');
        const alertBox = document.getElementById('formAlertBox');

        // Set minimum date for event booking to today
        if (eventDateInput) {
            const today = new Date().toISOString().split('T')[0];
            eventDateInput.setAttribute('min', today);
        }

        // Real-time phone number input sanitizer (Strictly Digits Only, Max 10)
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                // Strip all non-digit characters
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                
                if (e.target.value.length === 10) {
                    phoneInput.classList.remove('is-invalid');
                    if (phoneError) phoneError.style.display = 'none';
                }
            });

            phoneInput.addEventListener('blur', (e) => {
                const val = e.target.value.trim();
                if (val && val.length !== 10) {
                    phoneInput.classList.add('is-invalid');
                    if (phoneError) phoneError.style.display = 'block';
                } else {
                    phoneInput.classList.remove('is-invalid');
                    if (phoneError) phoneError.style.display = 'none';
                }
            });
        }

        // Clear invalid state on inputs when typing
        [nameInput, eventTypeSelect, eventDateInput, locationInput, guestCountInput].forEach(elem => {
            if (elem) {
                elem.addEventListener('input', () => elem.classList.remove('is-invalid'));
                elem.addEventListener('change', () => elem.classList.remove('is-invalid'));
            }
        });

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous alerts
            if (alertBox) {
                alertBox.style.display = 'none';
                alertBox.className = 'form-alert-box';
                alertBox.innerHTML = '';
            }

            const name = nameInput?.value.trim() || '';
            const phone = phoneInput?.value.trim() || '';
            const eventType = eventTypeSelect?.value || '';
            const eventDate = eventDateInput?.value || '';
            const location = locationInput?.value.trim() || '';
            const guestCount = guestCountInput?.value.trim() || '';
            const notes = notesInput?.value.trim() || '';

            // --- Validation Checks ---
            let isValid = true;
            let firstInvalidElem = null;

            if (!name) {
                nameInput?.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidElem) firstInvalidElem = nameInput;
            }

            // Strictly validate 10-digit phone number
            const phoneDigitsRegex = /^\d{10}$/;
            if (!phone || !phoneDigitsRegex.test(phone)) {
                phoneInput?.classList.add('is-invalid');
                if (phoneError) phoneError.style.display = 'block';
                isValid = false;
                if (!firstInvalidElem) firstInvalidElem = phoneInput;
            } else {
                phoneInput?.classList.remove('is-invalid');
                if (phoneError) phoneError.style.display = 'none';
            }

            if (!eventType) {
                eventTypeSelect?.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidElem) firstInvalidElem = eventTypeSelect;
            }

            if (!eventDate) {
                eventDateInput?.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidElem) firstInvalidElem = eventDateInput;
            }

            if (!location) {
                locationInput?.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidElem) firstInvalidElem = locationInput;
            }

            if (!guestCount) {
                guestCountInput?.classList.add('is-invalid');
                isValid = false;
                if (!firstInvalidElem) firstInvalidElem = guestCountInput;
            }

            if (!isValid) {
                if (firstInvalidElem) {
                    firstInvalidElem.focus();
                }
                showToastNotice('Please fill in all required fields properly.');
                return;
            }

            // --- EmailJS Payload & Credentials ---
            const EMAILJS_SERVICE_ID = 'service_so4lb2h';
            const EMAILJS_TEMPLATE_ID = 'template_nt2600k';
            const EMAILJS_PUBLIC_KEY = 'Hh-FRlE05GFevMZKe';

            // Format human-readable date
            let formattedDate = eventDate;
            try {
                const dateObj = new Date(eventDate);
                formattedDate = dateObj.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            } catch (err) {}

            const submissionTime = new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            const dynamicSubject = `New Enquiry: ${eventType}`;

            const emailJsPayload = {
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: {
                    subject: dynamicSubject,
                    client_name: name,
                    name: name,
                    client_phone: phone,
                    phone: phone,
                    event_type: eventType,
                    event_date: formattedDate,
                    event_location: location,
                    guest_count: guestCount,
                    special_requirements: notes || "No specific menu notes provided",
                    message: notes || "No specific menu notes provided",
                    submission_time: submissionTime,
                    reply_to: 'afsalcatering@gmail.com'
                }
            };

            // Loading state on button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('is-loading');
                submitBtn.innerHTML = '<span class="btn-spinner"></span> Submitting Enquiry...';
            }

            try {
                const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(emailJsPayload)
                });

                if (response.ok || response.status === 200) {
                    // Success feedback
                    if (alertBox) {
                        alertBox.className = 'form-alert-box success';
                        alertBox.innerHTML = `
                            <strong>✓ Enquiry Received Successfully!</strong>
                            <p>Thank you <b>${escapeHtml(name)}</b>. Your event catering details have been submitted. Our team will review your menu requirements and reach out to you at <b>+91 ${escapeHtml(phone)}</b> shortly.</p>
                        `;
                        alertBox.style.display = 'block';
                        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }

                    bookingForm.reset();
                    showToastNotice('Enquiry sent successfully! We will contact you soon.');
                } else {
                    const errorText = await response.text().catch(() => 'Unable to send enquiry.');

                    if (alertBox) {
                        alertBox.className = 'form-alert-box error';
                        alertBox.innerHTML = `
                            <strong>✕ Submission Issue</strong>
                            <p>${escapeHtml(errorText)} You can also connect directly on <a href="https://wa.me/919037888910" target="_blank" rel="noopener">WhatsApp</a> or call <a href="tel:+919037888910">+91 90378 88910</a>.</p>
                        `;
                        alertBox.style.display = 'block';
                        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            } catch (networkError) {
                if (alertBox) {
                    alertBox.className = 'form-alert-box error';
                    alertBox.innerHTML = `
                        <strong>✕ Network Error</strong>
                        <p>Could not connect to the mail service. Please check your connection or reach us directly on <a href="https://wa.me/919037888910" target="_blank" rel="noopener">WhatsApp (+91 90378 88910)</a>.</p>
                    `;
                    alertBox.style.display = 'block';
                    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('is-loading');
                    submitBtn.innerHTML = '<span class="btn-text">Submit Enquiry &rarr;</span>';
                }
            }
        });
    }

    // ====== Newsletter Forms ======
    document.querySelectorAll('.footer-newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToastNotice('Thank you! You are subscribed to Afsal Caterers updates.');
            form.reset();
        });
    });

    // ====== Cinema Video Player & Fullscreen Controller ======
    const cinemaVideo = document.getElementById('cinemaVideo');
    const cinemaWrapper = document.getElementById('cinemaPlayerWrapper');
    const cinemaPlayBtn = document.getElementById('cinemaPlayBtn');
    const cinemaBigPlay = document.getElementById('cinemaBigPlay');
    const cinemaFullscreenBtn = document.getElementById('cinemaFullscreenBtn');
    const cinemaMuteBtn = document.getElementById('cinemaMuteBtn');
    const cinemaProgressBar = document.getElementById('cinemaProgressBar');
    const cinemaTimeDisplay = document.getElementById('cinemaTimeDisplay');

    if (cinemaVideo) {
        function togglePlay() {
            if (cinemaVideo.paused || cinemaVideo.ended) {
                cinemaVideo.play();
            } else {
                cinemaVideo.pause();
            }
        }

        if (cinemaBigPlay) cinemaBigPlay.addEventListener('click', togglePlay);
        if (cinemaPlayBtn) cinemaPlayBtn.addEventListener('click', togglePlay);
        cinemaVideo.addEventListener('click', togglePlay);

        cinemaVideo.addEventListener('play', () => {
            if (cinemaWrapper) cinemaWrapper.classList.add('is-playing');
            if (cinemaPlayBtn) {
                cinemaPlayBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
                cinemaPlayBtn.setAttribute('aria-label', 'Pause Video');
            }
        });

        cinemaVideo.addEventListener('pause', () => {
            if (cinemaWrapper) cinemaWrapper.classList.remove('is-playing');
            if (cinemaPlayBtn) {
                cinemaPlayBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
                cinemaPlayBtn.setAttribute('aria-label', 'Play Video');
            }
        });

        // Scrubber progress update
        cinemaVideo.addEventListener('timeupdate', () => {
            if (cinemaVideo.duration) {
                const percent = (cinemaVideo.currentTime / cinemaVideo.duration) * 100;
                if (cinemaProgressBar) cinemaProgressBar.value = percent;
                if (cinemaTimeDisplay) {
                    const curM = Math.floor(cinemaVideo.currentTime / 60);
                    const curS = Math.floor(cinemaVideo.currentTime % 60).toString().padStart(2, '0');
                    const durM = Math.floor(cinemaVideo.duration / 60);
                    const durS = Math.floor(cinemaVideo.duration % 60).toString().padStart(2, '0');
                    cinemaTimeDisplay.textContent = `${curM}:${curS} / ${durM}:${durS}`;
                }
            }
        });

        if (cinemaProgressBar) {
            cinemaProgressBar.addEventListener('input', (e) => {
                if (cinemaVideo.duration) {
                    cinemaVideo.currentTime = (e.target.value / 100) * cinemaVideo.duration;
                }
            });
        }

        // Mute / Unmute
        if (cinemaMuteBtn) {
            cinemaMuteBtn.addEventListener('click', () => {
                cinemaVideo.muted = !cinemaVideo.muted;
                if (cinemaVideo.muted) {
                    cinemaMuteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
                    cinemaMuteBtn.setAttribute('aria-label', 'Unmute');
                } else {
                    cinemaMuteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
                    cinemaMuteBtn.setAttribute('aria-label', 'Mute');
                }
            });
        }

        // Fullscreen Toggle
        if (cinemaFullscreenBtn) {
            cinemaFullscreenBtn.addEventListener('click', () => {
                const target = cinemaWrapper || cinemaVideo;
                if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                    if (target.requestFullscreen) {
                        target.requestFullscreen();
                    } else if (target.webkitRequestFullscreen) {
                        target.webkitRequestFullscreen();
                    } else if (cinemaVideo.webkitEnterFullscreen) {
                        cinemaVideo.webkitEnterFullscreen();
                    } else if (target.mozRequestFullScreen) {
                        target.mozRequestFullScreen();
                    } else if (target.msRequestFullscreen) {
                        target.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            });

            document.addEventListener('fullscreenchange', () => {
                const isFull = !!document.fullscreenElement;
                if (cinemaWrapper) cinemaWrapper.classList.toggle('is-fullscreen', isFull);
                cinemaFullscreenBtn.innerHTML = isFull
                    ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`
                    : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
            });
        }
    }

    // ====== Toast Notification Utility ======
    function showToastNotice(message) {
        let toast = document.querySelector('.toast-notice');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notice';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D91B24" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${message}</span>
        `;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // ====== Interactive Menu Book Slider & Viewer Controller ======
    const menuBookSection = document.getElementById('menuBookSection');
    if (menuBookSection) {
        let currentPage = 1;
        const slides = document.querySelectorAll('.menu-slide-item');
        const totalPages = slides.length || 7;

        const thumbs = document.querySelectorAll('.menu-thumb-item');
        const gridCards = document.querySelectorAll('.menu-grid-card');
        const prevBtns = document.querySelectorAll('.js-menu-prev');
        const nextBtns = document.querySelectorAll('.js-menu-next');
        const pageCounters = document.querySelectorAll('.js-menu-page-count');
        const progressFill = document.querySelector('.menu-progress-fill');
        const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
        const sliderView = document.getElementById('menuSliderView');
        const gridView = document.getElementById('menuGridView');

        // Lightbox elements
        const lightboxModal = document.getElementById('menuLightboxModal');
        const lbImg = document.getElementById('menuLbImg');
        const lbClose = document.getElementById('menuLbClose');
        const lbPrev = document.getElementById('menuLbPrev');
        const lbNext = document.getElementById('menuLbNext');
        const lbCounter = document.getElementById('menuLbCounter');
        const openFullscreenBtn = document.getElementById('menuFullscreenBtn');

        function goToPage(pageNumber) {
            if (pageNumber < 1) pageNumber = 1;
            if (pageNumber > totalPages) pageNumber = totalPages;
            currentPage = pageNumber;

            // Update slide visibility
            slides.forEach((slide, idx) => {
                if (idx + 1 === currentPage) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update thumbnails
            const strip = document.querySelector('.menu-thumbnails-strip');
            thumbs.forEach((thumb, idx) => {
                const isActive = (idx + 1 === currentPage);
                thumb.classList.toggle('active', isActive);
                if (isActive && strip) {
                    const scrollLeft = thumb.offsetLeft - (strip.clientWidth / 2) + (thumb.clientWidth / 2);
                    strip.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }
            });

            // Update counters
            pageCounters.forEach(el => {
                el.textContent = `Page ${currentPage} of ${totalPages}`;
            });

            // Update progress track
            if (progressFill) {
                progressFill.style.width = `${(currentPage / totalPages) * 100}%`;
            }

            // Update prev / next buttons state
            prevBtns.forEach(btn => btn.disabled = (currentPage === 1));
            nextBtns.forEach(btn => btn.disabled = (currentPage === totalPages));

            // Update Lightbox if open
            if (lightboxModal && lightboxModal.classList.contains('active')) {
                updateLightbox();
            }
        }

        // Navigation handlers
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentPage > 1) goToPage(currentPage - 1);
            });
        });

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentPage < totalPages) goToPage(currentPage + 1);
            });
        });

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const targetPage = parseInt(thumb.getAttribute('data-page'), 10);
                if (!isNaN(targetPage)) {
                    goToPage(targetPage);
                }
            });
        });

        // Grid cards click
        gridCards.forEach(card => {
            card.addEventListener('click', () => {
                const targetPage = parseInt(card.getAttribute('data-page'), 10);
                if (!isNaN(targetPage)) {
                    goToPage(targetPage);
                    // Switch to slider view
                    switchView('slider');
                    // Smooth scroll to stage
                    const stage = document.querySelector('.menu-stage-outer') || document.querySelector('.menu-stage-wrap');
                    if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        // View Mode Switcher
        function switchView(viewMode) {
            viewToggleBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-view') === viewMode);
            });

            if (viewMode === 'grid') {
                if (sliderView) sliderView.style.display = 'none';
                if (gridView) {
                    gridView.classList.add('active');
                    gridView.style.display = 'grid';
                }
            } else {
                if (gridView) {
                    gridView.classList.remove('active');
                    gridView.style.display = 'none';
                }
                if (sliderView) sliderView.style.display = 'block';
            }
        }

        viewToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-view');
                switchView(mode);
            });
        });

        // Touch Swipe gestures on Mobile
        const viewport = document.querySelector('.menu-slider-viewport');
        if (viewport) {
            let startX = 0;
            let endX = 0;

            viewport.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].screenX;
            }, { passive: true });

            viewport.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const threshold = 40;
                if (startX - endX > threshold) {
                    // Swipe Left -> Next Page
                    if (currentPage < totalPages) goToPage(currentPage + 1);
                } else if (endX - startX > threshold) {
                    // Swipe Right -> Prev Page
                    if (currentPage > 1) goToPage(currentPage - 1);
                }
            }
        }

        // Keyboard Arrow Navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                if (currentPage > 1) goToPage(currentPage - 1);
            } else if (e.key === 'ArrowRight') {
                if (currentPage < totalPages) goToPage(currentPage + 1);
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Lightbox Modal Logic
        function updateLightbox() {
            if (!lbImg) return;
            lbImg.src = `images/menu/menu-page-${currentPage}.jpg`;
            lbImg.alt = `Afsal Caterers Menu Book Page ${currentPage}`;
            if (lbCounter) lbCounter.textContent = `Page ${currentPage} of ${totalPages}`;
            if (lbPrev) lbPrev.disabled = (currentPage === 1);
            if (lbNext) lbNext.disabled = (currentPage === totalPages);
        }

        function openLightbox() {
            if (!lightboxModal) return;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateLightbox();
        }

        function closeLightbox() {
            if (!lightboxModal) return;
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Open lightbox on image click or button click
        document.querySelectorAll('.menu-page-img').forEach(img => {
            img.addEventListener('click', openLightbox);
        });

        if (openFullscreenBtn) {
            openFullscreenBtn.addEventListener('click', openLightbox);
        }

        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        if (lightboxModal) {
            lightboxModal.addEventListener('click', (e) => {
                if (e.target === lightboxModal) closeLightbox();
            });
        }
        if (lbPrev) {
            lbPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentPage > 1) goToPage(currentPage - 1);
            });
        }
        if (lbNext) {
            lbNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentPage < totalPages) goToPage(currentPage + 1);
            });
        }

        // Initialize at page 1
        goToPage(1);
    }
});
