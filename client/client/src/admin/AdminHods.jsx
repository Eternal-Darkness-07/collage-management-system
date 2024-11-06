import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css';

const AdminHOD = () => {
    const [hods, setHods] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [selectedHOD, setSelectedHOD] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [hodEmail, setHodEmail] = useState('');
    const [hodPhone, setHodPhone] = useState('');
    const [hodHireDate, setHodHireDate] = useState('');
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hodsRes, departmentsRes, instructorsRes] = await Promise.all([
                    axios.get(`${baseURL}/api/hods/admin`),
                    axios.get(`${baseURL}/api/departments`),
                    axios.get(`${baseURL}/api/instructors`),
                ]);
                setHods(hodsRes.data);
                setDepartments(departmentsRes.data);
                setInstructors(instructorsRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const resetNewHODForm = () => {
        setSelectedHOD('');
        setSelectedDepartment('');
        setHodEmail('');
        setHodPhone('');
        setHodHireDate('');
        setEditing(false);
        setEditingId(null);
    };

    const onSubmitHOD = async (e) => {
        e.preventDefault();
        if (!selectedDepartment || !hodEmail || !hodPhone || !hodHireDate) {
            return;
        }

        const selectedInstructor = instructors.find(instructor => `${instructor.first_name} ${instructor.last_name}` === selectedHOD);
        const hodNameParts = selectedHOD.split(' ');
        const firstName = hodNameParts[0];
        const lastName = hodNameParts.slice(1).join(' ');

        const values = {
            hod_first_name: firstName,
            hod_last_name: lastName,
            department_id: selectedDepartment,
            email: hodEmail,
            phone: hodPhone,
            hire_date: hodHireDate,
        };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/hods/admin/${editingId}`, values, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/hods/admin/add`, values, { withCredentials: true });
            }
            const updatedHods = await axios.get(`${baseURL}/api/hods`);
            setHods(updatedHods.data);
            resetNewHODForm();
        } catch (err) {
            console.error('Error adding/updating HOD:', err);
        }
    };

    const handleEdit = (hod) => {
        setSelectedHOD(hod.hod_name); // Set the HOD name for editing
        setSelectedDepartment(hod.department_id);
        setHodEmail(hod.hod_email);
        setHodPhone(hod.phone_number);
        setHodHireDate(hod.hire_date.split('T')[0]);
        setEditing(true);
        setEditingId(hod.hod_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/hods/admin/${id}`, { withCredentials: true });
            const updatedHods = await axios.get(`${baseURL}/api/hods`);
            setHods(updatedHods.data);
        } catch (err) {
            console.error('Error deleting HOD:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Head Of Department</h1>
            <form className='admin-form' onSubmit={onSubmitHOD}>
                <select
                    value={selectedHOD}
                    onChange={(e) => setSelectedHOD(e.target.value)}
                    required
                >
                    <option value='' disabled>Select HOD</option>
                    {instructors.map(instructor => (
                        <option key={instructor.instructor_id} value={`${instructor.first_name} ${instructor.last_name}`}>
                            {instructor.first_name} {instructor.last_name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    required
                >
                    <option value='' disabled>Select Department</option>
                    {departments.map(department => (
                        <option key={department.department_id} value={department.department_id}>
                            {department.department_name}
                        </option>
                    ))}
                </select>
                <input
                    type="email"
                    value={hodEmail}
                    onChange={(e) => setHodEmail(e.target.value)}
                    placeholder="HOD Email"
                    required
                />
                <input
                    type="text"
                    value={hodPhone}
                    onChange={(e) => setHodPhone(e.target.value)}
                    placeholder="Phone Number"
                    required
                />
                <input
                    type="date"
                    value={hodHireDate}
                    onChange={(e) => setHodHireDate(e.target.value)}
                    placeholder="Hire Date"
                    required
                />
                <button type='submit'>{editing ? 'Update' : 'Add'} HOD</button>
            </form>

            <table className='admin-table'>
                <thead>
                    <tr>
                        <th>HOD Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Hire Date</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {hods.map((hod) => (
                        <tr key={hod.hod_id}>
                            <td>{hod.first_name} {hod.last_name}</td>
                            <td>{hod.email}</td>
                            <td>{hod.phone}</td>
                            <td>{hod.hire_date.split('T')[0]}</td>
                            <td>{departments.find(d => d.department_id === hod.department_id)?.department_name}</td>
                            <td>
                                <button className='edit-btn' onClick={() => handleEdit(hod)}>Edit</button>
                                <button className='delete-btn' onClick={() => handleDelete(hod.hod_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminHOD;
