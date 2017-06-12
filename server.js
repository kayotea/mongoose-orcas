/*
Startup
*/
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');
app.set('views', path.join(__dirname, './views'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animal_db');
    var OrcaSchema = new mongoose.Schema({
        name: String,
        age: Number
    })
    //set schema as 'Orca'
    mongoose.model('Orca', OrcaSchema);
    //retrieve 'Orca'-named schema from mongoose models
    var Orca = mongoose.model('Orca');
    //use native promises (since mongoose promise will be deprecated)
    mongoose.Promise = global.Promise;

// Set View Engine to EJS
app.set('view engine', 'ejs');

/* 
Routes
*/
// Root Request
app.get('/', function(req, res) {
    Orca.find({}, function(err, data){
        if (err){
            console.log('error! where are the orcas??')
        } else {
            console.log('orcas retrieved');
            orcas = data;
            res.render('index', {orcas: orcas});
        }
    });
})
//add new orca
app.post('/orcas/new', function(req, res){
    var orca = new Orca({name: req.body.name, age: req.body.age});
    orca.save(function(err){
        if (err) {
            console.log('Error! orca not properly added');
        } else {
            console.log('orca successfully added!');
            res.redirect('/');
        }
    });
})
//look up information about particular orca
app.get('/orcas/:id', function(req, res){
    console.log('fetching orca:', req.params.id);
    Orca.find({_id: req.params.id}, function(err, orca){
        //console.log(orca[0]);
        res.render('individual', {orca: orca[0]});
    });
})
//direct to form to edit a particular orca
app.get('/orcas/edit/:id', function(req, res){
    console.log('editing orca:', req.params.id);
    Orca.find({_id: req.params.id}, function(err, orca){
        //console.log(orca[0]);
        res.render('edit_orca', {orca: orca[0]});
    });
})
//edit that particular orca
app.post('/orcas/:id', function(req, res){
    console.log('editing orca:', req.params.id);
    //console.log('edited name:', req.body.name);
    //console.log('edited age:', req.body.age);
    var name = req.body.name;
    var age = req.body.age;
    Orca.update({_id: req.params.id}, {name: name, age: age}, function(err, orca){
        if (err){
            console.log('error editing orca');
        } else {
            console.log('success editing orca');
            console.log('orca:', orca);
            res.redirect('/');
        }
    });
})
//destroy that particular orca
app.post('/orcas/destroy/:id', function(req, res){
    console.log('destroying orca:', req.params.id);
    Orca.deleteOne({_id: req.params.id}, function(err){
        if (err){
            console.log('error deleting orca');
        } else {
            console.log('success deleting orca');
            res.redirect('/');
        }
    });
})


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
