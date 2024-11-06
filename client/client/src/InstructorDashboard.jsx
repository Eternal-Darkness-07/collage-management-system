import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './design.css';

const InstructorDashboard = () => {
    const { instructorId } = useParams();
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);
    const [studentMarks, setStudentMarks] = useState([]);
    const [allInstructors, setAllInstructors] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [allMarks, setAllMarks] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [edit, setEdit] = useState(false);
    const [department_id, setDepartment_id] = useState(null);
    const baseURL = 'http://localhost:5000';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const instructorResponse = await axios.get(`${baseURL}/api/instructors`);
                setAllInstructors(instructorResponse.data);
                const coursesResponse = await axios.get(`${baseURL}/api/courses/admin`);
                setAllCourses(coursesResponse.data.filter(course => course.instructor_id === instructorId));
                
                // const marksResponse = await axios.get(`${baseURL}/api/marks/admin`);
                // setAllMarks(marksResponse.data.filter(mark => relatedCourses.some(course => course.course_id === mark.course_id)));
                
                const departmentResponse = await axios.get(`${baseURL}/api/departments`); 
                setAllDepartments(departmentResponse.data);
                console.log(departmentResponse.data)
                
                setLoading(false);
            } catch (err) {
                setError('Failed to load data.');
                setLoading(false);
            }
        };

        fetchData();
    }, [instructorId]);
    useEffect(() => {
        if (instructorData && allDepartments.length > 0) {
            const department = allDepartments.find(dep => dep.department_name === instructorData.department_name);
            if (department) {
                setDepartment_id(department.department_id);
            }
        }
    }, [instructorData, allDepartments]);

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
        const updatedValues = {
            instructor_id: instructorId,
            first_name: instructorData.first_name,
            last_name: instructorData.last_name,
            email: instructorData.email,
            phone: instructorData.phone,
            hire_date:instructorData.hire_date.split('T')[0],
            department_id: department_id, 
        };
        try {
            await axios.put(`${baseURL}/api/instructors/admin/${instructorId}`, updatedValues,{ withCredentials: true });
            setInstructorData(updatedValues);
        } catch (err) {
            console.error('Error updating instructor:', err);
        }
    };

    const handleChange = (e) => {
        setInstructorData({ ...instructorData, [e.target.name]: e.target.value });
    };

    const handleDepartmentChange = (e) => {
        setInstructorData({ ...instructorData, department_id: e.target.value }); // Update department ID
    };

    const handleMarkChange = async (e, studentId, courseId) => {
        const updatedMarks = studentMarks.map(mark => {
            if (mark.student_id === studentId && mark.course_id === courseId) {
                return { ...mark, obtained_marks: e.target.value };
            }
            return mark;
        });
        setStudentMarks(updatedMarks);

        // Save updated marks to server
        try {
            await axios.put(`${baseURL}/api/marks`, updatedMarks);
        } catch (err) {
            console.error('Error updating marks:', err);
        }
    };

    return (
        <div className="instructor-dashboard-container">
            {instructorData && (
                <>
                    <h1>Welcome, {instructorData.first_name} {instructorData.last_name}!</h1>
                    <table className='admin-table'>
                        <thead>
                            <tr>
                                <th>Instructor ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Hire Date</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{instructorData.instructor_id}</td>
                                <td>{edit ? <input type="text" name="first_name" value={instructorData.first_name} onChange={handleChange} /> : instructorData.first_name}</td>
                                <td>{edit ? <input type="text" name="last_name" value={instructorData.last_name} onChange={handleChange} /> : instructorData.last_name}</td>
                                <td>{instructorData.email}</td>
                                <td>{edit ? <input type="text" name="phone" value={instructorData.phone} onChange={handleChange} /> : instructorData.phone}</td>
                                <td>{instructorData.hire_date.split('T')[0]}</td>
                                <td>
                                    {edit ? (
                                        <select name="department_id" value={instructorData.department_id} onChange={handleDepartmentChange}>
                                            {allDepartments.map(department => (
                                                <option key={department.department_id} value={department.department_id}>
                                                    {department.department_name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        instructorData.department_name
                                    )}
                                </td>
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

                    {/* Courses Section */}
                    <div className="instructor-courses">
                        <h2>Your Courses</h2>
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
                            <p>No courses assigned.</p>
                        )}
                    </div>

                    {/* Student Marks Section */}
                    <div className="student-marks">
                        <h2>Students Marks</h2>
                        {studentMarks.length > 0 ? (
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Course ID</th>
                                        <th>Obtained Marks</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentMarks.map((mark) => (
                                        <tr key={`${mark.student_id}-${mark.course_id}`}>
                                            <td>{mark.student_id}</td>
                                            <td>{mark.course_id}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={mark.obtained_marks}
                                                    onChange={(e) => handleMarkChange(e, mark.student_id, mark.course_id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No marks available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default InstructorDashboard;
