var express = require('express');
var boardController = require('../controllers/boardController');

var router = express.Router();

// GET
router.get('/list/:size/:pageNo', boardController.list);

// GET 글 갯수 구하기
router.get('/totalArticle', boardController.totalArticle);

// GET
router.get('/:seq', boardController.show);

// GET
router.get('/name/:name', boardController.searchByName);

// GET
router.get('/search/key/:key/word/:word', boardController.search);

// PUT
router.put('/seq', boardController.nextSeq);

// POST
router.post('/', boardController.create);

// PUT
router.put('/:id', boardController.update);

// DELETE
router.delete('/:id', boardController.remove);


module.exports = router;
