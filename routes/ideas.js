const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Idea Model
require('../models/Idea');
const idea = mongoose.model('ideas');

//Add Idea Form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
    idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/ideas', {
            ideas: ideas
        });
    }); 
});

//Edit Idea Form
router.get('/edit/:id', (req, res) => {
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
router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;