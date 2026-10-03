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

  const settingThemeToggle = document.querySelector("#settingThemeToggle");
  if (settingThemeToggle) {
    settingThemeToggle.checked = newTheme === "dark";
  }
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
    const salary = appDetails[2]?.textContent.split("Salary:")[1]?.trim() || "";
    const contact =
      appDetails[3]?.textContent.split("Contact:")[1]?.trim() || "";
    const notes = card.querySelector(".card-notes")?.textContent.trim() || "";
    const jobUrl = card.querySelector(".btn-link")?.getAttribute("href") || "";

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
  } else {
    applications = extractCardsFromDOM();
    saveApplications(applications);
  }
};

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
  let appliedCount = 0;
  let screeningCount = 0;
  let interviewCount = 0;
  let offerCount = 0;
  let rejectedCount = 0;

  // Calculate count for each status across all applications
  applications.forEach((app) => {
    const status = (app.status || "").trim().toLowerCase();

    if (status === "applied") appliedCount++;
    else if (status === "screening") screeningCount++;
    else if (status === "interview" || status === "interviews")
      interviewCount++;
    else if (status === "offer" || status === "offers") offerCount++;
    else if (status === "rejected") rejectedCount++;
  });

  const total = applications.length;

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
  if (totalStat) totalStat.textContent = total;
  if (appliedStat) appliedStat.textContent = appliedCount;
  if (screeningStat) screeningStat.textContent = screeningCount;
  if (interviewStat) interviewStat.textContent = interviewCount;
  if (offerStat) offerStat.textContent = offerCount;
  if (rejectedStat) rejectedStat.textContent = rejectedCount;

  // Update Statistics Section in sync
  updateStatistics(
    total,
    appliedCount,
    screeningCount,
    interviewCount,
    offerCount,
    rejectedCount,
  );
};

//====================================================================
//=================Search, Filter, and Sort===========================

let currentFilter = "All";
let currentSearch = "";
let currentSort = "newest";

const searchInput = document.querySelector("#searchInput");
const filtersContainer = document.querySelector(".filters");
const sortDropdown = document.querySelector("#sortDropdown");

const applyFiltersAndRender = function () {
  let result = [...applications];

  // 1. Status Filter
  if (currentFilter && currentFilter !== "All") {
    result = result.filter(
      (app) =>
        (app.status || "").trim().toLowerCase() ===
        currentFilter.toLowerCase(),
    );
  }

  // 2. Search Query across company, position, location, notes, and contact
  if (currentSearch) {
    result = result.filter((app) => {
      const company = (app.company || "").toLowerCase();
      const position = (app.position || "").toLowerCase();
      const location = (app.location || "").toLowerCase();
      const notes = (app.notes || "").toLowerCase();
      const contact = (app.contact || "").toLowerCase();

      return (
        company.includes(currentSearch) ||
        position.includes(currentSearch) ||
        location.includes(currentSearch) ||
        notes.includes(currentSearch) ||
        contact.includes(currentSearch)
      );
    });
  }

  // 3. Sorting
  if (currentSort === "newest") {
    result.sort((a, b) => {
      const timeA = new Date(a.dateApplied || 0).getTime() || 0;
      const timeB = new Date(b.dateApplied || 0).getTime() || 0;
      if (timeB !== timeA) return timeB - timeA;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
  } else if (currentSort === "oldest") {
    result.sort((a, b) => {
      const timeA = new Date(a.dateApplied || 0).getTime() || 0;
      const timeB = new Date(b.dateApplied || 0).getTime() || 0;
      if (timeA !== timeB) return timeA - timeB;
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    });
  } else if (currentSort === "company") {
    result.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
  } else if (currentSort === "position") {
    result.sort((a, b) =>
      (a.position || "").localeCompare(b.position || ""),
    );
  }

  // 4. Render filtered & sorted cards
  renderApplications(result);

  // 5. Handle empty state
  const emptyState = document.querySelector("#emptyState");
  if (emptyState) {
    if (result.length === 0) {
      emptyState.classList.remove("hidden");
      const emptyTitle = emptyState.querySelector(".empty-title");
      const emptyText = emptyState.querySelector(".empty-text");
      if (applications.length === 0) {
        if (emptyTitle) emptyTitle.textContent = "No applications found";
        if (emptyText)
          emptyText.textContent =
            "Start tracking your job search or adjust your active search and filter settings.";
      } else {
        if (emptyTitle) emptyTitle.textContent = "No matching applications";
        if (emptyText)
          emptyText.textContent = `No applications match your active search or filter. Try clearing or adjusting your settings.`;
      }
    } else {
      emptyState.classList.add("hidden");
    }
  }
};

// Search Event Listener
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    applyFiltersAndRender();
  });
}

// Filter Buttons Event Delegation
if (filtersContainer) {
  filtersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filtersContainer
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter || "All";
    applyFiltersAndRender();
  });
}

// Sort Dropdown Event Listener
if (sortDropdown) {
  sortDropdown.addEventListener("change", (e) => {
    currentSort = e.target.value;
    applyFiltersAndRender();
  });
}


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

      applications.unshift(newAppData);
    }

    // Persist to localStorage, update stats, and re-render cards
    saveApplications(applications);
    updateDashboard();
    applyFiltersAndRender();

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
    if (cardId) {
      applications = applications.filter(
        (app) => String(app.id) !== String(cardId),
      );
      saveApplications(applications);
    }
    updateDashboard();
    applyFiltersAndRender();
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

    const salary = appDetails[2]?.textContent.split("Salary:")[1]?.trim() || "";
    const contact =
      appDetails[3]?.textContent.split("Contact:")[1]?.trim() || "";
    const notes =
      appCard.querySelector(".card-notes")?.textContent.trim() || "";
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
if (modal) {
  modal.addEventListener("click", (e) => {
    const closeBtn = e.target.closest(".close-modal-btn");
    const cancelBtn = e.target.closest("#cancelBtn");
    if (closeBtn || e.target === modal || cancelBtn) {
      e.preventDefault();
      modal.classList.add("hidden");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    e.preventDefault();
    modal.classList.add("hidden");
  }
});

//====================================================================
//=================Settings & Preferences=============================

const saveProfileBtn = document.querySelector("#saveProfileBtn");
const settingUserName = document.querySelector("#settingUserName");
const settingUserInitials = document.querySelector("#settingUserInitials");
const welcomeTitle = document.querySelector(".welcome-title");
const profileAvatar = document.querySelector(".profile-avatar");

const loadUserProfile = function () {
  const savedName = localStorage.getItem("jobtrack_user_name");
  const savedInitials = localStorage.getItem("jobtrack_user_initials");

  if (savedName) {
    if (settingUserName) settingUserName.value = savedName;
    const firstName = savedName.trim().split(" ")[0];
    if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${firstName} 👋`;
  }
  if (savedInitials) {
    if (settingUserInitials) settingUserInitials.value = savedInitials;
    if (profileAvatar) profileAvatar.textContent = savedInitials;
  }
};

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", () => {
    const name = settingUserName ? settingUserName.value.trim() : "";
    const initials = settingUserInitials
      ? settingUserInitials.value.trim()
      : "";

    if (name) {
      localStorage.setItem("jobtrack_user_name", name);
      const firstName = name.split(" ")[0];
      if (welcomeTitle) welcomeTitle.textContent = `Welcome back, ${firstName} 👋`;
    }
    if (initials) {
      localStorage.setItem("jobtrack_user_initials", initials);
      if (profileAvatar) profileAvatar.textContent = initials;
    }

    const originalText = saveProfileBtn.textContent;
    saveProfileBtn.textContent = "✓ Saved!";
    setTimeout(() => {
      saveProfileBtn.textContent = originalText;
    }, 1800);
  });
}

// Appearance: Theme & Compact Cards
const settingThemeToggle = document.querySelector("#settingThemeToggle");
if (settingThemeToggle) {
  settingThemeToggle.checked = htmlElement.getAttribute("data-theme") === "dark";
  settingThemeToggle.addEventListener("change", () => {
    const newTheme = settingThemeToggle.checked ? "dark" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("jobtrack_theme", newTheme);
  });
}

const settingCompactToggle = document.querySelector("#settingCompactToggle");
const cardsGridElement = document.querySelector("#cardsGrid");

const loadCompactMode = function () {
  const isCompact = localStorage.getItem("jobtrack_compact") === "true";
  if (settingCompactToggle) settingCompactToggle.checked = isCompact;
  if (cardsGridElement) {
    if (isCompact) cardsGridElement.classList.add("compact-cards");
    else cardsGridElement.classList.remove("compact-cards");
  }
};

if (settingCompactToggle) {
  settingCompactToggle.addEventListener("change", () => {
    const isCompact = settingCompactToggle.checked;
    localStorage.setItem("jobtrack_compact", isCompact);
    if (cardsGridElement) {
      if (isCompact) cardsGridElement.classList.add("compact-cards");
      else cardsGridElement.classList.remove("compact-cards");
    }
  });
}

// Tracker Defaults: Default Sort & Currency
const settingDefaultSort = document.querySelector("#settingDefaultSort");

const loadDefaultSort = function () {
  const savedSort = localStorage.getItem("jobtrack_default_sort") || "newest";
  if (settingDefaultSort) settingDefaultSort.value = savedSort;
  if (sortDropdown) sortDropdown.value = savedSort;
  currentSort = savedSort;
};

if (settingDefaultSort) {
  settingDefaultSort.addEventListener("change", () => {
    const newSort = settingDefaultSort.value;
    localStorage.setItem("jobtrack_default_sort", newSort);
    if (sortDropdown) sortDropdown.value = newSort;
    currentSort = newSort;
    applyFiltersAndRender();
  });
}

const settingCurrency = document.querySelector("#settingCurrency");

const updateSalaryPlaceholder = function (currency) {
  const salaryInput = document.querySelector("#salaryInput");
  if (!salaryInput) return;
  const currencyPlaceholders = {
    USD: "e.g. $90,000 / yr",
    EGP: "e.g. EGP 45,000 / mo",
    EUR: "e.g. €80,000 / yr",
    GBP: "e.g. £70,000 / yr",
  };
  salaryInput.placeholder =
    currencyPlaceholders[currency] || "e.g. $90,000 / yr";
};

const loadCurrency = function () {
  const savedCurrency = localStorage.getItem("jobtrack_currency") || "USD";
  if (settingCurrency) settingCurrency.value = savedCurrency;
  updateSalaryPlaceholder(savedCurrency);
};

if (settingCurrency) {
  settingCurrency.addEventListener("change", () => {
    const newCurrency = settingCurrency.value;
    localStorage.setItem("jobtrack_currency", newCurrency);
    updateSalaryPlaceholder(newCurrency);
  });
}

//====================================================================
//=================Data Persistence (Export / Import / Clear)=========

const exportDataBtn = document.querySelector("#exportDataBtn");
const importDataBtn = document.querySelector("#importDataBtn");
const clearDataBtn = document.querySelector("#clearDataBtn");

if (exportDataBtn) {
  exportDataBtn.addEventListener("click", () => {
    const backupData = {
      appName: "JobTrack",
      version: "1.0",
      exportedAt: new Date().toISOString(),
      userProfile: {
        name: localStorage.getItem("jobtrack_user_name") || "Yosab Fouad",
        initials: localStorage.getItem("jobtrack_user_initials") || "YF",
      },
      preferences: {
        theme: localStorage.getItem("jobtrack_theme") || "dark",
        compact: localStorage.getItem("jobtrack_compact") === "true",
        defaultSort:
          localStorage.getItem("jobtrack_default_sort") || "newest",
        currency: localStorage.getItem("jobtrack_currency") || "USD",
      },
      applications: applications,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const dateStamp = new Date().toISOString().split("T")[0];
    const a = document.createElement("a");
    a.href = url;
    a.download = `jobtrack_backup_${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const originalText = exportDataBtn.textContent;
    exportDataBtn.textContent = "✓ Exported!";
    setTimeout(() => {
      exportDataBtn.textContent = originalText;
    }, 1800);
  });
}

// Hidden file input for JSON import
let importFileInput = document.querySelector("#importFileInput");
if (!importFileInput) {
  importFileInput = document.createElement("input");
  importFileInput.type = "file";
  importFileInput.id = "importFileInput";
  importFileInput.accept = ".json,application/json";
  importFileInput.style.display = "none";
  document.body.appendChild(importFileInput);
}

if (importDataBtn) {
  importDataBtn.addEventListener("click", () => {
    importFileInput.click();
  });
}

importFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      let importedApps = [];

      if (Array.isArray(parsed)) {
        importedApps = parsed;
      } else if (parsed && Array.isArray(parsed.applications)) {
        importedApps = parsed.applications;

        // Restore profile and preferences if present in backup
        if (parsed.userProfile) {
          if (parsed.userProfile.name) {
            localStorage.setItem("jobtrack_user_name", parsed.userProfile.name);
          }
          if (parsed.userProfile.initials) {
            localStorage.setItem(
              "jobtrack_user_initials",
              parsed.userProfile.initials,
            );
          }
          loadUserProfile();
        }
        if (parsed.preferences) {
          if (parsed.preferences.theme) {
            localStorage.setItem("jobtrack_theme", parsed.preferences.theme);
            htmlElement.setAttribute("data-theme", parsed.preferences.theme);
            if (settingThemeToggle)
              settingThemeToggle.checked = parsed.preferences.theme === "dark";
          }
          if (typeof parsed.preferences.compact === "boolean") {
            localStorage.setItem(
              "jobtrack_compact",
              parsed.preferences.compact,
            );
            loadCompactMode();
          }
          if (parsed.preferences.defaultSort) {
            localStorage.setItem(
              "jobtrack_default_sort",
              parsed.preferences.defaultSort,
            );
            loadDefaultSort();
          }
          if (parsed.preferences.currency) {
            localStorage.setItem(
              "jobtrack_currency",
              parsed.preferences.currency,
            );
            loadCurrency();
          }
        }
      } else {
        throw new Error("Invalid format");
      }

      // Ensure every application has an ID and status
      importedApps.forEach((app, i) => {
        if (!app.id) app.id = String(Date.now() + i);
        if (!app.status) app.status = "Applied";
      });

      applications = importedApps;
      saveApplications(applications);
      applyFiltersAndRender();
      updateDashboard();

      const originalText = importDataBtn.textContent;
      importDataBtn.textContent = `✓ Imported (${importedApps.length})!`;
      setTimeout(() => {
        importDataBtn.textContent = originalText;
      }, 2000);
    } catch (err) {
      alert("Failed to import: Please provide a valid JobTrack JSON backup file.");
    }
    importFileInput.value = "";
  };
  reader.readAsText(file);
});

if (clearDataBtn) {
  clearDataBtn.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all data? This will delete all applications and cannot be undone.",
    );
    if (!confirmed) return;

    applications = [];
    saveApplications(applications);
    applyFiltersAndRender();
    updateDashboard();

    const originalText = clearDataBtn.textContent;
    clearDataBtn.textContent = "✓ Cleared!";
    setTimeout(() => {
      clearDataBtn.textContent = originalText;
    }, 1800);
  });
}

//====================================================================
//=================Initialize Application=============================

checkingExistingData();
loadUserProfile();
loadCompactMode();
loadDefaultSort();
loadCurrency();
applyFiltersAndRender();
updateDashboard();

