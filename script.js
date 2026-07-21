(() => {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");
  const backToTop = document.getElementById("backToTop");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Sticky nav shadow */
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Back to top button */
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Mobile menu */
  if (navToggle && navMenu) {
    const closeAllDropdowns = () => {
      navMenu.querySelectorAll(".nav__dropdown").forEach((d) => {
        d.classList.remove("open");
        d.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
      });
    };

    const setMenuOpen = (open) => {
      navMenu.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
      if (!open) closeAllDropdowns();
    };

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenuOpen(!navMenu.classList.contains("open"));
    });

    navMenu.querySelectorAll(".nav__trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = trigger.closest(".nav__dropdown");
        const willOpen = !parent?.classList.contains("open");
        navMenu.querySelectorAll(".nav__dropdown").forEach((d) => {
          if (d !== parent) {
            d.classList.remove("open");
            d.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
          }
        });
        parent?.classList.toggle("open", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
      });
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        if (window.matchMedia("(max-width: 900px)").matches) {
          setMenuOpen(false);
        } else {
          closeAllDropdowns();
        }
      }
    });

    navMenu.querySelectorAll("a.nav__link, .nav__dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 900px)").matches) {
          setMenuOpen(false);
        }
      });
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 900px)").matches) {
        setMenuOpen(false);
      }
    });
  }

  /* Active nav on scroll */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav__link")];

  const setActiveLink = () => {
    const y = window.scrollY + 120;
    let current = sections[0]?.id || "home";
    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${current}`);
    });
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* Count-up stats with easing */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // Smooth elastic-out easing
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => countObs.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* Reveal on scroll — supports multiple animation variants */
  const revealSelectors = [
    ".service-card",
    ".why__feature",
    ".process__step",
    ".resources__inner",
    ".reveal--left",
    ".reveal--right",
    ".reveal--scale",
    ".section-head",
    ".stats__item",
    ".footer__cta",
    ".footer__info",
  ];

  const revealTargets = document.querySelectorAll(revealSelectors.join(", "));

  revealTargets.forEach((el) => {
    // Only add 'reveal' class if the element doesn't already have a variant
    if (
      !el.classList.contains("reveal--left") &&
      !el.classList.contains("reveal--right") &&
      !el.classList.contains("reveal--scale")
    ) {
      el.classList.add("reveal");
    }
  });

  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((el) => revealObs.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("visible"));
  }

  /* Parallax tilt on hero image */
  const heroFigure = document.querySelector(".hero__figure");
  const heroVisual = document.querySelector(".hero__visual");

  if (heroFigure && heroVisual && window.matchMedia("(min-width: 901px)").matches) {
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * 6; // degrees
      const tiltY = -x * 6;
      heroFigure.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });

    heroVisual.addEventListener("mouseleave", () => {
      heroFigure.style.transform = "";
    });
  }

  /* Smooth reveal for section heads */
  const sectionHeads = document.querySelectorAll(".section-head");
  if ("IntersectionObserver" in window) {
    const headObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );
    sectionHeads.forEach((el) => headObs.observe(el));
  }
})();
