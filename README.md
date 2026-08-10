# JobTrack

> A modern job application tracker built with Vanilla JavaScript.

## 📌 Project Idea

**JobTrack** is a web application designed to help students, graduates, and job seekers organize and track their job and internship applications in one place.

Instead of keeping applications in scattered notes, spreadsheets, browser tabs, or messages, JobTrack provides a simple dashboard where users can record an application, track its current status, search and filter applications, and see useful statistics about their job search.

The main goal of the project is to build a **real-world, interactive JavaScript application** rather than a small demonstration project.

---

## 🎯 Problem

When applying for many jobs or internships, it is easy to lose track of:

- Which companies you applied to
- Which position you applied for
- When you applied
- Which applications are still waiting for a response
- Which companies invited you to an interview
- Which applications were rejected
- Which opportunities resulted in an offer

JobTrack solves this problem by keeping all application information organized in one dashboard.

---

## 💡 Solution

JobTrack allows the user to:

1. Add a new job or internship application.
2. Store important information about the application.
3. View all applications from one dashboard.
4. Change the status of an application.
5. Edit application information.
6. Delete applications.
7. Search for specific applications.
8. Filter applications by status.
9. Sort applications.
10. View statistics about the job search.
11. Save application data locally so it remains available after closing the browser.

---

## 🔄 How the Application Works

The core workflow is:

```text
User Action
    ↓
JavaScript handles the event
    ↓
Application data is updated
    ↓
Data is saved
    ↓
The UI is rendered again
    ↓
Statistics are updated
```

For example, when a user changes an application from **Applied** to **Interview**:

```text
Change Status
     ↓
Find Application
     ↓
Update Status
     ↓
Save Data
     ↓
Re-render Applications
     ↓
Update Statistics
```

The application data acts as the source of truth, while the user interface reflects that data.

---

## 📊 Application Statuses

Each application can have a status such as:

- **Applied**
- **Screening**
- **Interview**
- **Offer**
- **Rejected**

This allows the user to understand where each application currently stands.

---

## 🗂️ Application Information

An application can contain information such as:

```text
Company
Position
Status
Location
Date Applied
Job URL
Salary
Notes
Contact Information
```

Example:

```text
Company: Microsoft
Position: Frontend Developer Intern
Status: Interview
Location: Remote
Date Applied: August 8, 2026
Notes: Technical interview next week
```

---

## 📈 Dashboard & Statistics

The dashboard will provide a quick overview of the user's job search.

Possible statistics include:

```text
Total Applications
Applied
Interviews
Offers
Rejected
Response Rate
Interview Rate
Offer Rate
```

These statistics are calculated from the application's data rather than being manually entered.

---

## 🔎 Search, Filtering & Sorting

JobTrack will allow users to quickly find applications.

### Search

Search by information such as:

- Company
- Position
- Location
- Notes

### Filtering

Filter applications by status:

```text
All
Applied
Screening
Interview
Offer
Rejected
```

### Sorting

Applications can be sorted by:

- Newest
- Oldest
- Company name
- Position

---

## 💾 Data Persistence

JobTrack will use **LocalStorage** to save application data in the browser.

The basic flow is:

```text
Application Changes
       ↓
Applications Array
       ↓
LocalStorage
```

When the user opens JobTrack again:

```text
LocalStorage
      ↓
Load Saved Data
      ↓
Applications Array
      ↓
Render Dashboard
```

This means the user's applications are not lost when the page is closed.

---

## 🧠 Main JavaScript Concepts Practiced

This project is intentionally designed to reinforce important JavaScript and DOM concepts.

### DOM Manipulation

- Selecting elements
- Creating elements
- Removing elements
- Changing classes
- Updating content
- DOM traversal

### Events

- Event listeners
- Event propagation
- Event delegation
- Form events
- Input events
- Click events

### Arrays

- `map()`
- `filter()`
- `find()`
- `findIndex()`
- `sort()`
- `reduce()`

### JavaScript Concepts

- Objects
- Arrays
- Functions
- Modules
- Destructuring
- Spread syntax
- Template literals
- Dates
- LocalStorage
- JSON

### Browser APIs

- DOM API
- LocalStorage API

---

## 🛠️ Technologies

### Current Version

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- DOM API
- LocalStorage

---

## 🗺️ Project Roadmap

### Phase 1 — Foundation

- [ ] Create project structure
- [ ] Build dashboard UI
- [ ] Create application data structure
- [ ] Render applications dynamically

### Phase 2 — Application Management

- [ ] Add application
- [ ] Edit application
- [ ] Delete application
- [ ] Change application status
- [ ] Validate forms

### Phase 3 — User Experience

- [ ] Search
- [ ] Filtering
- [ ] Sorting
- [ ] Tabs
- [ ] Application details modal
- [ ] Responsive design

### Phase 4 — Statistics

- [ ] Application count
- [ ] Status statistics
- [ ] Response rate
- [ ] Interview rate
- [ ] Offer rate
- [ ] Charts

### Phase 5 — Persistence

- [ ] Save applications to LocalStorage
- [ ] Load applications on startup
- [ ] Handle invalid stored data

---

## 🎓 Learning Goal

JobTrack is not only a portfolio project.

It is also a learning project designed to develop the ability to build a complete application from an idea.

The project focuses on understanding:

```text
User
 ↓
Interface
 ↓
Events
 ↓
JavaScript Logic
 ↓
Application State
 ↓
Data Persistence
 ↓
UI Update
```

The goal is to understand **why each part exists and how the parts communicate**, rather than simply copying a finished application.

---

## 📄 License

This project is created for learning and portfolio development.
