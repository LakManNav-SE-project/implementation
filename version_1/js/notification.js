// Notifications Management
class NotificationsManager {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadNotifications();
    }

    initializeEventListeners() {
        document.getElementById('composeNotificationBtn').addEventListener('click', () => this.showComposeSection());
        document.getElementById('cancelComposeBtn').addEventListener('click', () => this.hideComposeSection());
        document.getElementById('sendNotificationBtn').addEventListener('click', () => this.sendNotification());
        document.getElementById('notificationSettingsBtn').addEventListener('click', () => this.showSettings());
    }

    loadNotifications() {
        this.notifications = [...mockData.notifications];
        this.renderNotifications();
    }

    renderNotifications() {
        const container = document.getElementById('notificationList');
        
        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.type}">
                <div class="notification-icon">
                    <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-header">
                        <h5>${notification.title}</h5>
                        <span class="notification-time">${notification.time}</span>
                    </div>
                    <p>${notification.message}</p>
                    <div class="notification-meta">
                        <span class="recipients">To: ${notification.recipients.join(', ')}</span>
                        <span class="status ${notification.status}">${notification.status}</span>
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="btn-action" onclick="notificationsManager.resendNotification('${notification.id}')" 
                            ${notification.status === 'sent' ? 'disabled' : ''}>
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn-action delete" onclick="notificationsManager.deleteNotification('${notification.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    showComposeSection() {
        document.getElementById('composeSection').style.display = 'block';
    }

    hideComposeSection() {
        document.getElementById('composeSection').style.display = 'none';
        this.resetComposeForm();
    }

    resetComposeForm() {
        document.getElementById('recipientType').selectedIndex = -1;
        document.getElementById('messageType').value = 'email';
        document.getElementById('notificationMessage').value = '';
    }

    sendNotification() {
        const recipients = Array.from(document.getElementById('recipientType').selectedOptions).map(opt => opt.value);
        const messageType = document.getElementById('messageType').value;
        const message = document.getElementById('notificationMessage').value;

        if (recipients.length === 0) {
            samsApp.showToast('Please select at least one recipient', 'error');
            return;
        }

        if (!message.trim()) {
            samsApp.showToast('Please enter a message', 'error');
            return;
        }

        const newNotification = {
            id: `notif_${Date.now()}`,
            title: this.generateNotificationTitle(recipients, messageType),
            message: message,
            type: messageType,
            recipients: recipients,
            status: 'sending',
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString()
        };

        // Add to notifications list
        this.notifications.unshift(newNotification);
        this.renderNotifications();

        // Simulate sending
        setTimeout(() => {
            newNotification.status = 'sent';
            this.renderNotifications();
            samsApp.showToast('Notification sent successfully!', 'success');
        }, 2000);

        this.hideComposeSection();
    }

    generateNotificationTitle(recipients, type) {
        const recipientStr = recipients.includes('all') ? 'All' : recipients.join(', ');
        const typeStr = type.charAt(0).toUpperCase() + type.slice(1);
        return `${typeStr} to ${recipientStr}`;
    }

    getNotificationIcon(type) {
        const icons = {
            email: 'fa-envelope',
            sms: 'fa-comment-alt',
            both: 'fa-bullhorn',
            system: 'fa-cog'
        };
        return icons[type] || 'fa-bell';
    }

    resendNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.status = 'sending';
            this.renderNotifications();
            
            setTimeout(() => {
                notification.status = 'sent';
                this.renderNotifications();
                samsApp.showToast('Notification resent successfully!', 'success');
            }, 1500);
        }
    }

    deleteNotification(notificationId) {
        if (confirm('Are you sure you want to delete this notification?')) {
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            this.renderNotifications();
            samsApp.showToast('Notification deleted', 'success');
        }
    }

    showSettings() {
        // Mock notification settings
        samsApp.showToast('Notification settings would open here', 'info');
    }

    // Method to simulate receiving a notification (for demo purposes)
    simulateIncomingNotification() {
        const sampleNotifications = [
            {
                id: `incoming_${Date.now()}`,
                title: 'System Update',
                message: 'Scheduled maintenance tonight at 10 PM',
                type: 'system',
                recipients: ['all'],
                status: 'sent',
                time: new Date().toLocaleTimeString(),
                timestamp: new Date().toISOString()
            },
            {
                id: `incoming_${Date.now() + 1}`,
                title: 'Low Attendance Alert',
                message: 'Class 5A has low attendance today (65%)',
                type: 'email',
                recipients: ['teachers'],
                status: 'sent',
                time: new Date().toLocaleTimeString(),
                timestamp: new Date().toISOString()
            }
        ];

        const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
        this.notifications.unshift(randomNotif);
        this.renderNotifications();
        
        // Show toast notification
        samsApp.showToast(`New notification: ${randomNotif.title}`, 'info');
    }
}

// Initialize notifications manager
const notificationsManager = new NotificationsManager();

// Simulate incoming notifications every 30 seconds for demo
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance
        notificationsManager.simulateIncomingNotification();
    }
}, 30000);