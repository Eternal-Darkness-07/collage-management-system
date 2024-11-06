import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './design.css';

export default function Exams() {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/exams`);
                setExams(response.data);
                console.log("Exams data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/courses`);
                setCourses(response.data);
                console.log("Courses data fetched successfully");
            } catch (err) {
                console.log(err);
            }
        };

        fetchExams();
        fetchCourses();
    }, []);

    // Create a mapping of course ID to course name
    const courseMap = {};
    courses.forEach(course => {
        courseMap[course.course_id] = course.course_name;
    });

    // Sort exams by exam_id
    exams.sort((a, b) => a.exam_id - b.exam_id);

    return (
        <div className="container">
            <h1>Exams</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Exam ID</th>
                        <th>Exam Name</th>
                        <th>Course Name</th>
                        <th>Exam Date</th>
                        <th>Exam Time</th>
                        <th>Max Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map(exam => (
                        <tr key={exam.exam_id}>
                            <td>{exam.exam_id}</td>
                            <td>{exam.exam_name}</td>
                            <td>{exam.course_name}</td> 
                            <td>{exam.exam_date}</td>
                            <td>{exam.exam_time}</td>
                            <td>{exam.max_marks}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
