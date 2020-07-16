const controller = require('../controllers/TransactionController.js');
const express = require('express');
const transactionRouter = express.Router();

transactionRouter.post('/', controller.create);
transactionRouter.get('/', controller.findAll);
transactionRouter.get('/:id', controller.findOne);
transactionRouter.put('/:id', controller.update);
transactionRouter.delete('/:id', controller.remove);
transactionRouter.delete('/', controller.removeAll);

module.exports = transactionRouter;
