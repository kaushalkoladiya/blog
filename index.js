const mongoose = require('mongoose');
// const socketio = require('socket.io');
const PORT = process.env.PORT || 5000;

const app = require('./app');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@node-jvfv6.mongodb.net/${process.env.MONGO_DATABASE}?authSource=admin&replicaSet=Node-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`)
  .then(result => {
    console.log('connected!');
    const server = app.listen(PORT);
    // const io = socketio(server);

  })
  .catch( err => console.log(err) );