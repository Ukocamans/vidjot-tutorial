const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Connect to mongoose

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/vidjot-dev", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb Connected..."))
    .catch(err => console.log(err));

//Load Idea Model

require('./models/Idea');
const idea = mongoose.model('ideas');

//Handlebars middleware
const handlebarsFunc = exphbs({
    defaultLayout: 'main'
});

app.engine('handlebars', handlebarsFunc);
app.set('view engine', 'handlebars');

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//MethodOverride middleware
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

//Global Variables

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

const port = 5000;

//INDEX Route
app.get('/', (req, res) => {
    const title = 'Welcome1'; 
    res.render('index', {
        title: title
    });
});

// About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Add Idea Form

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

app.post('/ideas', (req, res) => {
    let errors = [];
    if (!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if (!req.body.details){
        errors.push({text: 'Please add a details'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details 
        });
    }else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        })
    }
})

//Idea Index Page
app.get('/ideas', (req, res) => {
    idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/ideas', {
            ideas: ideas
        });
    }); 
});

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    })
    
});

// Edit Form Process
app.put('/ideas/:id', (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
    .then( idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        });
    });
});

//Delete Idea

app.delete('/ideas/:id', (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.delete()
        .then(idea => {
            req.flash('success_msg', 'Video Idea removed');
            res.redirect('/ideas');
        })
    });
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
});

