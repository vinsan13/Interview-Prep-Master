const {Router} =require('express');
const formController= require('../controllers/formController');
const {isAuth} = require('../middleware/authMiddleware');

const router=Router();

router.get('/formQuestion',isAuth,formController.formQuestion_get);
router.post('/formQuestion',isAuth,formController.formQuestion_post);
router.get('/formExperience',isAuth,formController.formExperience_get);
router.post('/formExperience',isAuth,formController.formExperience_post);

module.exports = router;