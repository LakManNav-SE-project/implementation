// Mock Data for SAMS Frontend
const mockData = {
    users: [
        {
            id: 'user_1',
            username: 'teacher_john',
            password: 'password123',
            name: 'John Smith',
            email: 'john.smith@school.edu',
            role: 'teacher',
            class: '5A'
        },
        {
            id: 'user_2',
            username: 'admin_mary',
            password: 'password123',
            name: 'Mary Johnson',
            email: 'mary.johnson@school.edu',
            role: 'admin'
        },
        {
            id: 'user_3',
            username: 'student_alice',
            password: 'password123',
            name: 'Alice Brown',
            email: 'alice.brown@school.edu',
            role: 'student',
            class: '5A'
        },
        {
            id: 'user_4',
            username: 'parent_david',
            password: 'password123',
            name: 'David Wilson',
            email: 'david.wilson@email.com',
            role: 'parent',
            children: ['student_1']
        }
    ],

    students: [
        {
            id: 'student_1',
            name: 'Alice Brown',
            class: '5A',
            email: 'alice.brown@school.edu',
            parentEmail: 'david.wilson@email.com'
        },
        {
            id: 'student_2',
            name: 'Bob Johnson',
            class: '5A',
            email: 'bob.johnson@school.edu',
            parentEmail: 'sarah.johnson@email.com'
        },
        {
            id: 'student_3',
            name: 'Carol Davis',
            class: '5B',
            email: 'carol.davis@school.edu',
            parentEmail: 'michael.davis@email.com'
        },
        {
            id: 'student_4',
            name: 'David Miller',
            class: '5B',
            email: 'david.miller@school.edu',
            parentEmail: 'lisa.miller@email.com'
        },
        {
            id: 'student_5',
            name: 'Eva Wilson',
            class: '5A',
            email: 'eva.wilson@school.edu',
            parentEmail: 'robert.wilson@email.com'
        }
    ],

    attendance: [
        {
            id: 'att_1',
            studentId: 'student_1',
            date: new Date().toISOString().split('T')[0],
            status: 'present',
            markedBy: 'user_1',
            timestamp: new Date().toISOString()
        },
        {
            id: 'att_2',
            studentId: 'student_2',
            date: new Date().toISOString().split('T')[0],
            status: 'present',
            markedBy: 'user_1',
            timestamp: new Date().toISOString()
        },
        {
            id: 'att_3',
            studentId: 'student_3',
            date: new Date().toISOString().split('T')[0],
            status: 'absent',
            markedBy: 'user_1',
            timestamp: new Date().toISOString()
        },
        {
            id: 'att_4',
            studentId: 'student_4',
            date: new Date().toISOString().split('T')[0],
            status: 'present',
            markedBy: 'user_1',
            timestamp: new Date().toISOString()
        },
        {
            id: 'att_5',
            studentId: 'student_5',
            date: new Date().toISOString().split('T')[0],
            status: 'present',
            markedBy: 'user_1',
            timestamp: new Date().toISOString()
        }
    ],

    notifications: [
        {
            id: 'notif_1',
            title: 'Welcome to SAMS',
            message: 'Your Student Attendance Management System is now active.',
            type: 'system',
            recipients: ['all'],
            status: 'sent',
            time: '09:00 AM'
        },
        {
            id: 'notif_2',
            title: 'Low Attendance Alert',
            message: 'Class 5B has low attendance today (60%)',
            type: 'email',
            recipients: ['teachers', 'admin'],
            status: 'sent',
            time: '10:30 AM'
        },
        {
            id: 'notif_3',
            title: 'Parent Notification',
            message: 'Your child was marked absent today. Please contact the school if this is an error.',
            type: 'sms',
            recipients: ['parents'],
            status: 'sent',
            time: '11:15 AM'
        }
    ],

    activities: [
        {
            id: 'act_1',
            type: 'present',
            description: 'Alice Brown marked present',
            time: '08:15 AM'
        },
        {
            id: 'act_2',
            type: 'absent',
            description: 'Carol Davis marked absent',
            time: '08:20 AM'
        },
        {
            id: 'act_3',
            type: 'notification',
            description: 'Low attendance alert sent for Class 5B',
            time: '10:30 AM'
        },
        {
            id: 'act_4',
            type: 'report',
            description: 'Daily attendance report generated',
            time: '11:00 AM'
        },
        {
            id: 'act_5',
            type: 'system',
            description: 'System backup completed',
            time: '12:00 PM'
        }
    ]
};

// Add some historical data for demo
const today = new Date();
for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    mockData.students.forEach(student => {
        mockData.attendance.push({
            id: `att_hist_${student.id}_${dateStr}`,
            studentId: student.id,
            date: dateStr,
            status: Math.random() > 0.2 ? 'present' : 'absent', // 80% present rate
            markedBy: 'user_1',
            timestamp: date.toISOString()
        });
    });
}