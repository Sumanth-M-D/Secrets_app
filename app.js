//? Setting up environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

//? For saving user login sessions
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

import passport from "passport";

//? Local modules
import userRoutes from "./routes/userRoutes.js";
import localAuthRoutes from "./routes/localAuthRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

// import "./config/passportConfig.js"; // Ensure to configure passport strategies

//.

//.
const app = express();
const port = process.env.PORT || 3000;

// .
//? Express middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// .
//? Saving user login sessions
// Creating the user session through "express-session"
const PgStore = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(
  session({
    store: new PgStore({
      pool: pgPool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false, /// Dont save the session to database
    saveUninitialized: true, /// Save the session to the browser
    // cookie: { secure: true }
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, ///  1 day
    },
  })
);

//.
//? Authentication middleware for handling user authentication.
app.use(passport.initialize());
/* /// Initializes Passport and allows it to be used in the application. 
  /// Provides methods -> req.login(), req.logout(), req.isAuthenticated()
*/

app.use(passport.session());
/*/// 1. Alters the request object, 
  /// 2. Changes the req.user value to the authenticated user. 
  /// 3. needed for Serializing and deserializing the user from the session.
 */

//.
//? Using the routers
app.use("/", userRoutes);
app.use("/", localAuthRoutes);
app.use("/", googleAuthRoutes);

//.
//? Setting up a server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
