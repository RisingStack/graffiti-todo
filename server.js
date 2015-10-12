import path from 'path';
import Hapi from 'hapi';
import Inert from 'inert';
import {graphql} from 'graphql';
import boom from 'boom';
import {getSchema} from '@risingstack/graffiti-mongoose';
import mongoose from 'mongoose';
import mongooseSchema from './data/schema';

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/graphql';

mongoose.connect(MONGO_URI);

const server = new Hapi.Server();
server.connection({ port: PORT });

server.register(Inert, (err) => {
  if (err) {
    throw new Error('Failed to load a plugin: ' + err);
  }
});

const schema = getSchema(mongooseSchema);

// handle graphql requests
server.route({
  method: ['POST'],
  path: '/graphql',
  handler: (request, reply) => {
    const {query, variables} = request.payload || {}; // eslint-disable-line

    if (!query) {
      return reply(boom.badRequest('no query'));
    }

    return graphql(schema, query, null, variables)
      .then((result) => {
        if (result.errors) {
          const message = result.errors.map((error) => error.message).join('\n');
          return reply(boom.badRequest(message));
        }
        return reply(result);
      })
      .catch((err) => reply(boom.badImplementation(err)));
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
