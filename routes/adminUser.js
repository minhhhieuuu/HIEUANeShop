const express = require('express');
const router = express.Router();

const adminUserController = require('../controllers/adminUserController');
const authController = require('../controllers/authController');

const initAdminUserRoute = (app) => {
    router.get('/users-manage', authController.isLoggedAdmin, adminUserController.getUsersManage);
    router.get('/manage/details-user/:id', authController.isLoggedAdmin, adminUserController.getDetailsUser);
    router.get('/users-manage/:id/ban', authController.isLoggedAdmin, adminUserController.banUser);
    router.get('/users-manage/:id/unban', authController.isLoggedAdmin, adminUserController.unbanUser);

    return app.use('/', router)
}

module.exports = initAdminUserRoute;