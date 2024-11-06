import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css';

const AdminInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [instructorId, setInstructorId] = useState(''); 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [hireDate, setHireDate] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetInstructorForm = () => {
        setInstructorId(''); 
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setHireDate('');
        setDepartmentId('');
        setEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [instructorsResponse, departmentsResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/instructors/admin`),
                    axios.get(`${baseURL}/api/departments`) 
                ]);
                setInstructors(instructorsResponse.data);
                setDepartments(departmentsResponse.data); 
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const onSubmitInstructor = async (e) => {
        e.preventDefault();
        if (!instructorId || !firstName || !lastName || !email || !departmentId) return; 

        const instructorData = {
            instructor_id: instructorId, 
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            hire_date: hireDate,
            department_id: departmentId
        };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/instructors/admin/${editingId}`, instructorData, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/instructors/admin/add`, instructorData, { withCredentials: true });
            }
            const updatedInstructors = await axios.get(`${baseURL}/api/instructors/admin`);
            setInstructors(updatedInstructors.data);
            resetInstructorForm();
        } catch (err) {
            console.error('Error submitting instructor:', err);
        }
    };

    const handleEdit = (instructor) => {
        setInstructorId(instructor.instructor_id); 
        setFirstName(instructor.first_name);
        setLastName(instructor.last_name);
        setEmail(instructor.email);
        setPhone(instructor.phone);
        setHireDate(instructor.hire_date);
        setDepartmentId(instructor.department_id);
        setEditing(true);
        setEditingId(instructor.instructor_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/instructors/admin/${id}`, { withCredentials: true });
            const updatedInstructors = await axios.get(`${baseURL}/api/instructors/admin`);
            setInstructors(updatedInstructors.data);
        } catch (err) {
            console.error('Error deleting instructor:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Instructors</h1>
            <form className='admin-form' onSubmit={onSubmitInstructor}>
                <input
                    type="text"
                    value={instructorId}
                    onChange={(e) => setInstructorId(e.target.value)} 
                    placeholder="Instructor ID"
                    required
                />
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                />
                <input
                    type="date"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                />
                <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Department</option>
                    {departments.map((department) => (
                        <option key={department.department_id} value={department.department_id}>
                            {department.department_name}
                        </option>
                    ))}
                </select>

                <button type='submit'>{editing ? 'Update Instructor' : 'Add Instructor'}</button>
            </form>
            <table className='admin-table'>
                <thead>
                    <tr>
                        <th>ID</th>
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
                    {instructors.map((instructor) => {
                        const department = departments.find(d => d.department_id === instructor.department_id)?.department_name;

                        return (
                            <tr key={instructor.instructor_id}>
                                <td>{instructor.instructor_id}</td> 
                                <td>{instructor.first_name}</td>
                                <td>{instructor.last_name}</td>
                                <td>{instructor.email}</td>
                                <td>{instructor.phone || 'N/A'}</td>
                                <td>{instructor.hire_date.split("T")[0] || 'N/A'}</td>
                                <td>{department}</td>
                                <td className='admin-btn-group'>
                                    <button className="edit-btn" onClick={() => handleEdit(instructor)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(instructor.instructor_id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminInstructors;
