const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};
const VehicleDetails = {};
//build inventory by classification view

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + "Vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error(
      "Sorry, we couldn't reach the vehicles for this category" + error
    );
  }
};

VehicleDetails.buildVehicleDetailsById = async function (req, res, next) {
  try {
    const vehicle_Id = req.params.vehicleId;
    const data = await invModel.getVehicleDetailsById(vehicle_Id);
    const detailsPage = await utilities.buildDetailsPage(data);
    const nav = await utilities.getNav();

    res.render("./inventory/detail", {
      title: data.inv_year + " " + data.inv_make + " " + data.inv_model,
      nav,
      detailsPage,
    });
  } catch (error) {
    console.error("Sorry, we could not build this vehicle" + error);
  } 
};

module.exports = { invCont, VehicleDetails };
