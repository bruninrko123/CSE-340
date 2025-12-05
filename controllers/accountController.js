const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
/* ****************************************
 *  Deliver login view
 * *************************************** */

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  // let form = await utilities.buildForm();
  res.render("account/login", {
    title: "Login",
    nav,
    // form,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  // let registration = await utilities.buildRegistrationPage();
  res.render("account/registration", {
    title: "Registration",
    nav,
    // registration,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  // let form = await utilities.buildForm();
  // let registration = await utilities.buildRegistrationPage();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  //hash the password before storing
  let hashedPassword;
  try {
    //regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration"
    );
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      // form,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      // registration,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please, check your credentials and try again");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please, check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */

async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "User logged out successfully");
  res.redirect("/");
}
/* ****************************************
 *  Build account management view
 * ************************************ */

async function buildAccountManagementView(req, res) {
  const nav = await utilities.getNav();
  res.render("account/management", {
    title: "You're logged in.",
    nav,
    errors: null,
  });
}

async function updateAccountInformationView(req, res) {
  const nav = await utilities.getNav();
  account_firstname = res.locals.accountData.account_firstname;
  account_lastname = res.locals.accountData.account_lastname;
  account_email = res.locals.accountData.account_email;
  account_id = res.locals.accountData.account_id;
  res.render("account/update", {
    title: "Update Account Page",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  });
}

async function updateAccount(req, res) {
  const nav = await utilities.getNav();

  let { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  account_id = parseInt(account_id);

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    const info =
      updateResult.account_firstname +
      updateResult.account_lastname +
      updateResult.account_email;

    req.flash("notice", `Your account information has been updated, ${info}`);
    res.render("account/management", {
      title: "You're logged in",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the update failed");
    res.status(501).render("account/update", {
      title: "Update Account Page",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function updatePasswordProcess(req, res) {
  const nav = await utilities.getNav();
  let {
    account_id,
    account_password,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  account_id = parseInt(account_id);
  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the update");
    res.status(500).render("account/management", {
      title: "Update Account Page",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (updateResult) {
    req.flash("notice", "Password has been successfully changed");
    res.status(200).render("account/management", {
      title: "You're logged in",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {});
  }
}

async function deleteAccountView(req, res) {
  let nav = await utilities.getNav();

  res.render("account/delete", {
    title: "Delete Accounts",
    nav,
    errors: null,
  });
}

async function deleteAccountProcess(req, res) {
  const nav = await utilities.getNav();

  const { account_email, account_email_confirmation } = req.body;

  const deleteResult = await accountModel.deleteAccount(
    account_email,
    account_email_confirmation
  );

  if (deleteResult) {
    req.flash("notice", "The account has been deleted successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "There was an error processing the deletion.");
    res.render("account/delete", {
      title: "Delete account",
      nav,
      errors: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  accountLogout,
  updateAccountInformationView,
  updateAccount,
  updatePasswordProcess,
  deleteAccountView,
  deleteAccountProcess,
};
