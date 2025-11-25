const utilities = require("./index");
const { body, validationResult } = require("express-validator");
const validateInv = {};
const inventoryModel = require("../models/inventory-model");

/*  **********************************
 *  New classification Data Validation Rules
 * ********************************* */

validateInv.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage(
        "Please provide a classification name at least 3 letters long"
      ),
  ];
};

validateInv.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Create new Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validateInv.addInventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .isInt()
      .withMessage("please, select a classification"),

    body("inv_make")
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 1 })
      .withMessage("please, add a valide make"),

    body("inv_model")
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 1 })
      .withMessage("please, add a valide model"),

    body("inv_year").notEmpty().isInt().withMessage("Please, select a year"),

    body("inv_description")
      .notEmpty()
      .trim()
      .escape()
      .isLength({ min: 20 })
      .withMessage(
        "Please, add a description that contains at least 20 characters"
      ),

    body("inv_price")
      .notEmpty()
      .trim()
      .isFloat({ gt: 0 })
      .escape()
      .withMessage("Please, add a price"),

    body("inv_miles")
      .notEmpty()
      .trim()
      .isFloat({ gt: 0 })
      .escape()
      .withMessage("Please, add a mileage"),

    body("inv_color")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Please, add a color"),
  ];
};

validateInv.checkAddInventoryRules = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};
module.exports = validateInv;
