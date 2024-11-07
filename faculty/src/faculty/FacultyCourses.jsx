import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CButton, CForm, CFormInput, CFormSelect, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableRow, CTableDataCell, CTableHeaderCell } from '@coreui/react';

const FacultyCourses = ({ facultyId }) => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const baseURL = "http://localhost:5000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, deptRes, instRes] = await Promise.all([
                    axios.get(`${baseURL}/api/courses/faculty?faculty_id=${facultyId}`),
                    axios.get(`${baseURL}/api/departments`),
                    axios.get(`${baseURL}/api/instructors`)
                ]);
                setCourses(courseRes.data);
                setDepartments(deptRes.data);
                setInstructors(instRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [facultyId]);

    return (
        <div className="admin-container">
            <h1>Courses</h1>
            <CTable hover responsive className="mt-4">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Course Name</CTableHeaderCell>
                        <CTableHeaderCell>Department</CTableHeaderCell>
                        <CTableHeaderCell>Instructor</CTableHeaderCell>
                        <CTableHeaderCell>Course Code</CTableHeaderCell>
                        <CTableHeaderCell>Credits</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {courses.map((course) => (
                        <CTableRow key={course.course_id}>
                            <CTableDataCell>{course.course_name}</CTableDataCell>
                            <CTableDataCell>
                                {departments.find(d => d.department_id === course.department_id)?.department_name}
                            </CTableDataCell>
                            <CTableDataCell>
                                {instructors.find(i => i.instructor_id === course.instructor_id)?.first_name + " " +
                                instructors.find(i => i.instructor_id === course.instructor_id)?.last_name}
                            </CTableDataCell>
                            <CTableDataCell>{course.course_code}</CTableDataCell>
                            <CTableDataCell>{course.credits}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default FacultyCourses;
