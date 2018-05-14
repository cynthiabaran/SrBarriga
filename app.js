var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// comente as duas linhas abaixo
// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// serve static files
app.use('/', express.static(__dirname + '/'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adicione as duas linhas abaixo
var router = express.Router();
app.use('/', router);   // deve vir depois de app.use(bodyParser...

// comente as duas linhas abaixo
// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// codigo abaixo adicionado para o processamento das requisições
// HTTP GET, POST, PUT, DELETE

var alunos = [];

router.route('/alunos')   // operacoes sobre todos os alunos
  .get(function(req, res) {  // GET
      if (alunos.length == 0) {
       res.json({"alunos": []});
       return;
      }
      var response = '{"alunos": [';
      var aluno;
      for (var i = 0; i < alunos.length; i++) {
         aluno = JSON.stringify(alunos[i]);   // JSON -> string
         if (aluno != '{}')   // deletado ?
            response = response + aluno + ',';
      }
      if (response[response.length-1] == ',')
         response = response.substr(0, response.length-1);  // remove ultima ,
      response = response + ']}';  // fecha array
      res.send(response);
      }
   )
  .post(function(req, res) {   // POST (cria)
      id = alunos.length;
      alunos[id] = req.body;    // armazena em JSON
      response = {"id": id};
      res.json(response);
    }
 );

router.route('/alunos/:id')   // operacoes sobre um aluno (ID)
  .get(function(req, res) {   // GET
      response = '{}';
      id = parseInt(req.params.id);
      if(alunos.length > id)
        response = JSON.stringify(alunos[id]);
      res.send(response);   
      }
  )
  .put(function(req, res) {   // PUT (altera)
      response = {"updated": "false"};
      id = parseInt(req.params.id);
      if(alunos.length > id) {
         alunos[id] = req.body;
         response = {"updated": "true"};
      }
      res.json(response);   
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
      response = {"deleted": "false"};
      id = parseInt(req.params.id);
      if(alunos.length > id && JSON.stringify(alunos[id]) != '{}') {
         alunos[id] = {};
         response = {"deleted": "true"};
      }
      res.json(response);
    }
  );
