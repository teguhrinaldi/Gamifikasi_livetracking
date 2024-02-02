// src/components/UserDropdown.js
import React from 'react';
import './User.css';

const UserDropdown = ({ onClose }) => {
	const handleLogout = () => {
		// Implement your logout logic here
		console.log('Logout logic goes here');
		onClose(); // Close the dropdown after logout
	};

	return (
		<div className="user-dropdown">
			<ul>
				<li onClick={handleLogout}>Logout</li>
				{/* Add more options as needed */}
			</ul>
		</div>
	);
};

export default UserDropdown;
