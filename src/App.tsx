import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import { ProtectedRoute } from './components/protected-route';
import AdminLayout from './layouts/admin-layout';
import TeacherLayout from './layouts/teacher-layout';
import StudentLayout from './layouts/student-layout';
import AdminDashboard from './pages/admin/dashboard';
import AdminTeachers from './pages/admin/teachers';
import AdminStudents from './pages/admin/students';
import AdminSchedules from './pages/admin/schedules';
import AdminAttendance from './pages/admin/attendance';
import AdminMessages from './pages/admin/messages';
import AdminMaterials from './pages/admin/materials';
import AdminSettings from './pages/admin/settings';

import TeacherDashboard from './pages/teacher/dashboard';
import TeacherSchedule from './pages/teacher/schedule';
import TeacherGrades from './pages/teacher/grades';
import TeacherStudents from './pages/teacher/students';
import TeacherAttendance from './pages/teacher/attendance';
import TeacherMaterials from './pages/teacher/materials';
import TeacherMessages from './pages/teacher/messages';

import StudentDashboard from './pages/student/dashboard';
import StudentProfile from './pages/student/profile';
import StudentSchedule from './pages/student/schedule';
import StudentGrades from './pages/student/grades';
import StudentTeachers from './pages/student/teachers';
import StudentAttendance from './pages/student/attendance';
import StudentMaterials from './pages/student/materials';
import StudentMessages from './pages/student/messages';

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />

        {/* Admin Routes */}
        <ProtectedRoute path="/admin" roles={['admin']}>
          <AdminLayout>
            <Switch>
              <Route exact path="/admin" component={AdminDashboard} />
              <Route path="/admin/teachers" component={AdminTeachers} />
              <Route path="/admin/students" component={AdminStudents} />
              <Route path="/admin/schedules" component={AdminSchedules} />
              <Route path="/admin/attendance" component={AdminAttendance} />
              <Route path="/admin/messages" component={AdminMessages} />
              <Route path="/admin/materials" component={AdminMaterials} />
              <Route path="/admin/settings" component={AdminSettings} />
              <Redirect to="/admin" />
            </Switch>
          </AdminLayout>
        </ProtectedRoute>

        {/* Teacher Routes */}
        <ProtectedRoute path="/teacher" roles={['teacher']}>
          <TeacherLayout>
            <Switch>
              <Route exact path="/teacher" component={TeacherDashboard} />
              <Route path="/teacher/schedule" component={TeacherSchedule} />
              <Route path="/teacher/grades" component={TeacherGrades} />
              <Route path="/teacher/students" component={TeacherStudents} />
              <Route path="/teacher/attendance" component={TeacherAttendance} />
              <Route path="/teacher/materials" component={TeacherMaterials} />
              <Route path="/teacher/messages" component={TeacherMessages} />
              <Redirect to="/teacher" />
            </Switch>
          </TeacherLayout>
        </ProtectedRoute>

        {/* Student Routes */}
        <ProtectedRoute path="/student" roles={['student']}>
          <StudentLayout>
            <Switch>
              <Route exact path="/student" component={StudentDashboard} />
              <Route path="/student/profile" component={StudentProfile} />
              <Route path="/student/schedule" component={StudentSchedule} />
              <Route path="/student/grades" component={StudentGrades} />
              <Route path="/student/teachers" component={StudentTeachers} />
              <Route path="/student/attendance" component={StudentAttendance} />
              <Route path="/student/materials" component={StudentMaterials} />
              <Route path="/student/messages" component={StudentMessages} />
              <Redirect to="/student" />
            </Switch>
          </StudentLayout>
        </ProtectedRoute>

        <Redirect to="/" />
      </Switch>
    </AuthProvider>
  );
}

export default App;