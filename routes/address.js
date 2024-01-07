const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

const initAddressRoute = (app) => {


    return app.use('/', router);
}

module.exports = initAddressRoute;