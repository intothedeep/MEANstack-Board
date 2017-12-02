var boardController = require('../controllers/boardController');
var express = require('express');

var cors = require('cors');
var whitelist = ['http://localhost:4200', 'http://localhost'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

var router = express.Router();

 // include before other routes
router.options('*', cors(corsOptions))

// GET
router.get('/list/:size/:pageNo', boardController.list);

// GET # of articles in DB
router.get('/totalArticle', boardController.totalArticle);

// GET an article with seq = :seq
router.get('/:seq', boardController.show);

// GET an article with name = :name
router.get('/name/:name', boardController.searchByName);

// GET an article with search key = :key and search word = :word
router.get('/search/key/:key/word/:word', boardController.search);

// GET next seq of an article which will be written
router.get('/seq/next', boardController.nextSeq);

// POST save an article
router.post('/', cors(corsOptions), boardController.create);

// PUT modify an article with seq = :seq
router.put('/:seq', cors(corsOptions), boardController.update);

// DELETE an article with seq = :seq
router.delete('/:seq', cors(corsOptions), boardController.remove);


module.exports = router;
