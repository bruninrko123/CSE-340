//Needed resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const { invCont, VehicleDetails } = require("../controllers/invController");

router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId));

router.get("/detail/:vehicleId", utilities.handleErrors(VehicleDetails.buildVehicleDetailsById));

module.exports = router;
