const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folderMap = {
			avatar: 'uploads/avatars',
			banner: 'uploads/banners',
			logo: 'uploads/company-logos',
		};

		const folder = folderMap[file.fieldname];

		if (!folder) {
			return cb(new Error('Invalid field name for file upload'), null);
		}

		cb(null, folder);
	},

	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname); // сохраняет оригинальное расширение
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
		cb(null, uniqueName);
	},
});

module.exports = storage;
