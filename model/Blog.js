const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Blog', blogSchema);