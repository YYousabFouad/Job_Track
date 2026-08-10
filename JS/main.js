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
