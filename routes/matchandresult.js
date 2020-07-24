const express = require('express');
const {
    getMatchAndResults,
    predictAndPlayMatch
} = require('../controllers/matchandresult');

const MatchAndResult = require('../models/MatchAndResult');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');

  router
  .route('/:groupName')
  .get(getMatchAndResults);


  router
  .route('/predictandplaymatch/:matchId')
  .get(predictAndPlayMatch);

module.exports = router;
