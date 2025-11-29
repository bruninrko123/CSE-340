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
  const classificationSelect = await utilities.buildClassificationList();
  try {
    res.render("inventory/management", {
      title: "Management page",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

management.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );

  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

// build the edit the inventory view
management.buildEditInventoryPage = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getVehicleDetailsById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const name = ` ${itemData.inv_make} ${itemData.inv_model}`;

  try {
    res.render("inventory/edit-inventory", {
      title: "Update Vehicle" + name,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_color: itemData.inv_color,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_miles: itemData.inv_miles,
      inv_price: itemData.inv_price,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_year: itemData.inv_year,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */

management.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();

  let {
    inv_id,
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

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated`);
    res.redirect("/inv/management");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Update" + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};
module.exports = { invCont, VehicleDetails, management };
