##  Project: SAMS -version 1.1

This single HTML file contains a complete, functional prototype for the *School Attendance Management System (SAMS)*. This version is a significant improvement over the basic structure, as it now includes a fully functional front-end with:

* *Complete UI/UX:* A professional, responsive layout utilizing modern CSS and the Font Awesome icon library.
* *Authentication Flow:* A working Login/Registration system.
* *In-Browser Persistence:* Data storage using localStorage for users, students, attendance, and notifications.
* *Interactive Modules:* Full navigation and user interaction for all key features.

### Key Features and Functionality

SAMS provides a comprehensive suite of tools for school management across multiple user roles:

| Module | Core Functionality | Role Access |
| :--- | :--- | :--- |
| *Authentication* | Login and Registration, with demo credentials provided (teacher/admin and demo123). | *Teacher, Admin, Parent, Student* |
| *Dashboard* | Provides a real-time summary of the current day's attendance statistics: *Present, **Absent, **Total Students, and **Attendance Rate*. | All Logged-in Roles |
| *Attendance* | *Mark Attendance* (individual/multiple students), *Delete* records, and mock *Bulk Upload* functionality. | *Teacher, Admin* (Implied) |
| *Students* | *Add, **Edit* (mocked), and *Delete* student records. Displays a full student directory. | *Teacher, Admin* (Implied) |
| *User Management* | *Add* new users (Teachers, Admins, Parents, Students) and *Delete* existing users. | *Admin* (Implied) |
| *Reports* | *Generate* report summaries (based on attendance history) and *Export CSV* of all attendance data. | *Teacher, Admin* (Implied) |
| *Notifications* | Allows sending system-wide or targeted messages (e.g., to all Parents, all Students) with time-stamped history. | *Teacher, Admin* (Implied) |

###  Technology Stack

* *HTML5:* The entire application structure is contained in a single file.
* *CSS3:* Uses modern CSS for layout and styling, including a dedicated responsive design section (@media queries).
* *JavaScript (Vanilla JS):* All application logic, state management (using localStorage), and DOM manipulation are handled by pure JavaScript, eliminating the need for external frameworks.
* *Font Awesome:* Used for all modern, clean icons across the system.

### 💻 System Details (For Developers)
Commited by Navyashee J

* *Data Persistence:* Uses localStorage to save data across browser sessions for *users, **students, **attendance, and **notifications*. This makes the prototype fully functional without a backend server.
* *Security:* Authentication is handled client-side against the stored users array. *Note:* Passwords are not hashed in this basic version.
* *User Roles:* The system supports *Teacher, Administrator, Parent, and Student* roles, though the current view primarily caters to the Teacher/Admin role.

Commited by : Navyashree J
