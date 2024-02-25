import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './user.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UserList = () => {
	const [users, setUsers] = useState([]);
	const [perjalanans, setPerjalanans] = useState([]);
	const [userMapImages, setUserMapImages] = useState({});

	useEffect(() => {
		axios
			.get('http://localhost:3001/api/users')
			.then((response) => {
				console.log('Data pengguna dari server:', response.data);

				// Tambahkan atribut points pada objek pengguna
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
				renderUserMapImages(response.data);
			})
			.catch((error) => {
				console.error('Error fetching perjalanan data:', error);
			});
	}, []);

	// Fungsi untuk menghitung total poin pengguna berdasarkan ID pengguna
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
				// Setelah pengguna dihapus, perbarui daftar pengguna
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
				// Setelah perjalanan dihapus, perbarui daftar perjalanan
				setPerjalanans(
					perjalanans.filter((perjalanan) => perjalanan.id !== perjalananId)
				);
			})
			.catch((error) => {
				console.error('Error menghapus data perjalanan:', error);
			});
	};

	const renderUserMapImages = (perjalanansData) => {
		const userMapImagesData = {};

		perjalanansData.forEach((perjalanan) => {
			const startCoords = perjalanan.koordinat_start.split(',').map(Number);
			const endCoords = perjalanan.koordinat_end.split(',').map(Number);

			const mapInstance = L.map(`map-${perjalanan.id}`).setView(
				startCoords,
				10
			);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
			}).addTo(mapInstance);

			L.marker(startCoords)
				.addTo(mapInstance)
				.bindPopup(`Start: ${startCoords}`)
				.openPopup();

			L.marker(endCoords)
				.addTo(mapInstance)
				.bindPopup(`End: ${endCoords}`)
				.openPopup();

			L.polyline([startCoords, endCoords], { color: 'blue' }).addTo(
				mapInstance
			);

			// Simpan gambar peta sebagai data URL
			userMapImagesData[perjalanan.id] = mapInstance.toDataURL();
		});

		setUserMapImages(userMapImagesData);
	};

	return (
		<div>
			<h1>User List</h1>
			<button onClick={handleExportToExcel}>Export to Excel</button>

			{/* Tampilkan data Users */}
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

			{/* Tampilkan data Perjalanan */}
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
							<td>{perjalanan.koordinat_start}</td>
							<td>{perjalanan.koordinat_end}</td>
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

			{/* Tampilkan data Pengguna dan Peta Perjalanan */}
			<h2>Data Pengguna dan Peta Perjalanan</h2>
			<table>
				<thead>
					<tr>
						<th>Nama Pengguna</th>
						<th>Points</th>
						<th>Peta Perjalanan</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.username}</td>
							<td>{user.points}</td>
							<td>
								<img
									src={userMapImages[user.id]}
									alt={`Map of ${user.username}'s journeys`}
									style={{ width: '200px', height: '200px' }}
								/>
							</td>
							<td>
								<button onClick={() => handleDeleteUser(user.id)}>Hapus</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UserList;
