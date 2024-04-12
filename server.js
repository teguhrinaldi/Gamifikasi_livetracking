const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const ExcelJS = require('exceljs');
const next = require('next');

const app = express();
const port = 3001;

const db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'teguhganteng',
	database: 'data_register',
	port: 3306,
});

db.connect((err) => {
	if (err) {
		console.error('Kesalahan koneksi ke MySQL:', err);
	} else {
		console.log('Terhubung ke MySQL');
	}
});

app.use(bodyParser.json());
app.use(cors());

const authenticateUser = (req, res, next) => {
	if (!req.user || req.user.role !== 'admin') {
		return res.status(403).json({ error: 'Unauthorized' });
	}
	next();
};

app.get('/userlist', authenticateUser, (req, res) => {
	res.send('This is the userlist page');
});

app.delete('/api/users/:userId', (req, res) => {
	const userId = req.params.userId;

	const sql = 'DELETE FROM register_data WHERE id = ?';
	db.query(sql, [userId], (err, result) => {
		if (err) {
			console.error('Error deleting user:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		} else {
			console.log('User deleted successfully');
			res.status(200).json({ message: 'User deleted successfully' });
		}
	});
});

app.delete('/api/perjalanans/:perjalananId', (req, res) => {
	const perjalananId = req.params.perjalananId;

	const sql = 'DELETE FROM data_perjalanan WHERE id = ?';
	db.query(sql, [perjalananId], (err, result) => {
		if (err) {
			console.error('Error deleting perjalanan:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		} else {
			console.log('Perjalanan deleted successfully');
			res.status(200).json({ message: 'Perjalanan deleted successfully' });
		}
	});
});

app.delete('/api/user-map-images/:userId', (req, res) => {
	const userId = req.params.userId;
	console.log('User map images deleted successfully');
	res.status(200).json({ message: 'User map images deleted successfully' });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Terjadi kesalahan server.' });
});

app.post('/api/register', (req, res) => {
	const { email, username, password } = req.body;

	if (!email || !username || !password) {
		return res.status(400).json({ error: 'Semua kolom harus diisi.' });
	}

	const sql =
		'INSERT INTO register_data (email, username, password) VALUES (?, ?, ?)';
	db.query(sql, [email, username, password], (err, result) => {
		if (err) {
			return err;
		}

		console.log('Data berhasil ditambahkan:', result);
		res.status(200).json({ message: 'Registrasi berhasil.' });
	});
});

app.get('/api/leaderboard', (req, res) => {
	const sql =
		'SELECT rd.username, SUM(dp.poin_diperoleh) AS total_points ' +
		'FROM data_perjalanan dp ' +
		'JOIN register_data rd ON dp.nama = rd.username ' +
		'GROUP BY rd.username ' +
		'ORDER BY total_points DESC ' +
		'LIMIT 10';

	db.query(sql, (err, result) => {
		if (err) {
			console.error('Error fetching leaderboard data:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		}

		res.status(200).json(result);
	});
});

app.post('/api/mulai_perjalanan', (req, res) => {
	const {
		nama,
		jenis_angkutan,
		maksud_perjalanan,
		tujuan_perjalanan,
		koordinat_start,
	} = req.body;

	const waktu = new Date();
	const sql = `INSERT INTO data_perjalanan (waktu, nama, jenis_angkutan, maksud_perjalanan, tujuan_perjalanan, koordinat_start) VALUES (?, ?, ?, ?, ?, ?)`;

	db.query(
		sql,
		[
			waktu,
			nama,
			jenis_angkutan,
			maksud_perjalanan,
			tujuan_perjalanan,
			koordinat_start,
		],
		(err, result) => {
			if (err) {
				return res.status(500).json({ error: 'Internal Server Error' });
			} else {
				console.log('Data perjalanan berhasil disimpan');
				res.status(200).json({ message: 'Data perjalanan berhasil disimpan' });
			}
		}
	);
});

app.post('/api/stop_perjalanan', (req, res) => {
	const { nama, koordinat_end } = req.body;

	if (!nama || !koordinat_end) {
		return res
			.status(400)
			.json({ error: 'Nama dan koordinat_end harus diisi.' });
	}

	const waktuStop = new Date();
	const panjangPerjalanan = 0;
	const poinDiperoleh = 5;

	const sql =
		'UPDATE data_perjalanan SET koordinat_end = ?, panjang_perjalanan = ?, poin_diperoleh = ? WHERE nama = ? AND koordinat_end IS NULL';

	db.query(
		sql,
		[koordinat_end, panjangPerjalanan, poinDiperoleh, nama],
		(err, result) => {
			if (err) {
				return res
					.status(500)
					.json({ error: 'Gagal menghentikan perjalanan.' });
			}

			if (result.affectedRows > 0) {
				console.log('Perjalanan berhasil dihentikan');

				// Tambahkan poin ke leaderboard jika belum ada
				const leaderboardSql =
					'INSERT INTO leaderboard (username, total_points) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_points = total_points + ?';

				db.query(
					leaderboardSql,
					[nama, poinDiperoleh, poinDiperoleh],
					(leaderboardErr, leaderboardResult) => {
						if (leaderboardErr) {
							console.error('Error updating leaderboard:', leaderboardErr);
						}
						res.status(200).json({
							message: 'Perjalanan berhasil dihentikan.',
							poin_diperoleh: poinDiperoleh,
						});
					}
				);
			} else {
				console.log('Perjalanan tidak ditemukan atau sudah dihentikan');
				res
					.status(404)
					.json({ error: 'Perjalanan tidak ditemukan atau sudah dihentikan.' });
			}
		}
	);
});

app.post('/api/login', (req, res) => {
	const { email, username, password } = req.body;

	if ((!email && !username) || !password) {
		return res
			.status(400)
			.json({ error: 'Email atau username dan password harus diisi.' });
	}

	const sql =
		'SELECT * FROM register_data WHERE (email = ? OR username = ?) AND password = ?';
	db.query(sql, [email, username, password], (err, result) => {
		if (err) {
			console.error('Error fetching login data:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		}

		if (result.length > 0) {
			console.log('Login berhasil');
			const user = result[0];
			res.status(200).json({
				message: 'Login berhasil.',
				username: user.username,
			});
		} else {
			console.log('Login gagal');
			res.status(401).json({ error: 'Email, username, atau password salah.' });
		}
	});
});

app.get('/api/perjalanans', (req, res) => {
	const sql = 'SELECT * FROM data_perjalanan';
	db.query(sql, (err, result) => {
		if (err) {
			console.error('Error fetching perjalanan data:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		}

		const perjalanans = result.map((perjalanan) => {
			return {
				...perjalanan,
				waktu: new Date(perjalanan.waktu).toLocaleString(),
			};
		});

		res.status(200).json(perjalanans);
	});
});

app.get('/api/users', (req, res) => {
	const sql = 'SELECT * FROM register_data';
	db.query(sql, (err, result) => {
		if (err) {
			return next(err);
		}

		res.status(200).json(result);
	});
});

app.post('/api/calculate-user-points', (req, res) => {
	const perjalanansData = req.body.perjalanans;
	const totalPoints = calculateTotalPoints(perjalanansData);
	res.json({ totalPoints });
});

function calculateTotalPoints(perjalanans) {
	let totalPoints = 0;

	perjalanans.forEach((perjalanan) => {
		totalPoints += perjalanan.poin_diperoleh || 0;
	});

	return totalPoints;
}

app.get('/api/export-to-excel', (req, res) => {
	const sql = 'SELECT * FROM data_perjalanan';

	db.query(sql, (err, result) => {
		if (err) {
			return next(err);
		}

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Data Perjalanan');

		const headerRow = worksheet.addRow([
			'ID',
			'Waktu',
			'Nama',
			'Jenis Angkutan',
			'Maksud Perjalanan',
			'Tujuan Perjalanan',
			'Koordinat Start',
			'Koordinat End',
			'Panjang Perjalanan',
			'Poin Diperoleh',
		]);

		result.forEach((row) => {
			worksheet.addRow(Object.values(row));
		});

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=data_perjalanan.xlsx'
		);

		workbook.xlsx.write(res).then(() => {
			res.end();
		});
	});
});

app.listen(port, () => {
	console.log(`Server berjalan di http://localhost:${port}`);
});
