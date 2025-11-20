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

Util.buildForm = async function () {
  let form = `
  <form action="/account/login" method="post" class="loginForm">
    <label for="account_email">Email:
        <input type="email" name="account_email" id="account_email" required>
    </label>
    <label for="account_password">Password:
    <div><i>The password should have at least 12 characters, at least 1 uppercase character, 1 number and 1 special character</i></div>
        <input type="password" name="account_password" id="account_password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"  required>
    </label>
    <div>
    <button type="submit">Log in</button>
    <p class="NoAccountText">No account? <a href="/account/registration">Sign-up</a></p>
    </div>
</form>`;

  return form;
};

Util.buildRegistrationPage = async function () {
  let regform = `
  <form action="/account/registration" method="post" class="loginForm">
    <label for="account_firstname">First name:
        <input type="text" name="account_firstname" id="account_firstname" value=" <%= locals.account_firstname %>"  required >
    </label>
    <label for="account_lastname">Last name:
        <input type="text" name="account_lastname" id="account_lastname" value="<%= locals.account_lastname %> required>
    </label>
    <label for="account_email">Email address:
        <input type="email" name="account_email" id="account_email" value="<%= locals.account_email %> required>
    </label>
    <label for="account_password">Password: 
    <div><i>The password should have at least 12 characters, at least 1 uppercase character, 1 number and 1 special character</i></div>
        <input type="password" name="account_password" id="account_password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" required>
    </label>
    
    <div>
    <button type="submit">Register</button>
    
    </div>
</form>`;

  return regform;
};
//middleware for handling errors
//wrap other functions in this for General error handling

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
module.exports = Util;
