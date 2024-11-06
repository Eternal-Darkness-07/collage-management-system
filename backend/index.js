const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 5000;
const URL = ['http://localhost:5173'];
app.use(cors({
    origin: URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json()); 

const departmentsRoutes = require('./routes/department');
const instructorsRoutes = require('./routes/instructor');
const coursesRoutes = require('./routes/course');
const studentsRoutes = require('./routes/student');
const enrollmentsRoutes = require('./routes/enrollment');
const hodsRoutes = require('./routes/hod');
const marksRoutes = require('./routes/marks');
const examsRoutes = require('./routes/exams');
const performanceRoutes = require('./routes/performance');
const loginRoutes = require('./routes/login');

app.use('/api/departments/', departmentsRoutes);
app.use('/api/instructors/', instructorsRoutes);
app.use('/api/courses/', coursesRoutes);
app.use('/api/students/', studentsRoutes);
app.use('/api/enrollments/', enrollmentsRoutes);
app.use('/api/hods/', hodsRoutes);
app.use('/api/marks/', marksRoutes);
app.use('/api/exams/', examsRoutes);
app.use('/api/performance/', performanceRoutes);
app.use('/api', loginRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});