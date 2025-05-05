// Main JavaScript file

document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation toggle
  setupMobileNav();

  // Header scroll effect
  setupHeaderScroll();

  // Smooth scroll for anchor links
  setupSmoothScroll();

  // Initialize animations
  initAnimations();

  // Set current year in copyright
  setCurrentYear();
});

// Mobile navigation setup
function setupMobileNav() {
  const navToggle = document.createElement("button");
  navToggle.className = "nav-toggle";
  navToggle.setAttribute("aria-label", "Toggle navigation");
  navToggle.innerHTML = "☰";

  const nav = document.querySelector("nav");
  const headerContainer = document.querySelector("header .container");

  if (headerContainer && nav) {
    headerContainer.insertBefore(navToggle, nav);

    navToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      navToggle.innerHTML = nav.classList.contains("open") ? "✕" : "☰";
    });

    // Close mobile nav when clicking on links
    const navLinks = nav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth < 768) {
          nav.classList.remove("open");
          navToggle.innerHTML = "☰";
        }
      });
    });

    // Close mobile nav when resizing to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.innerHTML = "☰";
      }
    });
  }
}

// Header scroll effect
function setupHeaderScroll() {
  const header = document.querySelector("header");

  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    });
  }
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#") {
        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: targetPosition - headerHeight,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// Initialize animations
function initAnimations() {
  // Add animation to elements as they enter the viewport
  const animatedElements = document.querySelectorAll(
    ".service, .service-item, .loan-type, .contact-item, .team-member"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Set current year for copyright
function setCurrentYear() {
  const currentYearElements = document.querySelectorAll(".current-year");
  const currentYear = new Date().getFullYear();

  currentYearElements.forEach((element) => {
    element.textContent = currentYear;
  });
}

// Loan calculator function
function calculateLoan() {
  const amount = parseFloat(document.getElementById("loanAmount").value) || 0;
  const term = parseFloat(document.getElementById("loanTerm").value) || 0;
  const resultElement = document.getElementById("loanResult");

  if (amount <= 0 || term <= 0) {
    resultElement.textContent = "Пожалуйста, введите корректные значения";
    resultElement.style.color = "var(--color-error)";
    return;
  }

  const monthlyRate = 0.12 / 12; // 12% годовых
  const monthlyPayment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - amount;

  resultElement.innerHTML = `
    <div>Ежемесячный платеж: <strong>${monthlyPayment.toFixed(
      2
    )} ₽</strong></div>
    <div>Общая сумма: <strong>${totalPayment.toFixed(2)} ₽</strong></div>
    <div>Переплата: <strong>${totalInterest.toFixed(2)} ₽</strong></div>
  `;
  resultElement.style.color = "var(--color-neutral-800)";

  // Add animation to result
  resultElement.style.animation = "none";
  setTimeout(() => {
    resultElement.style.animation = "fadeIn 0.5s ease-out forwards";
  }, 10);
}

// Make the calculator function globally available
window.calculateLoan = calculateLoan;

// Form validation
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        showError(nameInput, "Пожалуйста, введите ваше имя");
        isValid = false;
      } else {
        removeError(nameInput);
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        showError(emailInput, "Пожалуйста, введите корректный email");
        isValid = false;
      } else {
        removeError(emailInput);
      }

      // Validate message
      if (!messageInput.value.trim()) {
        showError(messageInput, "Пожалуйста, введите сообщение");
        isValid = false;
      } else {
        removeError(messageInput);
      }

      // Submit form if valid
      if (isValid) {
        // Here you would normally send the form data to the server
        // For now, let's just show a success message
        contactForm.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <h3 style="color: var(--color-success);">Спасибо за ваше сообщение!</h3>
            <p>Мы свяжемся с вами в ближайшее время.</p>
          </div>
        `;
      }
    });
  }

  function showError(input, message) {
    removeError(input);

    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorElement.style.color = "var(--color-error)";
    errorElement.style.fontSize = "var(--font-size-sm)";
    errorElement.style.marginTop = "calc(-1 * var(--spacing-3))";
    errorElement.style.marginBottom = "var(--spacing-2)";

    input.style.borderColor = "var(--color-error)";
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }

  function removeError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement && errorElement.className === "error-message") {
      errorElement.remove();
    }
    input.style.borderColor = "";
  }
});
