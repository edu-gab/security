var express = require('express');
var router = express.Router();

let crypto = require('crypto');

const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async function (req, res, next) {

  let { username, password } = req.body
  if (username != null && password != null) {

    try {

      let userData = await models.users.findOne({
        where: {
          name: username
        }
      })

      if (userData != null && userData.password != null) {

        let salt = userData.password.split("$")[0]
        let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
        let passwordHash = salt + "$" + hash

        if (passwordHash === userData.password) {
          res.redirect('/users');
        } else {
          res.redirect('/');
        }
      } else {
        res.redirect('/');
      }

    } catch (error) {
      res.status(400).send(error)
    }
  } else {
    res.redirect('/');
  }

});

module.exports = router;
