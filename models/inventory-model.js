const pool = require("../database/");

//Get all classification data

async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
  } catch (error) {
    console.error("getClassifications error");
    throw error;
  }
}

// get all the inventory items and classification_name by classification_id

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error" + error);
    throw error;
  }
}

//get data for a specific vehicle

async function getVehicleDetailsById(vehicleId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [vehicleId]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleDetailsById error" + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleDetailsById,
};
