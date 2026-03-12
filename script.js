const LINKS = {
  linkedin: "https://www.linkedin.com/in/a-s-impashree/",
  github: "https://github.com/Impashreee",
};

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function wireNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.tagName === "A") close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function wireProfileLinks() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.getAttribute("data-link");
    if (!key) return;
    const value = LINKS[key];
    if (value && typeof value === "string") {
      el.setAttribute("href", value);
      const valueEl = el.querySelector(".metaLink__value, .quickLink__v");
      if (valueEl) valueEl.textContent = value.replace(/^https?:\/\//, "");
    } else {
      el.setAttribute("href", "#contact");
      el.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        },
        { once: true },
      );
    }
  });
}

function wireContactForm() {
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  if (!form || !hint) return;

  const TO_EMAIL = "impashree2624@gmail.com";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) {
      hint.textContent = "Please fill in all fields.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}\n`);
    const mailto = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;

    hint.textContent = `Opening your email app to send to ${TO_EMAIL}…`;

    // Avoid `window.open()` (often creates a blank tab). Use same-tab navigation.
    window.location.href = mailto;
  });
}

function animateCounters() {
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  if (counters.length === 0) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const animateOne = (el, target) => {
    if (prefersReduced) {
      el.textContent = String(target);
      return;
    }
    const duration = 900;
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count") || 0);
        animateOne(el, target);
        io.unobserve(el);
      });
    },
    { threshold: 0.35 },
  );

  counters.forEach((el) => io.observe(el));
}

setYear();
wireNav();
wireProfileLinks();
wireContactForm();
animateCounters();

