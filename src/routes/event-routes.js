import express from 'express';
import multer from 'multer';
import { EventController } from '../controllers/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { storage } from '../utils/uploadsStorage.js';

export const eventRouter = express.Router();

// показываем, где хранить файлы
const upload = multer({ storage });

eventRouter.post(
	'/events',
	authenticateToken,
	upload.single('banner'),
	EventController.createEvent
);
eventRouter.put(
	'/events/:id',
	authenticateToken,
	upload.single('banner'),
	EventController.updateEvent
);
eventRouter.get('/events', authenticateToken, EventController.getAllEvents);
eventRouter.get('/events/:id', authenticateToken, EventController.getEventById);
eventRouter.delete(
	'/events/:id',
	authenticateToken,
	EventController.deleteEvent
);
