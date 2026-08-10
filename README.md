JobTrack 💼

A modern, responsive Job Application Tracker built with HTML, CSS,and JavaScript.

JobTrack helps job seekers organize their job and internshipapplications in one place. Instead of keeping track of applicationsacross browser tabs, notes, spreadsheets, and memory, JobTrack providesa single dashboard where applications can be stored, searched, filtered,sorted, and monitored.

✨ Features

📊 Dashboard

A central overview of the user's job search.

Total applications

Applied applications

Interviews

Offers

Rejected applications

Recent applications

Quick access to important sections

📝 Application Management

Users can manage their job applications from one place.

Add a new application

Edit an existing application

Delete an application

View application information

Store notes about an application

Store the job posting URL

Each application can contain information such as:

Company

Position

Status

Location

Work type

Date applied

Job URL

Notes

🔎 Search

Search applications by relevant information such as:

Company

Position

Location

🏷️ Filtering

Filter applications by their current status:

All

Applied

Screening

Interview

Offer

Rejected

↕️ Sorting

Sort applications using options such as:

Newest

Oldest

Company name

📈 Statistics

JobTrack provides an overview of the user's application progress,including:

Total applications

Applications by status

Response rate

Interview rate

Offer rate

💾 Local Storage

Applications are persisted using the browser's localStorage.

This means the user can:

Add an application.

Close or refresh the browser.

Return to JobTrack.

Continue seeing their saved applications.

🌙 Dark / Light Theme

JobTrack supports a dark and light interface.

The selected theme is saved locally so the user's preference remainsafter refreshing the page.

🧭 Smooth Navigation

The application uses a single-page layout with sections such as:

Dashboard

Applications

Statistics

Settings

Navigation allows the user to move between sections smoothly.

📱 Responsive Interface

The interface is designed to work across:

Desktop

Tablet

Mobile

🛠️ Technologies

This version of JobTrack is built with:

Technology Purpose

HTML5 Page structure and semantic contentCSS3 Styling, layout, responsiveness, and themesJavaScript Application logic and DOM interactionLocalStorage API Client-side data persistenceJSON Serialization of application dataSVG Icons and branding

🧠 JavaScript Concepts Practiced

JobTrack is also a learning project. The application is being developedwhile studying JavaScript and the DOM.

The project provides practical use cases for:

DOM manipulation

Selecting elements

Creating elements

Deleting elements

Styles, attributes, and classes

Dataset attributes

Events and event handlers

Event propagation

Event delegation

DOM traversing

Smooth scrolling

Tabs

Sticky navigation

Scroll events

Intersection Observer

Revealing elements

Sliders

LocalStorage

JSON serialization and parsing

The goal is to apply these concepts inside a real project instead ofpracticing them only in isolated examples.

🗂️ Application Data

The core of JobTrack is the applications collection.

Conceptually, each application contains information like:

Application
├── id
├── company
├── position
├── status
├── location
├── workType
├── dateApplied
├── jobUrl
└── notes

The application data is kept in JavaScript while the application isrunning and persisted to LocalStorage.

Data flow

User Action
↓
JavaScript
↓
applications[]
↓
LocalStorage
↓
DOM
↓
Updated UI

💾 Data Persistence

JobTrack uses LocalStorage to persist application data.

Saving

applications[]
↓
JSON.stringify()
↓
localStorage.setItem()

Loading

localStorage.getItem()
↓
JSON.parse()
↓
applications[]

Startup

Open JobTrack
↓
Check LocalStorage
↓
Saved data exists?
/ \
 YES NO
↓ ↓
Load Start empty
\ /
↓ ↓
applications[]
↓
Render UI

🧭 Application Workflow

The main user workflow is:

Open JobTrack
↓
Load saved applications
↓
View Dashboard
↓
Add Application
↓
Application is stored
↓
Application appears in the UI
↓
Search / Filter / Sort
↓
Edit application when needed
↓
Delete application when needed
↓
Statistics update

🎨 Interface Structure

The first version uses a single-page layout.

JobTrack
│
├── Navbar
│
├── Dashboard
│ ├── Welcome section
│ ├── Add Application
│ └── Summary statistics
│
├── Applications
│ ├── Search
│ ├── Filters
│ ├── Sorting
│ └── Application cards
│
├── Statistics
│ ├── Response rate
│ ├── Status breakdown
│ └── Application insights
│
├── Settings
│ ├── Theme
│ ├── Export data
│ └── Clear data
│
└── Footer

📁 Project Structure

JobTrack/
│
├── HTML/
│ └── index.html
│
├── CSS/
│ └── style.css
│
├── JS/
│ └── main.js
│
├── images/
│
│
├── README.md
└── .gitignore

🚀 Getting Started

1. Clone the repository

git clone <your-repository-url>

2. Open the project

cd JobTrack

3. Run the project

Because the first version is a frontend application, it can be openeddirectly in a browser.

You can also use VS Code Live Server for a better developmentexperience.

🔐 Data & Privacy

Version 1 stores application data locally in the user's browser.

There is currently:

No backend

No database

No user account system

No server-side authentication

The stored applications remain in the browser's LocalStorage.

📌 Version 1 Scope

The first version focuses on building a useful frontend application andpracticing JavaScript.

Included

Dashboard

Application management

Search

Filtering

Sorting

Statistics

LocalStorage persistence

Theme persistence

Smooth navigation

Responsive UI

Not included yet

Backend

Database

Real authentication

User registration

Server-side storage

Multi-user accounts

These are outside the scope of the first version.

🎯 Project Goals

JobTrack has two goals.

1. Build a useful application

Create a tool that can actually help organize a real job search.

2. Improve JavaScript skills

Use the project to understand how JavaScript interacts with the DOM andbrowser APIs.

Instead of creating separate small demos for every concept, JobTrackprovides a single project where those concepts can work together.

🛣️ Development Approach

The project is being developed progressively.

HTML
↓
CSS
↓
JavaScript Data
↓
LocalStorage
↓
DOM Manipulation
↓
Events
↓
Application Management
↓
Search / Filter / Sort
↓
Statistics
↓
UI Improvements

Each feature is implemented when the related JavaScript concept is beingstudied.

📚 Learning Philosophy

JobTrack is intentionally built step by step.

The goal is not simply to copy a finished application.

The goal is to understand:

Why the application works, how the data flows through it, and howJavaScript changes the DOM in response to user actions.

📄 License

This project is currently being developed as a personal learning andportfolio project.
