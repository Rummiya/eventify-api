import fs from 'fs';

const paths = ['./ToDo.md', './BUGS.md'];
const contents = paths.map(path => fs.readFileSync(path, 'utf-8'));

contents.forEach((content, i) => {
	const total =
		(content.match(/- \[ /g) || []).length +
		(content.match(/- \[x\]/gi) || []).length;
	const done = (content.match(/- \[x\]/gi) || []).length;

	const percent = Math.round((done / total) * 100);
	const progressText = `__Прогресс: ${done} из ${total} задач выполнено (${percent}%)__ ✅`;

	const hasProgressLine = /^__Прогресс:.*\n?/m.test(content);

	let newContent;

	if (hasProgressLine) {
		// Если прогресс уже есть, заменить строку прогресса на новую (без добавления лишних переносов)
		console.log('1');

		newContent = content.replace(/^__Прогресс:.*\n?/m, progressText);
	} else {
		// Если строки прогресса нет, вставить прогресс после заголовка с переносом строки
		if (paths[i].includes('ToDo.md')) {
			console.log(paths[i]);

			newContent = content.replace(/^(## 📋 ToDo)/m, `$1\n\n${progressText}`);
		} else if (paths[i].includes('BUGS.md')) {
			console.log(paths[i]);

			newContent = content.replace(
				/^(## Список багов)/m,
				`$1\n\n${progressText}`
			);
		} else {
			// Если заголовок не найден — оставить без изменений
			newContent = content;
		}
	}

	fs.writeFileSync(paths[i], newContent);

	console.log(
		`✔ Прогресс обновлён (${paths[i]}): ${done}/${total} (${percent}%)`
	);
});
