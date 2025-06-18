import express from 'express';
import multer from 'multer';
import { CompanyController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { storage } from '../utils/uploadsStorage.js';

export const companyRouter = express.Router();

// показываем, где хранить файлы
const upload = multer({ storage });

companyRouter.get(
	'/companies/my',
	authenticateToken,
	CompanyController.getMyCompanies
);
companyRouter.post(
	'/companies',
	authenticateToken,
	upload.single('logo'),
	CompanyController.createCompany
);
companyRouter.put(
	'/companies/:id',
	authenticateToken,
	upload.single('logo'),
	CompanyController.updateCompany
);
companyRouter.get(
	'/companies',
	authenticateToken,
	CompanyController.getAllCompanies
);
companyRouter.get(
	'/companies/:id',
	authenticateToken,
	CompanyController.getCompanyById
);
companyRouter.delete(
	'/companies/:id',
	authenticateToken,
	CompanyController.deleteCompany
);
