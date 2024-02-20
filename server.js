const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const ExcelJS = require('exceljs');

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

// Middleware untuk menangani kesalahan
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Terjadi kesalahan server.' });
});

// Middleware untuk menangani rute register
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

// Middleware untuk menangani rute perjalanan
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
				return next(err);
			} else {
				console.log('Data perjalanan berhasil disimpan');
				res.status(200).json({ message: 'Data perjalanan berhasil disimpan' });
			}
		}
	);
});

// Middleware untuk menangani rute stop perjalanan
app.post('/api/stop_perjalanan', (req, res) => {
	const { nama, koordinat_end } = req.body;

	if (!nama || !koordinat_end) {
		return res
			.status(400)
			.json({ error: 'Nama dan koordinat_end harus diisi.' });
	}

	const waktuStop = new Date();

	// Hitung panjang perjalanan (dummy implementation)
	const panjangPerjalanan = 0;

	// Hitung poin diperoleh (dummy implementation)
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
				res.status(200).json({
					message: 'Perjalanan berhasil dihentikan.',
					poin_diperoleh: poinDiperoleh, // Sertakan poin dalam respons
				});
			} else {
				console.log('Perjalanan tidak ditemukan atau sudah dihentikan');
				res
					.status(404)
					.json({ error: 'Perjalanan tidak ditemukan atau sudah dihentikan.' });
			}
		}
	);
});

// Middleware untuk menangani rute login
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
			return next(err);
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

// Middleware untuk menangani rute perjalanan
app.get('/api/perjalanans', (req, res) => {
	const sql = 'SELECT * FROM data_perjalanan';
	db.query(sql, (err, result) => {
		if (err) {
			return next(err);
		}

		// Mengonversi keterangan waktu ke dalam format yang diinginkan (tanpa '000Z')
		const perjalanans = result.map((perjalanan) => {
			return {
				...perjalanan,
				waktu: new Date(perjalanan.waktu).toLocaleString(),
			};
		});

		res.status(200).json(perjalanans);
	});
});

// Middleware untuk menangani rute pengguna
app.get('/api/users', (req, res) => {
	const sql = 'SELECT * FROM register_data';
	db.query(sql, (err, result) => {
		if (err) {
			return next(err);
		}

		res.status(200).json(result);
	});
});

// Middleware untuk menangani rute export-to-excel
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
