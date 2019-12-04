const express = require('express');
const router = express.Router();

// Models
const Note = require('../models/Note');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/notes/add', isAuthenticated, (req, res) => {
if(req.user.type != 'Admin') {
    req.flash('error_msg', 'Usuario no autorizado');
    return res.redirect('/notes');
  } 
  res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
  const { title, precio, imagen } = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Por favor escribe el nombre del pan.'});
  }
  if (!precio) {
    errors.push({text: 'Por favor escribe el precio del pan.'});
  }
if (!imagen) {
    errors.push({text: 'Por favor ingrese la url de la imagen.'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      title,
      precio,
	imagen
    });
  } else {
    const newNote = new Note({title, precio, imagen});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Nuevo pan agregado');
    res.redirect('/notes');
  }
});

// Get All Notes
router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find().sort({title:'desc'});
  res.render('notes/all-notes', { notes });
});

// Edit Notes
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id);
  if(req.user.type != 'Admin') {
    req.flash('error_msg', 'Usuario no autorizado');
    return res.redirect('/notes');
  } 
  res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
  const { title, precio } = req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, precio});
  req.flash('success_msg', 'Pan actualizado');
  res.redirect('/notes');
});

// Delete Notes
 router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
 if(req.user.type != 'Admin') {
    req.flash('error_msg', 'Usuario no autorizado');
    return res.redirect('/notes');
  } 
else{
  await Note.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Pan removido');
  res.redirect('/notes');
}
});

module.exports = router;
