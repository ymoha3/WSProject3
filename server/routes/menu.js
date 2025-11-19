let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to our menu model
let Menu = require('../model/menu');

// Authentication middleware
function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

// GET: Display the Menu List
router.get('/', async (req, res, next) => {
    try {
        const menuList = await Menu.find();   
        console.log(menuList);
        res.render('menu/list', {
            title: "Menu List",
            menuList: menuList,                
            displayName: req.user ? req.user.displayName : ""
        });
    }
    catch (err) {
        console.log(err);
        res.render('menu/list', {
            title: "Menu List",
            menuList: [],
            error: 'Server Error'
        });
    }
});

// GET: Display Add Page
router.get('/add', (req, res, next) => {
    try {
        res.render('menu/add', {
            title: "Add Menu Item",
            displayName: req.user ? req.user.displayName : ""
        });
    }
    catch (err) {
        console.log(err);
        res.render('menu/list', { error: 'Server Error' });
    }
});

// POST: Process Add Form
router.post('/add', async (req, res, next) => {
    try {
        let newMenu = new Menu({
            "ItemType": req.body.ItemType,
            "ItemName": req.body.ItemName,
            "Description": req.body.Description,
            "Calories": req.body.Calories,
            "Price": req.body.Price,
            "DietaryRes": req.body.DietaryRes
        });

        Menu.create(newMenu).then(()=>{
            res.redirect('/menu')
    })
}   
    catch (err) {
        console.log(err);
        res.render('menu/list', { error: 'Server Error' });
    }
});

// GET: Display Edit Page
router.get('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const menuToEdit = await Menu.findById(id);

        res.render("menu/edit", {
            title: "Edit Menu Item",
            menu: menuToEdit,
            displayName: req.user ? req.user.displayName : ""
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

// POST: Process Edit Page
router.post('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        let updatedMenu = {
            "ItemType": req.body.ItemType,
            "ItemName": req.body.ItemName,
            "Description": req.body.Description,
            "Calories": req.body.Calories,
            "Price": req.body.Price,
            "DietaryRes": req.body.DietaryRes
        };

        await Menu.findByIdAndUpdate(id, updatedMenu);
        res.redirect("/menu");
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

// GET: Delete Menu Item
router.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await Menu.deleteOne({ _id: id });
        res.redirect("/menu");
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;


