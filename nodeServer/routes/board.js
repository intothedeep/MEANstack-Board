var boardController = require('../controllers/boardController');
var express = require('express');
var router = express.Router();
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
router.post('/', boardController.create);

// PUT modify an article with seq = :seq
router.put('/:seq', boardController.update);

// DELETE an article with seq = :seq
router.delete('/:seq', boardController.remove);


module.exports = router;
