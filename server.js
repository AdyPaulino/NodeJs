//server.js
var port = process.env.PORT || 8080;

//load dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true})); //to read the body in a friendly way
app.use(bodyParser.json()); // to respond with a json format

//setup DB connection
mongoose.set('debug', true);
mongoose.connect('mongodb://node_sample:123@ds051853.mongolab.com:51853/node_sample');
mongoose.connection.on('error', function(err){console.log(err);})

//load models
var Article = require('./app/models/article');

//setup router
var router = express.Router();
router.get('/', function (req, res){
	res.json({'message': 'Json is running'});
});

router.route('/articles')
		
	.get(function(req, res){
		Article.find(function(err, articles){ //return an error or articles
			if (err){
				res.send(err);
			}
			res.json(articles);
		});
	})

    .post(function(req, res){
        var article = new Article();
        article.title = req.body.title;
        article.body = req.body.body;
        
        article.save(function(err){
            if (err){
                res.send(err);
            }
            
            res.json(article);
        });
    });

router.route('/articles/:article_id')

    .get(function(req, res){
        Article.findById(req.params.article_id, function(err, article){
            if(err){
                res.send(err);
            }
    
            res.json(article);
        });
    });

//launch application
app.use('/api', router);
app.use('/', router);
app.listen(port); //using express to listen to incoming requests
console.log('NodeJs is running on port: ' + port);