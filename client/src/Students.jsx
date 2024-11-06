import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function Students() {
    const [data, setData] = useState([]);
    const baseURL="http://localhost:5000"
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/students`);
                setData(response.data);
                console.log("Data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };
        fetchStudents();
    }, []);
    return (
        <div className="container">
            <h1>Students</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Department</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(student => (
                        <tr key={student.student_id}>
                            <td>{student.student_id}</td>
                            <td>{student.first_name+" "+student.last_name}</td>
                            <td>{student.department_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
