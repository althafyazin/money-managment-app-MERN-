const express = require('express');
const exportController = require('../controllers/exportController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/csv', exportController.downloadCsv);

module.exports = router;
