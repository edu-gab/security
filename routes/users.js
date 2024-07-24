var express = require('express');
var router = express.Router();

const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let usersCollection = await models.users.findAll({})
  res.render('crud', {title: 'CRUD with users', usersArray: usersCollection});
});

module.exports = router;
