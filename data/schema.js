import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  text: {
    type: String
  },
  complete: {
    type: Boolean
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

export default [Todo];
