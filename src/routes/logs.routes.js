const LogController = require('../controllers/logs.controller')

const router = require('express').Router();

router.get('/:userNrp', LogController.getLogs)
router.post('/', LogController.createNewLog)

module.exports = router;