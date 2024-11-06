import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css'; 

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetNewDepartmentForm = () => {
        setNewDepartment('');
        setEditing(false);
        setEditingId(null);
    };
    departments.sort((a,b)=>a.department_id-b.department_id);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/departments`);
                setDepartments(response.data);
            } catch (err) {
                console.error('Error fetching departments:', err);
            }
        };
        fetchDepartments();
    }, []);

    const onSubmitDepartment = async (e) => {
        e.preventDefault();
        if (!newDepartment) return;
        const values = { department_name: newDepartment };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/departments/admin/${editingId}`, values, { withCredentials: true });
                console.log('Department updated');
            } else {
                await axios.post(`${baseURL}/api/departments/admin/add`, values, { withCredentials: true });
                console.log('New department added');
            }

            const updatedDepartments = await axios.get(`${baseURL}/api/departments`);
            setDepartments(updatedDepartments.data);
            resetNewDepartmentForm();
        } catch (err) {
            console.error('Error adding/updating department:', err);
        }
    };

    const handleEdit = (department) => {
        setNewDepartment(department.department_name);
        setEditing(true);
        setEditingId(department.department_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/departments/admin/${id}`, { withCredentials: true });
            const updatedDepartments = await axios.get(`${baseURL}/api/departments`);
            setDepartments(updatedDepartments.data);
        } catch (err) {
            console.error('Error deleting department:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Departments</h1>
            <form className='admin-form' onSubmit={onSubmitDepartment}>
                <input
                    type='text'
                    name='name'
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder='Department Name'
                    required
                />
                <button type='submit'>{editing ? 'Update' : 'Add'} Department</button>
            </form>
            
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Department ID</th>
                        <th>Department Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map(department => (
                        <tr key={department.department_id}>
                            <td>{department.department_id}</td>
                            <td>{department.department_name}</td>
                            <td>
                                <button onClick={() => handleEdit(department)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(department.department_id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDepartments;
