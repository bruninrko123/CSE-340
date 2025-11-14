const utilities = require("../utilities/");
const footerController = {};

footerController.buildFooter = async function (req, res) {
    throw new error("testing error");
    const nav = await utilities.getNav();
  
  res.render("./partials/footer", { title: "Footer", nav,});
};

module.exports = footerController;
