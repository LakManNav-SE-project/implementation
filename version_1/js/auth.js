// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    async login(username, password, role) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = mockData.users.find(u => 
                    u.username === username && u.role === role
                );
                
                if (user) {
                    this.currentUser = user;
                    this.isAuthenticated = true;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    resolve(user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
    }

    checkAuthStatus() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.isAuthenticated = true;
            return true;
        }
        return false;
    }

    hasPermission(requiredRole) {
        if (!this.currentUser) return false;
        return this.currentUser.role === requiredRole || this.currentUser.role === 'admin';
    }
}