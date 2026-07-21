(() => {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
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
})();
