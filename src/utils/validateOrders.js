const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));

/** Validates required keys are present */
function validateKeys(req, res, next) {
  const keys = ["deliverTo", "mobileNumber", "dishes"];

  keys.forEach(
    (key) =>
      (!req.body.data.hasOwnProperty(key) || req.body.data[key] === "") &&
      next({ status: 400, message: `Order must include a ${key}` })
  );

  next();
};

/** Checks that order has dishes that have a quantity > 0 */
function validateDishes (req,res,next) {
  (!Array.isArray(req.body.data.dishes) || req.body.data.dishes.length === 0) &&
    next({ status: 400, message: `Order must include at least one dish` });

    req.body.data.dishes.forEach((dish, i) => {
    !dish.hasOwnProperty("quantity") &&
      next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });

    (typeof dish.quantity !== "number" || dish.quantity <= 0) &&
      next({
        status: 400,
        message: `Dish ${i} must have a quantity that is an integer greater than 0`,
      });
  });

  next();
}

/** Validates orderId is present and sets foundId order to res.locals property */
function validateOrderId  (req, res, next){
  if (req.params.orderId){
  const foundId = orders.find(({ id }) => id === req.params.orderId);
  if (!foundId) {
    next({
      status: 404,
      message: `No matching order ${req.params.orderId} found.`,
    });
  } else {
    res.locals.foundId = foundId;
    next();
  }} else next();
};

/** Validates status is not 'pending' */
function validatePendingStatus (req, res, next){
  let foundOrder = orders.find(({id})=> id === res.locals.foundId.id);
  foundOrder.status !== "pending"
    ? next({
        status: 400,
        message: `An order cannot be deleted unless it is pending`,
      })
    : next();
};

/** Validates body is present */
function validateBody (req, res, next) {
  (req.body.data.id && req.body.data.id !== req.params.orderId) &&
    next({
      status: 400,
      message: `Order id does not match route id. 
      Order: ${req.body.data.id}, 
      Route: ${req.params.orderId}.`,
    });

next();
};

/** Validates body status is not "invalid" or "delivered" */
function validateBodyStatus (req,res,next) {
  (!req.body.data.status ||
    req.body.data.status === "" ||
    req.body.data.status === "invalid") &&
    next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });

  req.body.data.status === "delivered" &&
    next({ status: 400, message: "A delivered order cannot be changed." });

  next();
}

module.exports = {
  validateOrders: [validateKeys, validateDishes],
  validateOrderId,
  validatePendingStatus,
  validateBody: [validateBody, validateBodyStatus]
}