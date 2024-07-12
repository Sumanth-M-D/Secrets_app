import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

//? Database connection
export const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },

  // database: process.env.PG_DATABASE,
  // user: process.env.PG_USER,
  // password: process.env.PG_PASSWORD,
  // host: process.env.PG_HOST,
  // port: process.env.PG_PORT,
});
db.connect().then(() => console.log("connected successfully to db"));

//.

//.
//? Find user by email in the DB
async function findUserByEmail(email) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    return result.rows[0];
  } catch (err) {
    return null;
  }
}
//.
//? Get user from id
async function findUserByID(id) {
  try {
    const result = await db.query("SELECT * FROM users WHERE id=$1", [id]);
    return result.rows[0];
  } catch (err) {
    console.log("No user found");
  }
}

//.
//?Create a new user in the DB
async function createUser(email, password) {
  try {
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES($1, $2) RETURNING *",
      [email, password]
    );
    return result.rows[0];
  } catch (err) {
    throw new Error("cannot create user");
  }
}

//.
//? Update the secret of user in the DB
async function updateUserSecret(email, newSecret) {
  const result = await db.query(
    'UPDATE users SET "secret text"=$1 WHERE email=$2 RETURNING *',
    [newSecret, email]
  );

  return result.rows[0]["secret text"];
}

//.
//? Export the functions
const userModel = {
  findUserByEmail,
  findUserByID,
  createUser,
  updateUserSecret,
};

export default userModel;
