var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('../models/connection');
const Tweet = require('../models/tweets');
const Trend = require('../models/trends');
const { checkBody } = require('../modules/checkBody');

/* GET liste des Tweets */
router.get('/', (req, res) => {
	Tweet.find()
    .populate('user')
    .then(data => {
        console.log("route GET tweets");
		res.json({ tweets: data });
	});
});

/* GET contenu d'un Tweet */
router.get('/:idTweet', (req, res) => {
	Tweet.findOne( {_id: req.params.idTweet} )
    .populate('user')
    .then(data => {
		res.json( data );
	});
});

/* POST créer un nouveau Tweet */
router.post('/:idUser', (req, res) => {

    // On verifie si le champ est rempli
    if (!checkBody(req.body, ['message'])) {
      res.json({ result: false, error: 'Missing or empty fields' });
      return;
    }
  
    // On extrait le hashtag du message
    const message = req.body.message;
    const pattern = /#[a-z0-9_]+/g;
    const found = message.match(pattern);
    console.log(found);

    // On vérifie si la hashtag n'est pas déjà dans la collection Trend
    Trend.findOne({ name: found })
        .then(data => {
            // Si oui, on récupère l'id d uTrend existant
            if(data) {
                console.log("Trend already exists");
                console.log(data._id);
                console.log(data.name);
            
                const newTweet = new Tweet({
                    message: req.body.message,
                    trend: data._id,
                    user: req.params.idUser,
                });
            
                newTweet.save().then(newDoc => {
                    console.log("New Tweet inserted");
                    res.json({ result: true });
                });
            // sinon on défini un nouvel ID pour le nouveau Trend
            } else {
                let hashtag;
                let idNewTrend;
                if(found!="") {
                    idNewTrend = new mongoose.Types.ObjectId();
                    hashtag = found[0];
                
                    const newTrend= new Trend({
                        _id: idNewTrend,
                        name: hashtag,
                    });
                    newTrend.save().then(newDoc => {
                        console.log("New Trend inserted");
                    });
                }
            
                const newTweet = new Tweet({
                    message: req.body.message,
                    trend: idNewTrend,
                    user: req.params.idUser,
                });
            
                newTweet.save().then(newDoc => {
                    console.log("New Tweet inserted");
                    res.json({ result: true });
                });
            }
        });

});

/* DELETE supprimer un Tweet */
router.delete('/:idTweet', (req, res) => {
    Tweet.deleteOne({ _id: req.params.idTweet })
    .then(deletedDoc => {
        if (deletedDoc.deletedCount > 0) {
          // document successfully deleted
          res.json({ result: true, error: "Tweet deleted !" });
        } else {
          res.json({ result: false, error: "Tweet not found" });
        }
      });
});
module.exports = router;