import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [newCourse, setNewCourse] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [credits, setCredits] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/courses/admin`);
                setCourses(response.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/departments`);
                setDepartments(response.data);
            } catch (err) {
                console.error('Error fetching departments:', err);
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/instructors`);
                setInstructors(response.data);
            } catch (err) {
                console.error('Error fetching instructors:', err);
            }
        };

        fetchCourses();
        fetchDepartments();
        fetchInstructors();
    }, []);

    const resetNewCourseForm = () => {
        setNewCourse('');
        setCourseCode('');
        setCredits('');
        setSelectedDepartment('');
        setSelectedInstructor('');
        setEditing(false);
        setEditingId(null);
    };

    const onSubmitCourse = async (e) => {
        e.preventDefault();
        if (!newCourse || !selectedDepartment || !selectedInstructor || !courseCode || !credits) return;

        const values = {
            course_name: newCourse,
            course_code: courseCode,
            credits: credits,
            department_id: selectedDepartment,
            instructor_id: selectedInstructor
        };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/courses/admin/${editingId}`, values, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/courses/admin/add`, values, { withCredentials: true });
            }
            const updatedCourses = await axios.get(`${baseURL}/api/courses`);
            setCourses(updatedCourses.data);
            resetNewCourseForm();
        } catch (err) {
            console.error('Error adding/updating course:', err);
        }
    };

    const handleEdit = (course) => {
        setNewCourse(course.course_name);
        setCourseCode(course.course_code);
        setCredits(course.credits);
        setSelectedDepartment(course.department_id);
        setSelectedInstructor(course.instructor_id);
        setEditing(true);
        setEditingId(course.course_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/courses/admin/${id}`, { withCredentials: true });
            const updatedCourses = await axios.get(`${baseURL}/api/courses/`);
            setCourses(updatedCourses.data);
        } catch (err) {
            console.error('Error deleting course:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Courses</h1>
            <form className='admin-form' onSubmit={onSubmitCourse}>
                <input
                    type='text'
                    name='course'
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    placeholder='Course Name'
                    required
                />
                <input
                    type='text'
                    name='course_code'
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder='Course Code'
                    required
                />
                <input
                    type='number'
                    name='credits'
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    placeholder='Credits'
                    required
                />
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Department</option>
                    {departments.map(department => (
                        <option key={department.department_id} value={department.department_id}>
                            {department.department_name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Instructor</option>
                    {instructors.map(instructor => (
                        <option key={instructor.instructor_id} value={instructor.instructor_id}>
                            {instructor.first_name + " " + instructor.last_name}
                        </option>
                    ))}
                </select>
                <button type='submit'>{editing ? 'Update' : 'Add'} Course</button>
            </form>

            <table className='admin-table'>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Department</th>
                        <th>Instructor</th>
                        <th>Course Code</th>
                        <th>Credits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.course_id}>
                            <td>{course.course_name}</td>
                            <td>{departments.find(d => d.department_id === course.department_id)?.department_name}</td>
                            <td>
                                {instructors.find(i => i.instructor_id === course.instructor_id)?.first_name + " " +
                                instructors.find(i => i.instructor_id === course.instructor_id)?.last_name}
                            </td>
                            <td>{course.course_code}</td>
                            <td>{course.credits}</td>

                            <td className='admin-btn-group'>
                                <button className="edit-btn" onClick={() => handleEdit(course)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(course.course_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCourses;
