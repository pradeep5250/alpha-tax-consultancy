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
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navMenu.querySelectorAll(".nav__trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        if (!window.matchMedia("(max-width: 1050px)").matches) return;
        e.preventDefault();
        const parent = trigger.closest(".nav__dropdown");
        const willOpen = !parent?.classList.contains("open");
        navMenu.querySelectorAll(".nav__dropdown").forEach((d) => {
          d.classList.remove("open");
          d.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
        });
        if (willOpen && parent) {
          parent.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    navMenu.querySelectorAll("a.nav__link, .nav__dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.querySelectorAll(".nav__dropdown").forEach((d) => {
          d.classList.remove("open");
          d.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
        });
      });
    });
  }

  /* Scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("revealed"));
  }

  /* Smooth stagger for benefit cards */
  document.querySelectorAll(".tr-benefits__panel .tr-benefit").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.06}s`;
  });

  document.querySelectorAll(".tr-process__step").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });
})();
