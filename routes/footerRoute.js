const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const footerController = require("../controllers/footerController");

router.get("/", utilities.handleErrors(footerController.buildFooter));

module.exports = router;
