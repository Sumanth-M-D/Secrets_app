import userModel from "../models/userModel.js";

//.
function renderHome(req, res) {
  res.render("home.ejs");
}

//.
function renderLogin(req, res) {
  res.render("login.ejs");
}

//.
function renderRegister(req, res) {
  res.render("register.ejs");
}

//.
function renderSecrets(req, res) {
  console.log(req.user);
  /// isAuthenticated method comes from passport => localStrategy
  if (req.isAuthenticated()) {
    const secret =
      req.user["secret text"] || "No secrets!! Submit your new secret";
    res.render("secrets.ejs", { secret });
  } else {
    res.redirect("/login");
  }
}

//.
function renderCreateSecret(req, res) {
  if (req.isAuthenticated) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
}

//.
function logoutUser(req, res) {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
}

//.
async function createSecret(req, res) {
  if (req.isAuthenticated()) {
    try {
      const updatedSecret = await userModel.updateUserSecret(
        req.user.email,
        req.body.secret
      );

      res.render("secrets.ejs", { secret: updatedSecret });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/login");
  }
}

//.
const userController = {
  renderHome,
  renderLogin,
  renderRegister,
  renderSecrets,
  renderCreateSecret,
  logoutUser,
  createSecret,
};

export default userController;
