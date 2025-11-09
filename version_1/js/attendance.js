// Attendance Management
class AttendanceManager {
    constructor() {
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadAttendanceData();
    }

    initializeEventListeners() {
        // Mark attendance button
        document.getElementById('markAttendanceBtn').addEventListener('click', () => this.showMarkAttendanceModal());
        
        // QR Scanner
        document.getElementById('qrScannerBtn').addEventListener('click', () => this.toggleQRScanner());
        document.getElementById('startScannerBtn').addEventListener('click', () => this.startQRScanner());
        document.getElementById('stopScannerBtn').addEventListener('click', () => this.stopQRScanner());
        
        // Bulk upload
        document.getElementById('bulkUploadBtn').addEventListener('click', () => this.handleBulkUpload());
        
        // Filters
        document.getElementById('applyFilterBtn').addEventListener('click', () => this.applyFilters());
        
        // Search
        document.getElementById('searchStudent').addEventListener('input', (e) => this.handleSearch(e.target.value));
    }

    loadAttendanceData(filters = {}) {
        let data = [...mockData.attendance];
        
        // Apply filters
        if (filters.startDate) {
            data = data.filter(a => a.date >= filters.startDate);
        }
        if (filters.endDate) {
            data = data.filter(a => a.date <= filters.endDate);
        }
        if (filters.search) {
            data = data.filter(a => 
                a.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
                a.studentId.includes(filters.search)
            );
        }

        this.renderAttendanceTable(data);
    }

    renderAttendanceTable(data) {
        const tbody = document.getElementById('attendanceTableBody');
        
        tbody.innerHTML = data.map(record => {
            const student = mockData.students.find(s => s.id === record.studentId);
            const statusClass = record.status === 'present' ? 'status-present' : 'status-absent';
            
            return `
                <tr>
                    <td>${record.studentId}</td>
                    <td>${student?.name || 'Unknown'}</td>
                    <td>${student?.class || 'N/A'}</td>
                    <td>${this.formatDate(record.date)}</td>
                    <td><span class="status ${statusClass}">${record.status}</span></td>
                    <td>
                        <button class="btn-action edit" onclick="attendanceManager.editAttendance('${record.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action delete" onclick="attendanceManager.deleteAttendance('${record.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    showMarkAttendanceModal() {
        // Create and show mark attendance modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Mark Attendance</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Select Students</label>
                        <select id="studentSelect" multiple style="height: 200px;">
                            ${mockData.students.map(student => `
                                <option value="${student.id}">${student.name} (${student.class})</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="attendanceDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="attendanceStatus">
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button class="btn-primary" id="saveAttendanceBtn">Save Attendance</button>
                        <button class="btn-secondary close-modal">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('#saveAttendanceBtn').addEventListener('click', () => this.saveAttendance());
    }

    saveAttendance() {
        const studentSelect = document.getElementById('studentSelect');
        const date = document.getElementById('attendanceDate').value;
        const status = document.getElementById('attendanceStatus').value;
        const selectedStudents = Array.from(studentSelect.selectedOptions).map(opt => opt.value);
        
        if (selectedStudents.length === 0) {
            samsApp.showToast('Please select at least one student', 'error');
            return;
        }

        // Add new attendance records
        selectedStudents.forEach(studentId => {
            const newRecord = {
                id: `att_${Date.now()}_${studentId}`,
                studentId: studentId,
                date: date,
                status: status,
                markedBy: samsApp.currentUser.id,
                timestamp: new Date().toISOString()
            };
            mockData.attendance.push(newRecord);
        });

        samsApp.showToast(`Attendance marked for ${selectedStudents.length} students`, 'success');
        document.querySelector('.modal').remove();
        this.loadAttendanceData();
        samsApp.loadDashboardData(); // Refresh dashboard stats
    }

    toggleQRScanner() {
        const modal = document.getElementById('qrScannerModal');
        modal.classList.toggle('active');
    }

    startQRScanner() {
        // Mock QR scanner implementation
        // In a real implementation, this would use a QR scanning library
        samsApp.showToast('QR Scanner started. Point camera at QR code.', 'info');
        
        // Simulate QR code detection after 3 seconds
        setTimeout(() => {
            if (Math.random() > 0.3) { // 70% success rate for demo
                const randomStudent = mockData.students[Math.floor(Math.random() * mockData.students.length)];
                document.getElementById('qrResult').innerHTML = `
                    <div class="qr-success">
                        <i class="fas fa-check-circle"></i>
                        <p>Student detected: ${randomStudent.name}</p>
                        <button class="btn-primary" onclick="attendanceManager.markFromQR('${randomStudent.id}')">
                            Mark Present
                        </button>
                    </div>
                `;
            } else {
                document.getElementById('qrResult').innerHTML = `
                    <div class="qr-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>No QR code detected. Please try again.</p>
                    </div>
                `;
            }
        }, 3000);
    }

    stopQRScanner() {
        document.getElementById('qrResult').innerHTML = '';
        samsApp.showToast('QR Scanner stopped', 'info');
    }

    markFromQR(studentId) {
        const today = new Date().toISOString().split('T')[0];
        const existingRecord = mockData.attendance.find(a => 
            a.studentId === studentId && a.date === today
        );

        if (existingRecord) {
            samsApp.showToast('Attendance already marked for today', 'warning');
            return;
        }

        const newRecord = {
            id: `att_qr_${Date.now()}`,
            studentId: studentId,
            date: today,
            status: 'present',
            markedBy: samsApp.currentUser.id,
            timestamp: new Date().toISOString()
        };

        mockData.attendance.push(newRecord);
        samsApp.showToast('Attendance marked successfully!', 'success');
        this.toggleQRScanner();
        this.loadAttendanceData();
        samsApp.loadDashboardData();
    }

    applyFilters() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        this.currentFilters = { startDate, endDate };
        this.loadAttendanceData(this.currentFilters);
    }

    handleSearch(searchTerm) {
        this.currentFilters.search = searchTerm;
        this.loadAttendanceData(this.currentFilters);
    }

    editAttendance(attendanceId) {
        const record = mockData.attendance.find(a => a.id === attendanceId);
        if (!record) return;

        // Show edit modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Attendance</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Student</label>
                        <input type="text" value="${this.getStudentName(record.studentId)}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="editDate" value="${record.date}">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="editStatus">
                            <option value="present" ${record.status === 'present' ? 'selected' : ''}>Present</option>
                            <option value="absent" ${record.status === 'absent' ? 'selected' : ''}>Absent</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button class="btn-primary" onclick="attendanceManager.updateAttendance('${attendanceId}')">
                            Update
                        </button>
                        <button class="btn-secondary close-modal">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    }

    updateAttendance(attendanceId) {
        const record = mockData.attendance.find(a => a.id === attendanceId);
        if (record) {
            record.date = document.getElementById('editDate').value;
            record.status = document.getElementById('editStatus').value;
            record.timestamp = new Date().toISOString();
            
            samsApp.showToast('Attendance updated successfully', 'success');
            document.querySelector('.modal').remove();
            this.loadAttendanceData();
            samsApp.loadDashboardData();
        }
    }

    deleteAttendance(attendanceId) {
        if (confirm('Are you sure you want to delete this attendance record?')) {
            mockData.attendance = mockData.attendance.filter(a => a.id !== attendanceId);
            samsApp.showToast('Attendance record deleted', 'success');
            this.loadAttendanceData();
            samsApp.loadDashboardData();
        }
    }

    getStudentName(studentId) {
        const student = mockData.students.find(s => s.id === studentId);
        return student ? student.name : 'Unknown';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US');
    }

    handleBulkUpload() {
        // Mock bulk upload functionality
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv,.xlsx,.xls';
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Simulate file processing
                samsApp.showToast('Processing bulk upload...', 'info');
                
                setTimeout(() => {
                    // Mock adding some attendance records
                    const newRecords = mockData.students.slice(0, 3).map(student => ({
                        id: `att_bulk_${Date.now()}_${student.id}`,
                        studentId: student.id,
                        date: new Date().toISOString().split('T')[0],
                        status: 'present',
                        markedBy: samsApp.currentUser.id,
                        timestamp: new Date().toISOString()
                    }));
                    
                    mockData.attendance.push(...newRecords);
                    samsApp.showToast(`Bulk upload successful! Added ${newRecords.length} records.`, 'success');
                    this.loadAttendanceData();
                    samsApp.loadDashboardData();
                }, 2000);
            }
        };
        
        fileInput.click();
    }
}

// Initialize attendance manager
const attendanceManager = new AttendanceManager();