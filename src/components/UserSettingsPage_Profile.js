import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

function UserSettingsPage_Profile() {
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const navigate = useNavigate();

    // Toggle visibility of a card (for expandable sections)
    const toggleCard = (uniqueIndex) => {
        const cardBody = document.getElementById(`card-body-${uniqueIndex}`);
        cardBody.style.display = cardBody.style.display === 'none' || cardBody.style.display === '' ? 'block' : 'none';
    };

    // Handler for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    const setEditedUsername = async (newUsername) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${apiUrl}/edit-user/username/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (!response.ok) {
                if (response.error === 'Username already exists') {
                    alert(`Username ${newUsername} already exists, please try a different one.`);
                } else {
                    throw new Error('Failed to update username');
                }
            }
            // Update the username in the state
            setUsername(newUsername);
        } catch (error) {
            alert(error);
            console.error('Error updating username:', error);
        }
    };

    // Fetch user details from the backend
    const [user, setUserProfile] = useState([]);
    useEffect(() => {
        fetchUserDetails()
            .then((data) => {
                setUserProfile(data);
                setUsername(data.username);
                setProfileImage(data.profile_image);
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    }, []);

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/user-profile/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        });
        const data = await response.json();
        return data;
    };

    // Handle image selection and upload
    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
    
        if (file) {
            // Load image as base64
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImage(event.target.result);
            };
            reader.readAsDataURL(file);

            reader.onloadend = async (event) => {
                formData.append('profile_image', reader.result);  // Append the file to the FormData
                try {
                    const response = await fetch(`${apiUrl}/edit-user/profile-image/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`,
                        },
                        body: formData,
                    });
                    console.log('Response:', response);
                    if (!response.ok) {
                        throw new Error('Failed to update profile image');
                    }
                } catch (error) {
                    console.error('Error updating profile image:', error);
                }
            }
        }
    };

    return (
        <div className="page-layout">
            {/* Page header */}
            <div className="page-header">
                <button className="back-button" onClick={() => handleNavigate(`/settings`)}>
                    &lt; Settings
                </button>
            </div>

            {/* Main Content */}
            <div className="page-content">
                <h1 className="page-content-title">General</h1>
                <div className="form-label">
                    Username
                    <input
                        type="text"
                        className="form-input"
                        value={username || ''}
                        onChange={(e) => setEditedUsername(e.target.value)}
                    />
                </div>

                <div className="form-label">Profile image</div>
                <div>
                    <img src={profileImage} className="edit-settings-image" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfileImageChange}
                    />
                    <button className="edit-settings-image-button" onClick={() => document.getElementById('profileImageInput').click()}>
                        <i className="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserSettingsPage_Profile;
