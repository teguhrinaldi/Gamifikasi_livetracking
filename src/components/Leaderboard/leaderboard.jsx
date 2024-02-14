import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTrophy,
	faMedal,
	faArrowLeft, 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './leaderboard.css';

const Leaderboard = () => {
	const navigate = useNavigate();
	const [leaderboardData, setLeaderboardData] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:5000/api/leaderboard')
			.then(response => {
				const data = response.data;
				data.sort((a, b) => b.point - a.point);
				const formattedData = data.slice(0, 3).map((item, index) => ({
					icon: index === 0 ? faTrophy : faMedal,
					name: item.nama,
					points: item.point
				}));
				setLeaderboardData(formattedData);
			})
			.catch(error => {
				console.error('Error fetching data:', error);
			});
	}, []);

	const handleBackToDashboard = () => {
		navigate('/dashboard');
	};

	return (
		<div className="leaderboard-body">
			<div className="leaderboard-container">
				<div className="leaderboard-header">
					<button className="back-button" onClick={handleBackToDashboard}>
						<FontAwesomeIcon icon={faArrowLeft} size="sm" />
					</button>
					<h2 className="leaderboard-title">LEADERBOARD</h2>
				</div>
				<div className="leaderboard-list">
					{leaderboardData.map((player, index) => (
						<div key={index} className="leaderboard-item">
							<FontAwesomeIcon
								icon={player.icon}
								className={`trophy-icon ${
									index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'
								}`}
								size="sm"
							/>
							<span className="player-name">{player.name}</span>
							<span className="player-points">{player.points} </span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
