import React, { useState } from 'react';
import axios from 'axios';
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
	const [user] = useState('jhon');
	const [isPlaying, setIsPlaying] = useState(false);
	const [transportation, setTransportation] = useState('');
	const [purpose, setPurpose] = useState('');
	const [destination, setDestination] = useState('');
	const navigate = useNavigate();

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const handleLogout = async () => {
		try {
			await axios.delete('http://localhost:5000/api/logout');
			navigate('/login');
		} catch (error) {
			console.log(error);
		}
	};

	const handleStartClick = () => {
		setIsPlaying(true);
		sendDataToAPI();
	};

	const handleStopClick = () => {
		setIsPlaying(false);
	};

	function calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371;
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;

		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		const distance = R * c;

		return distance;
	}

	const sendDataToAPI = async () => {
		try {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(async position => {
					const { latitude: latStart, longitude: lonStart } = position.coords;
					const latEnd = latStart;
					const lonEnd = lonStart;

					const distance = calculateDistance(latStart, lonStart, latEnd, lonEnd);

					const data = {
						nama: user || '',
						jenis_angkutan_umum: transportation || '',
						maksud_perjalanan: purpose || '',
						tujuan_perjalanan: destination || '',
						koordinat_start: `${latStart},${lonStart}`,
						koordinat_end: `${latEnd},${lonEnd}`,
						panjang_perjalanan: distance.toFixed(2),
						point: '5',
					};

					const response = await fetch('http://localhost:5000/api/leaderboard', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					});

					if (!response.ok) {
						throw new Error('Network response was not ok');
					}

					console.log('Data sent successfully');
				});
			} else {
				throw new Error('Geolocation is not supported by your browser');
			}
		} catch (error) {
			console.error('Error sending data:', error);
		}
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
					<select onChange={(e) => setTransportation(e.target.value)} value={transportation}>
						<option value="KRL">KRL(KERETA REL LISTRIK)</option>
						<option value="MRT">MRT(MASS RAPIT TRANSIT)</option>
						<option value="LRT BODEBEK">LRT (BODEBEK)</option>
						<option value="LRT JAKARTA">LRT (JAKARTA)</option>
						<option value="TIJE">TIJE (TRANS JAKARTA)</option>
					</select>
				</div>
				<div className="dashboard-input-group2">
					<label>Maksud Perjalanan</label>
					<select onChange={(e) => setPurpose(e.target.value)} value={purpose}>
						<option value="bekerja">BEKERJA</option>
						<option value="berwisata">BERWISATA</option>
						<option value="berbelanja">BERBELANJA</option>
						<option value="bersekolah">BERSEKOLAH</option>
					</select>
				</div>
				<div className="dashboard-input-group3">
					<label>Tujuan Perjalanan</label>
					<select onChange={(e) => setDestination(e.target.value)} value={destination}>
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
