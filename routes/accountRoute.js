const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  accountLogout
} = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

//default route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(buildAccountManagementView)
);

//login route
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
  utilities.handleErrors(accountLogin)
);

router.get("/logout",
  utilities.handleErrors(accountLogout)
)

module.exports = router;
