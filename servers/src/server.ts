import { makeSchema, declarativeWrappingPlugin } from "nexus";
import { ApolloServer } from "apollo-server-express";
import express from "express";
require("dotenv");
//file importsodotenv
import * as todo from "./api/todo";
import { join } from "path";
const schema = makeSchema({
  types: todo,
  outputs: {
    schema: join(process.cwd(), "src/api/generated/api.graphql"),
    typegen: join(process.cwd(), "src/api/generated/api.ts"),
  },
  plugins: [declarativeWrappingPlugin()],
  nonNullDefaults: { input: false, output: false },
});

async function startApollo() {
  const app = express();
  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "*",
    },
  });
  console.log(`http://localhost:4000${server.graphqlPath}`);
  await new Promise((resolve) => {
    app.listen({ port: process.env.PORT || 4000 });
  });
}

startApollo();
