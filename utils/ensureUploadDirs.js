function ensureUploadDirs(dirs) {
	const fs = require('fs');
	const path = require('path');

	dirs.forEach(dir => {
		const fullPath = path.resolve(dir);
		if (!fs.existsSync(fullPath)) {
			fs.mkdirSync(fullPath, { recursive: true });
		}
	});
}

module.exports = ensureUploadDirs;
