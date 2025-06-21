export const validate = schema => (req, res, next) => {
	try {
		req.body = schema.parse(req.body); // Валидация и преобразование
		next();
	} catch (err) {
		if (err.errors) {
			return res.status(400).json({ error: err.errors[0].message });
		}
		res.status(400).json({ error: 'Некорректные данные' });
	}
};
