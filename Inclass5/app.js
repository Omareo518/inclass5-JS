const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/prog1935_inclass5', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Admin = mongoose.model('Admin', adminSchema);


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    
    Admin.findOne({ username, password })
        .then((admin) => {
            if (admin) {
                
                req.session.loggedInUser = admin;   
                res.redirect('/page');
            } else {
                res.render('error', { message: 'Incorrect username or password.' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.render('error', { message: 'An error occurred, please try again later.' });
        });
});


app.get('/page', (req, res) => {
   
    if (req.session.loggedInUser) {
        res.render('page');
    } else {
        res.redirect('/');
    }
});


const port = 8084;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
