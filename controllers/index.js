const UserController = require('./user-controller');
const EventController = require('./event-controller');
const CommentController = require('./comment-controller');
const LikeController = require('./like-controller');
const FollowController = require('./follow-controller');
const CompanyController = require('./company-controller');
const AuthController = require('./auth-controller');

module.exports = {
	AuthController,
	UserController,
	EventController,
	CommentController,
	LikeController,
	FollowController,
	CompanyController,
};
