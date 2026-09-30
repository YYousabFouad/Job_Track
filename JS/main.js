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

const saveApplications = function (applications) {
  localStorage.setItem("applications", JSON.stringify(applications));
};

const loadApplicatoins = function () {
  return JSON.parse(localStorage.getItem("applications"));
};

const checkingExistingData = function () {
  const data = loadApplicatoins();

  if (data) {
    applications = data;
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

    threshold: 0,
  },
);

// Start observing every section
observer.observe(dashboardSection);
observer.observe(applicationsSeciton);
observer.observe(statisticsSection);
observer.observe(settingsSection);

//Delete and Edit Button

document.querySelector("#cardsGrid").addEventListener("click", (e) => {
  e.preventDefault();
  //Guard Clause
  const button = e.target.closest(".btn-icon");
  if (!button) return;
  const appCard = button.closest(".app-card");
  const action = button.getAttribute("title");
  const openModal = document.querySelector(".modal-overlay");
  if (action === "Delete") appCard.remove();
  if (action === "Edit") {
    openModal.classList.remove("hidden");
    //Get Company name , Position , Status , Location , Date Applied , Salary , Job Posting URL,Contact Info , Notes
    const companyName = appCard.querySelector(".company-name").textContent;
    const position = appCard.querySelector(".role-title").textContent;
    const status = appCard.querySelector(".badge").textContent;
    const appDetails = appCard.querySelectorAll(".card-detail");
    const location = appDetails[0].textContent.split("Location:")[1];
    const date = new Date(
      appDetails[1].textContent.split("Applied:")[1].trim(),
    );
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const salary = appDetails[2].textContent.split("Salary:")[1];
    const contact = appDetails[3].textContent.split("Contact:")[1];
    const notes = appCard.querySelector(".card-notes").textContent.trim();
    console.log(notes);
    const jobURL = appCard.querySelector(".btn-link").getAttribute("href");
    openModal.querySelector("#companyInput").value = companyName;
    openModal.querySelector("#positionInput").value = position;
    openModal.querySelector("#statusSelect").value = status;
    openModal.querySelector("#locationInput").value = location;
    openModal.querySelector("#dateAppliedInput").value =
      `${year}-${month}-${day}`;
    openModal.querySelector("#salaryInput").value = salary;
    openModal.querySelector("#contactInput").value = contact;
    openModal.querySelector("#notesInput").value = notes;
    openModal.querySelector("#jobUrlInput").value = jobURL;
  }
});

// Close The Modal
const modal = document.querySelector(".modal-overlay");
modal.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(e.target);
  const closeBtn = e.target.closest(".close-modal-btn");
  const cancelBtn = e.target.closest("#cancelBtn");
  if (closeBtn || e.target === modal || cancelBtn) {
    modal.classList.add("hidden");
  }
});
document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.key === "Escape") modal.classList.add("hidden");
});
