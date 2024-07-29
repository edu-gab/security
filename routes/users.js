var express = require('express');
var router = express.Router();

let crypto = require('crypto')

const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let usersCollection = await models.users.findAll({})
  res.render('crud', {title: 'CRUD with users', usersArray: usersCollection});
});

router.post('/', async (req, res) => {
  let{ name, password, idrole } = req.body;

  try{
    let salt = process.env.SALT
    let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
    let passwordHash = salt + "$" + hash

    let user = await models.users.create({name: name, password: passwordHash})

    res.redirect('/users')
  } catch(error){
    res.status(400).send(error)
  }
})

module.exports = router;
