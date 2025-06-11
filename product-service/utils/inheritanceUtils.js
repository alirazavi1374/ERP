const Category = require('../models/Category');

async function getInheritedCustomFields(categoryId, visited = new Set()) {
  if (!categoryId || visited.has(categoryId.toString())) return [];

  visited.add(categoryId.toString());

  const category = await Category.findById(categoryId).populate('customFields').lean();
  if (!category) return [];

  const parentFields = await getInheritedCustomFields(category.parent, visited);
  const ownFields = Array.isArray(category.customFields)
    ? category.customFields.map(f => f._id?.toString() || f.toString())
    : [];

  return [...new Set([...parentFields, ...ownFields])];
}


module.exports = { getInheritedCustomFields };
