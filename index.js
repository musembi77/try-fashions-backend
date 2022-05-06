import mongoose from "mongoose";
import dotenv from "dotenv";
import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";
import { createServer, createPubSub } from "@graphql-yoga/node";

dotenv.config();

// Yoga set up
const pubsub = createPubSub();

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
  context: { pubsub },
});

// DB set-up
mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGODB_REMOTE_URL, {
  useNewUrlParser: true,
});

connection
  .then((db) => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

// Start the server and explore http://localhost:4000/graphql
server.start();
