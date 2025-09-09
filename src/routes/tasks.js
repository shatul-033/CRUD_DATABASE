const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/role');
const tasksController = require('../controllers/task.controller');


router.use(protect);

router.get('/', tasksController.listTasks);
router.post('/', tasksController.createTask);
router.get('/:id', tasksController.getTask);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);



module.exports = router;
