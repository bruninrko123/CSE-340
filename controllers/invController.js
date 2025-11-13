const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};
const VehicleDetails = {};
//build inventory by classification view

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + "Vehicles",
    nav,
    grid,
  });
};

VehicleDetails.buildVehicleDetailsById = async function (req, res, next) {
  const vehicle_Id = req.params.vehicleId;
  const data = await invModel.getVehicleDetailsById(vehicle_Id);
  const detailsPage = await utilities.buildDetailsPage(data);
  const nav = await utilities.getNav();
  // const carName = data[0].inv_make + data[0].inv_model;
  res.render("./inventory/detail", {
    title: "hello",
    nav,
    detailsPage,
  });
};

module.exports = { invCont, VehicleDetails} ;
