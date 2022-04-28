const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));

// Validation imported from Utils Folder
const {validateOrderId, validateOrders, validateBody,validatePendingStatus} = require(path.resolve('src/utils/validateOrders.js'))
const nextId = require("../utils/nextId");

// Gets one or all orders
function list (req, res, next) {
  res.locals.foundId
    ? res.status(200).json({ data: res.locals.foundId })
    : res.status(200).json({ data: orders });
};

// Creates new order
function post (req, res) {
  let data = req.body.data;
  data['id'] = nextId();
  orders.push(data);
  res.status(201).json({ data: data });
};

// Updates an order
function put(req, res) {
  let data = req.body.data;
  data['id'] = req.params.orderId;
  let foundIndex = orders.indexOf(({id})=> id === req.params.orderId)
  orders.splice(foundIndex,1, data)
  res.status(200).json({ data });
};

// Deletes an order
function del(req, res) {
  let foundIndex = orders.indexOf(({id})=> id === res.locals.foundId);
  orders.splice(foundIndex,1)
  res.sendStatus(204);
};

/** Validation is spread into separate arguments with ...  */
module.exports = {
  list: [validateOrderId, list],
  post: [...validateOrders, post],
  put: [validateOrderId, ...validateBody, ...validateOrders, put],
  del: [validateOrderId, validatePendingStatus, del],
};
