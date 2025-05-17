// DOM Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const tabs = document.querySelectorAll(".tab");
const loginFormContent = document.getElementById("login-form");
const registerFormContent = document.getElementById("register-form");
const togglePasswordElements = document.querySelectorAll(".toggle-password");
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");

// Initialize users in localStorage if not exists
if (!localStorage.getItem("users")) {
  // Create some default users
  const defaultUsers = [
    {
      id: 1,
      firstName: "Петр",
      lastName: "Николаев",
      middleName: "Евгеньевич",
      email: "administrator@mail.com",
      password: "admin123",
      avatar:
        "https://images.pexels.com/photos/9499608/pexels-photo-9499608.jpeg",
      role: "administrator",
    },
    {
      id: 2,
      firstName: "Анна",
      lastName: "Смирнова",
      middleName: "Ивановна",
      email: "anna@mail.com",
      password: "anna123",
      avatar:
        "https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg",
      role: "employee",
    },
    {
      id: 3,
      firstName: "Иван",
      lastName: "Петров",
      middleName: "Александрович",
      email: "ivan@mail.com",
      password: "ivan123",
      avatar:
        "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg",
      role: "employee",
    },
    {
      id: 4,
      firstName: "Мубориз",
      lastName: "Асроров",
      middleName: "Илёсхуджаевич",
      email: "director@mail.com",
      password: "director123",
      avatar:
        "https://sun9-3.userapi.com/impg/lVTUSXes8jESuqP2uVQLNa1vvov-bVM2fQJLyw/Hmev_uqrzjk.jpg?size=640x640&quality=95&sign=d529b8ad3f4da963e274238c17408792&type=album",
      role: "director",
    },
  ];

  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// Event Listeners
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabType = tab.getAttribute("data-tab");

    // Remove active class from all tabs
    tabs.forEach((t) => t.classList.remove("active"));

    // Add active class to current tab
    tab.classList.add("active");

    // Hide all form contents
    loginFormContent.classList.add("hidden");
    registerFormContent.classList.add("hidden");

    // Show current form content
    if (tabType === "login") {
      loginFormContent.classList.remove("hidden");
    } else if (tabType === "register") {
      registerFormContent.classList.remove("hidden");
    }
  });
});

// Toggle password visibility
togglePasswordElements.forEach((element) => {
  element.addEventListener("click", () => {
    const passwordInput = element.previousElementSibling;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      element.classList.remove("fa-eye-slash");
      element.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      element.classList.remove("fa-eye");
      element.classList.add("fa-eye-slash");
    }
  });
});

// Login Form Submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users"));

  // Find user with matching email and password
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    // Set current user in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Show success notification
    showNotification("Вход выполнен успешно!", "success");

    // Redirect to dashboard after short delay
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  } else {
    // Check if user with email exists
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      showNotification("Неверный пароль. Попробуйте еще раз.", "error");
    } else {
      showNotification(
        "Пользователь не найден. Пожалуйста, зарегистрируйтесь.",
        "error"
      );

      // Switch to registration form after short delay
      setTimeout(() => {
        tabs.forEach((t) => t.classList.remove("active"));
        tabs[1].classList.add("active");
        loginFormContent.classList.add("hidden");
        registerFormContent.classList.remove("hidden");

        // Prefill email in registration form
        document.getElementById("regEmail").value = email;
      }, 1500);
    }
  }
});

// Register Form Submit
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("regFirstName").value;
  const lastName = document.getElementById("regLastName").value;
  const middleName = document.getElementById("regMiddleName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  // Validate passwords match
  if (password !== confirmPassword) {
    showNotification("Пароли не совпадают. Попробуйте еще раз.", "error");
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users"));

  // Check if user with email already exists
  if (users.some((user) => user.email === email)) {
    showNotification("Пользователь с таким email уже существует.", "error");
    return;
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    middleName,
    email,
    password,
    avatar: "https://images.pexels.com/photos/247302/pexels-photo-247302.jpeg", // Default avatar
    role: "employee", // Default role
  };

  // Add new user to users array
  users.push(newUser);

  // Update users in localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Set current user in localStorage
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  // Show success notification
  showNotification("Регистрация выполнена успешно!", "success");

  // Redirect to dashboard after short delay
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1500);
});

// Helper function to show notifications
function showNotification(message, type = "info") {
  notificationMessage.textContent = message;
  notification.className = "notification show";
  notification.classList.add(type);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.classList.remove(type);
    }, 300);
  }, 3000);
}
