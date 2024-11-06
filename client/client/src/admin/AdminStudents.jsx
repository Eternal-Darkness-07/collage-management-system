import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newStudent, setNewStudent] = useState({
        student_id: '',  // Added student_id to form state
        first_name: '',
        last_name: '',
        dob: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        enrollment_year: '',
        department_id: '',
    });
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/students/admin`);
                setStudents(response.data);
            } catch (err) {
                console.error('Error fetching students:', err);
            }
        };
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/departments`);
                setDepartments(response.data);
            } catch (err) {
                console.error('Error fetching departments:', err);
            }
        };

        fetchDepartments();
        fetchStudents();
    }, []);

    const resetNewStudentForm = () => {
        setNewStudent({
            student_id: '', 
            first_name: '',
            last_name: '',
            dob: '',
            email: '',
            phone: '',
            address: '',
            gender: '',
            enrollment_year: '',
            department_id: '',
        });
        setEditing(false);
        setEditingId(null);
    };

    const onSubmitStudent = async (e) => {
        e.preventDefault();

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/students/admin/${editingId}`, newStudent, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/students/admin/add`, newStudent, { withCredentials: true });
            }
            const updatedStudents = await axios.get(`${baseURL}/api/students`);
            setStudents(updatedStudents.data);
            resetNewStudentForm();
        } catch (err) {
            console.error('Error adding/updating student:', err);
        }
    };

    const handleEdit = (student) => {
        setNewStudent({
            student_id: student.student_id,  
            first_name: student.first_name,
            last_name: student.last_name,
            dob: student.dob,
            email: student.email,
            phone: student.phone,
            address: student.address,
            gender: student.gender,
            enrollment_year: student.enrollment_year,
            department_id: student.department_id,
        });
        setEditing(true);
        setEditingId(student.student_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/students/admin/${id}`, { withCredentials: true });
            const updatedStudents = await axios.get(`${baseURL}/api/students`);
            setStudents(updatedStudents.data);
        } catch (err) {
            console.error('Error deleting student:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prevStudent) => ({ ...prevStudent, [name]: value }));
    };

    return (
        <div className='admin-container'>
            <h1>Students</h1>
            <form className='admin-form' onSubmit={onSubmitStudent}>
                <input
                    type='text'
                    name='student_id'
                    value={newStudent.student_id}
                    onChange={handleChange}
                    placeholder='Student ID'
                    required={!editing}  
                    style={{width:'150px'}}
                />
                <input
                    type='text'
                    name='first_name'
                    value={newStudent.first_name}
                    onChange={handleChange}
                    placeholder='First Name'
                    required
                    style={{width:'150px'}}
                />
                <input
                    type='text'
                    name='last_name'
                    value={newStudent.last_name}
                    onChange={handleChange}
                    placeholder='Last Name'
                    required
                    style={{width:'150px'}}
                />
                <input
                    type='date'
                    name='dob'
                    value={newStudent.dob}
                    onChange={handleChange}
                    placeholder='Date of Birth'
                />
                <input
                    type='email'
                    name='email'
                    value={newStudent.email}
                    onChange={handleChange}
                    placeholder='Email'
                    required
                    style={{width:'150px'}}
                />
                <input
                    type='tel'
                    name='phone'
                    value={newStudent.phone}
                    onChange={handleChange}
                    placeholder='Phone'
                    style={{width:'150px'}}
                />
                <input
                    type='text'
                    name='address'
                    value={newStudent.address}
                    onChange={handleChange}
                    placeholder='Address'
                />
                <select
                    name='gender'
                    value={newStudent.gender}
                    onChange={handleChange}
                >
                    <option value=''>Select Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                </select>
                <input
                    type='number'
                    name='enrollment_year'
                    value={newStudent.enrollment_year}
                    onChange={handleChange}
                    placeholder='Enrollment Year'
                    required
                    style={{width:'100px'}}
                />
                <select
                    name='department_id'
                    value={newStudent.department_id}
                    onChange={handleChange}
                    required
                >
                    <option value=''>Select Department</option>
                    {departments.map(dept => (
                        <option key={dept.department_id} value={dept.department_id}>
                            {dept.department_name}
                        </option>
                    ))}
                </select>
                <button type='submit'>{editing ? 'Update' : 'Add'} Student</button>
            </form>
            <table className='admin-table'>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>DOB</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Gender</th>
                        <th>Enrollment Year</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.student_id}>
                            <td>{student.student_id}</td>
                            <td>{student.first_name}</td>
                            <td>{student.last_name}</td>
                            <td>{student.dob.split('T')[0]}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                            <td>{student.address}</td>
                            <td>{student.gender}</td>
                            <td>{student.enrollment_year}</td>
                            <td>{departments.find(dept => dept.department_id === student.department_id)?.department_name}</td>
                            <td>
                                <button className='edit-btn' onClick={() => handleEdit(student)}>Edit</button>
                                <button className='delete-btn' onClick={() => handleDelete(student.student_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminStudents;
