const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const {
  buildLogin,
  buildRegistration,
  registerAccount,
} = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(buildLogin));

router.get("/registration", utilities.handleErrors(buildRegistration));

//registration post route
router.post(
  "/registration",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(registerAccount)
);

//process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  (req, res) => {
    res.status(200).send("login process");
  }
);

module.exports = router;
