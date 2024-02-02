// src/components/Leaderboard.js
import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaTrophy, FaMedal, FaMedal as FaBronze } from 'react-icons/fa'; // Icons with color variations
import './Leaderboard.css';

const dummyData = [
	{ nama: 'John Doe', points: 150 },
	{ nama: 'Jane Smith', points: 120 },
	{ nama: 'Bob Johnson', points: 90 },
];

const getTrophyIcon = (index) => {
	switch (index) {
		case 0:
			return <FaTrophy color="#ffd700" />;
		case 1:
			return <FaMedal color="#c0c0c0" />;
		case 2:
			return <FaBronze color="#cd7f32" />;
		default:
			return null;
	}
};

const Leaderboard = ({ onClose }) => {
	return (
		<div className="leaderboard-container">
			<div className="leaderboard-header">
				<span>Leaderboard</span>
				<button className="close-button" onClick={onClose}>
					<IoClose />
				</button>
			</div>
			<div className="leaderboard-content">
				<ul>
					{dummyData.map((data, index) => (
						<li key={index}>
							<span className="trophy-icon">{getTrophyIcon(index)}</span>
							<span className="name">{data.nama}</span>
							<span className="points">{data.points} pts</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Leaderboard;
