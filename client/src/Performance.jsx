import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './design.css';

export default function Performance() {
    const [data, setData] = useState([]);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/performance`);
                setData(response.data);
                console.log("Data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };
        fetchPerformance();
    }, []);

    data.sort((a, b) => a.performance_id - b.performance_id);

    return (
        <div className="container">
            <h1>Performance</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Performance ID</th>
                        <th>Student ID</th>
                        <th>SGPA</th>
                        <th>Remarks</th>
                        <th>Semester</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(performance => (
                        <tr key={performance.performance_id}>
                            <td>{performance.performance_id}</td>
                            <td>{performance.student_first_name} {performance.student_last_name}</td>
                            <td>{performance.sgpa}</td>
                            <td>{performance.remarks}</td>
                            <td>{performance.semester}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
