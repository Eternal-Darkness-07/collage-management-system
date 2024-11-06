import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './design.css';
export default function Departments() {
    const [data, setData] = useState([]);
    const baseURL="http://localhost:5000"
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/departments`);
                setData(response.data);
                console.log("Data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };
        fetchDepartments();
    }, []);
    data.sort((a,b)=>a.department_id-b.department_id)
    return (
        <div className="container">
            <h1>Departments</h1>
            <table className="table ">
                <thead>
                    <tr>
                        <th>Department ID</th>
                        <th>Department Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(department => (
                        <tr key={department.department_id}>
                            <td>{department.department_id}</td>
                            <td>{department.department_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
