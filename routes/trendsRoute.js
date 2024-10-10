var express = require('express');
var router = express.Router();

require('../models/connection');
const Trend = require('../models/trends');

/* GET trends listing. */
router.get('/', (req, res) => {
	Trend.find().then(data => {
		res.json({ trends: data });
	});
});

module.exports = router;