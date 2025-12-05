const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */

validate.registrationRules = () => {
  return [
    //first name is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent

    //last name is required and must be  a string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent

    //valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error(
            "Email exits. Please log in or use a different email"
          );
        }
      }),

    //password is required and must be a strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements"),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    // let registration = await utilities.buildRegistrationPage();
    res.render("account/registration", {
      errors,
      title: "Registration",
      nav,
      //   registration,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.loginRules = () => {
  return [
    //first name is required and must be string
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error(
            "Email exits. Please log in or use a different email"
          );
        }
      }),

    //password is required and must be a strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements"),
  ];
};

validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

//validating the update account info page

validate.updateAccountRules = () => {
  return [
    //first name is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent

    //last name is required and must be  a string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent

    //valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
    // .custom(async (account_email) => {
    //   const emailExists = await accountModel.checkExistingEmail(
    //     account_email
    //   );
    //   if (emailExists) {
    //     throw new Error(
    //       "Email exits. Please log in or use a different email"
    //     );
    //   }
    // }),
  ];
};

validate.checkUpdateAccountRules = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Login",
      nav,
      account_email,
      account_firstname,
      account_lastname,
    });
    return;
  }
  next();
};

validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements"),
  ];
};

validate.checkUpdatePasswordRules = async (req, res, next) => {
  const nav = await utilities.getNav();

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("account/update", {
      title: "Update Account Page",
      nav,
      account_id: res.locals.account_id,
      account_email: res.locals.account_email,
      account_firstname: res.locals.account_firstname,
      account_lastname: res.locals.account_lastname,
    });
    return;
  }
  next();
};

validate.checkAccountType = async (req, res, next) => {
  const account_type = res.locals.accountData.account_type;

  if (account_type == "Admin") {
    next();
  } else {
    req.flash(
      "notice",
      "Not Authorized. Must be an Admin to access this information"
    );
    res.status(401).redirect("/account/login");
  }
};
module.exports = validate;
