import fs from 'fs';
import path from 'path';
import {getSchema} from '@risingstack/graffiti-mongoose';
import {graphql} from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';
import mongooseSchema from '../data/schema';

const schema = getSchema(mongooseSchema);
// const schema = getSchema(mongooseSchema);
// Save JSON of full schema introspection for Babel Relay Plugin to use
async () => {
  const result = await (graphql(schema, introspectionQuery));
  if (result.errors) {
    console.error( // eslint-disable-line no-console
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../data/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
}();

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, '../data/schema.graphql'),
  printSchema(schema)
);
