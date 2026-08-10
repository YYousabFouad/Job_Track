JobTrack --- Version 1

JobTrack is a simple Job Application Tracker that helps usersorganize and keep track of the jobs and internships they apply to.

Version 1 focuses on the frontend and JavaScript fundamentals. Ituses HTML, CSS, JavaScript, and LocalStorage.

The goal is to build a useful project while practicing the JavaScriptand DOM concepts from the course.

🎯 Version 1 Goal

The first version should allow the user to:

View a dashboard

View their applications

Add an application

Edit an application

Delete an application

Search applications

Filter applications by status

Sort applications

View basic statistics

Save applications in LocalStorage

Keep the selected theme after refreshing

Navigate smoothly between sections

No backend or real authentication is included in Version 1.

🖥️ Page Structure

Version 1 uses one HTML page:

index.html
│
├── Navbar
│
├── Dashboard
│
├── Applications
│
├── Statistics
│
├── Settings
│
└── Footer

The page is intentionally organized into multiple sections so we canpractice DOM navigation and smooth scrolling.

1. Navigation Bar

The navbar should contain:

JobTrack logo

Dashboard link

Applications link

Statistics link

Settings link

Theme toggle

User/profile area

Navigation:

Dashboard → #dashboard
Applications → #applications
Statistics → #statistics
Settings → #settings

The navigation links should eventually use JavaScript to implementsmooth scrolling.

2. Dashboard

The Dashboard is the first section the user sees.

Content

Hero

Include:

Welcome message

Short description

Add Application button

Scroll-down button

Example:

Welcome back 👋

Organize and track your job applications
in one place.

[ + Add Application ]

Summary Cards

Display:

Total Applications
Applied
Interviews
Offers
Rejected

Example:

Total Applications 12
Applied 6
Interviews 3
Offers 1
Rejected 2

These values should eventually be calculated from the actualapplications array.

3. Applications

This is the main section of JobTrack.

Controls

Include:

[ Search applications... ]

[ All ]
[ Applied ]
[ Interview ]
[ Offer ]
[ Rejected ]

[ Sort ]

Application Cards

Each card should contain:

Company
Position
Status
Location
Work type
Date applied
Notes
View Job
Edit
Delete

Example:

┌─────────────────────────────────┐
│ Vercel │
│ Frontend Engineer │
│ │
│ Status: Interview │
│ Location: Remote │
│ Applied: Aug 2, 2026 │
│ │
│ Technical interview next week. │
│ │
│ View Job Edit Delete │
└─────────────────────────────────┘

Use several dummy applications during development so the application hasrealistic content.

Suggested examples:

Vercel Frontend Engineer Interview
GitHub Full Stack Developer Offer
Microsoft Backend Engineer Applied
Google React Intern Applied
Amazon Software Engineer Rejected
Stripe Frontend Intern Screening

4. Add Application

The user should be able to open a form/modal to create a newapplication.

Form

The first version can contain:

Company Name
Position
Status
Location
Work Type
Date Applied
Job URL
Notes

Example:

Company: Microsoft
Position: Frontend Intern
Status: Applied
Location: Cairo
Work Type: Hybrid
Date Applied: August 10, 2026

When the user submits:

Form Submit
↓
Create application object
↓
Add object to applications[]
↓
Save to LocalStorage
↓
Render applications
↓
Update statistics

5. Edit Application

Each application should have an Edit button.

Workflow:

Click Edit
↓
Open form
↓
Show existing data
↓
User changes information
↓
Update application object
↓
Save to LocalStorage
↓
Render again

6. Delete Application

Each application should have a Delete button.

Workflow:

Click Delete
↓
Find application
↓
Remove it from applications[]
↓
Save to LocalStorage
↓
Render again
↓
Update statistics

7. Search

The user should be able to search applications by information such as:

Company

Position

Location

Example:

Search: React

Possible results:

Google React Intern
Meta React Developer
Startup X React Engineer

8. Filter

The user should be able to filter by status:

All
Applied
Interview
Offer
Rejected

Example:

User selects Interview
↓
Show only Interview applications

9. Sort

Version 1 can include:

Newest
Oldest
Company A-Z
Company Z-A

10. Statistics

The Statistics section should show useful information calculated fromthe applications.

Include:

Total Applications
Applied
Interviews
Offers
Rejected
Response Rate
Interview Rate
Offer Rate

The statistics should eventually be calculated from:

applications[]

rather than being hard-coded.

11. Settings

Version 1 Settings should remain simple.

Include:

Theme preference

Export data

Clear all data

The theme should be saved in LocalStorage.

Application data should also be saved in LocalStorage.

💾 LocalStorage

LocalStorage is the persistence layer for Version 1.

Application data

applications[]
↓
JSON.stringify()
↓
LocalStorage

When JobTrack opens:

LocalStorage
↓
getItem()
↓
JSON.parse()
↓
applications[]

Startup workflow

Open JobTrack
↓
Check LocalStorage
↓
Saved applications?
/ \
 YES NO
↓ ↓
Load []
\ /
↓
applications[]
↓
Render UI

🧠 Main Data Structure

The application state is:

applications[]

Each application is an object containing information such as:

id
company
position
status
location
workType
dateApplied
jobUrl
notes

A future version can add more properties.

🌐 Smooth Scrolling

Version 1 should have several sections on the same page:

Dashboard
↓
Applications
↓
Statistics
↓
Settings

Navigation links should move between these sections.

Also include:

Scroll-down button

Back-to-top button

The purpose is to practice:

getElementById()

querySelector()

addEventListener()

scrollIntoView()

DOM events

Event delegation

🎨 UI Requirements

Version 1 should be:

Clean

Modern

Responsive

Easy to navigate

Consistent with the JobTrack logo

Available in dark and light themes

Focus on usability rather than excessive animations.

📚 JavaScript Concepts Practiced

Version 1 should give practice with:

Data

Arrays

Objects

Array methods

State management

LocalStorage

setItem()

getItem()

JSON serialization

JSON parsing

DOM

Selecting elements

Creating elements

Deleting elements

Changing text/content

Attributes

Classes

Dataset attributes

Events

Click

Input

Change

Submit

Scroll

Navigation

Event delegation

Smooth scrolling

DOM traversal

Browser APIs

LocalStorage

🔄 Complete Version 1 Workflow

                    OPEN JOBTRACK
                         ↓
                 Load LocalStorage
                         ↓
              Existing applications?
                    /          \
                  YES           NO
                   ↓             ↓
                 Load          Start []
                   \             /
                    ↓           ↓
                     applications[]
                           ↓
                     Render Dashboard
                           ↓
                 ┌─────────┼─────────┐
                 ↓         ↓         ↓
               Add       Search    Filter
                 ↓         ↓         ↓
               Edit      Sort      Delete
                 \         |         /
                  \        |        /
                   ↓       ↓       ↓
                  Update applications[]
                           ↓
                  Save LocalStorage
                           ↓
                     Render UI
                           ↓
                  Update Statistics

📁 Suggested Project Structure

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
├── assets/
│ ├── images/
│ ├── icons/
│ └── logo/
│
├── README.md
└── .gitignore

🚧 Version 1 --- What Is NOT Included

To keep Version 1 focused, do not add:

Backend

Database

Real authentication

User registration

Password management

API

React

TypeScript

React Native

Those can be future versions.

🏆 Version 1 Success Criteria

Version 1 is complete when the user can:

✓ Open JobTrack
✓ Navigate between sections
✓ Toggle dark/light mode
✓ Add an application
✓ See the application immediately
✓ Refresh the page
✓ Still see the application
✓ Edit an application
✓ Delete an application
✓ Search applications
✓ Filter applications
✓ Sort applications
✓ See updated statistics
✓ Clear stored data

🚀 Future Versions

After Version 1 is stable:

Version 1
HTML + CSS + JavaScript + LocalStorage
↓
Version 2
Backend + Database + Authentication
↓
Version 3
React
↓
Version 4
React + TypeScript
↓
Version 5
React Native

The goal is to keep improving the same project as your skills grow.
