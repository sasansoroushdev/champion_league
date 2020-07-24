const express = require('express');
const {
    drawAndCreateGroups,
    getGroupAndResults
} = require('../controllers/groupandresult');

const Groupandresult = require('../models/GroupAndResult');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('user'));

router
  .route('/drawandgetgroups')
  .get(drawAndCreateGroups);

router
  .route('/:groupName')
  .get(getGroupAndResults);

module.exports = router;