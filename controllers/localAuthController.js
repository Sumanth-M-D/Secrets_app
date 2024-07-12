import userModel from "../models/userModel.js";

import bcrypt from "bcrypt"; //for encrypting the password of users
import passport from "passport";
import LocalStrategy from "passport-local";

const saltRounds = +process.env.SALT_ROUNDS;

//? To register a new user and Log them in
async function registerUser(req, res) {
  const { username: email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);
    if (user) {
      res.send("User is already registered. Try logging in.");
    } else {
      // Hash the password
      const hash = await bcrypt.hash(password, saltRounds);
      let newUser;

      // create new user in database
      try {
        newUser = await userModel.createUser(email, hash);
      } catch (err) {
        throw new Error(err.message);
      }

      // Logging in after registration
      /*
        /// req.login() serializes the user object into the session. By calling "passport.serializeUer()"
      */
      req.login(newUser, (err) => {
        // "Error logging in after registration."
        if (err) throw new Error(err.message);
        res.redirect("/secrets");
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error : ", err.mesage);
  }
}

//.
//? To log in the user after authentication using "local" strategy of passport
const loginUser = passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
});

//.
//? Defining Local Strategy for authentication
/*
  /// Passport.js automatically extracts "username & password" fields from the req.body when the login form is submitted.
  /// "done":- A callback function provided by "Passport" that you call to signal the outcome of authentication. 
  /// The "done" function has the following signature: done(error, user, info),
*/
passport.use(
  "local",
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userModel.findUserByEmail(username);
      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

//.
//?Passport configuration : Serialize user into session
/*
  /// Define how the user object is serialized into the session
  /// Stores user.id in the session
  /// user parameter is passed by req.login(user, ...) function call
*/
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//.
//?Passport configuration : DeSerialize user from session
/*
  /// Define how the user Object is received from the session data
  /// Retrieves the user Object through user.id stored by serializer
*/
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findUserByID(id);
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err);
  }
});

const localAuthController = {
  registerUser,
  loginUser,
};

export default localAuthController;
