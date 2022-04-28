const router = require("express").Router();
const notAllowed = require('../errors/methodNotAllowed')
const {list, post, put, del} = require('./orders.controller')


router.route('/')
      .get(list)
      .post(post)
      .all(notAllowed)

router.route('/:orderId')
      .get(list)
      .put(put)
      .delete(del)
      .all(notAllowed)

module.exports = router;
