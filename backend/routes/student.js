const express = require('express');
const router=express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.student_id, s.first_name, s.last_name, s.dob, s.email,s.address, s.phone, s.gender, s.enrollment_year, d.department_name
            FROM Students s
            JOIN Departments d ON s.department_id = d.department_id;`;
        const students = await db.promise().query(query);
        res.status(200).json(students[0]);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/admin', async (req, res) => {
    try {
        const query = `
            SELECT * FROM Students`;
        const students = await db.promise().query(query);
        res.status(200).json(students[0]);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { student_id, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id } = req.body;
    try {
        const query = `
            INSERT INTO Students 
            (student_id, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().query(query, [
            student_id, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id
        ]);
        res.status(201).json({ id: result.insertId, student_id, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/admin/:id', async (req, res) => {
    const studentId = req.params.id;
    const { first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id } = req.body;
    try {
        const query = `
            UPDATE Students 
            SET first_name = ?, last_name = ?, dob = ?, email = ?, phone = ?, address = ?, gender = ?, enrollment_year = ?, department_id = ?
            WHERE student_id = ?
        `;
        const [result] = await db.promise().query(query, [
            first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id, studentId
        ]);
        if (result.affectedRows > 0) {
            res.status(200).json({ id: studentId, first_name, last_name, dob, email, phone, address, gender, enrollment_year, department_id });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/admin/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const query = "DELETE FROM Students WHERE student_id = ?";
        const [result] = await db.promise().query(query, [studentId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Student deleted' });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;