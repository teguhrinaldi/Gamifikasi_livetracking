import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import './dashboard.css';

const DashboardForm = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [showLeaderboard, setShowLeaderboard] = useState(false);

	const handlePlayStopClick = () => {
		setIsPlaying(!isPlaying);
	};

	const toggleLeaderboard = () => {
		setShowLeaderboard(!showLeaderboard);
	};

	return (
		<div className="dashboard-container">
			<div className="dashboard-box">
				<h2 className="dashboard-title">DASHBOARD</h2>
				<div className="dashboard-input-group1">
					<label>Angkutan Umum</label>
					<select>
						<option value="bus">Bus</option>
						<option value="kereta">Kereta</option>
						<option value="taksi">Taksi</option>
					</select>
				</div>
				<div className="dashboard-input-group2">
					<label>Maksud Perjalanan</label>
					<select>
						<option value="liburan">Liburan</option>
						<option value="pekerjaan">Pekerjaan</option>
						<option value="studi">Studi</option>
					</select>
				</div>
				<div className="dashboard-input-group3">
					<label>Tujuan Perjalanan</label>
					<select>
						<option value="kantor">Kantor</option>
						<option value="universitas">Universitas</option>
						<option value="wisata">Wisata</option>
					</select>
				</div>
				<div className="dashboard-button-group1">
					<div
						className={`play-stop-icon-wrapper ${
							isPlaying ? 'playing' : 'stopped'
						}`}
						onClick={handlePlayStopClick}
					>
						{isPlaying ? (
							<FontAwesomeIcon icon={faStop} className="play-stop-icon" />
						) : (
							<FontAwesomeIcon icon={faPlay} className="play-stop-icon" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardForm;
