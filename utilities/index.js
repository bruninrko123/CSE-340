const invModel = require("../models/inventory-model");
const Util = {};

//constructs the nav HTML unordered list
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list;

  list = "<ul>";
  list += '<li><a href="/" title="Home Page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  
  list += "</ul>";
  return list;
};

// build the clasification view HTML

Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '"title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '"title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "<h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "<span>";
      grid += "<div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildDetailsPage = async function (data) {
  let details;
  let formattedPrice = Number(data.inv_price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });
  if (data) {
    details = `
    <div class="content">
    <section class="image">
    <img src="${data.inv_image}" alt="${data.inv_model} ${
      data.inv_make
    } image" width="600">
    </section>
    <section class="info">
    <div class="mileage-pric">
    <p id="mileage">MILEAGE<BR>${Number(data.inv_miles).toLocaleString(
      "en-US"
    )}</p>
    <p id="price">$${formattedPrice}</p>
    </div>
    <p id="color"><strong>Color:</strong> ${data.inv_color}</p>
    <p class="description">Description:<br>${data.inv_description}</p>
    </section>
    </div>`;
  } else {
    details = `<p>Sorry, we couldn't find this vehicle's details</p>`;
  }
  return details;
};

//middleware for handling errors
//wrap other functions in this for General error handling

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
module.exports = Util;
