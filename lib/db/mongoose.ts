import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.warn(
    "[DB] MONGODB_URI is not set. Database operations will fail until it is provided."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use global to preserve the connection across hot-reloads in development
const globalAny = global as unknown as { _mongooseCache?: MongooseCache };
const cached: MongooseCache = globalAny._mongooseCache || {
  conn: null,
  promise: null,
};
if (!globalAny._mongooseCache) globalAny._mongooseCache = cached;

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // bufferCommands is true by default; we keep defaults
        // You may add connection options here if needed
      })
      .then((m) => {
        console.log("[DB] Connected to MongoDB");

        return m;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
