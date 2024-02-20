import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import './dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const CongratulationsPopup = ({ onClose }) => {
	return (
		<div className="popup">
			<div className="popup-content">
				<span className="popup-close-btn" onClick={onClose}>
					&times;
				</span>
				<h2>Selamat!</h2>
				<p>Anda berhasil memenangkan 5 poin dari perjalanan!</p>
				<button onClick={onClose}>Tutup</button>
			</div>
		</div>
	);
};

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

const DashboardForm = ({
	location: routeLocation,
	onJalurPerjalananUpdate,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [username, setUsername] = useState('');
	const [currentLocation, setCurrentLocation] = useState(null);
	const [locationPermissionDenied, setLocationPermissionDenied] =
		useState(false);
	const [poin, setPoin] = useState(0);
	const [perjalanans, setPerjalanans] = useState([]);
	const [showCongratulations, setShowCongratulations] = useState(false);
	const [userData, setUserData] = useState(null);
	const [jalurPerjalanan, setJalurPerjalanan] = useState(null); // Tambahkan ini
	const [historyPerjalanan, setHistoryPerjalanan] = useState([]);
	const navigate = useNavigate();

	const location = useLocation();

	useEffect(() => {
		if (location?.state?.username) {
			setUsername(location.state.username);
			setUserData({
				username: location.state.username,
			});
		}
	}, [location]);

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const showCongratulationsPopup = () => {
		setShowCongratulations(true);
	};

	const closeCongratulationsPopup = () => {
		setShowCongratulations(false);
	};

	const handleLogout = () => {
		setTimeout(() => {
			navigate('/login');
		}, 2000);
	};

	const sendStartRequest = (data) => {
		return axios.post('http://localhost:3001/api/mulai_perjalanan', data);
	};

	const sendStopRequest = (data) => {
		return axios.post('http://localhost:3001/api/stop_perjalanan', data);
	};

	const getDeviceLocation = () => {
		return new Promise((resolve, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
						resolve({ latitude, longitude });
					},
					(error) => {
						console.error('Gagal mendapatkan lokasi:', error);
						reject('Gagal mendapatkan izin lokasi.');
					}
				);
			} else {
				console.error('Geolocation tidak didukung pada perangkat ini.');
				reject('Geolocation tidak didukung pada perangkat ini.');
			}
		});
	};

	const handleAllowLocationClick = () => {
		getDeviceLocation();
	};

	const handleStartClick = () => {
		setIsPlaying(true);

		getDeviceLocation()
			.then((coordinates) => {
				setCurrentLocation(coordinates);

				const dataPerjalanan = {
					nama: username,
					jenis_angkutan: document.getElementById('jenisAngkutan').value,
					maksud_perjalanan: document.getElementById('maksudPerjalanan').value,
					tujuan_perjalanan: document.getElementById('tujuanPerjalanan').value,
					koordinat_start: coordinates
						? `${coordinates.latitude},${coordinates.longitude}`
						: 'koordinat_start_dummy',
				};

				sendStartRequest(dataPerjalanan)
					.then((response) => {
						console.log('Berhasil memulai perjalanan:', response.data);
						const updatedJalurPerjalanan = [coordinates];
						setJalurPerjalanan(updatedJalurPerjalanan); // Menambahkan koordinat start ke jalurPerjalanan
					})
					.catch((error) => {
						console.error('Gagal memulai perjalanan:', error);
					});
			})
			.catch((error) => {
				console.error('Gagal mendapatkan izin lokasi:', error);
				setIsPlaying(false);
			});
	};

	const handleStopClick = () => {
		console.log('Stop button clicked');
		setIsPlaying(false);

		getDeviceLocation()
			.then((coordinates) => {
				const dataPerjalanan = {
					nama: username,
					koordinat_end: coordinates
						? `${coordinates.latitude},${coordinates.longitude}`
						: 'koordinat_end_dummy',
				};

				sendStopRequest(dataPerjalanan)
					.then((response) => {
						console.log('Berhasil menghentikan perjalanan:', response.data);
						const perjalananSelesai = {
							...dataPerjalanan,
							koordinat_start: jalurPerjalanan, // Menambahkan jalur perjalanan ke objek
						};
						setHistoryPerjalanan([...historyPerjalanan, perjalananSelesai]); // Menambahkan data perjalanan ke historyPerjalanan
						showCongratulationsPopup(); // Tampilkan popup pesan selamat
					})
					.catch((error) => {
						console.error('Gagal menghentikan perjalanan:', error);
					});
			})
			.catch((error) => {
				console.error('Gagal mendapatkan izin lokasi:', error);
			});
	};

	return (
		<div className="dashboard-container">
			<div className="dashboard-username-container">
				<button className="dashboard-username-btn" onClick={toggleDropdown}>
					{userData?.username ? `Hi, ${userData.username}` : 'Hi, Guest'}
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
					<select id="jenisAngkutan">
						<option value="KRL">KRL(KERETA REL LISTRIK)</option>
						<option value="MRT">MRT(MASS RAPIT TRANSIT)</option>
						<option value="LRT BODEBEK">LRT (BODEBEK)</option>
						<option value="LRT JAKARTA">LRT (JAKARTA)</option>
						<option value="TIJE">TIJE (TRANS JAKARTA)</option>
					</select>
				</div>
				<div className="dashboard-input-group2">
					<label>Maksud Perjalanan</label>
					<select id="maksudPerjalanan">
						<option value="bekerja">BEKERJA</option>
						<option value="berwisata">BERWISATA</option>
						<option value="berbelanja">BERBELANJA</option>
						<option value="bersekolah">BERSEKOLAH</option>
					</select>
				</div>
				<div className="dashboard-input-group3">
					<label>Tujuan Perjalanan</label>
					<select id="tujuanPerjalanan">
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
					{!currentLocation && !locationPermissionDenied && (
						<div>
							<button onClick={handleAllowLocationClick}>
								Izinkan Akses Lokasi
							</button>
						</div>
					)}
					{locationPermissionDenied && (
						<div>
							<p>Mohon izinkan akses lokasi untuk melanjutkan.</p>
						</div>
					)}
					{isPlaying ? (
						<StopButton onStopClick={handleStopClick} />
					) : (
						<StartButton onStartClick={handleStartClick} />
					)}
				</div>
				{showCongratulations && (
					<div className="popup">
						<div className="popup-content">
							<span
								className="popup-close-btn"
								onClick={() => setShowCongratulations(false)}
							>
								&times;
							</span>
							<h2>Selamat!</h2>
							<p>Anda berhasil memenangkan 5 poin dari perjalanan!</p>
							<button onClick={() => setShowCongratulations(false)}>
								Tutup
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardForm;
