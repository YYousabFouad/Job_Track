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
const scrollingTO = function (section) {
  const sectionCoord = section.getBoundingClientRect().top + window.scrollY;

  const distance = Math.abs(sectionCoord - window.scrollY);

  if (distance <= 150) {
    return;
  }

  section.scrollIntoView({
    behavior: "smooth",
  });
};
const settingsSection = document.querySelector(".settings");
//For dashboard
const dashboardLink = document.querySelector(".nav-link-dashboard");
const dashboardSection = document.querySelector("#dashboard");

dashboardLink.addEventListener("click", function (e) {
  e.preventDefault();

  scrollingTO(dashboardSection);
});

//For Applications
const applicationsLink = document.querySelector(".nav-link-applications");
const applicationsSeciton = document.querySelector("#applications");

applicationsLink.addEventListener("click", function (e) {
  e.preventDefault();
  scrollingTO(applicationsSeciton);
});

//For Statistics
const statisticsLink = document.querySelector(".nav-link-statistics");
const statisticsSection = document.querySelector("#statistics");

statisticsLink.addEventListener("click", function (e) {
  e.preventDefault();
  scrollingTO(statisticsSection);
});
