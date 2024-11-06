import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './design.css'; 

export default function HODs() {
    const [data, setData] = useState([]);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchHODs = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/hods`);
                setData(response.data);
                console.log("HODs data fetched successfully");
            } catch (err) {
                console.log("Error fetching HODs data:", err);
            }
        };
        fetchHODs();
    }, []);
    data.sort((a,b)=>a.hod_id-b.hod_id)
    return (
        <div className="container">
            <h1>Heads of Departments</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>HOD ID</th>
                        <th>Department Name</th>
                        <th>Instructor Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(hod => (
                        <tr key={hod.hod_id}>
                            <td>{hod.hod_id}</td>
                            <td>{hod.department_name}</td>
                            <td>{hod.hod_first_name+" "+hod.hod_last_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
