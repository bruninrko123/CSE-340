//Needed resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");
const {
  invCont,
  VehicleDetails,
  management,
} = require("../controllers/invController");

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invCont.buildByClassificationId)
);

router.get(
  "/detail/:vehicleId",
  utilities.handleErrors(VehicleDetails.buildVehicleDetailsById)
);

router.get(
  "/management",
  utilities.handleErrors(management.buildManagementPage)
);

router.get(
  "/add-classification",
  utilities.handleErrors(management.buildAddClassificationPage)
);

router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkAddClassificationData,
  utilities.handleErrors(management.addClassification)
);

router.get(
  "/add-inventory",
  utilities.handleErrors(management.buildAddInventoryPage)
);

router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkAddInventoryRules,
  utilities.handleErrors(management.addInventory)
);

// route to get inventory data
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(management.getInventoryJSON)
);

//route to modify inventory
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(management.buildEditInventoryPage)
);

router.post(
  "/update",
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(management.updateInventory)
);

module.exports = router;
