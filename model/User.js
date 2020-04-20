const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    verified_at: {
      type: Date,
      required: false
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);