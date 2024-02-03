const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const ExcelJS = require('exceljs');

const app = express();
const port = 3001;

// Konfigurasi MySQL
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'teguhganteng',
	database: 'id_user',
	insecureAuth: true,
});

// Coba tambahkan event listener untuk menangkap event error
db.on('error', (err) => {
	console.error('MySQL connection error:', err);
});

// Middleware untuk mengurai body permintaan
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint registrasi
app.post('/register', (req, res) => {
	const { email, username, password } = req.body;

	// Simpan data ke dalam tabel data_user
	const query = `INSERT INTO data_user (email, username, password) VALUES (?, ?, ?)`;
	db.query(query, [email, username, password], (err, result) => {
		if (err) {
			console.error('Error registering user:', err);
			res.status(500).json({ message: 'Internal server error' });
		} else {
			console.log('User registered successfully');
			res.status(200).json({ message: 'User registered successfully' });
		}
	});
});

// Endpoint untuk mendapatkan data pengguna
app.get('/users', (req, res) => {
	const query = `SELECT * FROM data_user`;

	db.query(query, (err, result) => {
		if (err) {
			console.error('Error fetching users:', err);
			res.status(500).json({ message: 'Internal server error' });
		} else {
			res.status(200).json(result);
		}
	});
});

// Endpoint untuk mengekspor data pengguna ke dalam Excel
app.get('/export-users', async (req, res) => {
	const query = `SELECT * FROM data_user`;

	db.query(query, async (err, result) => {
		if (err) {
			console.error('Error fetching users:', err);
			res.status(500).json({ message: 'Internal server error' });
		} else {
			try {
				const workbook = new ExcelJS.Workbook();
				const worksheet = workbook.addWorksheet('Data Pengguna');

				worksheet.columns = [
					{ header: 'ID', key: 'id' },
					{ header: 'Email', key: 'email' },
					{ header: 'Username', key: 'username' },
					{ header: 'Password', key: 'password' },
				];

				result.forEach((user) => {
					worksheet.addRow(user);
				});

				const excelBuffer = await workbook.xlsx.writeBuffer();
				res.setHeader(
					'Content-Type',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
				);
				res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
				res.send(excelBuffer);
			} catch (error) {
				console.error('Error exporting users to Excel:', error);
				res.status(500).json({ message: 'Internal server error' });
			}
		}
	});
});

// Jalankan server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
