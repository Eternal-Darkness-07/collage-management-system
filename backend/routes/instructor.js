const express = require('express');
const router=express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT i.instructor_id, i.first_name, i.last_name, i.email, i.phone, i.hire_date, d.department_name
            FROM Instructors i
            JOIN Departments d ON i.department_id = d.department_id;`;
        const instructors = await db.promise().query(query);
        res.status(200).json(instructors[0]);
    } catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const query = `
            SELECT * FROM Instructors`;
        const instructors = await db.promise().query(query);
        res.status(200).json(instructors[0]);
    } catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/admin/add', async (req, res) => {
    const { instructor_id, first_name, last_name, email, phone, hire_date, department_id } = req.body; 
    try {
        const query = `
            INSERT INTO Instructors (instructor_id, first_name, last_name, email, phone, hire_date, department_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.promise().query(query, [instructor_id, first_name, last_name, email, phone, hire_date, department_id]);
        res.status(201).json({ id: result.insertId, instructor_id, first_name, last_name, email, phone, hire_date, department_id });
    } catch (error) {
        console.error("Error adding instructor:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/admin/:id', async (req, res) => {
    const instructorId = req.params.id; 
    const { first_name, last_name, email, phone, hire_date, department_id } = req.body; 
    try {
        const query = `
            UPDATE Instructors 
            SET first_name = ?, last_name = ?, email = ?, phone = ?, hire_date = ?, department_id = ? 
            WHERE instructor_id = ?`;
        const [result] = await db.promise().query(query, [first_name, last_name, email, phone, hire_date, department_id, instructorId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ instructor_id: instructorId, first_name, last_name, email, phone, hire_date, department_id });
        } else {
            res.status(404).json({ error: 'Instructor not found' });
        }
    } catch (error) {
        console.error("Error updating instructor:", error);
        res.status(500).json({ error: 'Server error' });
    }
});



router.delete('/admin/:id', async (req, res) => {
    const instructorId = req.params.id;
    try {
        const query = "DELETE FROM Instructors WHERE instructor_id = ?";
        const [result] = await db.promise().query(query, [instructorId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Instructor deleted' });
        } else {
            res.status(404).json({ error: 'Instructor not found' });
        }
    } catch (error) {
        console.error("Error deleting instructor:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;