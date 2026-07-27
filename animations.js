/* ============================================================
   SHARED ANIMATIONS JS — same behavior as home on every page
   Scroll reveal, back-to-top, parallax tilt, doc touch effects
   ============================================================ */
(() => {
  if (window.__alphaAnimationsReady) return;
  window.__alphaAnimationsReady = true;

  /* Mobile nav polish — body scroll lock, click-outside */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    const syncBodyLock = () => {
      document.body.classList.toggle("nav-open", navMenu.classList.contains("open"));
    };

    navToggle.addEventListener("click", () => {
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

  /* Back to top */
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

  /* Scroll reveal — home-matching selectors + common subpage cards */
  const revealSelectors = [
    ".service-card",
    ".why__feature",
    ".process__step",
    ".resources__inner",
    ".section-head",
    ".section-title",
    ".stats__item",
    ".footer__cta",
    ".footer__info",
    ".reveal--left",
    ".reveal--right",
    ".reveal--scale",
    ".benefit-card",
    ".doc-card",
    ".docs-card",
    ".docs-panel",
    ".reqs-panel",
    ".tr-docs__panel",
    ".tr-req__panel",
    ".tr-benefit",
    ".tr-process__step",
    ".document-card",
    ".why-card",
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
    ".advantages__grid article",
    ".trust-cta",
    ".trust__grid > div",
    ".trust__item",
    ".about-team__block",
    ".about-exist__list li",
    ".contact-card",
    ".contact-info-card",
    ".perk",
    ".apply-card",
    ".docs-icon-item",
  ];

  const revealTargets = document.querySelectorAll(revealSelectors.join(", "));

  revealTargets.forEach((el) => {
    if (
      !el.classList.contains("reveal--left") &&
      !el.classList.contains("reveal--right") &&
      !el.classList.contains("reveal--scale") &&
      !el.classList.contains("reveal")
    ) {
      el.classList.add("reveal");
    }
  });

  const markVisible = (el) => {
    el.classList.add("visible");
    el.classList.add("revealed"); // trust page legacy class
  };

  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          markVisible(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal--left, .reveal--right, .reveal--scale").forEach((el) => {
      revealObs.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal, .reveal--left, .reveal--right, .reveal--scale").forEach(markVisible);
  }

  /* Document cards — touch press + ripple */
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

  /* Hero images use CSS zoom animation — no tilt (keeps transform free) */

  /* Navbar scrolled shadow (same as home) */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Year stamp if present */
  const yearEl = document.getElementById("year");
  if (yearEl && !yearEl.textContent.trim()) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
