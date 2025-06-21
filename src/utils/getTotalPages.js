export const getTotalPages = (total, take) => {
	return Math.ceil(total / take);
};
