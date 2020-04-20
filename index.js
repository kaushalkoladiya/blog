const mongoose = require('mongoose');
const socketio = require('socket.io');
const PORT = process.env.PORT || 5000;

const app = require('./app');

mongoose.connect('mongodb+srv://Admin:KlPszA1nXaPDQRFP@cluster0-riiqm.mongodb.net/blog?retryWrites=true&w=majority')
  .then(result => {
    console.log('connected!');
    const server = app.listen(PORT);
    const io = socketio(server);

  })
  .catch( err => console.log(err) );