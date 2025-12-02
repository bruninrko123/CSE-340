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
const validateInv = require("../utilities/inventory-validation");

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
  validateInv.checkAccountType,
  utilities.handleErrors(management.buildManagementPage)
);

router.get(
  "/add-classification",
  invValidate.checkAccountType,
  utilities.handleErrors(management.buildAddClassificationPage)
);

router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkAddClassificationData,
  invValidate.checkAccountType,
  utilities.handleErrors(management.addClassification)
);

router.get(
  "/add-inventory",
  invValidate.checkAccountType,
  utilities.handleErrors(management.buildAddInventoryPage)
);

router.post(
  "/add-inventory",
  invValidate.addInventoryRules(),
  invValidate.checkAddInventoryRules,
  invValidate.checkAccountType,
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

router.get(
  "/delete/:inv_id",
  utilities.handleErrors(management.buildDeleteInventoryPage)
);

router.post("/delete", utilities.handleErrors(management.deleteInventory));

module.exports = router;
