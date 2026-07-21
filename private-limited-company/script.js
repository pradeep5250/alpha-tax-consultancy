(() => {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const onScroll = () => navbar?.classList.toggle("scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navMenu.querySelectorAll(".nav__trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (!window.matchMedia("(max-width: 900px)").matches) return;
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
      });
    });
  }

  document.querySelectorAll(".why-card, .process__step, .reqs-panel, .advantages__grid article, .perk, .trust-cta, .trust__grid > div").forEach((el) => {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }
})();
