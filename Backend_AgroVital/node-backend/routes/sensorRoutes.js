const express = require('express');
const { saveSensorData, getSensorData } = require('../controllers/sensorController');

const router = express.Router();

router.post('/sensor-data', saveSensorData);
router.get('/sensor-data', getSensorData);

module.exports = router;
