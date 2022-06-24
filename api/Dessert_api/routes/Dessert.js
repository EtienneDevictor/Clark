const express = require('express');
const router = express.Router();
const Dessert = require('../models/Dessert');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;


//creating data
router.post('/createDessert', (req, res) => {
    const { rating } = req.body;
    const numberSent = !Number.isNaN(Number(rating));
  
    const newEvent = new Dessert({
      title: req.body.title,
      description: req.body.description,
      rating: numberSent ? Number(rating) : undefined,
    });
  
    Dessert.create(newEvent, (error, post) => {
      if (error) {
        return res.sendStatus(BAD_REQUEST);
      } else {
        return res.json(post);
      }
    });
  });

  //reading data

  router.get('/getDessert', (req, res) => {
    Dessert.find()
      .then(items => res.status(OK).send(items))
      .catch(error => {
        res.sendStatus(BAD_REQUEST);
      });
  });

  //updating data
  router.post('/editDessert', (req, res) => {
    const {
      title,
      description,
      rating,
      _id,
    } = req.body;
    Animal.findOne({ _id })
      .then(Dessert => {
        Dessert.title = title || Dessert.title;
        Dessert.description = description || Dessert.description;
        Dessert.rating = rating || Dessert.rating;
        Dessert
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
  router.post('/deleteDessert', (req, res) => {
    Dessert.deleteOne({ _id: req.body._id })
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