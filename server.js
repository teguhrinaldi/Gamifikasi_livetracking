const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/gamifikai_database', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Koneksi MongoDB gagal:'));
db.once('open', function () {
	console.log('Terhubung ke MongoDB');
});

const registrasiSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
});

const Registrasi = mongoose.model('Registrasi', registrasiSchema);

app.post('/api/registrasi', async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const registrasi = new Registrasi({ email, username, password });
		await registrasi.save();

		res.status(201).json({ message: 'Data registrasi disimpan.' });
	} catch (error) {
		res.status(500).json({ error: 'Gagal menyimpan data registrasi.' });
	}
});

app.get('/api/export-excel', async (req, res) => {
	try {
		const registrasiData = await Registrasi.find({}, { _id: 0, __v: 0 });

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Data Registrasi');

		worksheet.columns = [
			{ header: 'Email', key: 'email', width: 20 },
			{ header: 'Username', key: 'username', width: 20 },
			{ header: 'Password', key: 'password', width: 20 },
		];

		registrasiData.forEach((data) => {
			worksheet.addRow(data);
		});

		const filePath = 'data_registrasi.xlsx';
		await workbook.xlsx.writeFile(filePath);

		res.download(filePath, 'data_registrasi.xlsx', () => {
			fs.unlinkSync(filePath);
		});
	} catch (error) {
		res.status(500).json({ error: 'Gagal mengekspor ke Excel.' });
	}
});

app.listen(port, () => {
	console.log(`Server berjalan di http://localhost:${port}`);
});
