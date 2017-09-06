var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = requir('pg').pool;

var config = {
    user : 'saralanandipati',
    database : 'saralanandipati',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB-PASSWORD
    
    
}

var app = express();
app.use(morgan('combined'));
var articles ={
 'article-one' : {
    title : 'Article one',
    heading :'Article one',
    date : 'sep 5th 2017',
    content :
    `<p>
              This is aricle one content This is aricle one content This is aricle one content  This is aricle one content This is aricle one content
          </p>
          <p>
              This is aricle one content This is aricle one content This is aricle one content 
          </p>`
          
},
 'article-two' : {
    title : 'Article Two',
    heading :'Article Two',
    date : 'sep 10th 2017',
    content :
    `<p>
              This is aricle Two content This is aricle Two content This is aricle one content  This is aricle one content This is aricle one content
          </p>
          <p>
              This is aricle Two content This is aricle one content This is aricle one content 
          </p>`
          
},

 'article-three' : {
    title : 'Article three',
    heading :'Article threene',
    date : 'sep 20th 2017',
    content :
    `<p>
              This is aricle three content This is aricle three content This is aricle three content  This is aricle one content This is aricle one content
          </p>
          <p>
              This is aricle three content This is aricle three content This is aricle three content 
          </p>`
          
},

};
function createTemplate(data){
    
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
var htmlTemplate = 
  `<html>
    <head>
        <title>${title}</title>
    </head>
    <body>
      <div>
      <a href="/">home</a> 
      </div>
      <hr/>
      <h3>${heading}</h3>
      <div>
      ${date}
      </div>
      <div>
          ${content}
      </div>
        
    </body>
</html>`  
;
return htmlTemplate;
}





app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool = new Pool('config');
app.get('/test-db',function(req,res){
    pool.query('SELECT * from test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result));
        }
        
    });
    
    
});
var counter=0;
app.get('/counter', function(req,res){
    counter = counter+1;
    res.send(counter.toString());
    
});

var names = [];
//app.get('/submit-name/:name',function(req, res){this is one way to submit the url
    app.get('/submit-name',function(req, res){//we pass the values as query
    var name = req.query.name;
    
    names.push(name);
    //json : javascript objct notation--- way of converting javascript objects into the string
    res.send(JSON.stringify(names));
    
});
app.get('/:articleName', function(req,res){
    //articleName === articleOne/articleTwo/articleThee
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});



// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
