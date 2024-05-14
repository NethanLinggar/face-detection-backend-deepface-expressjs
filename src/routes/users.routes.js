const UserController = require('../controllers/users.controller')

const router = require('express').Router();

// router.post('/verify/:id', UserController.verifyUser)
// router.post('/find', UserController.findUser)
router.get('/', UserController.getAllUsers)
router.get('/:id', UserController.getUser)
router.post('/', UserController.createNewUser)
router.patch('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

module.exports = router;