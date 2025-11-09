// Main Application Controller
class SAMSApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadMockData();
        this.updateDateTime();
        this.setupRoleBasedUI();
        
        // Update date every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    initializeEventListeners() {
        // Login functionality
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Quick actions
        document.getElementById('quickMarkBtn').addEventListener('click', () => this.quickMarkAttendance());
        document.getElementById('quickReportBtn').addEventListener('click', () => this.quickGenerateReport());
        document.getElementById('quickNotifyBtn').addEventListener('click', () => this.quickSendNotification());

        // Modal handling
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Enter key for login
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (!username || !password) {
            this.showToast('Please enter both username and password', 'error');
            return;
        }

        // Mock authentication
        const user = mockData.users.find(u => 
            u.username === username && u.role === role
        );

        if (user) {
            this.currentUser = user;
            this.showToast(`Welcome back, ${user.name}!`, 'success');
            this.switchScreen('appScreen');
            this.setupRoleBasedUI();
            this.loadDashboardData();
        } else {
            this.showToast('Invalid credentials. Please try again.', 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.switchScreen('loginScreen');
        this.resetLoginForm();
        this.showToast('You have been logged out successfully', 'success');
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    handleNavigation(event) {
        const navItem = event.currentTarget;
        const targetPage = navItem.dataset.page;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        navItem.classList.add('active');

        // Update active page
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${targetPage}Page`).classList.add('active');

        // Update page title
        document.getElementById('pageTitle').textContent = 
            navItem.querySelector('span').textContent;

        this.currentPage = targetPage;

        // Load page-specific data
        this.loadPageData(targetPage);
    }

    setupRoleBasedUI() {
        const role = this.currentUser?.role || 'student';
        document.body.className = `role-${role}`;
        document.getElementById('userRole').textContent = 
            role.charAt(0).toUpperCase() + role.slice(1);
        document.getElementById('userName').textContent = 
            this.currentUser?.name || 'Guest';
    }

    loadPageData(page) {
        switch(page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'attendance':
                attendanceManager.loadAttendanceData();
                break;
            case 'reports':
                reportsManager.loadReportsData();
                break;
            case 'notifications':
                notificationsManager.loadNotifications();
                break;
            case 'admin':
                this.loadAdminData();
                break;
            case 'parent':
                this.loadParentData();
                break;
        }
    }

    loadDashboardData() {
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = mockData.attendance.filter(a => a.date === today);
        
        const presentCount = todayAttendance.filter(a => a.status === 'present').length;
        const absentCount = todayAttendance.filter(a => a.status === 'absent').length;
        const totalStudents = mockData.students.length;
        const attendancePercentage = totalStudents > 0 ? 
            Math.round((presentCount / totalStudents) * 100) : 0;

        // Update stats
        document.getElementById('presentCount').textContent = presentCount;
        document.getElementById('absentCount').textContent = absentCount;
        document.getElementById('totalStudents').textContent = totalStudents;
        document.getElementById('attendancePercentage').textContent = `${attendancePercentage}%`;

        // Update recent activity
        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activityList = document.getElementById('activityList');
        const recentActivities = mockData.activities.slice(0, 5);

        activityList.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <p>${activity.description}</p>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            present: 'fa-user-check',
            absent: 'fa-user-times',
            notification: 'fa-bell',
            report: 'fa-chart-bar',
            system: 'fa-cog'
        };
        return icons[type] || 'fa-info-circle';
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString('en-US', options);
    }

    quickMarkAttendance() {
        this.handleNavigation({ currentTarget: document.querySelector('[data-page="attendance"]') });
        setTimeout(() => {
            document.getElementById('markAttendanceBtn').click();
        }, 500);
    }

    quickGenerateReport() {
        this.handleNavigation({ currentTarget: document.querySelector('[data-page="reports"]') });
        setTimeout(() => {
            document.getElementById('generateReportBtn').click();
        }, 500);
    }

    quickSendNotification() {
        this.handleNavigation({ currentTarget: document.querySelector('[data-page="notifications"]') });
        setTimeout(() => {
            document.getElementById('composeNotificationBtn').click();
        }, 500);
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    resetLoginForm() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('role').value = 'student';
        document.getElementById('rememberMe').checked = false;
    }

    loadMockData() {
        // Data is loaded from mockData.js
        console.log('Mock data loaded:', mockData);
    }

    loadAdminData() {
        // Load admin-specific data
        const usersTableBody = document.getElementById('usersTableBody');
        usersTableBody.innerHTML = mockData.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td><span class="user-role">${user.role}</span></td>
                <td>${user.email}</td>
                <td><span class="status active">Active</span></td>
                <td>
                    <button class="btn-action edit" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadParentData() {
        // Load parent-specific data
        const child = mockData.students[0]; // Mock first student as child
        document.getElementById('childName').textContent = child.name;
        document.getElementById('childClass').textContent = child.class;
        
        // Calculate attendance percentage
        const studentAttendance = mockData.attendance.filter(a => a.studentId === child.id);
        const presentCount = studentAttendance.filter(a => a.status === 'present').length;
        const attendancePercentage = studentAttendance.length > 0 ? 
            Math.round((presentCount / studentAttendance.length) * 100) : 0;
        
        document.getElementById('childAttendance').textContent = `${attendancePercentage}%`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.samsApp = new SAMSApp();
});