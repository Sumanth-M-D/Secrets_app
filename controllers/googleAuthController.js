import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

//? Google authentication using passport
/*
  ///To authenticate through google and retrun "user Object" with details requested in "scope"
*/
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

//.
//? Callback function after google authentication
const googleAuthCallback = passport.authenticate("google", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
});

//.
//? Defining Google Strategy for authentication
/* OPTIONS
  /// ClientID and clientSecret are from the configuration in my google-cloud account  
  /// callbaclURL -> route to go after authentication is complete
  /// UserprofileURL -> URL to Google's API endpoint for retrieving user profile information.
  ///                -> same for all the project.
  /// authorizationURL -> The URL to Google's OAuth 2.0 authorization endpoint.
*/

/* CALLBACK 
  ///  accessToken: The token that can be used to access the user's Google account.
  ///  refreshToken: A token that can be used to obtain a new access token (if applicable).
  ///  profile: The user's Google profile information.
  ///  done: A callback function provided by Passport.js to signal the completion of the authentication process.
*/
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      authorizationURL: "https://accounts.google.com/o/oauth2/auth",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value; // Extract email from the profile
        const user = await userModel.findUserByEmail(email);
        if (user) {
          done(null, user);
        } else {
          const newUser = await userModel.createUser(email, "google");
          done(null, newUser);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

const googleAuthController = {
  googleAuth,
  googleAuthCallback,
};

export default googleAuthController;
