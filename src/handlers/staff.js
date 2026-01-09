const Staff = require("@schemas/Staff");

/**
 * Verifica se o usuário é staff
 * @param {string} userId 
 * @returns {Promise<boolean>}
 */
async function isStaff(userId) {
  const staff = await Staff.findOne({ userId });
  return !!staff;
}

/**
 * Adiciona usuário ao staff
 * @param {string} userId 
 * @param {string} addedBy 
 * @param {string[]} permissions 
 * @returns {Promise<boolean>}
 */
async function addStaff(userId, addedBy, permissions = ["BASIC_STAFF"]) {
  try {
    await Staff.create({
      userId,
      addedBy,
      permissions
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Remove usuário do staff
 * @param {string} userId 
 * @returns {Promise<boolean>}
 */
async function removeStaff(userId) {
  try {
    await Staff.deleteOne({ userId });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Lista todos os staff
 * @returns {Promise<Array>}
 */
async function listStaff() {
  return await Staff.find().sort({ addedAt: -1 });
}

module.exports = {
  isStaff,
  addStaff,
  removeStaff,
  listStaff
};