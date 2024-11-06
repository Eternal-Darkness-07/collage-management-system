import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './design.css';

export default function Marks() {
    const [data, setData] = useState([]);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/marks`);
                setData(response.data);
                console.log("Data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };
        fetchMarks();
    }, []);

    data.sort((a, b) => a.mark_id - b.mark_id);
    return (
        <div className="container">
            <h1>Marks</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Mark ID</th>
                        <th>Student ID</th>
                        <th>Course Name</th>
                        <th>Obtained Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(mark => (
                        <tr key={mark.mark_id}>
                            <td>{mark.mark_id}</td>
                            <td>{mark.student_first_name} {mark.student_last_name}</td>
                            <td>{mark.course_name}</td>
                            <td>{mark.obtained_marks}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
