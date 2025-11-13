//Needed resources
const express = require("express");
const router = new express.Router();
const {invCont, VehicleDetails} = require("../controllers/invController");

router.get("/type/:classificationId", invCont.buildByClassificationId);

router.get("/detail/:vehicleId", VehicleDetails.buildVehicleDetailsById);

module.exports = router;
