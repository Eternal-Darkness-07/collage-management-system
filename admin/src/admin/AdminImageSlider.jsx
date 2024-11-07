import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminDesign.css';

const AdminImageSlider = () => {
    const [images, setImages] = useState([]);
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const baseURL = "http://localhost:5000";

    const fetchImages = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/imageslider`);
            setImages(response.data);
        } catch (err) {
            console.error("Error fetching images:", err);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const resetForm = () => {
        setContent('');
        setImageFile(null);
        setEditing(false);
        setEditingId(null);
    };

    const onSubmitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        if (imageFile) formData.append('image', imageFile);

        try {
            if (editing) {
                await axios.put(`${baseURL}/api/imageslider/admin/${editingId}`, formData, { withCredentials: true });
                console.log("Image updated");
            } else {
                await axios.post(`${baseURL}/api/imageslider/admin/add`, formData, { withCredentials: true });
                console.log("New image added");
            }

            fetchImages();
            resetForm();
        } catch (err) {
            console.error("Error adding/updating image:", err);
        }
    };

    const handleEdit = (image) => {
        setContent(image.content);
        setEditing(true);
        setEditingId(image.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/imageslider/admin/${id}`, { withCredentials: true });
            fetchImages();
        } catch (err) {
            console.error("Error deleting image:", err);
        }
    };

    return (
        <div className="admin-container">
            <h1>Image Slider Management</h1>
            <form className="admin-form" onSubmit={onSubmitImage}>
                <input
                    type="text"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Image Content"
                    required
                />
                <input
                    type="file"
                    name="image"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                />
                <button type="submit">{editing ? 'Update' : 'Add'} Image</button>
            </form>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Content</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map((image) => (
                        <tr key={image.id}>
                            <td>{image.id}</td>
                            <td>{image.content}</td>
                            <td><img src={`${baseURL}/${image.image_path}`} alt={image.content} width="100" /></td>
                            <td>
                                <button onClick={() => handleEdit(image)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(image.id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminImageSlider;
