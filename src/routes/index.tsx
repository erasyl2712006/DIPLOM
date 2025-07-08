// Add proper route definitions for teacher pages
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ProtectedRoute } from '../components/protected-route';

// Layouts
import AdminLayout from '../layouts/admin-layout';
import TeacherLayout from '../layouts/teacher-layout';
import StudentLayout from '../layouts/student-layout';

// Pages
import HomePage from '../pages/home';
import LoginPage from '../pages/login';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/dashboard';
import TeacherSchedule from '../pages/teacher/schedule';
import TeacherGrades from '../pages/teacher/grades';
import TeacherStudents from '../pages/teacher/students';
import TeacherAttendance from '../pages/teacher/attendance';
import TeacherMaterials from '../pages/teacher/materials';
import TeacherMessages from '../pages/teacher/messages';

// Admin Pages
import AdminDashboard from '../pages/admin/dashboard';
import AdminStudents from '../pages/admin/students';
import AdminTeachers from '../pages/admin/teachers';
import AdminSchedules from '../pages/admin/schedules';
import AdminAttendance from '../pages/admin/attendance';
import AdminMaterials from '../pages/admin/materials';
import AdminMessages from '../pages/admin/messages';
import AdminSettings from '../pages/admin/settings';

// Student Pages
import StudentDashboard from '../pages/student/dashboard';
import StudentProfile from '../pages/student/profile';
import StudentSchedule from '../pages/student/schedule';
import StudentGrades from '../pages/student/grades';
import StudentTeachers from '../pages/student/teachers';
import StudentAttendance from '../pages/student/attendance';
import StudentMaterials from '../pages/student/materials';
import StudentMessages from '../pages/student/messages';

// Public pages
import AboutPage from '../pages/about';
import NewsPage from '../pages/news';
import ContactPage from '../pages/contact';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* Admin Routes */}
      <ProtectedRoute
        path="/admin"
        role="admin"
        component={() => (
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
            </Switch>
          </AdminLayout>
        )}
      />
      
      {/* Student Routes */}
      <ProtectedRoute
        path="/student"
        role="student"
        component={() => (
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
            </Switch>
          </StudentLayout>
        )}
      />
      
      {/* Teacher Routes */}
      <ProtectedRoute
        path="/teacher"
        role="teacher"
        component={() => (
          <TeacherLayout>
            <Switch>
              <Route exact path="/teacher" render={() => <Redirect to="/teacher/dashboard" />} />
              <Route path="/teacher/dashboard" component={TeacherDashboard} />
              <Route path="/teacher/schedule" component={TeacherSchedule} />
              <Route path="/teacher/grades" component={TeacherGrades} />
              <Route path="/teacher/students" component={TeacherStudents} />
              <Route path="/teacher/attendance" component={TeacherAttendance} />
              <Route path="/teacher/materials" component={TeacherMaterials} />
              <Route path="/teacher/messages" component={TeacherMessages} />
            </Switch>
          </TeacherLayout>
        )}
      />
      
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default Routes;