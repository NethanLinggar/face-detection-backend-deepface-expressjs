const UserController = require('../controllers/users.js')

const router = require('express').Router();

router.get('/', UserController.getAllUsers)
router.post('/', UserController.createNewUser)

module.exports = router;