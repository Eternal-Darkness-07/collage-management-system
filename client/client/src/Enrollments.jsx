import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function Enrollments() {
    const [data, setData] = useState([]);
    const baseURL="http://localhost:5000"
    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/enrollments`);
                setData(response.data); 
                console.log("Data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };
        fetchEnrollments();
    }, []);
    data.sort((a,b)=>a.enrollment_id-b.enrollment_id)
    return (
        <div className="container">
            <h1>Enrollments</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Enrollment Id</th>
                        <th>Student Name</th>
                        <th>Course Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(enrollment => (
                        <tr key={`${enrollment.student_id}-${enrollment.course_id}`}>
                            <td>{enrollment.enrollment_id}</td>
                            <td>{enrollment.student_first_name+" "+enrollment.student_last_name}</td>
                            <td>{enrollment.course_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
