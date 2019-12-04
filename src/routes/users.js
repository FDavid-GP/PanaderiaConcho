const router = require('express').Router();
const passport = require('passport');

// Models
const User = require('../models/User');

router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

//Codigo nuevo
router.get('/users', (req, res) => {
if(req.user.type != 'Admin') {
    req.flash('error_msg', 'Usuario no autorizado');
    return res.redirect('/notes');
  }
  res.render('users/all-users');
});

// Get All Users (detalles)
router.get('/users', async (req, res) => {
    const users = await User.find().sort({name:'desc'});
  res.render('users/all-users', { users });
});

router.post('/users/signup', async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if(password != confirm_password) {
    errors.push({text: 'Passwords incopatibles.'});
  }
  if(password.length < 4) {
    errors.push({text: 'Passwords must be at least 4 characters.'})
  }
  if(errors.length > 0){
    res.render('users/signup', {errors, name, email, password, confirm_password});
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'Email ya en uso.');
      res.redirect('/users/signup');
    } else {
      // Saving a New User
      const newUser = new User({name, email, password});
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'Te has registrado exitosamente.');
      res.redirect('/users/signin');
    }
  }
});

router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Has salido de la pagina.');
  res.redirect('/users/signin');
});


 router.delete('/users/delete/:id', async (req, res) => {
 if(req.user.type != 'Admin') {
    req.flash('error_msg', 'Usuario no autorizado');
    return res.redirect('/users');
  } 
else{
  await Note.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Usuario eliminado');
  res.redirect('/users');
}
});

module.exports = router;
