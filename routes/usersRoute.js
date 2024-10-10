var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET liste des utilisateurs */
router.get('/', (req, res) => {
	User.find().then(data => {
		res.json({ users: data });
	});
});

/* POST créer un compte utilisateur */
router.post('/signup', (req, res) => {

  // On verifie si les champs sont remplis
  if (!checkBody(req.body, ['firstname', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // On verifie si l'utilisateur n'a pas déjà un compte
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // Utilisateur déjà présent dans la base
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

/* POST se connecter au compte */
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

module.exports = router;
