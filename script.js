// ==========================================
// RAJ MISHRA PORTFOLIO - JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. DARK / LIGHT MODE
    // ==========================================

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");

        if (themeIcon) {
            themeIcon.textContent = "☀";
        }
    } else {
        if (themeIcon) {
            themeIcon.textContent = "☾";
        }
    }

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("light-mode");

            const isLight =
                document.body.classList.contains("light-mode");

            if (isLight) {

                localStorage.setItem(
                    "portfolio-theme",
                    "light"
                );

                if (themeIcon) {
                    themeIcon.textContent = "☀";
                }

            } else {

                localStorage.setItem(
                    "portfolio-theme",
                    "dark"
                );

                if (themeIcon) {
                    themeIcon.textContent = "☾";
                }
            }

        });

    }


    // ==========================================
    // 2. MOBILE MENU
    // ==========================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinksContainer = document.querySelector(".nav-links");

    if (menuToggle && navLinksContainer) {

        menuToggle.addEventListener("click", () => {

            navLinksContainer.classList.toggle("mobile-open");

            const isOpen =
                navLinksContainer.classList.contains("mobile-open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        // Close mobile menu after clicking a link

        navLinksContainer.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinksContainer.classList.remove(
                    "mobile-open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    // ==========================================
    // 3. SMOOTH NAVIGATION
    // ==========================================

    const navLinks =
        document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (
                !targetId ||
                !targetId.startsWith("#")
            ) {
                return;
            }

            const targetSection =
                document.querySelector(targetId);

            if (targetSection) {

                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // ==========================================
    // 4. ACTIVE NAVBAR SECTION
    // ==========================================

    const sections =
        document.querySelectorAll("section[id]");


    function updateActiveNav() {

        let currentSection = "";

        /*
         * We check the section around 35%
         * from the top of the screen.
         */

        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.35;


        sections.forEach(section => {

            if (
                scrollPosition >= section.offsetTop
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        /*
         * When user reaches the very bottom,
         * make CONTACT active.
         */

        const reachedBottom =
            window.innerHeight +
            window.scrollY >=
            document.documentElement.scrollHeight - 20;


        if (reachedBottom && sections.length > 0) {

            currentSection =
                sections[sections.length - 1]
                    .getAttribute("id");

        }


        // Remove active from every link

        navLinks.forEach(link => {

            link.classList.remove("active");

        });


        // Add active to current section

        if (currentSection) {

            const activeLink =
                document.querySelector(
                    `.nav-links a[href="#${currentSection}"]`
                );

            if (activeLink) {

                activeLink.classList.add("active");

            }

        }

    }


    window.addEventListener(
        "scroll",
        updateActiveNav
    );

    window.addEventListener(
        "resize",
        updateActiveNav
    );

    updateActiveNav();


    // ==========================================
    // 5. SCROLL REVEAL
    // ==========================================

    const revealElements =
        document.querySelectorAll(
            ".section, " +
            ".skill-card, " +
            ".project-card, " +
            ".experience-card, " +
            ".certificate-card, " +
            ".event-card, " +
            ".education-card, " +
            ".contact-card"
        );


    revealElements.forEach(element => {

        element.classList.add("reveal");

    });


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "show"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("show");

        });

    }


    // ==========================================
    // 6. CERTIFICATE VIEWER
    // ==========================================

    /*
     * IMPORTANT:
     * We use ONE event listener only.
     *
     * This supports:
     * - Certificate cards
     * - Event cards with data-certificate
     */

    document.addEventListener("click", (event) => {

        const card =
            event.target.closest(
                ".certificate-card[data-certificate], " +
                ".event-card[data-certificate]"
            );


        if (!card) {
            return;
        }


        const certificateImage =
            card.getAttribute("data-certificate");


        if (!certificateImage) {
            return;
        }


        openCertificateModal(certificateImage);

    });


    function openCertificateModal(imagePath) {

        // Prevent duplicate modal

        const existingModal =
            document.querySelector(
                ".certificate-modal"
            );

        if (existingModal) {
            existingModal.remove();
        }


        const modal =
            document.createElement("div");

        modal.className =
            "certificate-modal";


        modal.innerHTML = `

            <div class="certificate-modal-content">

                <button
                    class="certificate-close"
                    aria-label="Close certificate"
                    type="button"
                >
                    &times;
                </button>

                <img
                    src="${imagePath}"
                    alt="Certificate"
                >

            </div>

        `;


        document.body.appendChild(modal);


        // Stop background scrolling

        document.body.style.overflow =
            "hidden";


        const closeButton =
            modal.querySelector(
                ".certificate-close"
            );


        // ======================================
        // CLOSE FUNCTION
        // ======================================

        function closeCertificateModal() {

            if (!modal) {
                return;
            }


            modal.remove();


            document.body.style.overflow =
                "";


            document.removeEventListener(
                "keydown",
                escapeHandler
            );

        }


        // ======================================
        // X BUTTON
        // ======================================

        closeButton.addEventListener(
            "click",
            closeCertificateModal
        );


        // ======================================
        // CLICK OUTSIDE
        // ======================================

        modal.addEventListener(
            "click",
            (event) => {

                if (event.target === modal) {

                    closeCertificateModal();

                }

            }
        );


        // ======================================
        // ESCAPE KEY
        // ======================================

        function escapeHandler(event) {

            if (event.key === "Escape") {

                closeCertificateModal();

            }

        }


        document.addEventListener(
            "keydown",
            escapeHandler
        );

    }


    // ==========================================
    // 7. AUTOMATIC COPYRIGHT YEAR
    // ==========================================

    const copyrightElements =
        document.querySelectorAll(
            ".copyright-year"
        );


    copyrightElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    // ==========================================
    // 8. CLOSE MOBILE MENU ON OUTSIDE CLICK
    // ==========================================

    document.addEventListener(
        "click",
        (event) => {

            if (
                !navLinksContainer ||
                !menuToggle
            ) {
                return;
            }


            const clickedInsideMenu =
                navLinksContainer.contains(
                    event.target
                );


            const clickedMenuButton =
                menuToggle.contains(
                    event.target
                );


            if (
                !clickedInsideMenu &&
                !clickedMenuButton
            ) {

                navLinksContainer.classList.remove(
                    "mobile-open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

});