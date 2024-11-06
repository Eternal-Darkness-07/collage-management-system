import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Instructor() {
    const [data, setData] = useState([]);
    const baseURL="http://localhost:5000"
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/instructors`);
                setData(response.data);
                console.log("Data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };
        fetchInstructors();
    }, []);
    
    return (
        <div className="container">
            <h1>Instructors</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Instructor ID</th>
                        <th>Instructor Name</th>
                        <th>Department Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(instructor => (
                        <tr key={instructor.instructor_id}>
                            <td>{instructor.instructor_id}</td>
                            <td>{instructor.first_name+" "+instructor.last_name}</td>
                            <td>{instructor.department_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Instructor;
