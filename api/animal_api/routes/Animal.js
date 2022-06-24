const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;


//creating data
router.post('/createAnimal', (req, res) => {
    const { lifespan } = req.body;
    const numberSent = !Number.isNaN(Number(lifespan));
  
    const newEvent = new Animal({
      title: req.body.title,
      description: req.body.description,
      lifespan: numberSent ? Number(lifespan) : undefined,
    });
  
    Animal.create(newEvent, (error, post) => {
      if (error) {
        return res.sendStatus(BAD_REQUEST);
      } else {
        return res.json(post);
      }
    });
  });

  //reading data

  router.get('/getAnimals', (req, res) => {
    Animal.find()
      .then(items => res.status(OK).send(items))
      .catch(error => {
        res.sendStatus(BAD_REQUEST);
      });
  });

  //updating data
  router.post('/editAnimal', (req, res) => {
    const {
      title,
      description,
      lifespan,
      _id,
    } = req.body;
    Animal.findOne({ _id })
      .then(Animal => {
        Animal.title = title || Animal.title;
        Animal.description = description || Animal.description;
        Animal.lifespan = lifespan || Animal.lifespan;
        Animal
          .save()
          .then(() => {
            res.sendStatus(OK);
          })
          .catch(() => {
            res.sendStatus(BAD_REQUEST);
          });
      })
      .catch(() => {
        res.sendStatus(NOT_FOUND);
      });
  });

  //deleting data
  router.post('/deleteAnimal', (req, res) => {
    Animal.deleteOne({ _id: req.body._id })
      .then(result => {
        if (result.n < 1) {
          res.sendStatus(NOT_FOUND);
        } else {
          res.sendStatus(OK);
        }
      })
      .catch(() => {
        res.sendStatus(BAD_REQUEST);
      });
  });

  module.exports = router;