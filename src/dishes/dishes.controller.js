const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));

// Validation imported from Utils Folder
const {validateDishes, validateDishId, validateBody} = require(path.resolve('src/utils/validateDishes'))
const nextId = require("../utils/nextId");

// Gets one or all orders
function list (req, res) {
  if (req.params.dishId){
   res.status(200).json({ data: res.locals.foundDish })
  } else res.status(200).json({ data: dishes });
}

// Creates new order
function create (req, res) {
  let data = req.body.data;
  data['id'] = nextId();
  dishes.push(data);
  res.status(201).json({ data });
};

// Updates an order
function update (req, res) {
  let data = req.body.data;
  data['id'] = req.params.dishId;
  let foundIndex = dishes.indexOf(({id})=> id === req.params.dishId)
  dishes.splice(foundIndex,1, data)
  res.status(200).json({ data });
};

/** Validation is spread into separate arguments with ...  */
module.exports = {
  list: [...validateDishId, list],
  create: [...validateDishes, create],
  update: [...validateDishId, ...validateDishes, update],
};
