/* ============================================================
   SHARED ANIMATIONS JS
   Enhances all sub-pages with scroll reveal, back-to-top,
   parallax tilt, and improved interactions.
   ============================================================ */
(() => {
  /* Mobile nav polish — full-width panel, body scroll lock, click-outside */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    const syncBodyLock = () => {
      document.body.classList.toggle("nav-open", navMenu.classList.contains("open"));
    };

    navToggle.addEventListener("click", () => {
      // Let page script toggle .open first, then sync on next frame
      requestAnimationFrame(syncBodyLock);
    });

    const observer = new MutationObserver(syncBodyLock);
    observer.observe(navMenu, { attributes: true, attributeFilter: ["class"] });

    document.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 900px)").matches) return;
      if (!navMenu.classList.contains("open")) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.querySelectorAll(".nav__dropdown").forEach((d) => {
        d.classList.remove("open");
        d.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
      });
      syncBodyLock();
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 900px)").matches && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        syncBodyLock();
      }
    });
  }

  /* Back to top button — inject if not present */
  let backToTop = document.getElementById("backToTop");
  if (!backToTop) {
    backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.id = "backToTop";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
  }

  const toggleBackToTop = () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  };
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* Scroll reveal system */
  const revealSelectors = [
    ".benefit-card",
    ".doc-card",
    ".docs-card",
    ".docs-panel",
    ".reqs-panel",
    ".tr-docs__panel",
    ".tr-req__panel",
    ".document-card",
    ".why-card",
    ".process__step",
    ".service-card",
    ".why__feature",
    ".resources__inner",
    ".section-title",
    ".section-head",
    ".stats__item",
    ".footer__cta",
    ".footer__info",
    ".reveal--left",
    ".reveal--right",
    ".reveal--scale",
    /* generic page sections */
    ".faq-item",
    ".timeline-item",
    ".pricing-card",
    ".feature-card",
    ".info-card",
    ".step-card",
    ".advantage-card",
    ".eligibility-card",
    ".type-card",
    ".penalty-card",
  ];

  const revealTargets = document.querySelectorAll(revealSelectors.join(", "));

  revealTargets.forEach((el) => {
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

  /* Document cards — touch press + ripple (all pages) */
  const docCardSelector = [
    ".doc-card",
    ".docs-card",
    ".docs-panel",
    ".reqs-panel",
    ".tr-docs__panel",
    ".tr-req__panel",
    ".document-card",
    ".info-card",
  ].join(", ");

  const spawnDocRipple = (card, clientX, clientY) => {
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "doc-touch-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${clientX - rect.left - size / 2}px`;
    ripple.style.top = `${clientY - rect.top - size / 2}px`;
    card.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 600);
  };

  document.querySelectorAll(docCardSelector).forEach((card) => {
    // Only wire info-cards that hold a document list
    if (
      card.classList.contains("info-card") &&
      !card.querySelector(".doc-list, ol")
    ) {
      return;
    }

    const pressOn = (e) => {
      card.classList.add("is-touching");
      const point = e.touches ? e.touches[0] : e;
      if (point) spawnDocRipple(card, point.clientX, point.clientY);
    };
    const pressOff = () => card.classList.remove("is-touching");

    card.addEventListener("touchstart", pressOn, { passive: true });
    card.addEventListener("touchend", pressOff, { passive: true });
    card.addEventListener("touchcancel", pressOff, { passive: true });
    card.addEventListener("mousedown", pressOn);
    card.addEventListener("mouseup", pressOff);
    card.addEventListener("mouseleave", pressOff);
  });

  /* Document list rows — press highlight on touch/click */
  const docRowSelector = [
    ".doc-card ol li",
    ".doc-card ul li",
    ".docs-card ol li",
    ".docs-card ul li",
    ".docs-panel ol li",
    ".docs-panel ul li",
    ".reqs-panel ol li",
    ".reqs-panel ul li",
    ".tr-docs__list li",
    ".doc-list li",
    ".info-card ol li",
  ].join(", ");

  document.querySelectorAll(docRowSelector).forEach((row) => {
    const rowOn = () => row.classList.add("is-touching");
    const rowOff = () => row.classList.remove("is-touching");
    row.addEventListener("touchstart", rowOn, { passive: true });
    row.addEventListener("touchend", rowOff, { passive: true });
    row.addEventListener("touchcancel", rowOff, { passive: true });
    row.addEventListener("mousedown", rowOn);
    row.addEventListener("mouseup", rowOff);
    row.addEventListener("mouseleave", rowOff);
  });

  /* Income Tax-style icon document tiles */
  document.querySelectorAll(".docs-icon-item").forEach((item) => {
    const pressOn = (e) => {
      item.classList.add("is-touching");
      const point = e.touches ? e.touches[0] : e;
      if (point) spawnDocRipple(item, point.clientX, point.clientY);
    };
    const pressOff = () => item.classList.remove("is-touching");
    item.addEventListener("touchstart", pressOn, { passive: true });
    item.addEventListener("touchend", pressOff, { passive: true });
    item.addEventListener("touchcancel", pressOff, { passive: true });
    item.addEventListener("mousedown", pressOn);
    item.addEventListener("mouseup", pressOff);
    item.addEventListener("mouseleave", pressOff);
  });

  /* Parallax tilt on page-hero image */
  const heroFigure = document.querySelector(".page-hero__figure");
  const heroVisual = document.querySelector(".page-hero__visual");

  if (heroFigure && heroVisual && window.matchMedia("(min-width: 901px)").matches) {
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * 6;
      const tiltY = -x * 6;
      heroFigure.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });

    heroVisual.addEventListener("mouseleave", () => {
      heroFigure.style.transform = "";
    });
  }

  /* Also handle main-page hero__figure if present */
  const mainHeroFigure = document.querySelector(".hero__figure");
  const mainHeroVisual = document.querySelector(".hero__visual");

  if (mainHeroFigure && mainHeroVisual && !heroFigure && window.matchMedia("(min-width: 901px)").matches) {
    mainHeroVisual.addEventListener("mousemove", (e) => {
      const rect = mainHeroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * 6;
      const tiltY = -x * 6;
      mainHeroFigure.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
    });

    mainHeroVisual.addEventListener("mouseleave", () => {
      mainHeroFigure.style.transform = "";
    });
  }
})();
