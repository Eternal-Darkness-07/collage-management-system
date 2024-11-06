import './App.css'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Instructors from './Instructors'
import Departments from './Departments'
import Courses from './Courses'
import Students from './Students'
import Enrollments from './Enrollments'
import HODs from './Hod';
import Exams from './Exams';
import Marks from './Marks';
import Performance from './Performance';
import Header from './Header';
import AdminDepartments from './admin/AdminDepartments';
import AdminCourses from './admin/AdminCourses';
import AdminInstructors from './admin/AdminInstructors';
import AdminStudents from './admin/AdminStudents';
import AdminEnrollments from './admin/AdminEnrollments';
import AdminHODs from './admin/AdminHods';
import AdminHeader from './admin/AdminHeader';
import AdminExams from './admin/AdminExams';
import AdminMarks from './admin/AdminMarks';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import Login from './Login';

function HeaderSwitcher() {
  const location = useLocation();
  const excludedPaths = ['/login', '/student/dashboard', '/instructor/dashboard'];
  const isExcludedPath = excludedPaths.some(path => location.pathname.startsWith(path));
  if (location.pathname.startsWith('/admin/')) {
    return <AdminHeader />;
  }
  return !isExcludedPath ? <Header /> : null;
}
function App() {
  return (
    <div className='main'>
      <Router>
        <HeaderSwitcher />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/students" element={<Students />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/hods" element={<HODs />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/instructors" element={<AdminInstructors />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />
          <Route path="/admin/hods" element={<AdminHODs />} />
          <Route path="/admin/exams" element={<AdminExams />} />
          <Route path="/admin/marks" element={<AdminMarks />} />
          <Route path="/student/dashboard/:studentId" element={<StudentDashboard />} />
          <Route path="/instructor/dashboard/:instructorId" element={<InstructorDashboard />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
