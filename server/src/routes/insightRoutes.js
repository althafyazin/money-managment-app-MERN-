const express = require('express');
const insightController = require('../controllers/insightController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', insightController.getInsights);

module.exports = router;
