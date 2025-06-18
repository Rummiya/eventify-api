import fs from 'fs';
import path from 'path';

export const ensureUploadDirs = (dirs, baseDir = process.cwd()) => {
	dirs.forEach(dir => {
		const fullPath = path.resolve(baseDir, dir);
		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath, { recursive: true });
		}
	});
};
