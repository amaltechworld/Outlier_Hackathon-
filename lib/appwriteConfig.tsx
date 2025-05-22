import { Client, Databases, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Replace with your endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Replace with your project ID


const databases = new Databases(client);
const storage = new Storage(client);

export { client, databases, storage, ID };
