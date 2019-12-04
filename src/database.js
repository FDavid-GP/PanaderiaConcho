const mongoose = require('mongoose');

//en local
//mongoose.set('useFindAndModify', false);
//mongoose.connect('mongodb://localhost/node-notes-db', {
 // useCreateIndex: true,
//  useNewUrlParser: true
//})
//  .then(db => console.log('DB is connected'))
//  .catch(err => console.error(err));

//en docker
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));