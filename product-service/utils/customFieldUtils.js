const Category = require('../models/Category');
const CustomField = require('../models/CustomField');

const getInheritedFields = async (categoryId) => {
  const fields = [];
  let current = categoryId;

  while (current) {
    const cat = await Category.findById(current);
    if (!cat) break;

    const catFields = await CustomField.find({ category: cat._id });
    fields.push(...catFields);
    current = cat.parent;
  }

  return fields;
};

module.exports = { getInheritedFields };
