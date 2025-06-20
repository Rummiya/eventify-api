export const getPagination = (page, limit) => {
	const currentPage = parseInt(page, 10);
	const take = parseInt(limit, 10);
	const skip = (currentPage - 1) * take;

	return { currentPage, take, skip };
};
