const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

//Load Routes

const ideas = require("./routes/ideas");
const users = require("./routes/users");

const app = express();
//Connect to mongoose

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/vidjot-dev", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb Connected..."))
    .catch(err => console.log(err));

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

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

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

app.listen(port, () => {
    console.log('Server started on port ' + port);
});

