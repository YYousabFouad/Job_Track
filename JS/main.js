"use strict";
//==============Change Themes=================================
const themeToggleBtn = document.getElementById("themeToggleBtn");
const htmlElement = document.documentElement;

// Check saved theme in localStorage or default to dark
const savedTheme = localStorage.getItem("jobtrack_theme") || "dark";
htmlElement.setAttribute("data-theme", savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("jobtrack_theme", newTheme);
});

//=====================Load and Check Applicatoins=====================

let applications = [];

const formatDate = function (dateStr) {
  if (!dateStr) {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  if (!dateStr.includes("-")) return dateStr;

  const [year, month, day] = dateStr.split("-");
  const d = new Date(year, month - 1, day);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const createCardElement = function (app) {
  const card = document.createElement("article");
  card.className = "app-card";
  if (app.id) card.dataset.id = app.id;

  const initial = app.company ? app.company.charAt(0).toUpperCase() : "?";
  const status = app.status || "Applied";
  const badgeClass = `badge-${status.toLowerCase()}`;
  const formattedDate = formatDate(app.dateApplied);

  card.innerHTML = `
    <div class="card-header">
      <div class="company-brand">
        <div class="company-logo">${initial}</div>
        <div>
          <h3 class="role-title">${app.position}</h3>
          <p class="company-name">${app.company}</p>
        </div>
      </div>
      <span class="badge ${badgeClass}">${status}</span>
    </div>
    <div class="card-body">
      <p class="card-detail">📍 <strong>Location:</strong> ${app.location || "Not specified"}</p>
      <p class="card-detail">📅 <strong>Applied:</strong> ${formattedDate}</p>
      <p class="card-detail">💰 <strong>Salary:</strong> ${app.salary || "Not specified"}</p>
      <p class="card-detail">👤 <strong>Contact:</strong> ${app.contact || "Not specified"}</p>
      <p class="card-notes">${app.notes || "No notes added."}</p>
    </div>
    <div class="card-footer">
      ${
        app.jobUrl
          ? `<a href="${app.jobUrl}" target="_blank" rel="noopener" class="btn-link">View Job URL &rarr;</a>`
          : `<span class="btn-link" style="opacity: 0.5; pointer-events: none;">No URL provided</span>`
      }
      <div class="card-actions">
        <button class="btn-icon" title="Edit">✏️</button>
        <button class="btn-icon" title="Delete">🗑️</button>
      </div>
    </div>
  `;

  return card;
};

const renderApplications = function (apps) {
  const cardsGrid = document.querySelector("#cardsGrid");
  if (!cardsGrid) return;
  cardsGrid.innerHTML = "";
  apps.forEach((app) => {
    cardsGrid.appendChild(createCardElement(app));
  });
};

const extractCardsFromDOM = function () {
  const cards = document.querySelectorAll("#cardsGrid .app-card");
  const extracted = [];
  cards.forEach((card, index) => {
    const id = String(Date.now() + index);
    card.dataset.id = id;

    const company =
      card.querySelector(".company-name")?.textContent.trim() || "";
    const position =
      card.querySelector(".role-title")?.textContent.trim() || "";
    const badge = card.querySelector(".badge");
    const status = badge ? badge.textContent.trim() : "Applied";
    const appDetails = card.querySelectorAll(".card-detail");
    const location =
      appDetails[0]?.textContent.split("Location:")[1]?.trim() || "";
    const dateApplied =
      appDetails[1]?.textContent.split("Applied:")[1]?.trim() || "";
    const salary =
      appDetails[2]?.textContent.split("Salary:")[1]?.trim() || "";
    const contact =
      appDetails[3]?.textContent.split("Contact:")[1]?.trim() || "";
    const notes = card.querySelector(".card-notes")?.textContent.trim() || "";
    const jobUrl =
      card.querySelector(".btn-link")?.getAttribute("href") || "";

    extracted.push({
      id,
      company,
      position,
      status,
      location,
      dateApplied,
      salary,
      jobUrl,
      contact,
      notes,
    });
  });
  return extracted;
};

const saveApplications = function (applications) {
  localStorage.setItem("applications", JSON.stringify(applications));
};

const loadApplicatoins = function () {
  return JSON.parse(localStorage.getItem("applications"));
};

const checkingExistingData = function () {
  const data = loadApplicatoins();

  if (data !== null) {
    applications = data;
    renderApplications(applications);
  } else {
    applications = extractCardsFromDOM();
    saveApplications(applications);
  }
};

checkingExistingData();

// ==========================================================================
// Dynamic Power Scroll-to-Top Implementation
// ==========================================================================
const scrollTopBtn = document.getElementById("scrollTopBtn");
const powerRingFill = document.getElementById("powerRingFill");

// Circumference = 2 * Math.PI * 42 ≈ 263.89
const RING_CIRCUMFERENCE = 263.89;

function updateScrollPower() {
  // to know how much i far from the top of the page
  const scrollTop = window.scrollY;
  //Calculating total scrollable distance
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (totalHeight <= 0) return;

  // Calculate normalized ratio (0.0 -> 1.0)
  const scrollProgress = Math.min(Math.max(scrollTop / totalHeight, 0), 1);

  // Show button after 120px of scrolling
  if (scrollTop > 120) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }

  // Update dynamic CSS power variable for scaling & visual glow
  scrollTopBtn.style.setProperty("--power-level", scrollProgress);

  // Update SVG stroke offset to fill up the ring
  const strokeOffset = RING_CIRCUMFERENCE - scrollProgress * RING_CIRCUMFERENCE;
  if (powerRingFill) {
    powerRingFill.style.strokeDashoffset = strokeOffset;
  }

  // Activate Max Power state when scrolling near the bottom (>= 90%)
  if (scrollProgress >= 0.9) {
    scrollTopBtn.classList.add("max-power");
  } else {
    scrollTopBtn.classList.remove("max-power");
  }
}

// Optimized Scroll Event Listener
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollPower();
      ticking = false;
    });
    ticking = true;
  }
});

// Smooth Scroll back to top on click
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

//============================Scroll-to-down Button===================================

const scrollDownBtn = document.querySelector("#scrollDownBtn");

scrollDownBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const section1 = document.querySelector("#applications");
  const section1coord = section1.getBoundingClientRect();

  //====3 Different ways of creating scrolling================
  // window.scrollTo(
  //   section1coord.left + window.scrollX,
  //   section1coord.top + window.scrollY,
  // );
  // window.scrollTo({
  //   left: section1coord.left + window.scrollX,
  //   top: section1coord.top + window.scrollY,
  //   behavior: "smooth",
  // });

  section1.scrollIntoView({ behavior: "smooth" });
});

//======================Scroll-to-down for NavBar=============================================
//Main function to implement on the four navbar tabs
const dashboardLink = document.querySelector(".nav-link-dashboard");
const applicationsLink = document.querySelector(".nav-link-applications");
const statisticsLink = document.querySelector(".nav-link-statistics");
const settingsLink = document.querySelector(".nav-link-settings");

const scrollingTO = function (section) {
  const sectionCoord = section.getBoundingClientRect().top + window.scrollY;

  const distance = Math.abs(sectionCoord - window.scrollY);

  if (distance <= 110) {
    return;
  }

  section.scrollIntoView({
    behavior: "smooth",
  });
};
//For dashboard
const dashboardSection = document.querySelector("#dashboard");

dashboardLink.addEventListener("click", function (e) {
  e.preventDefault();

  scrollingTO(dashboardSection);
  dashboardLink.classList.add("active");
  applicationsLink.classList.remove("active");
  statisticsLink.classList.remove("active");
  settingsLink.classList.remove("active");
});

//For Applications
const applicationsSeciton = document.querySelector("#applications");

applicationsLink.addEventListener("click", function (e) {
  e.preventDefault();
  scrollingTO(applicationsSeciton);
  dashboardLink.classList.remove("active");
  applicationsLink.classList.add("active");
  statisticsLink.classList.remove("active");
  settingsLink.classList.remove("active");
});

//For Statistics
const statisticsSection = document.querySelector("#statistics");

statisticsLink.addEventListener("click", function (e) {
  e.preventDefault();
  scrollingTO(statisticsSection);
  dashboardLink.classList.remove("active");
  applicationsLink.classList.remove("active");
  statisticsLink.classList.add("active");
  settingsLink.classList.remove("active");
});

//For Settings
const settingsSection = document.querySelector("#settings");

settingsLink.addEventListener("click", function (e) {
  e.preventDefault();
  scrollingTO(settingsSection);
  dashboardLink.classList.remove("active");
  applicationsLink.classList.remove("active");
  statisticsLink.classList.remove("active");
  settingsLink.classList.add("active");
});
// =====================================================
// Active Navbar Link While Scrolling
// =====================================================

const navbar = document.querySelector(".navbar");

const navSectionMap = new Map([
  [dashboardSection, dashboardLink],
  [applicationsSeciton, applicationsLink],
  [statisticsSection, statisticsLink],
  [settingsSection, settingsLink],
]);

// Remove active from all links
const removeActiveLinks = function () {
  dashboardLink.classList.remove("active");
  applicationsLink.classList.remove("active");
  statisticsLink.classList.remove("active");
  settingsLink.classList.remove("active");
};

// Create observer
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const section = entry.target;

      const correspondingLink = navSectionMap.get(section);

      if (!correspondingLink) return;

      removeActiveLinks();

      correspondingLink.classList.add("active");
    });
  },
  {
    root: null,

    // Create a detection area near the top
    // of the viewport, below the sticky navbar.
    rootMargin: `-${navbar.offsetHeight}px 0px -70% 0px`,

    //an amount of the target enters the detection area.
    threshold: 0,
  },
);

// Start observing every section
observer.observe(dashboardSection);
observer.observe(applicationsSeciton);
observer.observe(statisticsSection);
observer.observe(settingsSection);

//====================================================================
//=================Dynamic Dashboard Counter==========================

const updateStatistics = function (
  total,
  applied,
  screening,
  interview,
  offer,
  rejected,
) {
  const responses = screening + interview + offer;

  const responseRate =
    total > 0 ? ((responses / total) * 100).toFixed(1) : "0.0";
  const interviewRate =
    total > 0 ? ((interview / total) * 100).toFixed(1) : "0.0";
  const offerRate = total > 0 ? ((offer / total) * 100).toFixed(1) : "0.0";

  // Stat summary cards (Response Rate, Interview Rate, Offer Rate)
  const statCards = document.querySelectorAll(
    ".statistics-detailed-section .stat-summary-card",
  );
  if (statCards.length >= 3) {
    const respVal = statCards[0].querySelector(".stat-value");
    const respDetail = statCards[0].querySelector(".card-detail");
    if (respVal) respVal.textContent = `${responseRate}%`;
    if (respDetail) {
      respDetail.textContent = `${responses} response${
        responses === 1 ? "" : "s"
      } (Screening, Interview, Offer) out of ${total} total application${
        total === 1 ? "" : "s"
      }.`;
    }

    const intVal = statCards[1].querySelector(".stat-value");
    const intDetail = statCards[1].querySelector(".card-detail");
    if (intVal) intVal.textContent = `${interviewRate}%`;
    if (intDetail) {
      intDetail.textContent = `${interview} application${
        interview === 1 ? "" : "s"
      } reached the interview stage.`;
    }

    const offVal = statCards[2].querySelector(".stat-value");
    const offDetail = statCards[2].querySelector(".card-detail");
    if (offVal) offVal.textContent = `${offerRate}%`;
    if (offDetail) {
      offDetail.textContent = `${offer} formal offer${
        offer === 1 ? "" : "s"
      } extended from active search.`;
    }
  }

  // Status Breakdown
  const breakdownItems = document.querySelectorAll(
    ".statistics-detailed-section .breakdown-item strong",
  );
  if (breakdownItems.length >= 5) {
    const calcPct = (count) =>
      total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
    breakdownItems[0].textContent = `${calcPct(applied)}% (${applied})`;
    breakdownItems[1].textContent = `${calcPct(screening)}% (${screening})`;
    breakdownItems[2].textContent = `${calcPct(interview)}% (${interview})`;
    breakdownItems[3].textContent = `${calcPct(offer)}% (${offer})`;
    breakdownItems[4].textContent = `${calcPct(rejected)}% (${rejected})`;
  }
};

const updateDashboard = function () {
  const cards = document.querySelectorAll("#cardsGrid .app-card");

  let appliedCount = 0;
  let screeningCount = 0;
  let interviewCount = 0;
  let offerCount = 0;
  let rejectedCount = 0;

  // Calculate count for each application status
  cards.forEach((card) => {
    const badge = card.querySelector(".badge");
    if (!badge) return;

    const status = badge.textContent.trim().toLowerCase();

    if (status === "applied") appliedCount++;
    else if (status === "screening") screeningCount++;
    else if (status === "interview" || status === "interviews") interviewCount++;
    else if (status === "offer" || status === "offers") offerCount++;
    else if (status === "rejected") rejectedCount++;
  });

  // Select Dashboard Stat Elements
  const totalStat = document.querySelector(".stat-card.total .stat-value");
  const appliedStat = document.querySelector(".stat-card.applied .stat-value");
  const screeningStat = document.querySelector(
    ".stat-card.screening .stat-value",
  );
  const interviewStat = document.querySelector(
    ".stat-card.interviews .stat-value",
  );
  const offerStat = document.querySelector(".stat-card.offers .stat-value");
  const rejectedStat = document.querySelector(
    ".stat-card.rejected .stat-value",
  );

  // Update DOM with live numbers
  if (totalStat) totalStat.textContent = cards.length;
  if (appliedStat) appliedStat.textContent = appliedCount;
  if (screeningStat) screeningStat.textContent = screeningCount;
  if (interviewStat) interviewStat.textContent = interviewCount;
  if (offerStat) offerStat.textContent = offerCount;
  if (rejectedStat) rejectedStat.textContent = rejectedCount;

  // Toggle Empty State if cards are 0
  const emptyState = document.querySelector("#emptyState");
  if (emptyState) {
    if (cards.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");
    }
  }

  // Update Statistics Section in sync
  updateStatistics(
    cards.length,
    appliedCount,
    screeningCount,
    interviewCount,
    offerCount,
    rejectedCount,
  );
};

// Initial update on script load
updateDashboard();

//====================================================================
//=================Add Application (Modal Open)=======================

let currentEditingCard = null;

const openModalBtn = document.querySelector("#openModalBtn");
const emptyAddBtn = document.querySelector("#emptyAddBtn");

const openAddApplicationModal = function () {
  currentEditingCard = null;

  const modalTitle = document.querySelector("#modalTitle");
  if (modalTitle) modalTitle.textContent = "Add New Application";

  const form = document.querySelector("#applicationForm");
  if (form) form.reset();

  const dateInput = document.querySelector("#dateAppliedInput");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  const modal = document.querySelector(".modal-overlay");
  if (modal) modal.classList.remove("hidden");

  const companyInput = document.querySelector("#companyInput");
  if (companyInput) companyInput.focus();
};

if (openModalBtn) {
  openModalBtn.addEventListener("click", openAddApplicationModal);
}

if (emptyAddBtn) {
  emptyAddBtn.addEventListener("click", openAddApplicationModal);
}

//====================================================================
//=================Save / Submit Application Form=====================

const applicationForm = document.querySelector("#applicationForm");

if (applicationForm) {
  applicationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const company = document.querySelector("#companyInput").value.trim();
    const position = document.querySelector("#positionInput").value.trim();
    const status = document.querySelector("#statusSelect").value;
    const location = document.querySelector("#locationInput").value.trim();
    const dateApplied = document.querySelector("#dateAppliedInput").value;
    const salary = document.querySelector("#salaryInput").value.trim();
    const jobUrl = document.querySelector("#jobUrlInput").value.trim();
    const contact = document.querySelector("#contactInput").value.trim();
    const notes = document.querySelector("#notesInput").value.trim();

    if (!company || !position) return;

    if (currentEditingCard) {
      // Editing existing application
      const cardId = currentEditingCard.dataset.id;
      const initial = company.charAt(0).toUpperCase();
      const formattedDate = formatDate(dateApplied);

      const logo = currentEditingCard.querySelector(".company-logo");
      if (logo) logo.textContent = initial;

      const titleEl = currentEditingCard.querySelector(".role-title");
      if (titleEl) titleEl.textContent = position;

      const companyEl = currentEditingCard.querySelector(".company-name");
      if (companyEl) companyEl.textContent = company;

      const badge = currentEditingCard.querySelector(".badge");
      if (badge) {
        badge.textContent = status;
        badge.className = `badge badge-${status.toLowerCase()}`;
      }

      const appDetails = currentEditingCard.querySelectorAll(".card-detail");
      if (appDetails.length >= 4) {
        appDetails[0].innerHTML = `📍 <strong>Location:</strong> ${location || "Not specified"}`;
        appDetails[1].innerHTML = `📅 <strong>Applied:</strong> ${formattedDate}`;
        appDetails[2].innerHTML = `💰 <strong>Salary:</strong> ${salary || "Not specified"}`;
        appDetails[3].innerHTML = `👤 <strong>Contact:</strong> ${contact || "Not specified"}`;
      }

      const cardNotes = currentEditingCard.querySelector(".card-notes");
      if (cardNotes) {
        cardNotes.textContent = notes || "No notes added.";
      }

      const footer = currentEditingCard.querySelector(".card-footer");
      const existingLink = footer ? footer.querySelector(".btn-link") : null;
      if (existingLink) {
        if (jobUrl) {
          existingLink.outerHTML = `<a href="${jobUrl}" target="_blank" rel="noopener" class="btn-link">View Job URL &rarr;</a>`;
        } else {
          existingLink.outerHTML = `<span class="btn-link" style="opacity: 0.5; pointer-events: none;">No URL provided</span>`;
        }
      }

      // Update in applications array
      if (cardId) {
        const item = applications.find(
          (app) => String(app.id) === String(cardId),
        );
        if (item) {
          item.company = company;
          item.position = position;
          item.status = status;
          item.location = location;
          item.dateApplied = dateApplied;
          item.salary = salary;
          item.jobUrl = jobUrl;
          item.contact = contact;
          item.notes = notes;
        }
      }

      currentEditingCard = null;
    } else {
      // Adding new application
      const newAppData = {
        id: String(Date.now()),
        company,
        position,
        status,
        location,
        dateApplied,
        salary,
        jobUrl,
        contact,
        notes,
      };

      const newCard = createCardElement(newAppData);
      const cardsGrid = document.querySelector("#cardsGrid");
      if (cardsGrid) {
        cardsGrid.prepend(newCard);
      }

      applications.unshift(newAppData);
    }

    // Persist to localStorage & recalculate Dashboard numbers
    saveApplications(applications);
    updateDashboard();

    // Close the modal & reset form
    const modal = document.querySelector(".modal-overlay");
    if (modal) modal.classList.add("hidden");
    applicationForm.reset();
  });
}

//====================================================================
//=================Delete and Edit Button=============================

document.querySelector("#cardsGrid").addEventListener("click", (e) => {
  //Guard Clause
  const button = e.target.closest(".btn-icon");
  if (!button) return;
  e.preventDefault();

  const appCard = button.closest(".app-card");
  const action = button.getAttribute("title");
  const openModal = document.querySelector(".modal-overlay");

  if (action === "Delete") {
    const cardId = appCard.dataset.id;
    appCard.remove();
    if (cardId) {
      applications = applications.filter(
        (app) => String(app.id) !== String(cardId),
      );
      saveApplications(applications);
    }
    updateDashboard();
  }

  if (action === "Edit") {
    currentEditingCard = appCard;

    const modalTitle = document.querySelector("#modalTitle");
    if (modalTitle) modalTitle.textContent = "Edit Application";

    openModal.classList.remove("hidden");

    //Get Company name , Position , Status , Location , Date Applied , Salary , Job Posting URL,Contact Info , Notes
    const companyName =
      appCard.querySelector(".company-name")?.textContent || "";
    const position = appCard.querySelector(".role-title")?.textContent || "";
    const status = appCard.querySelector(".badge")?.textContent || "Applied";
    const appDetails = appCard.querySelectorAll(".card-detail");
    const location =
      appDetails[0]?.textContent.split("Location:")[1]?.trim() || "";

    const rawDateText =
      appDetails[1]?.textContent.split("Applied:")[1]?.trim() || "";
    let dateInputValue = "";
    if (rawDateText) {
      if (rawDateText.includes("-") && rawDateText.length === 10) {
        dateInputValue = rawDateText;
      } else {
        const parsedDate = new Date(rawDateText);
        if (!isNaN(parsedDate.getTime())) {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
          const day = String(parsedDate.getDate()).padStart(2, "0");
          dateInputValue = `${year}-${month}-${day}`;
        }
      }
    }

    const salary =
      appDetails[2]?.textContent.split("Salary:")[1]?.trim() || "";
    const contact =
      appDetails[3]?.textContent.split("Contact:")[1]?.trim() || "";
    const notes = appCard.querySelector(".card-notes")?.textContent.trim() || "";
    const jobURL =
      appCard.querySelector(".btn-link")?.getAttribute("href") || "";

    openModal.querySelector("#companyInput").value = companyName;
    openModal.querySelector("#positionInput").value = position;
    openModal.querySelector("#statusSelect").value = status;
    openModal.querySelector("#locationInput").value = location;
    openModal.querySelector("#dateAppliedInput").value = dateInputValue;
    openModal.querySelector("#salaryInput").value = salary;
    openModal.querySelector("#contactInput").value = contact;
    openModal.querySelector("#notesInput").value = notes;
    openModal.querySelector("#jobUrlInput").value = jobURL;
  }
});

//============Close The Modal============================
const modal = document.querySelector(".modal-overlay");
modal.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".close-modal-btn");
  const cancelBtn = e.target.closest("#cancelBtn");
  if (closeBtn || e.target === modal || cancelBtn) {
    e.preventDefault();
    modal.classList.add("hidden");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    modal.classList.add("hidden");
  }
});
