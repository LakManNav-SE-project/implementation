// Reports Management
class ReportsManager {
    constructor() {
        this.currentReportType = 'daily';
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadReportsData();
    }

    initializeEventListeners() {
        document.getElementById('generateReportBtn').addEventListener('click', () => this.generateReport());
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('reportType').addEventListener('change', (e) => this.onReportTypeChange(e.target.value));
    }

    loadReportsData() {
        this.renderCharts();
        this.updateReportPreview();
    }

    onReportTypeChange(type) {
        this.currentReportType = type;
        this.updateReportPreview();
    }

    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const format = document.querySelector('input[name="format"]:checked').value;
        
        samsApp.showToast(`Generating ${reportType} report in ${format.toUpperCase()} format...`, 'info');
        
        // Simulate report generation
        setTimeout(() => {
            const reportData = this.prepareReportData(reportType);
            this.downloadReport(reportData, format, reportType);
            samsApp.showToast('Report generated successfully!', 'success');
        }, 2000);
    }

    prepareReportData(reportType) {
        const today = new Date();
        let data = [];
        
        switch(reportType) {
            case 'daily':
                data = mockData.attendance.filter(a => a.date === today.toISOString().split('T')[0]);
                break;
            case 'weekly':
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                data = mockData.attendance.filter(a => new Date(a.date) >= weekAgo);
                break;
            case 'monthly':
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                data = mockData.attendance.filter(a => new Date(a.date) >= monthAgo);
                break;
            case 'custom':
                data = mockData.attendance; // All data for custom
                break;
        }
        
        return this.formatReportData(data, reportType);
    }

    formatReportData(data, reportType) {
        // Group data by date and calculate statistics
        const groupedData = data.reduce((acc, record) => {
            if (!acc[record.date]) {
                acc[record.date] = {
                    date: record.date,
                    present: 0,
                    absent: 0,
                    total: 0
                };
            }
            
            acc[record.date].total++;
            if (record.status === 'present') {
                acc[record.date].present++;
            } else {
                acc[record.date].absent++;
            }
            
            return acc;
        }, {});
        
        return Object.values(groupedData);
    }

    downloadReport(data, format, reportType) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `attendance_report_${reportType}_${timestamp}`;
        
        if (format === 'csv') {
            this.downloadCSV(data, filename);
        } else if (format === 'excel') {
            this.downloadExcel(data, filename);
        } else {
            this.downloadPDF(data, filename);
        }
    }

    downloadCSV(data, filename) {
        const headers = ['Date', 'Present', 'Absent', 'Total', 'Attendance Rate'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.date,
                row.present,
                row.absent,
                row.total,
                `${Math.round((row.present / row.total) * 100)}%`
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        this.downloadBlob(blob, `${filename}.csv`);
    }

    downloadExcel(data, filename) {
        // Mock Excel download - in real implementation, use a library like SheetJS
        samsApp.showToast('Excel export would be implemented with SheetJS', 'info');
        this.downloadCSV(data, filename); // Fallback to CSV
    }

    downloadPDF(data, filename) {
        // Mock PDF download - in real implementation, use a library like jsPDF
        samsApp.showToast('PDF export would be implemented with jsPDF', 'info');
        this.downloadCSV(data, filename); // Fallback to CSV
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportData() {
        const dataStr = JSON.stringify(mockData.attendance, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        this.downloadBlob(blob, `attendance_data_${new Date().toISOString().split('T')[0]}.json`);
        samsApp.showToast('Data exported successfully!', 'success');
    }

    renderCharts() {
        // Mock chart rendering - in real implementation, use Chart.js or similar
        console.log('Rendering attendance charts...');
        
        // This would initialize charts with mockData
        const ctx1 = document.getElementById('attendanceChart');
        const ctx2 = document.getElementById('classChart');
        
        if (ctx1 && ctx2) {
            // Chart.js initialization would go here
            this.updateChartData();
        }
    }

    updateChartData() {
        // Update charts with current data
        console.log('Updating chart data...');
    }

    updateReportPreview() {
        const preview = document.getElementById('reportPreview');
        const reportType = document.getElementById('reportType').value;
        
        const sampleData = this.prepareReportData(reportType);
        
        preview.innerHTML = `
            <div class="report-preview-content">
                <h5>${this.getReportTitle(reportType)} - Preview</h5>
                <table class="preview-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Total</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sampleData.slice(0, 5).map(row => `
                            <tr>
                                <td>${row.date}</td>
                                <td>${row.present}</td>
                                <td>${row.absent}</td>
                                <td>${row.total}</td>
                                <td>${Math.round((row.present / row.total) * 100)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${sampleData.length > 5 ? `<p class="preview-note">... and ${sampleData.length - 5} more records</p>` : ''}
            </div>
        `;
    }

    getReportTitle(reportType) {
        const titles = {
            daily: 'Daily Attendance Report',
            weekly: 'Weekly Attendance Summary',
            monthly: 'Monthly Attendance Report',
            custom: 'Custom Period Report'
        };
        return titles[reportType] || 'Attendance Report';
    }
}

// Initialize reports manager
const reportsManager = new ReportsManager();