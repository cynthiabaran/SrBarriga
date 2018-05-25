// Servidor da aplicacao

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adicione "ponteiro" para o MongoDB
var usersDB = require('./models/users');
var spendingsDB = require('./models/spendings');
var groupsDB = require('./models/groups');

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

// index.html
router.route('/')
  .get(function(req, res) {  // GET
      var path = 'index.html';
      res.header('Cache-Control', 'no-cache');
      res.sendfile(path, {"root": "./"});
    }
  );

router.route('/users')   // operacoes sobre todos os alunos
  .get(function(req, res) {  // GET
      var response = {};
      usersDB.find({}, function(erro, data) {
        if(erro)
          response = {"resultado": "Falha de acesso ao BD"};
        else
          response = {"users": data};
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
      console.log(JSON.stringify(req.body));
      var query = {"email": req.body.email};
      var response = {};
      usersDB.findOne(query, function(erro, data) {
          if (data == null) {
            var db = new usersDB();
            db.email = req.body.email;
            db.name = req.body.name;
            db.password = req.body.password;
            db.save(function(erro) {
                if(erro) {
                  response = {"resultado": "Falha de insercao no BD"};
                  res.json(response);
                } else {
                  response = {"resultado": "Usuario inserido no BD"};
                  res.json(response);
                }
              }
            )
          } else {
            response = {"resultado": "Usuario ja existente"};
            res.json(response);
          }
        }
      )
    }
  );


router.route('/users/:email')
  .get(function(req, res) {   // GET
        var response = {};
        var query = {"email": req.params.email};
        usersDB.findOne(query, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao BD"};
            res.json(response);
          } else if (data == null) {
            response = {"resultado": "aluno inexistente"};
            res.json(response);
          } else {
            response = {"users": [data]};
            res.json(response);
          }
        }
      )
    }
  )
  .put(function(req, res) {   // PUT (altera)
      var response = {};
      var query = {"email": req.params.email};
      var data = {"name": req.body.name, "password": req.body.password};
      usersDB.findOneAndUpdate(query, data, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
          } else if (data == null) {
            response = {"resultado": "usuario inexistente"};
            res.json(response);
          } else {
            response = {"resultado": "usuario atualizado no BD"};
            res.json(response);
          }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
      var response = {};
      var query = {"email": req.params.email};
      usersDB.findOneAndRemove(query, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
          } else if (data == null) {
            response = {"resultado": "usuario inexistente"};
            res.json(response);
          } else {
            response = {"resultado": "usuario removido do BD"};
            res.json(response);
          }
        }
      )
    }
  );

router.route('/groups')   // operacoes sobre todos os alunos
 .get(function(req, res) {  // GET
     var response = {};
     groupsDB.find({}, function(erro, data) {
       if(erro)
          response = {"resultado": "Falha de acesso ao BD"};
        else
          response = {"groups": data};
          res.json(response);
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
      console.log(JSON.stringify(req.body));
      var response = {};
      var db = new groupsDB();
      db.admin = req.body.admin;
      db.nome = req.body.nome;
      // db.id = ObjectId();

      db.membros = req.body.membros;

      db.save(function(erro) {
          if(erro) {
            response = {"resultado": "Falha de insercao no BD"};
            res.json(response);
          } else {
            response = {"resultado": "Grupo inserido no BD"};
            res.json(response);
          }
        }
      )
    }
  );

router.route('/groups/:id')
  .get(function(req, res) {   // GET
      var response = {};
      var query = {"_id": req.params.id};
      groupsDB.findOne(query, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao BD"};
            res.json(response);
          } else if (data == null) {
            response = {"resultado": "grupo inexistente"};
            res.json(response);
          } else {
            response = {"grupo": [data]};
            res.json(response);
          }
        }
      )
    }
  )

  .put(function(req, res) {   // PUT (altera)
      var response = {};
      var query = {"_id": req.params.id};
      var data = {"nome": req.body.name, "membros": req.body.membros, "admin": req.body.admin};
      groupsDB.findOneAndUpdate(query, data, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
          } else if (data == null) {
            response = {"resultado": "grupo inexistente"};
            res.json(response);
          } else {
            response = {"resultado": "grupo atualizado no BD"};
            res.json(response);
          }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
      //Necessário remover as despesas do grupo também
       var response = {};
       var query = {"groupID": req.params.id};

        // remove spendings do grupo do db de spendings
       spendingsDB.remove(query, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
          } else if (data == null) {
            response = {"resultado": "grupo inexistente"};
            res.json(response);
          }
        }
      )

      // remove group do db de grupo
      query = {"_id": req.params.id};
       groupsDB.findOneAndRemove(query, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
          } else if (data == null) {
            response = {"resultado": "grupo inexistente"};
            res.json(response);
          } else {
            response = {"resultado": "grupo removido do BD"};
            res.json(response);
          }
        }
      )
    }
  );

  router.route('/spendings')   // operacoes sobre todos os alunos
    .get(function(req, res) {  // GET
        var response = {};
        spendingsDB.find({}, function(erro, data) {
          if(erro)
            response = {"resultado": "Falha de acesso ao BD"};
          else
            response = {"spendings": data};
            res.json(response);
          }
        )
      }
    )

router.route('/:groupID/spendings')
  .get(function(req, res) {   // GET
      var response = {};
      var query = {"groupID": req.params.groupID};
      spendingsDB.find(query, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao BD"};
            res.json(response);
          } else if (data == null) {
             response = {"resultado": "grupo sem despesas ou inexistente"};
             res.json(response);
          } else {
            response = {"despesas": [data]};
            res.json(response);
          }
        }
      )
    }
  )
  .post(function(req, res) {   // POST (cria)
      console.log(JSON.stringify(req.body));
      var response = {};
      var db = new spendingsDB();
      db.groupID = req.parameters.groupID;
      db.data = req.body.data;
      db.pagou = req.body.pagou;
      db.valor = req.body.valor;
      db.paraQuem = req.body.paraQuem;

      db.save(function(erro) {
          if(erro) {
            response = {"resultado": "Falha de insercao no BD"};
            res.json(response);
          } else {
            response = {"resultado": "despesa inserido no BD"};
            res.json(response);
          }
        }
      )
    }
  )
  .delete(function(req, res) {   // DELETE (remove)
       var response = {};
       var query = {"groupID": req.params.groupID};
       spendingsDB.remove(query, function(erro, data) {
          if(erro) {
            response = {"resultado": "falha de acesso ao DB"};
            res.json(response);
          } else if (data == null) {
          response = {"resultado": "despesas pa'ra o grupo inexistentes"};
            res.json(response);
          } else {
            response = {"resultado": "despesas do grupo removidas do BD"};
            res.json(response);
          }
        }
      )
    }
  );

  router.route('/spendings/:id')
    .get(function(req, res) {   // GET
        var response = {};
        var query = {"_id": req.params.id};
        spendingsDB.findOne(query, function(erro, data) {
            if(erro) {
              response = {"resultado": "falha de acesso ao BD"};
              res.json(response);
            } else if (data == null) {
               response = {"resultado": "despesa inexistente"};
               res.json(response);
            } else {
              response = {"despesas": [data]};
              res.json(response);
            }
          }
        )
      }
    )
    .put(function(req, res) {   // PUT (altera)
        var response = {};
        var query = {"_id": req.params.id};
        var data = {"pagou":req.body.pagou,"valor": req.body.valor, "paraQuem": req.body.paraQuem};
        spendingsDB.findOneAndUpdate(query, data, function(erro, data) {
            if(erro) {
              response = {"resultado": "falha de acesso ao DB"};
              res.json(response);
            } else if (data == null) {
              response = {"resultado": "despesa inexistente"};
              res.json(response);
            } else {
              response = {"resultado": "despesa atualizada no BD"};
              res.json(response);
            }
          }
        )
      }
    )
    .delete(function(req, res) {   // DELETE (remove)
         var response = {};
         var query = {"_id": req.params.id};
         spendingsDB.findOneAndRemove(query, function(erro, data) {
            if(erro) {
              response = {"resultado": "falha de acesso ao DB"};
              res.json(response);
            } else if (data == null) {
              response = {"resultado": "despesas inexistente"};
              res.json(response);
            } else {
              response = {"resultado": "despesas removida do BD"};
              res.json(response);
            }
          }
        )
      }
    );
