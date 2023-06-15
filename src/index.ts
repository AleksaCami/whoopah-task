import Koa from 'koa';
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import { ApolloServer } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';

// Resolvers
import * as resolvers from './graphql/resolvers/resolvers';

// Type Defs
import { typeDefs } from "./graphql/schemas/schema";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(router.routes());

const schema = makeExecutableSchema({
  typeDefs,
  ...resolvers
});

export const server = new ApolloServer({
  schema
});

// Start the server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

const startApollo = async () => {
  await server.start();

  server.applyMiddleware({ app });
}

startApollo();
