import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './imagegallery.css';  // Assuming you want to add custom styles

const ImageGallery = () => {
    const [imageName, setImageName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [gallery, setGallery] = useState([]);
    const baseURL = "http://localhost:5000";

    // Fetch images from the database on component load
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/imagegallery`);
                setGallery(response.data);
            } catch (err) {
                console.error('Error fetching images:', err);
            }
        };

        fetchImages();
    }, []);

    // Handle form submission for image upload
    const onSubmitImage = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('image_name', imageName);

        try {
            await axios.post(`${baseURL}/api/imagegallery/admin/add`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Re-fetch gallery after adding new image
            const response = await axios.get(`${baseURL}/api/imagegallery`);
            setGallery(response.data);
            setImageName('');
            setImageFile(null);
        } catch (err) {
            console.error('Error uploading image:', err);
        }
    };

    // Handle image deletion
    const deleteImage = async (id) => {
        try {
            await axios.delete(`${baseURL}/api/imagegallery/admin/delete/${id}`);
            // Re-fetch gallery after deleting image
            const response = await axios.get(`${baseURL}/api/imagegallery`);
            setGallery(response.data);
        } catch (err) {
            console.error('Error deleting image:', err);
        }
    };

    // Handle image editing (for now, just updating the name)
    const editImage = async (id) => {
        const newName = prompt('Enter new image name:');
        if (newName) {
            try {
                await axios.put(`${baseURL}/api/imagegallery/admin/edit/${id}`, { image_name: newName });
                // Re-fetch gallery after updating image name
                const response = await axios.get(`${baseURL}/api/imagegallery`);
                setGallery(response.data);
            } catch (err) {
                console.error('Error editing image:', err);
            }
        }
    };

    return (
        <div className='gallery-container'>
            <h1>Image Gallery</h1>

            {/* Image upload form */}
            <form onSubmit={onSubmitImage} className="upload-form">
                <input
                    type='text'
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder='Image Name'
                />
                <input
                    type='file'
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                />
                <button type="submit">Upload Image</button>
            </form>

            {/* Table to display images */}
            <div className="gallery-table">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gallery.map((image) => (
                            <tr key={image.image_id}>
                                <td>
                                    <img
                                        src={`http://localhost:5000${image.image_url}`}
                                        alt={image.image_name}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{image.image_name}</td>
                                <td>
                                    {/* <button onClick={() => editImage(image.image_id)}>Edit</button> */}
                                    <button onClick={() => deleteImage(image.image_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ImageGallery;
