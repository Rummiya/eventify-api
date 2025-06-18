import fs from 'fs';
import path from 'path';

export const ensureUploadDirs = dirs => {
	dirs.forEach(dir => {
		const fullPath = path.resolve(dir);
		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath, { recursive: true });
		}
	});
};
