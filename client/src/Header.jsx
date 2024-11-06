import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className='header'>
            <nav className='nav'>
                <ul className='nav-list'>
                    <li className='nav-item'>
                        <Link 
                            to='/departments' 
                            className='nav-link'>
                            Departments
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/courses' 
                            className='nav-link'>
                            Courses
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/students' 
                            className='nav-link'>
                            Students
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/enrollments' 
                            className='nav-link'>
                            Enrollments
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/instructors' 
                            className='nav-link'>
                            Instructors
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/hods' 
                            className='nav-link'>
                            HOD
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/exams' 
                            className='nav-link'>
                            Exams
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/marks' 
                            className='nav-link'>
                            Marks
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/performance' 
                            className='nav-link'>
                            Performance
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link 
                            to='/login' 
                            className='nav-link'>
                            Login
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
