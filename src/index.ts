import Koa from 'koa';
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import { ApolloServer } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

// Data source
import dataSource from "./database/typeorm-cli.datasource";

// Resolvers
import * as resolvers from './graphql/resolvers/resolvers';

// Type Defs
import { typeDefs } from "./graphql/schemas/schema";

const app = new Koa();
const httpServer = createServer(app.callback());
const router = new Router();

app.use(bodyParser());
app.use(router.routes());

const schema = makeExecutableSchema({
  typeDefs,
  ...resolvers
});

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

export const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }) as any,
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// Start the server
httpServer.listen(3001, () => {
  console.log('Server listening on port 3001');
});

const startApollo = async () => {
  await dataSource.initialize();
  await server.start();

  server.applyMiddleware({ app });
}

startApollo();
