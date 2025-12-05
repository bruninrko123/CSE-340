const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const {
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
} = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const { updatePassword } = require("../models/account-model");

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

router.get("/logout", utilities.handleErrors(accountLogout));

router.get("/update", utilities.handleErrors(updateAccountInformationView));

router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountRules,
  utilities.handleErrors(updateAccount)
);

router.post(
  "/updatePassword",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordRules,
  utilities.handleErrors(updatePasswordProcess)
);

router.get(
  "/delete",
  regValidate.checkAccountType,
  utilities.handleErrors(deleteAccountView)
);

router.post("/delete", utilities.handleErrors(deleteAccountProcess));

module.exports = router;
