import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/common/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/common/ProfilePage';
import FeedPage from './pages/common/FeedPage';
import ChatPage from './pages/common/ChatPage';
import EventPage from './pages/common/EventPage';
import SearchPage from './pages/common/SearchPage';
import NotificationPage from './pages/common/NotificationPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import StudentGrades from './pages/student/GradesPage';
import StudentAttendance from './pages/student/AttendancePage';
import TimetablePage from './pages/student/TimetablePage';
import StudentMaterials from './pages/student/MaterialsPage';
import StudentAssignments from './pages/student/AssignmentsPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherSchedulePage from './pages/teacher/TeacherSchedulePage';
import CoursesPage from './pages/teacher/CoursesPage';
import AttendancePage from './pages/teacher/AttendancePage';
import GradesPage from './pages/teacher/GradesPage';
import AssignmentsPage from './pages/teacher/AssignmentsPage';
import MaterialsPage from './pages/teacher/MaterialsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TeachersPage from './pages/admin/TeachersPage';
import StudentsPage from './pages/admin/StudentsPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import SettingsPage from './pages/admin/SettingsPage';
import LogsPage from './pages/admin/LogsPage';

import StudentLayout from './layouts/StudentLayout.jsx';
import TeacherLayout from './layouts/TeacherLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Common Routes */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventPage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentLayout /></ProtectedRoute>}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<MyCourses />} />
              <Route path="/student/grades" element={<StudentGrades />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/timetable" element={<TimetablePage />} />
              <Route path="/student/materials" element={<StudentMaterials />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/messages" element={<ChatPage />} />
              <Route path="/student/profile" element={<ProfilePage />} />
              <Route path="/student/notifications" element={<NotificationPage />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherLayout /></ProtectedRoute>}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/schedule" element={<TeacherSchedulePage />} />
              <Route path="/teacher/courses" element={<CoursesPage />} />
              <Route path="/teacher/courses/:id" element={<CoursesPage />} />
              <Route path="/teacher/attendance" element={<AttendancePage />} />
              <Route path="/teacher/attendance/:courseId" element={<AttendancePage />} />
              <Route path="/teacher/grades" element={<GradesPage />} />
              <Route path="/teacher/grades/:courseId" element={<GradesPage />} />
              <Route path="/teacher/assignments" element={<AssignmentsPage />} />
              <Route path="/teacher/assignments/:courseId" element={<AssignmentsPage />} />
              <Route path="/teacher/materials" element={<MaterialsPage />} />
              <Route path="/teacher/materials/:courseId" element={<MaterialsPage />} />
              <Route path="/teacher/messages" element={<ChatPage />} />
              <Route path="/teacher/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/teachers" element={<TeachersPage />} />
              <Route path="/admin/students" element={<StudentsPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/logs" element={<LogsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
