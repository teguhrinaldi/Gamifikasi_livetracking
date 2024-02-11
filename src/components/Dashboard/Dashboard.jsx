import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import './dashboard.css';

const StartButton = ({ onStartClick }) => {
	return (
		<div className="play-stop-icon-wrapper stopped" onClick={onStartClick}>
			<FontAwesomeIcon icon={faPlay} className="play-stop-icon" />
		</div>
	);
};

const StopButton = ({ onStopClick }) => {
	return (
		<div className="play-stop-icon-wrapper playing" onClick={onStopClick}>
			<FontAwesomeIcon icon={faStop} className="play-stop-icon" />
		</div>
	);
};

const DashboardForm = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [user, setUser] = useState('John Doe');
	const [isPlaying, setIsPlaying] = useState(false);
	const navigate = useNavigate();

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const handleLogout = () => {
		setTimeout(() => {
			navigate('/login');
		}, 2000);
	};

	const handleStartClick = () => {
		setIsPlaying(true);
	};

	const handleStopClick = () => {
		setIsPlaying(false);
	};
	return (
		<div className="dashboard-container">
			<div className="dashboard-username-container">
				<button className="dashboard-username-btn" onClick={toggleDropdown}>
					Hi, {user}
				</button>
				{showDropdown && (
					<div className="dashboard-leaderboard-dropdown">
						<span onClick={handleLogout}>Logout</span>
					</div>
				)}
			</div>
			<Link to="/leaderboard" className="leaderboard-button">
				<FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
			</Link>
			<div className="dashboard-box">
				<div className="dashboard-header"></div>
				<div className="dashboard-input-group1">
					<label>Angkutan Umum</label>
					<select>
						<option value="KRL">KRL(KERETA REL LISTRIK)</option>
						<option value="MRT">MRT(MASS RAPIT TRANSIT)</option>
						<option value="LRT BODEBEK">LRT (BODEBEK)</option>
						<option value="LRT JAKARTA">LRT (JAKARTA)</option>
						<option value="TIJE">TIJE (TRANS JAKARTA)</option>
					</select>
				</div>
				<div className="dashboard-input-group2">
					<label>Maksud Perjalanan</label>
					<select>
						<option value="bekerja">BEKERJA</option>
						<option value="berwisata">BERWISATA</option>
						<option value="berbelanja">BERBELANJA</option>
						<option value="bersekolah">BERSEKOLAH</option>
					</select>
				</div>
				<div className="dashboard-input-group3">
					<label>Tujuan Perjalanan</label>
					<select>
						<option value="dki">JAKARTA</option>
						<option value="kota_bekasi">KOTA BEKASI</option>
						<option value="kab_bekasi">KAB. BEKASI</option>
						<option value="kota_tangerang">KOTA TANGERANG</option>
						<option value="kab_tangerang">KAB. TANGERANG</option>
						<option value="kota_tangsel">KOTA TANG-SEL</option>
						<option value="kota_depok">KOTA DEPOK</option>
						<option value="kota_bogor">KOTA BOGOR</option>
						<option value="kab_bogor">KAB. BOGOR</option>
					</select>
				</div>
				<div className="dashboard-button-group1">
					{isPlaying ? (
						<StopButton onStopClick={handleStopClick} />
					) : (
						<StartButton onStartClick={handleStartClick} />
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardForm;
