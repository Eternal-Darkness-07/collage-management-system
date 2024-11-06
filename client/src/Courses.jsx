import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './design.css';
export default function Courses() {
    const [data, setData] = useState([]);
    const baseURL="http://localhost:5000"
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/courses`);
                setData(response.data);
                console.log("Data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };
        fetchCourses();
    }, []);
    data.sort((a,b)=>a.course_id-b.course_id)
    return (
        <div className="container">
            <h1>Courses</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Course credits</th>
                        <th>Department Name</th>
                        <th>Instructor Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(course => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td>{course.course_name}</td>
                            <td>{course.credits}</td>
                            <td>{course.department_name}</td>
                            <td>{course.instructor_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
