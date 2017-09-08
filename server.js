var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
//var multer = require('multer');         



var config = {
    user : 'saralanandipati',
    database : 'saralanandipati',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
    
    
};

var app = express();
app.use(morgan('combined'));
// these statements config express to use these modules, and only need to be run once
app.use(bodyParser.json());         
app.use(bodyParser.urlencoded({ extended: true }));                                
//app.use(multer);


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
      ${date.toDateString()}
      </div>
      <div>
          ${content}
      </div>
        
    </body>
</html>`  
;
return htmlTemplate;
}


function hash(input,salt){
    
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512,'sho512');
    
    return['pbkdf2',"10000",salt,hashed.toString('hex')].join('$');
    //return password + salt;
    
}

app.get('/hash/:input', function(req,res){
    var hashedString = hash(req.param.input,'this-is-some-random-string');
   res.send(hashedString); 
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * from test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
        
    });
    
    
});



app.post('/create-user', function(req,res){
    
    var userName = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbContent = hash(password,salt);
    
    pool.query('INSERT INTO "user" (username, password) values ($1,$2)', [userName, dbContent], function(err,result){
        
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.setHeader('content-type','application/json');
            res.send(JSON.parse('{"message": "user successfully created"}'));
        }
        
    });
});

app.post('/login', function(req,res){
    
    var userName = req.body.username;
    var password = req.body.password;
   
    pool.query('SELECT * from "user" where username = $1', [userName], function(err,result){
        
        if(err){
            res.status(500).send(err.toString());
        }else if(result.rows.length === 0){
             res.setHeader('content-type','application/json');
            res.send(JSON.parse('{"message": "username/password incorrect"}'));
            }
            else{
                 res.setHeader('content-type','application/json');
                    res.send(JSON.parse('{"message": "credentials are correct"}'));
                    // we need to check with other peoples abouth this logic mainly know about hash() function
                // var dbString = result.rows[0].password; 
                // var salt = dbString.split('$')[2];
                // var hashedPassword = hash(dbString,salt);
                // if(hashedPassword === dbString){
                //     req.session.auth = {userId : result.rows[0].id};
                //     res.setHeader('content-type','application/json');
                //     res.send(JSON.parse('{"message": "credentials are correct"}'));
                // }else{
                //     res.send(403).send("username/password is incorrect");
                // }
           
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

app.get('/get_articles', function(req,res){
   
    pool.query('SELECT * from "article"', function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else if(result.rows.length === 0){
          res.status(404).send('article not found');
       }else{
          // var articleData = result.rows[0];
           
           res.send(JSON.stringify(result.rows));
          //  res.send(articleData);
       }
    });
    
});
app.get('/articles/:articleName', function(req,res){
    //articleName === articleOne/articleTwo/articleThee
   // var articleName = req.params.articleName;
    
    pool.query("SELECT * from article where title = '" + req.params.articleName + "'", function(err,result){
       if(err){
           res.status(500).send(err.toString());
       } else if(result.rows.length === 0){
          res.status(404).send('article not found');
       }else{
           var articleData = result.rows[0];
            res.send(createTemplate(articleData));
       }
    });
    
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
