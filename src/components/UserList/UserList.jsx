import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './user.css';

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [perjalanans, setPerjalanans] = useState([]);
	const [locations, setLocations] = useState({});

	const reverseGeocode = async (coords) => {
		const [latitude, longitude] = coords;

		try {
			const API_KEY = 'd9c09368b3bd4a57b64bbe2c024808c3';
			const response = await axios.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
			);

			// Ambil nama lokasi dari respons API
			const locationName = response.data.results[0].formatted;
			return locationName;
		} catch (error) {
			console.error('Error reverse geocoding:', error);
			return `${latitude}, ${longitude}`;
		}
	};

	useEffect(() => {
		axios
			.get('http://localhost:3001/api/users')
			.then((response) => {
				console.log('Data pengguna dari server:', response.data);

				const usersWithPoints = response.data.map((user) => ({
					...user,
					points: calculateUserPoints(user.id),
				}));

				setUsers(usersWithPoints);
			})
			.catch((error) => {
				console.error('Error fetching user data:', error);
			});

		axios
			.get('http://localhost:3001/api/perjalanans')
			.then((response) => {
				console.log('Data perjalanan dari server:', response.data);
				setPerjalanans(response.data);
			})
			.catch((error) => {
				console.error('Error fetching perjalanan data:', error);
			});
	}, []);

	useEffect(() => {
		if (perjalanans.length > 0) {
			const fetchLocations = async () => {
				const locationsData = {};

				await Promise.all(
					perjalanans.map(async (perjalanan) => {
						const startLocation = await reverseGeocode(
							perjalanan.koordinat_start.split(',').map(Number)
						);
						const endLocation = await reverseGeocode(
							perjalanan.koordinat_end.split(',').map(Number)
						);

						locationsData[perjalanan.id] = {
							start: startLocation,
							end: endLocation,
						};
					})
				);

				setLocations(locationsData);
			};

			fetchLocations();
		}
	}, [perjalanans]);

	const calculateUserPoints = (userId) => {
		const userJourneys = perjalanans.filter(
			(perjalanan) => perjalanan.userId === userId
		);
		return userJourneys.reduce(
			(totalPoints, journey) => totalPoints + journey.poin_diperoleh,
			0
		);
	};

	const handleExportToExcel = () => {
		if (users.length === 0 || perjalanans.length === 0) {
			console.warn('Tidak ada data pengguna atau perjalanan untuk diekspor.');
			return;
		}

		const wsUsers = XLSX.utils.json_to_sheet(users);
		const wsPerjalanans = XLSX.utils.json_to_sheet(perjalanans);

		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, wsUsers, 'Users');
		XLSX.utils.book_append_sheet(wb, wsPerjalanans, 'Perjalanans');

		XLSX.writeFile(wb, 'users_and_perjalanans.xlsx');
	};

	const handleDeleteUser = (userId) => {
		axios
			.delete(`http://localhost:3001/api/users/${userId}`)
			.then((response) => {
				console.log('Data pengguna berhasil dihapus:', response.data);
				setUsers(users.filter((user) => user.id !== userId));
			})
			.catch((error) => {
				console.error('Error menghapus data pengguna:', error);
			});
	};

	const handleDeletePerjalanan = (perjalananId) => {
		axios
			.delete(`http://localhost:3001/api/perjalanans/${perjalananId}`)
			.then((response) => {
				console.log('Data perjalanan berhasil dihapus:', response.data);
				setPerjalanans(
					perjalanans.filter((perjalanan) => perjalanan.id !== perjalananId)
				);
			})
			.catch((error) => {
				console.error('Error menghapus data perjalanan:', error);
			});
	};

	return (
		<div>
			<h1>User List</h1>
			<button onClick={handleExportToExcel}>Export to Excel</button>

			<h2>Data Users</h2>
			<table>
				<thead>
					<tr>
						<th>Email</th>
						<th>Username</th>
						<th>Password</th>
						<th>Points</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.email}</td>
							<td>{user.username}</td>
							<td>{user.password}</td>
							<td>{user.points}</td>
							<td>
								<button onClick={() => handleDeleteUser(user.id)}>Hapus</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<h2>Data Perjalanan</h2>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Waktu</th>
						<th>Nama</th>
						<th>Jenis Angkutan</th>
						<th>Maksud Perjalanan</th>
						<th>Tujuan Perjalanan</th>
						<th>Koordinat Start</th>
						<th>Koordinat End</th>
						<th>Panjang Perjalanan</th>
						<th>Poin Diperoleh</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{perjalanans.map((perjalanan) => (
						<tr key={perjalanan.id}>
							<td>{perjalanan.id}</td>
							<td>{perjalanan.waktu}</td>
							<td>{perjalanan.nama}</td>
							<td>{perjalanan.jenis_angkutan}</td>
							<td>{perjalanan.maksud_perjalanan}</td>
							<td>{perjalanan.tujuan_perjalanan}</td>
							<td>{locations[perjalanan.id]?.start || 'Loading...'}</td>
							<td>{locations[perjalanan.id]?.end || 'Loading...'}</td>
							<td>{perjalanan.panjang_perjalanan}</td>
							<td>{perjalanan.poin_diperoleh}</td>
							<td>
								<button onClick={() => handleDeletePerjalanan(perjalanan.id)}>
									Hapus
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserList;
