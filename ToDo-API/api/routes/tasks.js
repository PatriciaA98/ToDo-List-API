const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
//imports object product 

const TasksController = require('../controllers/tasks');

//displays all products in database
router.get('/', TasksController.tasks_get_all );

//creates/ post new products to the database
router.post('/', TasksController.tasks_create_task);

//display the product with the productID the user gives
router.get('/:taskId', TasksController.tasks_get_task);

//Updates a given product
router.patch('/:taskId', TasksController.tasks_update_task);

//deletes a given product
router.delete('/:taskId', TasksController.tasks_delete_task);

module.exports = router;