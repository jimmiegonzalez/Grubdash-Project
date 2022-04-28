const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

/** Checks Body field has data */
function validateBody (req, res, next){
  if ( !req.body || !req.body.data){
    next({
      status: 400,
      message: `Request must have a body field with data!`,
    }) } else next();
}


/** Checks dishes have corresponding keys */
function validateKeys (req, res, next) {
  const keys = ["name", "description", "price", "image_url"];

  keys.forEach(
    (key) =>
      (!req.body.data.hasOwnProperty(key) || req.body.data[key] === "") &&
      next({ status: 400, message: `Dish must include a ${key}` })
  );

  next();
};

/* Checks price is a valid number > 0 */
function validatePrice (req, res, next) {
  if (typeof req.body.data.price !== "number" || req.body.data.price <= 0){
    next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    })
  }else next();
}

/** Checks Parameter Dish Id Exists in Dishes */
function validateDishId (req, res, next) {
  if (req.params.dishId) {
    const foundId = dishes.find(({ id }) => id === req.params.dishId);
    !foundId
      ? next({
          status: 404,
          message: `Dish does not exist: ${req.params.dishId}.`,
        })
      : (res.locals.foundDish = foundId);
  }
  next();
};

/* Checks Dish Id matches Route Id */
function validateIdMatch (req, res, next) {
  if (req.params.dishId) {
    req.body.data && req.body.data.id && req.body.data.id !== req.params.dishId
      ? next({
          status: 400,
          message: `Dish id does not match route id. 
        Dish: ${req.body.data.id}, 
        Route: ${req.params.dishId}`,
        })
      : "";
  }
  next();
};

module.exports = {
  validateDishes: [validateBody, validateKeys, validatePrice],
  validateDishId: [validateDishId, validateIdMatch],
};
