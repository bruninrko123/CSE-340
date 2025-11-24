const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};
const VehicleDetails = {};
const management = {};
//build inventory by classification view

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    if (!data || data.length === 0) {
      throw new Error("No vehicles found for this classification");
    }
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("inventory/classification", {
      title: className + "Vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error(
      "Sorry, we couldn't reach the vehicles for this category" + error
    );
    next(error);
  }
};

VehicleDetails.buildVehicleDetailsById = async function (req, res, next) {
  try {
    const vehicle_Id = req.params.vehicleId;
    const data = await invModel.getVehicleDetailsById(vehicle_Id);
    const detailsPage = await utilities.buildDetailsPage(data);
    const nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: data.inv_year + " " + data.inv_make + " " + data.inv_model,
      nav,
      detailsPage,
    });
  } catch (error) {
    console.error("Sorry, we could not build this vehicle" + error);
    next(error);
  }
};

management.buildManagementPage = async function (req, res, next) {
  const nav = await utilities.getNav();

  try {
    res.render("inventory/management", {
      title: "Management page",
      nav,
    });
  } catch (error) {
    console.error("Sorry, we could not build the management page");
    next(error);
  }
};

management.buildAddClassificationPage = async function (req, res, next) {
  const nav = await utilities.getNav();
  try {
    res.render("inventory/add-classification", {
      title: "Create new Classification",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

management.addClassification = async function (req, res) {
  let nav = await utilities.getNav();

  const { classification_name } = req.body;

  const addResult = await invModel.addClassification(classification_name);

  if (addResult) {
    req.flash("notice", `${classification_name} added!`);
    res.status(201).redirect("/");
  } else {
    req.flash(
      "notice",
      "Sorry, There was an error when creating the new classification"
    );
    res.status(500).render("inventory/add-classification", {
      title: "Create new Classification",
      nav,
      errors: null,
    });
  }
};

management.buildAddInventoryPage = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  try {
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

management.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();
  let {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  inv_price = parseFloat(inv_price);
  inv_miles = parseInt(inv_miles);
  const inv_image = "/images/vehicles/no-image.png";
  const inv_thumbnail = "/images/vehicles/no-image-tn.png";

  const addInventoryResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (addInventoryResult) {
    req.flash("notice", "New vehicle added");
    res.status(201).render("inventory/management", {
      title: "Add New Vehicle",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, there was an error when addind the vehicle");
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    });
  }
};
module.exports = { invCont, VehicleDetails, management };
