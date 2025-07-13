import env from "@/app/env";

import { Avatars, Client, Databases, Storage, Users } from "node-appwrite";

// Only create client if we have the required environment variables
const createClient = () => {
  if (!env.appwrite.endpoint || !env.appwrite.projectId || !env.appwrite.apikey) {
    console.warn('Appwrite server environment variables not configured');
    return null;
  }
  
  return new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apikey);
};

const client = createClient();

// Only create services if client exists
const databases = client ? new Databases(client) : null;
const avatars = client ? new Avatars(client) : null;
const storage = client ? new Storage(client) : null;
const users = client ? new Users(client) : null;

export { client, databases, users, avatars, storage };
