import path from 'path';
import Hapi from 'hapi';
import Inert from 'inert';
import {hapi} from '@risingstack/graffiti';
import {getSchema} from '@risingstack/graffiti-mongoose';
import mongoose from 'mongoose';
import mongooseSchema from './data/schema';

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/graphql';

mongoose.connect(MONGO_URI);

const server = new Hapi.Server();
server.connection({ port: PORT });

const hooks = {
  mutation: {
    pre: (next, {complete, id}, {fieldName}) => {
      if (fieldName === 'updateTodo' && complete) {
        console.log(`TODO with id: ${id} is marked complete`);
      }

      next();
    }
  }
};
server.register([Inert, {
  register: hapi,
  options: {
    schema: getSchema(mongooseSchema, {hooks})
  }
}], (err) => {
  if (err) {
    throw new Error('Failed to load a plugin: ' + err);
  }
});

// serve static files
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: path.join(__dirname, 'public'),
      redirectToSlash: true,
      index: true
    }
  }
});

server.start(() => {
  console.log('Server running at:', server.info.uri); // eslint-disable-line
});
