import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css'; 

const AdminMarks = () => {
    const [marks, setMarks] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [examId, setExamId] = useState('');
    const [obtainedMarks, setObtainedMarks] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetNewMarkForm = () => {
        setStudentId('');
        setExamId('');
        setObtainedMarks('');
        setEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/marks`);
                setMarks(response.data);
            } catch (err) {
                console.error('Error fetching marks:', err);
            }
        };
        fetchMarks();
    }, []);

    const onSubmitMark = async (e) => {
        e.preventDefault();
        if (!studentId || !examId || !obtainedMarks) return;
        const values = { student_id: studentId, exam_id: examId, obtained_marks: obtainedMarks };

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/marks/${editingId}`, values, { withCredentials: true });
                console.log('Mark updated');
            } else {
                await axios.post(`${baseURL}/api/marks`, values, { withCredentials: true });
                console.log('New mark added');
            }

            const updatedMarks = await axios.get(`${baseURL}/api/marks`);
            setMarks(updatedMarks.data);
            resetNewMarkForm();
        } catch (err) {
            console.error('Error adding/updating mark:', err);
        }
    };

    const handleEdit = (mark) => {
        setStudentId(mark.student_id);
        setExamId(mark.exam_id);
        setObtainedMarks(mark.obtained_marks);
        setEditing(true);
        setEditingId(mark.mark_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/marks/${id}`, { withCredentials: true });
            const updatedMarks = await axios.get(`${baseURL}/api/marks`);
            setMarks(updatedMarks.data);
        } catch (err) {
            console.error('Error deleting mark:', err);
        }
    };

    return (
        <div className='admin-container'>
            <h1>Exam Marks</h1>
            <form className='admin-form' onSubmit={onSubmitMark}>
                <input
                    type='text'
                    name='studentId'
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder='Student ID'
                    required
                />
                <input
                    type='text'
                    name='examId'
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    placeholder='Exam ID'
                    required
                />
                <input
                    type='number'
                    name='obtainedMarks'
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(e.target.value)}
                    placeholder='Obtained Marks'
                    required
                />
                <button type='submit'>{editing ? 'Update' : 'Add'} Mark</button>
            </form>
            
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Mark ID</th>
                        <th>Student ID</th>
                        <th>Exam ID</th>
                        <th>Obtained Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {marks.map(mark => (
                        <tr key={mark.mark_id}>
                            <td>{mark.mark_id}</td>
                            <td>{mark.student_id}</td>
                            <td>{mark.exam_id}</td>
                            <td>{mark.obtained_marks}</td>
                            <td>
                                <button onClick={() => handleEdit(mark)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(mark.mark_id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminMarks;
