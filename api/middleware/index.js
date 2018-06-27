const parser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const { willMoveExposeKing } = require('../../rules/interactions/');
const verifyLegalSquare = require('../../rules/movement/');

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).send('No hacks allowed. You must be logged in to do that.');
    }
  },
  isLegalMove: (req, res, next) => {
    const { user, game, selection, destin, prevPosition, prevMoves } = req.body;
    const _moveExposesKing = willMoveExposeKing(user.id, game.white, selection, destin, prevPosition, prevMoves);
    const _isLegalSquare = verifyLegalSquare(selection.piece, selection.origin, destin, prevPosition, prevMoves);
    
    if (!_moveExposesKing && _isLegalSquare) {
      next();
    } else {
      res.status(401).send('No hacks allowed. You must make a legal move.');
    }
  },
  apiMiddleware: [
    helmet(),
    parser.json(),
    parser.urlencoded({ extended: true }),
    session({
      secret: 'secret',
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: false,
        secure: false,
      },
    }),
    cors({
      credentials: true,
      allowedHeaders: 'Content-Type, authorization',
      methods: ['GET, POST, PUT, DELETE', 'OPTIONS'],
    }),
  ],
}

