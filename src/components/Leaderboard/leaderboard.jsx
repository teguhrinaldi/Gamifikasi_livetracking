import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './leaderboard.css';

const Leaderboard = () => {
	const navigate = useNavigate();
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [totalPoints, setTotalPoints] = useState(0);

	useEffect(() => {
		axios
			.get('http://localhost:3001/api/leaderboard')
			.then((response) => {
				console.log('Leaderboard response:', response.data);
				const leaderboardList = response.data;
				const newTotalPoints = response.data.totalPoints;

				setLeaderboardData(leaderboardList);
				setTotalPoints(newTotalPoints);
			})
			.catch((error) => {
				console.error('Error fetching leaderboard data:', error);
			});
	}, []);

	const handleBackToDashboard = () => {
		navigate('/dashboard');
	};

	return (
		<div className="leaderboard-body">
			<div className="leaderboard-container">
				<div className="leaderboard-header">
					<h2 className="leaderboard-title">LEADERBOARD</h2>
					<p>Total Poin: {totalPoints}</p>
				</div>
				<div className="leaderboard-list">
					{leaderboardData.map((player, index) => (
						<div key={index} className="leaderboard-item">
							<FontAwesomeIcon
								icon={faTrophy}
								className={`trophy-icon ${
									index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'
								}`}
								size="sm"
							/>
							<span className="player-name">{player.username}</span>
							<span className="player-points">{player.total_points} </span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
