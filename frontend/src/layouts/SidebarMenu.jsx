// Teacher Menu Items
export const teacherMenuItems = [
    {
        title: 'Dashboard',
        path: '/teacher/dashboard',
        icon: 'dashboard',
        exact: true
    },
    {
        title: 'My Courses',
        path: '/teacher/courses',
        icon: 'book',
        submenu: [
            { title: 'All Courses', path: '/teacher/courses' },
            { title: 'Active Courses', path: '/teacher/courses?status=active' },
            { title: 'Completed', path: '/teacher/courses?status=completed' }
        ]
    },
    {
        title: 'Attendance',
        path: '/teacher/attendance',
        icon: 'check-circle'
    },
    {
        title: 'Grades',
        path: '/teacher/grades',
        icon: 'star'
    },
    {
        title: 'Assignments',
        path: '/teacher/assignments',
        icon: 'clipboard'
    },
    {
        title: 'Materials',
        path: '/teacher/materials',
        icon: 'folder'
    },
    {
        title: 'Schedule',
        path: '/teacher/schedule',
        icon: 'calendar'
    },
    {
        title: 'Messages',
        path: '/teacher/messages',
        icon: 'message'
    },
    {
        title: 'Profile',
        path: '/teacher/profile',
        icon: 'user'
    }
];

// Student Menu Items
export const studentMenuItems = [
    {
        title: 'Dashboard',
        path: '/student/dashboard',
        icon: 'dashboard',
        exact: true
    },
    {
        title: 'My Courses',
        path: '/student/courses',
        icon: 'book'
    },
    {
        title: 'My Grades',
        path: '/student/grades',
        icon: 'star'
    },
    {
        title: 'Timetable',
        path: '/student/timetable',
        icon: 'calendar'
    },
    {
        title: 'Study Materials',
        path: '/student/materials',
        icon: 'folder'
    },
    {
        title: 'Assignments',
        path: '/student/assignments',
        icon: 'clipboard'
    },
    {
        title: 'Notifications',
        path: '/student/notifications',
        icon: 'bell'
    },
    {
        title: 'Messages',
        path: '/student/messages',
        icon: 'message'
    },
    {
        title: 'Profile',
        path: '/student/profile',
        icon: 'user'
    }
];
// Admin Menu Items
export const adminMenuItems = [
    {
        title: 'Dashboard',
        path: '/admin/dashboard',
        icon: 'dashboard',
        exact: true
    },
    {
        title: 'Teachers',
        path: '/admin/teachers',
        icon: 'user-check'
    },
    {
        title: 'Students',
        path: '/admin/students',
        icon: 'users'
    },
    {
        title: 'All Courses',
        path: '/admin/courses',
        icon: 'book-open'
    },
    {
        title: 'Settings',
        path: '/admin/settings',
        icon: 'settings'
    },
    {
        title: 'System Logs',
        path: '/admin/logs',
        icon: 'activity'
    }
];
