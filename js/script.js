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

    // ====== Booking Inquiry Form (WhatsApp Direct Integration) ======
    const bookingForm = document.getElementById('bookingInquiryForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName')?.value.trim() || '';
            const phone = document.getElementById('clientPhone')?.value.trim() || '';
            const eventType = document.getElementById('eventType')?.value || 'Event';
            const eventDate = document.getElementById('eventDate')?.value || 'TBD';
            const guestCount = document.getElementById('guestCount')?.value.trim() || 'TBD';
            const location = document.getElementById('eventLocation')?.value.trim() || 'Kerala';
            const notes = document.getElementById('eventNotes')?.value.trim() || '';

            let whatsappMessage = `*NEW EVENT ENQUIRY - AFSAL CATERERS & EVENTS*\n`;
            whatsappMessage += `--------------------------------------\n`;
            whatsappMessage += `*Name:* ${name}\n`;
            whatsappMessage += `*Phone / WhatsApp:* ${phone}\n`;
            whatsappMessage += `*Occasion:* ${eventType}\n`;
            whatsappMessage += `*Event Date:* ${eventDate}\n`;
            whatsappMessage += `*Guests:* ${guestCount}\n`;
            whatsappMessage += `*Venue / Location:* ${location}\n`;
            if (notes) {
                whatsappMessage += `*Preferences / Notes:* ${notes}\n`;
            }
            whatsappMessage += `--------------------------------------\n`;
            whatsappMessage += `_Enquiry sent from Afsal Caterers Official Website_`;

            // Afsal Caterers official WhatsApp number
            const whatsappNumber = '919037888910';
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            // Show confirmation toast
            if (typeof showToastNotice === 'function') {
                showToastNotice('Opening WhatsApp with your event details...');
            }

            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 300);
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
            thumbs.forEach((thumb, idx) => {
                const isActive = (idx + 1 === currentPage);
                thumb.classList.toggle('active', isActive);
                if (isActive) {
                    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
