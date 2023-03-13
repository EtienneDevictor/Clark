'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const User = require('../models/User.js');
const { getMemberExpirationDate, hashPassword } = require('../util/registerUser');
const { checkDiscordKey } = require('../../util/token-verification');
const { checkIfTokenSent, checkIfTokenValid, decodeToken } = require('../util/token-functions');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, SERVER_ERROR } = require('../../util/constants').STATUS_CODES;
const { discordApiKeys } = require('../../config/config.json');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const discordConnection = require('../util/discord-connection');

const discordRedirectUri = process.env.DISCORD_REDIRECT_URI || 'http://localhost:8080/api/user/callback';

router.get('/countAllUsers', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  }

  if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { search } = req.query;
  let status = OK;
  try {
    const count = await User.countDocuments({ });
    console.log({count})
    res.status(status).json({ count });
  } catch (error) {
    console.error(error);
    status = BAD_REQUEST;
    res.sendStatus(status);
  }
});

router.get('/currentUsers', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  }

  if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { search, page, u } = req.query;
  let status = OK;
  try {
    const limit = parseInt(u);
    const users = await User.find({
      $or: [
        { 'firstName': { '$regex': search, '$options': 'i' } },
        { 'lastName': { '$regex': search, '$options': 'i' } },
        { 'email': { '$regex': search, '$options': 'i' } }
      ]
    })
      .skip((parseInt(page) - 1) * limit)
      .limit(limit);
    res.status(status).json({ users });
  } catch (error) {
    console.error(error);
    status = BAD_REQUEST;
    res.sendStatus(status);
  }
});

router.post('/checkIfUserExists', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.sendStatus(BAD_REQUEST);
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      res.sendStatus(CONFLICT);
    } else {
      res.sendStatus(OK);
    }
  } catch (error) {
    console.error(error);
    res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
  }
});

// Delete a member
router.post('/delete', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  }

  if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  User.deleteOne({ email: req.body.email }, function(error, user) {
    if (error) {
      const info = {
        userEmail: req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'user/delete',
        errorDescription: error.message
      };

      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      return console.error(info);
    }

    if (!user || user.deletedCount < 1) {
      res.status(NOT_FOUND).send({ message: 'User not found.' });
    } else {
      res.status(OK).send({ message: `${req.body.email} was deleted.` });
    }
  });
});

// Delete a member
router.post('/delete', function deleteMember(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  User.deleteOne({ email: req.body.email }, function(error, user) {
    if (error) {
      const info = {
        userEmail: req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'user/delete',
        errorDescription: error
      };

      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (user.n < 1) {
      res.status(NOT_FOUND).send({ message: 'User not found.' });
    } else {
      res.status(OK).send({ message: `${req.body.email} was deleted.` });
    }
  });
});

// Search for a member
router.post('/search', function searchMember(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.ALUMNI)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  User.findOne({ email: req.body.email }, function(error, result) {
    if (error) {
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (!result) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }

    const user = {
      firstName: result.firstName,
      middleInitial: result.middleInitial,
      lastName: result.lastName,
      email: result.email,
      emailVerified: result.emailVerified,
      emailOptIn: result.emailOptIn,
      discordUsername: result.discordUsername,
      discordDiscrim: result.discordDiscrim,
      discordID: result.discordID,
      active: result.active,
      accessLevel: result.accessLevel,
      major: result.major,
      joinDate: result.joinDate,
      lastLogin: result.lastLogin,
      membershipValidUntil: result.membershipValidUntil,
      pagesPrinted: result.pagesPrinted,
      doorCode: result.doorCode,
      _id: result._id
    };
    return res.status(OK).send(user);
  });
});

// Search for all members
router.post('/users', function getAllMembers(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  User.find()
    .sort({ joinDate: -1 })
    .then(items => {
      res.status(OK).send(items);
    })
    .catch(() => {
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    });
});

// Edit/Update a member record
router.post('/edit', async function editMemberRecord(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  if (!req.body._id) {
    return res.sendStatus(BAD_REQUEST);
  }

  let decoded = decodeToken(req);
  if (decoded.accessLevel === membershipState.MEMBER) {
    if (req.body.email && req.body.email !== decoded.email) {
      return res
        .status(UNAUTHORIZED)
        .send('Unauthorized to edit another user');
    }
    if (
      req.body.accessLevel &&
      req.body.accessLevel !== decoded.accessLevel
    ) {
      return res
        .status(UNAUTHORIZED)
        .send('Unauthorized to change access level');
    }
  }

  if (decoded.accessLevel === membershipState.OFFICER) {
    if (
      req.body.accessLevel &&
      req.body.accessLevel === membershipState.ADMIN
    ) {
      return res.sendStatus(UNAUTHORIZED);
    }
  }

  const query = { _id: req.body._id };
  let user = req.body;

  if (typeof req.body.numberOfSemestersToSignUpFor !== 'undefined') {
    user.membershipValidUntil = getMemberExpirationDate(
      parseInt(req.body.numberOfSemestersToSignUpFor)
    );
  }

  delete user.numberOfSemestersToSignUpFor;

  if (!!user.password) {
    // hash the password before storing
    const result = await hashPassword(user.password);
    if (!result) {
      return res.sendStatus(SERVER_ERROR);
    }
    user.password = result;
  } else {
    // omit password from the object if it is falsy
    // i.e. an empty string, undefined or null
    delete user.password;
  }

  // Remove the auth token from the form getting edited
  delete user.token;

  User.updateOne(query, { ...user }, function handleUpdateMemberRecord(
    error,
    result
  ) {
    if (error) {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'user/edit',
        errorDescription: error,
      };

      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (result.nModified < 1) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${query.email} not found.` });
    }
    return res.status(OK).send({
      message: `${query.email} was updated.`,
      membershipValidUntil: user.membershipValidUntil,
    });
  });
});
router.post('/getPagesPrintedCount', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) {
      return handleBadRequest(res, 'Bad Request');
    }

    if (!user) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }
    return res.status(OK).json(user.pagesPrinted);
  });
});

router.get('/callback', async function(req, res) {
  const { code, state: email } = req.query;
  discordConnection.loginWithDiscord(code, email, discordRedirectUri)
    .then(() => {
      return res.redirect('https://discord.com/oauth2/authorized');
    })
    .catch(_ => {
      return res.status(NOT_FOUND).send('Authorization unsuccessful!');
    });
});

router.post('/getUserFromDiscordId', (req, res) => {
  const { discordID, apiKey } = req.body;
  if(!checkDiscordKey(apiKey)){
    return res.sendStatus(UNAUTHORIZED);
  }
  User.findOne({ discordID }, (err, user) => {
    if (err) {
      return handleBadRequest(res, 'Bad Request');
    } else if (!user) {
      return res.sendStatus(NOT_FOUND);
    }
    return res.status(OK).send(user);
  });
});

router.post('/updatePagesPrintedFromDiscord', (req, res) => {
  const { discordID, apiKey, pagesPrinted } = req.body;
  if(!checkDiscordKey(apiKey)){
    return res.sendStatus(UNAUTHORIZED);
  }
  User.updateOne( { discordID }, {pagesPrinted},
    (err, result) => {
      if (err) {
        return handleBadRequest(res, 'Bad Request');
      } else if (result.n === 0) {
        return res.sendStatus(NOT_FOUND);
      }
      return res.sendStatus(OK);
    });
});
router.post('/connectToDiscord', function(req, res) {
  const email = req.body.email;
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!email) {
    return res.sendStatus(BAD_REQUEST);
  }
  if (!discordApiKeys.ENABLED) {
    return res.sendStatus(OK);
  }

  // eslint-disable max-len
  return res.status(OK)
    .send(`https://discord.com/api/oauth2/authorize?client_id=${discordApiKeys.CLIENT_ID}&redirect_uri=${encodeURIComponent(discordRedirectUri)}&state=${email}&response_type=code&scope=identify`);
  // eslint-enable max-len
  });

router.post('/getUserById', async (req, res) => {
  try {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
      return res.sendStatus(UNAUTHORIZED);
    }
    const user = await User.findOne({ _id: req.body.userID });
    if (!user) {
      return res.sendStatus(NOT_FOUND);
    }
    const { password, ...omittedPassword } = user._doc;
    return res.status(OK).json(omittedPassword);
  } catch (err) {
    console.error(err);
    return res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;