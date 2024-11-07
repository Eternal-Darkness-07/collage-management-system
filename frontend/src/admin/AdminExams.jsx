import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css'; 

const AdminExams = () => {
    const [exams, setExams] = useState([]);
    const [examId, setExamId] = useState('');
    const [examName, setExamName] = useState('');
    const [examDate, setExamDate] = useState('');
    const [duration, setDuration] = useState('');
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const resetExamForm = () => {
        setExamId('');
        setExamName('');
        setExamDate('');
        setDuration('');
        setEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/exams/admin`);
                setExams(response.data);
            } catch (err) {
                console.error('Error fetching exams:', err);
            }
        };
        fetchExams();
    }, []);

    const onSubmitExam = async (e) => {
        e.preventDefault();
        if (!examId || !examName || !examDate || !duration) return;
        const values = { exam_id: examId, exam_name: examName, exam_date: examDate, duration };
        try {
            if (editing) {
                await axios.put(`${baseURL}/api/exams/${editingId}`, values, { withCredentials: true });
                console.log('Exam updated');
            } else {
                await axios.post(`${baseURL}/api/exams`, values, { withCredentials: true });
                console.log('New exam added');
            }

            const updatedExams = await axios.get(`${baseURL}/api/exams`);
            setExams(updatedExams.data);
            resetExamForm();
        } catch (err) {
            console.error('Error adding/updating exam:', err);
        }
    };

    const handleEdit = (exam) => {
        setExamId(exam.exam_id);
        setExamName(exam.exam_name);
        setExamDate(exam.exam_date);
        setDuration(exam.duration);
        setEditing(true);
        setEditingId(exam.exam_id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/exams/${id}`, { withCredentials: true });
            const updatedExams = await axios.get(`${baseURL}/api/exams`);
            setExams(updatedExams.data);
        } catch (err) {
            console.error('Error deleting exam:', err);
        }
    };
    console.log(exams)
    return (
        <div className='admin-container'>
            <h1>Exams</h1>
            <form className='admin-form' onSubmit={onSubmitExam}>
                <input
                    type='text'
                    name='examId'
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    placeholder='Exam ID'
                    required
                />
                <input
                    type='text'
                    name='examName'
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder='Exam Name'
                    required
                />
                <input
                    type='date'
                    name='examDate'
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    placeholder='Exam Date'
                    required
                />
                <input
                    type='text'
                    name='duration'
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder='Duration (in hours)'
                    required
                />
                <button type='submit'>{editing ? 'Update' : 'Add'} Exam</button>
            </form>
            
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Exam ID</th>
                        <th>Exam Name</th>
                        <th>Exam Date</th>
                        <th>Duration (hrs)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map(exam => (
                        <tr key={exam.exam_id}>
                            <td>{exam.exam_id}</td>
                            <td>{exam.exam_name}</td>
                            <td>{exam.exam_date}</td>
                            <td>{exam.duration}</td>
                            <td>
                                <button onClick={() => handleEdit(exam)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(exam.exam_id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminExams;
