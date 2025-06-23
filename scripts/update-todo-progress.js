import fs from 'fs';

const path = './ToDo.md';
const content = fs.readFileSync(path, 'utf-8');

const total =
	(content.match(/- \[ /g) || []).length +
	(content.match(/- \[x\]/gi) || []).length;
const done = (content.match(/- \[x\]/gi) || []).length;

const percent = Math.round((done / total) * 100);
const progressText = `_Прогресс: ${done} из ${total} задач выполнено (${percent}%)_ ✅`;

// Заменяем старую строку прогресса или добавляем её после заголовка
const newContent = content
	.replace(/^_Прогресс:.*\n/m, '')
	.replace(/^(## 📋 ToDo)/m, `$1\n\n${progressText}`);

fs.writeFileSync(path, newContent);

console.log(`✔ Прогресс обновлён: ${done}/${total} (${percent}%)`);
