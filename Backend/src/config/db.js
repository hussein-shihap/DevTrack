import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// pool مهم للعمل الحقيقي خارج التجارب يعني افضل بكثير من client


const db = new Pool({

    user: process.env.PG_USER,

    host: process.env.PG_HOST,

    database: process.env.PG_DATABASE,

    password: process.env.PG_PASSWORD,

    port: process.env.PG_PORT

});

console.log({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});


db.connect()
.then(()=> console.log("Database connected successfully"))
.catch((err)=> console.log("Database connection error:", err));


export default db;