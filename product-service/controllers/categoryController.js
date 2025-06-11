const Category = require('../models/Category');
const Model = require('../models/Model');
const { getInheritedCustomFields } = require('../utils/inheritanceUtils');

// Utility to check for loops in category hierarchy
const hasLoop = async (parentId, childId) => {
  if (!parentId || !childId) return false; // skip if either is missing

  while (parentId) {
    if (parentId.toString() === childId.toString()) return true;

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) break;

    parentId = parentCategory.parent;
  }

  return false;
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.addCategory = async (req, res) => {
  try {
    const { name, parent, customFields } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const inheritedFields = await getInheritedCustomFields(parent);
    const combinedFields = [...new Set([...(customFields || []), ...inheritedFields])];

    const category = new Category({
      name,
      parent: parent || null,
      customFields: combinedFields,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ message: 'Server error while adding category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent, customFields } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (parent && await hasLoop(parent, id)) {
      return res.status(400).json({ message: 'Category loop detected' });
    }

    const inheritedFields = await getInheritedCustomFields(parent);
    const combinedFields = [...new Set([...(customFields || []), ...inheritedFields])];

    const category = await Category.findByIdAndUpdate(
      id,
      { name, parent, customFields: combinedFields },
      { new: true }
    );

    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Server error while updating category' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { keepData } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.name === 'Default Category') {
      return res.status(400).json({ message: 'Cannot delete the Default Category' });
    }

    // Ensure default category exists
    let defaultCategory = await Category.findOne({ name: 'Default Category' });
    if (!defaultCategory) {
      defaultCategory = new Category({ name: 'Default Category' });
      await defaultCategory.save();
    }

    if (keepData) {
      // Move subcategories and models to default category
      await Category.updateMany({ parentId: id }, { parentId: defaultCategory._id });
      await Model.updateMany({ category: id }, { category: defaultCategory._id });
    } else {
      // Delete all subcategories and models under this category
      await Category.deleteMany({ parentId: id });
      await Model.deleteMany({ category: id });
    }

    await Category.findByIdAndDelete(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};
