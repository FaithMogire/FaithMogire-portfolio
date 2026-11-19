/* ==========================================================
   Faith Mogire – Portfolio JavaScript (vanilla JS, no libraries)
   ========================================================== */

// >>> EDIT THIS: put YOUR real email address between the quotes <<<
const MY_EMAIL = "mogiref01@gmail.com";

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  highlightActiveLink();
  setupRevealAnimations();
  setupPhotoFallback();
  setupContactForm();
  setupProjectPreviews();
  setFooterYear();
});

/* 7. Project previews: real images replace the drawings, and "View Project" opens a bigger preview */
function setupProjectPreviews() {
  const cards = document.querySelectorAll(".project-card");
  if (cards.length === 0) return;

  // Use the real image if it exists; otherwise keep the CSS drawing
  document.querySelectorAll(".project-visual img.project-img").forEach(function (img) {
    const visual = img.parentElement;
    function ok() { visual.classList.add("has-photo"); }
    function fail() { img.remove(); }
    img.addEventListener("load", ok);
    img.addEventListener("error", fail);
    if (img.complete) { img.naturalWidth > 0 ? ok() : fail(); }
  });

  const box = document.getElementById("lightbox");
  const title = document.getElementById("lightbox-title");
  const body = document.getElementById("lightbox-body");
  const closeBtn = document.getElementById("lightbox-close");
  let lastButton = null;

  function openPreview(card, button) {
    lastButton = button;
    title.textContent = card.querySelector("h3").textContent;
    body.innerHTML = "";
    const img = card.querySelector("img.project-img");
    if (img) {
      const big = document.createElement("img");
      big.src = img.src;
      big.alt = img.alt;
      body.appendChild(big);
    } else {
      body.appendChild(card.querySelector(".project-visual").cloneNode(true));
    }
    box.classList.add("open");
    closeBtn.focus();
  }

  function closePreview() {
    box.classList.remove("open");
    if (lastButton) lastButton.focus();
  }

  cards.forEach(function (card) {
    const button = card.querySelector(".view-project");
    if (button) button.addEventListener("click", function () { openPreview(card, button); });
  });
  closeBtn.addEventListener("click", closePreview);
  box.addEventListener("click", function (e) { if (e.target === box) closePreview(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("open")) closePreview(); });
}

/* 1. Mobile menu: opens/closes the navigation on small screens */
function setupMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu when a link is clicked
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close the menu with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* 2. Active link: marks the link of the page you are on */
function highlightActiveLink() {
  let current = window.location.pathname.split("/").pop();
  if (current === "" || current === undefined) current = "index.html";

  document.querySelectorAll(".nav-menu a").forEach(function (link) {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* 3. Reveal animations: elements fade in as you scroll */
function setupRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { observer.observe(el); });
}

/* 4. Photo fallback: if images/profile.jpg is missing, show a neat placeholder */
function setupPhotoFallback() {
  const frame = document.querySelector(".photo-frame");
  const img = frame ? frame.querySelector("img") : null;
  if (!frame || !img) return;

  function showPlaceholder() { frame.classList.add("no-photo"); }
  img.addEventListener("error", showPlaceholder);
  if (img.complete && img.naturalWidth === 0) showPlaceholder();
}

/* 5. Contact form: validate, then open the visitor's email app (mailto) */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const status = document.getElementById("form-status");

  function setError(input, message) {
    const errorEl = document.getElementById(input.id + "-error");
    errorEl.textContent = message;
    input.classList.toggle("invalid", message !== "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  }

  function validate() {
    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nameInput.value.trim() === "") {
      setError(nameInput, "Please enter your full name.");
      valid = false;
    } else { setError(nameInput, ""); }

    if (emailInput.value.trim() === "") {
      setError(emailInput, "Please enter your email address.");
      valid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      setError(emailInput, "Please enter a valid email, e.g. name@example.com.");
      valid = false;
    } else { setError(emailInput, ""); }

    if (messageInput.value.trim() === "") {
      setError(messageInput, "Please write a message.");
      valid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, "Your message should be at least 10 characters.");
      valid = false;
    } else { setError(messageInput, ""); }

    return valid;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if (!validate()) {
      status.className = "form-status error";
      status.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    const subject = "Portfolio message from " + nameInput.value.trim();
    const body = "Name: " + nameInput.value.trim() +
      "\nEmail: " + emailInput.value.trim() +
      "\n\nMessage:\n" + messageInput.value.trim();

    const mailto = "mailto:" + MY_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.className = "form-status success";
    status.textContent = "Thank you! Your email app should now open with your message ready to send. " +
      "Nothing is sent until you press Send there. If nothing opens, please email me directly at " + MY_EMAIL + ".";

    window.location.href = mailto;
  });

  // Clear an error as soon as the visitor starts fixing the field
  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener("input", function () { setError(input, ""); });
  });
}

/* 6. Footer year */
function setFooterYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}
