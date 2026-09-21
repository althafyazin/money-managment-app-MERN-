const express = require('express');
const recurringController = require('../controllers/recurringController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(recurringController.getAll)
  .post(recurringController.create);

router.post('/process', recurringController.processDue);
router.delete('/:id', recurringController.delete);

module.exports = router;
