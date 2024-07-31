var express = require('express');
var router = express.Router();

let crypto = require('crypto')

const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let usersCollection = await models.users.findAll({
    include:{all: true, nested: true},

    raw: true,
    nest: true,
  })

  let rolesCollection = await models.roles.findAll({})

  res.render('crud', { username: req.cookies['username'], title: 'CRUD with users', usersArray: usersCollection, rolesArray: rolesCollection})
});

router.post('/', async (req, res) => {
  
  let{ name, password, idrole } = req.body;

  try{
    
    let salt = process.env.SALT
    let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
    let passwordHash = salt + "$" + hash

    let user = await models.users.create({name: name, password: passwordHash})

    await models.users_roles.create({ users_iduser: user.iduser, roles_idrole: idrole })

    res.redirect('/users')
  } catch(error){
    res.status(400).send(error)
  }
})

module.exports = router;
