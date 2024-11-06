import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css';

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetEnrollmentForm = () => {
        setSelectedStudent('');
        setSelectedCourse('');
        setEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrollmentsResponse, studentsResponse, coursesResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/enrollments/admin`),
                    axios.get(`${baseURL}/api/students`),
                    axios.get(`${baseURL}/api/courses`)
                ]);
                setEnrollments(enrollmentsResponse.data);
                setStudents(studentsResponse.data);
                setCourses(coursesResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    const onSubmitEnrollment = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedCourse) return;

        const enrollmentData = {
            student_id: selectedStudent,
            course_id: selectedCourse
        };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/enrollments/admin/${editingId}`, enrollmentData, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/enrollments/admin/add`, enrollmentData, { withCredentials: true });
            }
            const updatedEnrollments = await axios.get(`${baseURL}/api/enrollments`);
            setEnrollments(updatedEnrollments.data);
            resetEnrollmentForm();
        } catch (err) {
            console.error('Error submitting enrollment:', err);
        }
    };

    const handleEdit = (enrollment) => {
        setSelectedStudent(enrollment.student_id);
        setSelectedCourse(enrollment.course_id);
        setEditing(true);
        setEditingId(enrollment.enrollment_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/enrollments/admin/${id}`, { withCredentials: true });
            const updatedEnrollments = await axios.get(`${baseURL}/api/enrollments`);
            setEnrollments(updatedEnrollments.data);
        } catch (err) {
            console.error('Error deleting enrollment:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Enrollments</h1>
            <form className='admin-form' onSubmit={onSubmitEnrollment}>
                <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Student</option>
                    {students.map((student) => (
                        <option key={student.student_id} value={student.student_id}>
                            {student.first_name} {student.last_name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Course</option>
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>

                <button type='submit'>{editing ? 'Update Enrollment' : 'Add Enrollment'}</button>
            </form>
            <table className='admin-table'>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Course Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {enrollments.map((enrollment, index) => {
                        const student = students.find(s => s.student_id === enrollment.student_id);
                        const course = courses.find(c => c.course_id === enrollment.course_id)?.course_name;

                        return (
                            <tr key={index}>
                                <td>{student ? `${student.first_name} ${student.last_name}` : 'N/A'}</td>
                                <td>{course || 'N/A'}</td>
                                <td className='admin-btn-group'>
                                    <button className="edit-btn" onClick={() => handleEdit(enrollment)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(enrollment.enrollment_id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminEnrollments;
