const express = require('express');
const {
  login
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/login', login);
module.exports = router;
