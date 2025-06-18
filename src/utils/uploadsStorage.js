import multer from 'multer';
import path from 'path';

export const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const folderMap = {
			avatar: 'uploads/avatars',
			banner: 'uploads/banners',
			logo: 'uploads/logos',
		};

		const folder = folderMap[file.fieldname];

		if (!folder) {
			return cb(new Error('Invalid field name for file upload'), null);
		}

		cb(null, path.resolve(folder));
	},

	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname); // сохраняет оригинальное расширение
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
		cb(null, uniqueName);
	},
});
