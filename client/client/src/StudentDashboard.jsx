import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './design.css';

const StudentDashboard = () => {
    const { studentId } = useParams();
    const [studentData, setStudentData] = useState(null);
    const [courses, setCourses] = useState([]);
    const [marks, setMarks] = useState([]);
    const [performance, setPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [department_id, setDepartment_id] = useState(null);
    const baseURL = 'http://localhost:5000';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, coursesResponse, enrollmentResponse, marksResponse, performanceResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/students`),
                    axios.get(`${baseURL}/api/courses`),
                    axios.get(`${baseURL}/api/enrollments/admin`),
                    axios.get(`${baseURL}/api/marks/admin`),
                    axios.get(`${baseURL}/api/performance/admin`)
                ]);

                const student = studentsResponse.data.find(student => student.student_id === studentId);
                if (student) {
                    setStudentData(student);
                    const enrolledCourses = enrollmentResponse.data.filter(enrollment => enrollment.student_id === studentId);
                    const courseIds = enrolledCourses.map(enrollment => enrollment.course_id);
                    const enrolledCourseData = coursesResponse.data.filter(course => courseIds.includes(course.course_id));
                    setCourses(enrolledCourseData);

                    const studentMarks = marksResponse.data.filter(mark => mark.student_id === studentId);
                    setMarks(studentMarks);

                    const studentPerformance = performanceResponse.data.filter(perf => perf.student_id === studentId);
                    setPerformance(studentPerformance);
                } else {
                    setError('Student not found.');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load data.');
                setLoading(false);
            }
        };
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/departments`);
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
        fetchData();
    }, [studentId]);
    useEffect(() => {
        if (studentData && departments.length > 0) {
            const department = departments.find(dep => dep.department_name === studentData.department_name);
            if (department) {
                setDepartment_id(department.department_id);
            }
        }
    }, [studentData, departments]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleEdit = () => {
        setEdit(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setEdit(false);
        const Values={
            "student_id": studentId,
            "first_name": studentData.first_name,
            "last_name": studentData.last_name,
            "department_id":department_id,
            "email": studentData.email,
            "phone": studentData.phone,
            "dob": studentData.dob.split('T')[0],
            "email": studentData.email,
            "address": studentData.address,
            "gender": studentData.gender,
            "enrollment_year": studentData.enrollment_year,
            
        }
        try {
            await axios.put(`${baseURL}/api/students/admin/${studentId}`, Values, { withCredentials: true });
            const updatedStudents = await axios.get(`${baseURL}/api/students`);
            const updatedStudent = updatedStudents.data.find(student => student.student_id === studentId);
            setStudentData(updatedStudent);
        } catch (err) {
            console.error('Error adding/updating student:', err);
        }
    };

    const handleChange = (e) => {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
    };
    return (
        <div className="student-dashboard-container">
            {studentData && (
                <>
                    <h1>Welcome, {studentData.first_name} {studentData.last_name}!</h1>
                    <table className='admin-table'>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>DOB</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Gender</th>
                                <th>Enrollment Year</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{studentId}</td>
                                <td>{edit ? <input style={{ width: '120px' }} type="text" name="first_name" value={studentData.first_name} onChange={handleChange} /> : studentData.first_name}</td>
                                <td>{edit ? <input style={{ width: '120px' }} type="text" name="last_name" value={studentData.last_name} onChange={handleChange} /> : studentData.last_name}</td>
                                <td>{edit ? <input style={{ width: '120px' }} type="date" name="dob" value={studentData.dob?.split('T')[0]} onChange={handleChange} /> : studentData.dob?.split('T')[0]}</td>
                                <td>{studentData.email}</td>
                                <td>{edit ? <input style={{ width: '120px' }} type="text" name="phone" value={studentData.phone} onChange={handleChange} /> : studentData.phone}</td>
                                <td>{edit ? <input style={{ width: '120px' }} type="text" name="address" value={studentData.address} onChange={handleChange} /> : studentData.address}</td>
                                <td>{edit ? <input style={{ width: '120px' }} type="text" name="gender" value={studentData.gender} onChange={handleChange} /> : studentData.gender}</td>
                                <td>{studentData.enrollment_year}</td>
                                <td>{studentData.department_name}</td>
                                <td>
                                    {edit ? (
                                        <button className="save-btn" onClick={handleSave}>Save</button>
                                    ) : (
                                        <button className='edit-btn' onClick={handleEdit}>Edit</button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Enrolled Courses Section */}
                    <div className="enrolled-courses">
                        <h2>Your Enrolled Courses</h2>
                        {courses.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.course_id}>
                                            <td>{course.course_id}</td>
                                            <td>{course.course_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No courses enrolled.</p>
                        )}
                    </div>

                    <div className="student-marks">
                        <h2>Your Marks</h2>
                        {marks.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Exam ID</th>
                                        <th>Obtained Marks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marks.map((mark) => (
                                        <tr key={mark.exam_id}>
                                            <td>{mark.exam_id}</td>
                                            <td>{mark.obtained_marks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No marks available.</p>
                        )}
                    </div>

                    <div className="student-performance">
                        <h2>Your Performance</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>SGPA</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performance.map((p) => (
                                    <tr key={p.performance_id}>
                                        <td>{p.sgpa}</td>
                                        <td>{p.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentDashboard;
