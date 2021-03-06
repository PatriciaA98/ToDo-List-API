const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const TasksController = require('../controllers/tasks');



//Displays all orders stored in database
router.get("/:userId", checkAuth, TasksController.tasks_get_all);

//Creates a new order
router.post('/', checkAuth, TasksController.tasks_create_task);

//Displays a given order
router.get('/:taskId/:userId', checkAuth, TasksController.tasks_get_task);

//Updates a given product
router.patch('/:taskId/:userId', TasksController.tasks_update_task);

//Deletes a given order
router.delete('/:taskId', checkAuth, TasksController.tasks_delete_task);

module.exports = router;