var articleModel = require('../models/article.js');
var counterModel = require('../models/counter.js');

/**
 * articleController.js
 *
 * @description :: Server-side logic for managing articles.
 */
module.exports = {

    // boardController.count()
    totalArticle: (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      articleModel.count().exec(function (err, count) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting article.',
                    error: err
                });
            }
            return res.json(count);
        });
    },
    /**
     * articleController.list()
     */
    list: (req, res) => {
      var pageNo = req.params.pageNo - 1;
      var size = req.params.size;

      size = parseInt(size);
      pageNo = parseInt(pageNo);
      pageNo = pageNo * size;

      res.setHeader('Access-Control-Allow-Origin', '*');

      articleModel.find().sort({ seq : -1 }).skip(pageNo).limit(size).exec(function (err, articles) {
          if (err) {
              return res.status(500).json({
                  message: 'Error when getting article.',
                  error: err
              });
          }
          return res.json(articles);
      });
    },

    /**
     * articleController.show()
     */
    show: function (req, res) {
        var seq = req.params.seq;
        res.setHeader('Access-Control-Allow-Origin', '*');

        articleModel.findOne({ seq:seq }, function (err, article) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting article.',
                    error: err
                });
            }
            if (!article) {
                return res.status(404).json({
                    message: 'No such article'
                });
            }
            article.save();
            console.log(article);

            return res.json(article);
        });
    },

    // boardController.searchByName()
    searchByName: function (req, res) {
      res.setHeader('Access-Control-Allow-Origin', '*');

      var word = req.params.name;
      articleModel.find({ 'user.name' : word }, function (err, article) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting article.',
                error: err
            });
        }
        if (!article) {
            return res.status(404).json({
                message: 'No such article'
            });
        }
        return res.json(article);
      })
    },

    // boardController.search()
    search: function (req, res) {
      var key = req.params.key;
      var word = req.params.word;
      var data = { "key":key, "word":word };
      //var searchParam = key;
      console.log(key);
      res.setHeader('Access-Control-Allow-Origin', '*');

      articleModel.find({ 'user.name' : word }).exec(function (err, article) {
        if (err) {
            return res.status(500).json({
                message: 'Error when getting article.',
                error: err
            });
        }
        if (!article) {
            return res.status(404).json({
                message: 'No such article'
            });
        }
        return res.json(article);
      })
      // return res.send(200);
    },

    // PUT boardController.nextSeq
    nextSeq: function (req, res) {
      res.setHeader('Access-Control-Allow-Origin', '*');

      var nextSeq = counterModel.increment('seq', function (err, result) {
          if (err) {
              console.error('Counter save error: ' + err);
              return;
          }
          return res.json(result.next);
      });

    },

    /**
     * articleController.create()
     */
    create: function (req, res) {
      res.setHeader('Access-Control-Allow-Origin', "*");

      var article = new articleModel({
        seq: req.body.seq,
		    subject : req.body.subject,
		    content : req.body.content,
        user: {
          id : req.body.id,
          name : req.body.name
        },
        time : req.body.time
      });

      article.save(function (err, article) {
        if (err) {
          return res.status(500).json({
            message: 'Error when creating article',
            error: err
          });
        }
        return res.status(201).json(article);
      });

    },

    /**
     * articleController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        articleModel.findOne({_id: id}, function (err, article) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting article',
                    error: err
                });
            }
            if (!article) {
                return res.status(404).json({
                    message: 'No such article'
                });
            }

            article.title = req.body.title ? req.body.title : article.title;
            article.author = req.body.author ? req.body.author : article.author;

            article.save(function (err, article) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating article.',
                        error: err
                    });
                }

                return res.json(article);
            });
        });
    },

    /**
     * articleController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        articleModel.findByIdAndRemove(id, function (err, article) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the article.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
