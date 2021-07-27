const mongoose = require('mongoose');
const Category = require('../models/location/category');
const Location = require('../models/location/location');

const findNotDeletedCategory = async (locationId, name = '') => {
  const c = await Category.find({
    locationId: mongoose.Types.ObjectId(locationId),
    name,
    deleted: false,
  });
  return c;
};

const createCategory = async (locationId, name) => {
  const newCategory = new Category({ locationId, name });
  await newCategory.save();
};

const updateCategoryName = async (locationId, categoryId, name) => {
  return Category.findOneAndUpdate(
    {
      _id: categoryId,
      locationId,
      deleted: false,
    },
    { name },
    { new: true }
  );
};

const deleteCategory = async (locationId, categoryId) => {
  return Category.findOneAndUpdate(
    {
      _id: categoryId,
      locationId,
      deleted: false,
    },
    { deleted: true },
    { new: true }
  );
};

const removeWorkManualIfCategoryDeleted = (locationId, categoryId) => {
  return Location.updateMany(
    {
      _id: locationId,
      'workManuals.category_id': categoryId,
    },
    {
      $set: {
        'workManuals.$[elem].deleted': true,
      },
    },
    {
      arrayFilters: [{ 'elem.category_id': categoryId }],
    }
  );
};

module.exports = {
  findNotDeletedCategory,
  createCategory,
  updateCategoryName,
  deleteCategory,
  removeWorkManualIfCategoryDeleted,
};
