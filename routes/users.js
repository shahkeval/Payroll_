const express = require("express");
const router = express.Router();

const userCtrl = require("../controller/user.controller");

/**
 * Route to return user detail.
 * @method GET/
 * @name findOne
 */
router.get("/users/:id", userCtrl.findOne);

/**
 * Route to return user detail with pagination.
 * @method GET/
 * @name findAllWithPagination
 */
router.get("/users", userCtrl.findAll);

/**
 * Route to return new  user.
 * @method POST/
 * @name createUser
 */
router.post("/users", userCtrl.createUser);

/**
 * Route to return user  update by user Id
 * @method PUT/
 * @name updateById
 */
router.put("/users/:id", userCtrl.updateById);

/**
 * Route to return message which is deleted by userId
 * @method DELETE/
 * @name removeUser
 */
router.delete("/users/:id", userCtrl.removeUser);


module.exports = router;

