const PythonController = require('../controllers/python_test.js')

const router = require('express').Router();

router.get('/', PythonController.pythonTest)

module.exports = router;