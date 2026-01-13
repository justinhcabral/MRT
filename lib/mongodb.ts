import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  //check for the mongodb uri if it exists
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// global is used here to maintain a cached connection across hot reloads in development. Prevents connection growing exponentially

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose; //for hot reloads to ensure we keep the old connection so that it doesnt create new connections

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // this is an async operation that requires the program to create a connection with the mongodb, so we have to put this in a promise to set the status of the promise to pending while it waits for the value from the database connection.
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise; // promise status has to become fulfilled to return the promises' value, so getting that connection has to wait for the promise to be fulfilled.
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};
