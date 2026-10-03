"use strict";

/* ==========================================================================
   JobTrack Auth Script — Ledger Theme Authentication & User Management
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Theme Management (Sync with main.js)
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("jobtrack_theme") || "dark";
  htmlElement.setAttribute("data-theme", savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("jobtrack_theme", newTheme);
    });
  }

  // 2. Initial User Database Setup in LocalStorage
  const DEFAULT_USERS = [
    {
      id: "usr_yosab",
      name: "Yosab Fouad",
      email: "yosab@jobtrack.app",
      role: "Frontend Engineer",
      password: "password123",
      initials: "YF",
      createdAt: new Date().toISOString()
    }
  ];

  const getUsers = () => {
    try {
      const stored = localStorage.getItem("jobtrack_users");
      if (!stored) {
        localStorage.setItem("jobtrack_users", JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading jobtrack_users from localStorage:", e);
      return DEFAULT_USERS;
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("jobtrack_users", JSON.stringify(users));
  };

  // Helper to extract initials from full name
  const extractInitials = (fullName) => {
    if (!fullName) return "JT";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper to extract first name
  const getFirstName = (fullName) => {
    if (!fullName) return "User";
    return fullName.trim().split(/\s+/)[0];
  };

  // 3. Tab Navigation (Sign In vs Create Account)
  const authTabs = document.getElementById("authTabs");
  const tabLogin = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const loginView = document.getElementById("loginView");
  const signupView = document.getElementById("signupView");
  const goToSignupLink = document.getElementById("goToSignupLink");
  const goToLoginLink = document.getElementById("goToLoginLink");

  const switchTab = (mode) => {
    if (mode === "signup") {
      authTabs.setAttribute("data-active", "signup");
      tabSignup.classList.add("active");
      tabLogin.classList.remove("active");
      loginView.classList.remove("active");
      signupView.classList.add("active");
      window.location.hash = "signup";
      const signupName = document.getElementById("signupName");
      if (signupName) signupName.focus();
    } else {
      authTabs.setAttribute("data-active", "login");
      tabLogin.classList.add("active");
      tabSignup.classList.remove("active");
      signupView.classList.remove("active");
      loginView.classList.add("active");
      window.location.hash = "login";
      const loginEmail = document.getElementById("loginEmail");
      if (loginEmail) loginEmail.focus();
    }
  };

  if (tabLogin) tabLogin.addEventListener("click", () => switchTab("login"));
  if (tabSignup) tabSignup.addEventListener("click", () => switchTab("signup"));
  if (goToSignupLink) goToSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("signup");
  });
  if (goToLoginLink) goToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("login");
  });

  // Handle URL hash on load (#signup or #login)
  const initialHash = window.location.hash.toLowerCase();
  if (initialHash === "#signup" || initialHash === "#register") {
    switchTab("signup");
  } else {
    switchTab("login");
  }

  // 4. Toast Notification System
  const toastContainer = document.getElementById("toastContainer");

  const showToast = (message, type = "info", duration = 3600) => {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✓";
    if (type === "error") icon = "✕";

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hiding");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, duration);
  };

  // 5. Password Visibility Toggles
  const initPasswordToggle = (toggleBtnId, inputId) => {
    const btn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener("click", () => {
      const isPassword = input.getAttribute("type") === "password";
      input.setAttribute("type", isPassword ? "text" : "password");
      btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");

      const eyeIcon = btn.querySelector(".eye-icon");
      const eyeSlashIcon = btn.querySelector(".eye-slash-icon");
      if (eyeIcon && eyeSlashIcon) {
        eyeIcon.style.display = isPassword ? "none" : "block";
        eyeSlashIcon.style.display = isPassword ? "block" : "none";
      }
    });
  };

  initPasswordToggle("toggleLoginPassword", "loginPassword");
  initPasswordToggle("toggleSignupPassword", "signupPassword");
  initPasswordToggle("toggleSignupConfirmPassword", "signupConfirmPassword");

  // 6. Quick Demo Account Filler
  const btnDemoLogin = document.getElementById("btnDemoLogin");
  const loginEmailInput = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");

  if (btnDemoLogin && loginEmailInput && loginPasswordInput) {
    btnDemoLogin.addEventListener("click", () => {
      loginEmailInput.value = "yosab@jobtrack.app";
      loginPasswordInput.value = "password123";
      loginEmailInput.classList.remove("is-invalid");
      loginPasswordInput.classList.remove("is-invalid");
      hideFieldError("loginEmailError");
      hideFieldError("loginPasswordError");
      showToast("Demo credentials filled! Click 'Sign In' to enter.", "info", 3000);
    });
  }

  // Restore remember me email if saved
  const savedRememberEmail = localStorage.getItem("jobtrack_remember_email");
  const rememberCheckbox = document.getElementById("loginRemember");
  if (savedRememberEmail && loginEmailInput) {
    loginEmailInput.value = savedRememberEmail;
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }

  // 7. Password Strength Evaluator (Sign Up)
  const signupPasswordInput = document.getElementById("signupPassword");
  const strengthStep1 = document.getElementById("strengthStep1");
  const strengthStep2 = document.getElementById("strengthStep2");
  const strengthStep3 = document.getElementById("strengthStep3");
  const strengthStep4 = document.getElementById("strengthStep4");
  const strengthText = document.getElementById("strengthText");

  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, text: "None", level: "none" };

    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: "Weak", level: "weak" };
    if (score <= 3) return { score: 2, text: "Fair", level: "medium" };
    if (score === 4) return { score: 3, text: "Good", level: "medium" };
    return { score: 4, text: "Strong", level: "strong" };
  };

  const updateStrengthMeter = () => {
    if (!signupPasswordInput || !strengthText) return;
    const pwd = signupPasswordInput.value;
    const { score, text, level } = evaluatePasswordStrength(pwd);

    strengthText.textContent = text;
    const steps = [strengthStep1, strengthStep2, strengthStep3, strengthStep4];

    steps.forEach((step, idx) => {
      if (!step) return;
      step.className = "strength-step";
      if (idx < score) {
        step.classList.add("filled", level);
      }
    });
  };

  if (signupPasswordInput) {
    signupPasswordInput.addEventListener("input", updateStrengthMeter);
  }

  // Confirm password live match checker
  const signupConfirmInput = document.getElementById("signupConfirmPassword");
  const confirmMatchError = document.getElementById("signupConfirmError");

  const checkPasswordMatch = () => {
    if (!signupConfirmInput || !signupPasswordInput) return true;
    const pwd = signupPasswordInput.value;
    const confirm = signupConfirmInput.value;

    if (confirm.length > 0 && pwd !== confirm) {
      signupConfirmInput.classList.add("is-invalid");
      signupConfirmInput.classList.remove("is-valid");
      if (confirmMatchError) {
        confirmMatchError.textContent = "Passwords do not match.";
        confirmMatchError.classList.add("visible");
      }
      return false;
    } else if (confirm.length > 0 && pwd === confirm) {
      signupConfirmInput.classList.remove("is-invalid");
      signupConfirmInput.classList.add("is-valid");
      if (confirmMatchError) {
        confirmMatchError.classList.remove("visible");
      }
      return true;
    } else {
      signupConfirmInput.classList.remove("is-invalid", "is-valid");
      if (confirmMatchError) confirmMatchError.classList.remove("visible");
      return true;
    }
  };

  if (signupConfirmInput) {
    signupConfirmInput.addEventListener("input", checkPasswordMatch);
  }

  // Field error helpers
  const showFieldError = (elementId, msg) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = msg;
      el.classList.add("visible");
    }
  };

  const hideFieldError = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.classList.remove("visible");
    }
  };

  // 8. Sign In Submission
  const loginForm = document.getElementById("loginForm");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginEmailInput.value.trim().toLowerCase();
      const password = loginPasswordInput.value;
      const remember = rememberCheckbox ? rememberCheckbox.checked : false;

      hideFieldError("loginEmailError");
      hideFieldError("loginPasswordError");
      loginEmailInput.classList.remove("is-invalid");
      loginPasswordInput.classList.remove("is-invalid");

      let hasError = false;

      if (!email) {
        showFieldError("loginEmailError", "Please enter your email address.");
        loginEmailInput.classList.add("is-invalid");
        hasError = true;
      }

      if (!password) {
        showFieldError("loginPasswordError", "Please enter your password.");
        loginPasswordInput.classList.add("is-invalid");
        hasError = true;
      }

      if (hasError) return;

      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === email);

      if (!user) {
        showFieldError("loginEmailError", "No account found with this email.");
        loginEmailInput.classList.add("is-invalid");
        showToast("No account matches that email address.", "error");
        return;
      }

      if (user.password !== password) {
        showFieldError("loginPasswordError", "Incorrect password. Please try again.");
        loginPasswordInput.classList.add("is-invalid");
        showToast("Incorrect password. Please verify your credentials.", "error");
        return;
      }

      // Successful login
      if (remember) {
        localStorage.setItem("jobtrack_remember_email", email);
      } else {
        localStorage.removeItem("jobtrack_remember_email");
      }

      // Set active user session
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "Job Seeker",
        initials: user.initials || extractInitials(user.name)
      };

      localStorage.setItem("jobtrack_active_user", JSON.stringify(userSession));
      localStorage.setItem("jobtrack_user_name", user.name);
      localStorage.setItem("jobtrack_user_initials", userSession.initials);

      // UI state
      if (loginSubmitBtn) {
        loginSubmitBtn.classList.add("loading");
        loginSubmitBtn.disabled = true;
      }

      showToast(`Welcome back, ${getFirstName(user.name)}! Redirecting to Dashboard...`, "success", 2000);

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 750);
    });
  }

  // 9. Sign Up Submission (Create Account)
  const signupForm = document.getElementById("signupForm");
  const signupNameInput = document.getElementById("signupName");
  const signupEmailInput = document.getElementById("signupEmail");
  const signupRoleInput = document.getElementById("signupRole");
  const signupTermsCheckbox = document.getElementById("signupTerms");
  const signupSubmitBtn = document.getElementById("signupSubmitBtn");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = signupNameInput.value.trim();
      const email = signupEmailInput.value.trim().toLowerCase();
      const role = signupRoleInput ? signupRoleInput.value.trim() : "Job Seeker";
      const password = signupPasswordInput.value;
      const confirmPassword = signupConfirmInput.value;
      const termsAccepted = signupTermsCheckbox ? signupTermsCheckbox.checked : true;

      // Clear previous error messages
      hideFieldError("signupNameError");
      hideFieldError("signupEmailError");
      hideFieldError("signupPasswordError");
      hideFieldError("signupConfirmError");
      hideFieldError("signupTermsError");

      signupNameInput.classList.remove("is-invalid");
      signupEmailInput.classList.remove("is-invalid");
      signupPasswordInput.classList.remove("is-invalid");
      signupConfirmInput.classList.remove("is-invalid");

      let hasError = false;

      if (!name) {
        showFieldError("signupNameError", "Full name is required.");
        signupNameInput.classList.add("is-invalid");
        hasError = true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showFieldError("signupEmailError", "Please provide a valid email address.");
        signupEmailInput.classList.add("is-invalid");
        hasError = true;
      }

      if (!password || password.length < 6) {
        showFieldError("signupPasswordError", "Password must be at least 6 characters.");
        signupPasswordInput.classList.add("is-invalid");
        hasError = true;
      }

      if (password !== confirmPassword) {
        showFieldError("signupConfirmError", "Passwords do not match.");
        signupConfirmInput.classList.add("is-invalid");
        hasError = true;
      }

      if (!termsAccepted) {
        showFieldError("signupTermsError", "Please agree to local storage terms to proceed.");
        hasError = true;
      }

      if (hasError) return;

      const users = getUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email);

      if (existingUser) {
        showFieldError("signupEmailError", "An account with this email already exists.");
        signupEmailInput.classList.add("is-invalid");
        showToast("Email already registered. Try signing in instead.", "error");
        return;
      }

      // Create new user object
      const initials = extractInitials(name);
      const newUser = {
        id: "usr_" + Date.now().toString(36),
        name: name,
        email: email,
        role: role || "Job Seeker",
        password: password,
        initials: initials,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      // Auto-login new user
      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        initials: newUser.initials
      };

      localStorage.setItem("jobtrack_active_user", JSON.stringify(userSession));
      localStorage.setItem("jobtrack_user_name", newUser.name);
      localStorage.setItem("jobtrack_user_initials", newUser.initials);

      if (signupSubmitBtn) {
        signupSubmitBtn.classList.add("loading");
        signupSubmitBtn.disabled = true;
      }

      showToast(`Account created! Welcome to JobTrack, ${getFirstName(newUser.name)}.`, "success", 2000);

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 850);
    });
  }

  // 10. Forgot Password Modal
  const forgotModal = document.getElementById("forgotModal");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  const closeForgotModalBtn = document.getElementById("closeForgotModalBtn");
  const cancelForgotModalBtn = document.getElementById("cancelForgotModalBtn");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const forgotEmailInput = document.getElementById("forgotEmailInput");
  const forgotMsg = document.getElementById("forgotMsg");

  const openForgotModal = () => {
    if (!forgotModal) return;
    forgotModal.classList.add("active");
    if (forgotEmailInput) {
      forgotEmailInput.value = loginEmailInput ? loginEmailInput.value.trim() : "";
      forgotEmailInput.focus();
    }
    if (forgotMsg) forgotMsg.textContent = "";
  };

  const closeForgotModal = () => {
    if (!forgotModal) return;
    forgotModal.classList.remove("active");
  };

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      openForgotModal();
    });
  }

  if (closeForgotModalBtn) closeForgotModalBtn.addEventListener("click", closeForgotModal);
  if (cancelForgotModalBtn) cancelForgotModalBtn.addEventListener("click", closeForgotModal);

  if (forgotModal) {
    forgotModal.addEventListener("click", (e) => {
      if (e.target === forgotModal) closeForgotModal();
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = forgotEmailInput.value.trim().toLowerCase();
      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === email);

      if (!user) {
        if (forgotMsg) {
          forgotMsg.style.color = "var(--color-error)";
          forgotMsg.textContent = "No registered account found with that email.";
        }
        return;
      }

      if (forgotMsg) {
        forgotMsg.style.color = "var(--color-success)";
        forgotMsg.innerHTML = `Account located! Your password is: <strong>${user.password}</strong><br><small>(Local demo credentials)</small>`;
      }

      showToast("Account credentials retrieved!", "info");
    });
  }
});
