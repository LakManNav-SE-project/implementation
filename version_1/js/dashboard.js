// Dashboard Management
class DashboardManager {
    constructor() {
        this.stats = {
            present: 0,
            absent: 0,
            total: 0,
            percentage: 0
        };
    }

    updateStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = mockData.attendance.filter(a => a.date === today);
        
        this.stats.present = todayAttendance.filter(a => a.status === 'present').length;
        this.stats.absent = todayAttendance.filter(a => a.status === 'absent').length;
        this.stats.total = mockData.students.length;
        this.stats.percentage = this.stats.total > 0 ? 
            Math.round((this.stats.present / this.stats.total) * 100) : 0;

        this.renderStats();
        this.renderCharts();
    }

    renderStats() {
        document.getElementById('presentCount').textContent = this.stats.present;
        document.getElementById('absentCount').textContent = this.stats.absent;
        document.getElementById('totalStudents').textContent = this.stats.total;
        document.getElementById('attendancePercentage').textContent = `${this.stats.percentage}%`;
    }

    renderCharts() {
        // This would be implemented with a charting library like Chart.js
        console.log('Rendering dashboard charts...');
    }

    loadRecentActivity() {
        const activities = mockData.activities.slice(0, 5);
        const activityList = document.getElementById('activityList');
        
        activityList.innerHTML = activities.map(activity => `
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
}