// DOM Elements
const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector(".menu-toggle");
const sidebarMenuItems = document.querySelectorAll(".sidebar-menu li");
const pages = document.querySelectorAll(".page");
const logoutBtn = document.getElementById("logout");
const headerUserName = document.getElementById("headerUserName");
const headerUserAvatar = document.querySelector("#headerUserAvatar img");
const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profileRole = document.getElementById("profileRole");
const profileAvatar = document.getElementById("profileAvatar");
const changeAvatarBtn = document.getElementById("changeAvatar");
const editProfileBtn = document.getElementById("editProfile");
const changePasswordBtn = document.getElementById("changePassword");
const avatarModal = document.getElementById("avatarModal");
const editProfileModal = document.getElementById("editProfileModal");
const passwordModal = document.getElementById("passwordModal");
const closeModalBtns = document.querySelectorAll(".close-modal");
const avatarOptions = document.querySelectorAll(".avatar-option");
const saveAvatarBtn = document.getElementById("saveAvatar");
const saveProfileBtn = document.getElementById("saveProfile");
const savePasswordBtn = document.getElementById("savePassword");
const employeesList = document.getElementById("employeesList");
const dashboardCards = document.querySelectorAll(".dashboard-card");
const employeesCard = document.getElementById("employees-card");
const employeesMenuItem = document.getElementById("employees-menu");
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "auth.html";
}

// Set user information
headerUserName.textContent = `${
  currentUser.lastName
} ${currentUser.firstName.charAt(0)}.${currentUser.middleName.charAt(0)}.`;
headerUserAvatar.src = currentUser.avatar;
profileFullName.textContent = `${currentUser.lastName} ${currentUser.firstName} ${currentUser.middleName}`;
profileEmail.textContent = currentUser.email;
profileAvatar.src = currentUser.avatar;

// Set user role
let roleText = "Сотрудник";
if (currentUser.role === "administrator") {
  roleText = "Администратор";
} else if (currentUser.role === "director") {
  roleText = "Директор";
}
profileRole.textContent = roleText;

// Hide Employees menu for regular employees
if (currentUser.role === "employee") {
  employeesMenuItem.style.display = "none";
  employeesCard.style.display = "none";
}

// Toggle sidebar on mobile
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Handle page navigation
sidebarMenuItems.forEach((item) => {
  if (!item.id || item.id !== "logout") {
    item.addEventListener("click", () => {
      const pageId = item.getAttribute("data-page");

      // Hide all pages
      pages.forEach((page) => {
        page.classList.remove("active");
      });

      // Remove active class from all menu items
      sidebarMenuItems.forEach((menuItem) => {
        menuItem.classList.remove("active");
      });

      // Add active class to current menu item
      item.classList.add("active");

      // Show current page
      document.getElementById(`${pageId}-page`).classList.add("active");

      // Close sidebar on mobile
      sidebar.classList.remove("active");
    });
  }
});

// Handle dashboard card clicks
dashboardCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.id === "employees-card" && currentUser.role !== "employee") {
      navigateToPage("employees");
    } else if (card.querySelector(".card-info h3").textContent === "Профиль") {
      navigateToPage("profile");
    } else if (
      card.querySelector(".card-info h3").textContent === "Безопасность"
    ) {
      navigateToPage("settings");
    }
  });
});

// Navigate to page function
function navigateToPage(pageId) {
  // Hide all pages
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  // Remove active class from all menu items
  sidebarMenuItems.forEach((menuItem) => {
    menuItem.classList.remove("active");
  });

  // Add active class to menu item
  document
    .querySelector(`.sidebar-menu li[data-page="${pageId}"]`)
    .classList.add("active");

  // Show page
  document.getElementById(`${pageId}-page`).classList.add("active");

  // Close sidebar on mobile
  sidebar.classList.remove("active");
}

// Handle logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// Load employees list
function loadEmployees() {
  const users = JSON.parse(localStorage.getItem("users"));
  let employeesHTML = "";

  users.forEach((user) => {
    // Skip current user
    if (user.id === currentUser.id) return;

    let roleClass = "role-employee";
    let roleText = "Сотрудник";

    if (user.role === "administrator") {
      roleClass = "role-admin";
      roleText = "Администратор";
    } else if (user.role === "director") {
      roleClass = "role-director";
      roleText = "Директор";
    }

    employeesHTML += `
      <div class="employee-card">
        <div class="employee-header">
          <div class="employee-avatar">
            <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}">
          </div>
          <div>
            <h3>${user.lastName} ${user.firstName}</h3>
            <span class="employee-role ${roleClass}">${roleText}</span>
          </div>
        </div>
        <div class="employee-info">
          <p><i class="fas fa-envelope"></i> ${user.email}</p>
          <p><i class="fas fa-user"></i> ${user.firstName} ${user.middleName}</p>
        </div>
      </div>
    `;
  });

  employeesList.innerHTML = employeesHTML;
}

// Load employees on page load
loadEmployees();

// Modal functions
function openModal(modal) {
  modal.classList.add("active");
}

function closeModal(modal) {
  modal.classList.remove("active");
}

// Handle modal close buttons
closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    closeModal(modal);
  });
});

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Handle avatar change
changeAvatarBtn.addEventListener("click", () => {
  openModal(avatarModal);

  // Select current avatar
  avatarOptions.forEach((option) => {
    const avatarSrc = option.getAttribute("data-avatar");
    if (avatarSrc === currentUser.avatar) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });
});

// Handle avatar selection
avatarOptions.forEach((option) => {
  option.addEventListener("click", () => {
    // Remove selected class from all options
    avatarOptions.forEach((opt) => opt.classList.remove("selected"));

    // Add selected class to current option
    option.classList.add("selected");
  });
});

// Save avatar changes
saveAvatarBtn.addEventListener("click", () => {
  const selectedAvatar = document.querySelector(".avatar-option.selected");
  if (selectedAvatar) {
    const avatarSrc = selectedAvatar.getAttribute("data-avatar");

    // Update current user avatar
    currentUser.avatar = avatarSrc;

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Update users in localStorage
    const users = JSON.parse(localStorage.getItem("users"));
    const userIndex = users.findIndex((user) => user.id === currentUser.id);
    users[userIndex] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));

    // Update UI
    headerUserAvatar.src = avatarSrc;
    profileAvatar.src = avatarSrc;

    // Close modal
    closeModal(avatarModal);

    // Show success notification
    showNotification("Аватар успешно изменен!", "success");
  }
});

// Handle profile edit
editProfileBtn.addEventListener("click", () => {
  // Populate form with current user data
  document.getElementById("editFirstName").value = currentUser.firstName;
  document.getElementById("editLastName").value = currentUser.lastName;
  document.getElementById("editMiddleName").value = currentUser.middleName;
  document.getElementById("editEmail").value = currentUser.email;

  // Open modal
  openModal(editProfileModal);
});

// Save profile changes
saveProfileBtn.addEventListener("click", () => {
  const firstName = document.getElementById("editFirstName").value;
  const lastName = document.getElementById("editLastName").value;
  const middleName = document.getElementById("editMiddleName").value;
  const email = document.getElementById("editEmail").value;

  // Validate email
  if (!email) {
    showNotification("Email не может быть пустым!", "error");
    return;
  }

  // Check if email is already taken by another user
  const users = JSON.parse(localStorage.getItem("users"));
  const emailExists = users.some(
    (user) => user.email === email && user.id !== currentUser.id
  );

  if (emailExists) {
    showNotification("Пользователь с таким email уже существует!", "error");
    return;
  }

  // Update current user data
  currentUser.firstName = firstName;
  currentUser.lastName = lastName;
  currentUser.middleName = middleName;
  currentUser.email = email;

  // Update localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update users in localStorage
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  users[userIndex] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));

  // Update UI
  headerUserName.textContent = `${lastName} ${firstName.charAt(
    0
  )}.${middleName.charAt(0)}.`;
  profileFullName.textContent = `${lastName} ${firstName} ${middleName}`;
  profileEmail.textContent = email;

  // Close modal
  closeModal(editProfileModal);

  // Show success notification
  showNotification("Профиль успешно обновлен!", "success");
});

// Handle password change
changePasswordBtn.addEventListener("click", () => {
  // Clear password fields
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmNewPassword").value = "";

  // Open modal
  openModal(passwordModal);
});

// Save password changes
savePasswordBtn.addEventListener("click", () => {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword =
    document.getElementById("confirmNewPassword").value;

  // Validate current password
  if (currentPassword !== currentUser.password) {
    showNotification("Неверный текущий пароль!", "error");
    return;
  }

  // Validate new password
  if (newPassword !== confirmNewPassword) {
    showNotification("Новые пароли не совпадают!", "error");
    return;
  }

  // Update current user password
  currentUser.password = newPassword;

  // Update localStorage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Update users in localStorage
  const users = JSON.parse(localStorage.getItem("users"));
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  users[userIndex] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));

  // Close modal
  closeModal(passwordModal);

  // Show success notification
  showNotification("Пароль успешно изменен!", "success");
});

// Handle dark mode toggle
const darkModeToggle = document.getElementById("darkMode");
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
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
