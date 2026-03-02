import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import TeacherRoute from './TeacherRoute';
import StudentRoute from './StudentRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import MyCourses from '../pages/teacher/MyCourses';
import CourseDetails from '../pages/teacher/CourseDetails';
import Attendance from '../pages/teacher/Attendance';
import Grades from '../pages/teacher/Grades';
// ... other imports

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentCourses from '../pages/student/MyCourses';
import MyGrades from '../pages/student/MyGrades';
import MyAttendance from '../pages/student/MyAttendance';
// ... other imports

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Teacher Routes */}
                <Route path="/teacher" element={
                    <PrivateRoute allowedRoles={['teacher']}>
                        <TeacherLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<TeacherDashboard />} />
                    <Route path="courses" element={<MyCourses />} />
                    <Route path="courses/:id" element={<CourseDetails />} />
                    <Route path="courses/:id/attendance" element={<Attendance />} />
                    <Route path="courses/:id/grades" element={<Grades />} />
                    <Route path="courses/:id/assignments" element={<Assignments />} />
                    <Route path="courses/:id/materials" element={<Materials />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="messages" element={<Messages />} />
                </Route>
                
                {/* Student Routes */}
                <Route path="/student" element={
                    <PrivateRoute allowedRoles={['student']}>
                        <StudentLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<Navigate to="dashboard" />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="courses" element={<StudentCourses />} />
                    <Route path="courses/:id" element={<CourseView />} />
                    <Route path="grades" element={<MyGrades />} />
                    <Route path="attendance" element={<MyAttendance />} />
                    <Route path="timetable" element={<Timetable />} />
                    <Route path="materials" element={<StudyMaterials />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="notifications" element={<Notifications />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;