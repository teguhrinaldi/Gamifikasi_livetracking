import React from 'react';
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

	const leaderboardData = [
		{ icon: faTrophy, name: 'John Doe', points: 500 },
		{ icon: faMedal, name: 'Jane Smith', points: 450 },
		{ icon: faMedal, name: 'Bob Johnson', points: 400 },
	];

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
