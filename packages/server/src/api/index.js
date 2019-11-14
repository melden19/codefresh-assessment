const express = require('express');
const router = express.Router();

router.use('/containers', require('./containers'));
router.use('/pipelines', require('./pipelines'));

module.exports = router;
