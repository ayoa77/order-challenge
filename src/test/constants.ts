import 'dotenv/config';

export const app = `http://[::1]:${process.env.PORT}`;
export const database = process.env.MONGO_URI;
