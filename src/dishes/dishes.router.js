const router = require("express").Router();
const {list, create, update} = require('./dishes.controller')
const notAllowed = require('../errors/methodNotAllowed')

router.route('/')
      .get(list)
      .post(create)
      .all(notAllowed)

router.route('/:dishId')
      .get(list)
      .put(update)
      .all(notAllowed)

module.exports = router;
