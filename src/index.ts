import Koa from 'koa';
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import { ApolloServer } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';

// Resolvers
import * as categoryResolver from './graphql/resolvers/category.resolvers';

// Type Defs
import { typeDefs } from "./graphql/schemas/schema";

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(router.routes());

const schema = makeExecutableSchema({
  typeDefs,
  ...categoryResolver
});

export const server = new ApolloServer({
  schema
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

const startApollo = async () => {
  await server.start();

  server.applyMiddleware({ app });
}

startApollo();
