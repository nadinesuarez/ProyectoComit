const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressSession = require('express-session');
const expressHandlebars = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.static(__dirname + '/public'));
const db = {
    url: 'mongodb://localhost:27017/',
    config: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4
    },
    nombre: 'testdb',
    nombreColeccionUsuarios: 'users'
}



app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layout')
}));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));


app.use(expressSession({
    secret: 'el tiempo sin ti es empo',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    console.log("GET /");
    if (req.session.usuarix) {
        res.render('home', { nombre: req.session.usuarix })
    } else {
        res.render('login');
    }
});


app.post('/login', (req, res) => {
    console.log('POST /login', 'body:', req.body);

    if (req.body.usuarix && req.body.password) {
        validarUsuarix(req.body.usuarix, req.body.password, resultado => {

            if (resultado) {
                req.session.usuarix = req.body.usuarix;
                res.render('home', { nombre: req.session.usuarix });
            } else {
                req.session.destroy();
                res.render('login', { mensaje: 'Usuarix/clave incorrectxs.', tipo: 'error' })
            }
        });
    } else {
        req.session.destroy();
        res.render('login', { mensaje: 'Ingrese usuarix y clave', tipo: 'error' });
    }

});


app.get('/registrarse', (req, res) => {
    console.log("GET /registrarse");
    res.render('registro');
});


app.post('/registrar', (req, res) => {

    console.log('POST /registrar', 'body:', req.body);
    if (req.body.usuarix && req.body.password && req.body.passwordRep) {


        if (req.body.password == req.body.passwordRep) {

            registrarUsuarix(req.body.usuarix, req.body.password, resultado => {
                console.log(`Registro exitoso: ${resultado}`);
                if (resultado) {
                    req.session.destroy();
                    res.render('login', { mensaje: 'Usuarix registrado correctamente', tipo: 'exito' });
                } else {
                    req.session.destroy();
                    res.render('registro', { mensaje: 'Datos incompletos', tipo: 'error' });
                }
            });
        } else {
            req.session.destroy();
            res.render('registro', { mensaje: 'Las claves ingresadas no coinciden.', tipo: 'error' });
        }

    } else {
        req.session.destroy();
        res.render('registro', {
            mensaje: 'Debe completar el formulario para registrarse.',
            tipo: 'error'
        });
    }
});


app.get('/logout', (req, res) => {

    console.log("GET /logout");
    req.session.destroy();
    res.render('login');

});


app.listen(3000, () => {
    console.log('Escuchando puerto 3000 con Express');
});

function validarUsuarix(usr, pwd, callback) {
    MongoClient.connect(db.url, db.config, (err, client) => {

        if (!err) {
            const colUsuarixs = client.db(db.nombre).collection(db.nombreColeccionUsuarios);
            colUsuarixs.findOne({ user: usr, pass: pwd }, (err, resConsulta) => {
                client.close();
                console.log(resConsulta);
                if (!err) {
                    if (resConsulta) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });

}

function registrarUsuarix(usr, pwd, callback) {
    MongoClient.connect(db.url, db.config, (err, client) => {
        if (!err) {
            const colUsuarixs = client.db(db.nombre).collection(db.nombreColeccionUsuarios);
            colUsuarixs.insertOne({ user: usr, pass: pwd }, (err, result) => {

                if (!err) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        } else {
            callback(false);
        }
    });
}