const CustomField = require('../models/CustomField');
const Category = require('../models/Category');
const Model = require('../models/Model');
const Variant = require('../models/Variant');

// Get all custom fields
exports.getAllCustomFields = async (req, res) => {
  try {
    const fields = await CustomField.find();
    res.json(fields);
  } catch (err) {
    console.error('Error fetching custom fields:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a custom field by ID
exports.getCustomField = async (req, res) => {
  try {
    const field = await CustomField.findById(req.params.id);
    if (!field) return res.status(404).json({ message: 'Field not found' });
    res.json(field);
  } catch (err) {
    console.error('Error fetching custom field:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new custom field
exports.addCustomField = async (req, res) => {
  try {
    const { name, type, enumValues } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const validTypes = [
      'single-select', 'multi-select', 'text',
      'number', 'currency', 'date', 'image'
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid field type' });
    }

    // Always assign to Default Category
    const defaultCategory = await Category.findOne({ name: 'Default Category' });
    if (!defaultCategory) {
      return res.status(500).json({ message: 'Default Category not found' });
    }

    const fieldData = {
      name,
      type,
      category: defaultCategory._id
    };

    if (['single-select', 'multi-select'].includes(type)) {
      fieldData.enumValues = Array.isArray(enumValues)
        ? enumValues.filter(v => v.trim() !== '')
        : [];
    }

    const field = new CustomField(fieldData);
    await field.save();

    res.status(201).json(field);
  } catch (err) {
    console.error('Error creating custom field:', err);
    res.status(500).json({ message: 'Server error while adding custom field' });
  }
};

// Get used values of a specific custom field
exports.getUsedFieldValues = async (req, res) => {
  try {
    const { id } = req.params;

    const modelValues = await Variant.aggregate([
      { $project: { value: `$customFieldValues.${id}` } },
      { $match: { value: { $exists: true, $ne: null } } },
      { $group: { _id: '$value' } }
    ]);

    const values = modelValues.map(v => v._id).filter(Boolean);
    res.json(values);
  } catch (err) {
    console.error('Error fetching used field values:', err);
    res.status(500).json({ message: 'Failed to retrieve used values' });
  }
};

// Update a custom field by ID
exports.updateCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, enumValues, category } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    let updateData = {
      name,
      type,
      category: category || null,
      enumValues: []
    };

    if (['single-select', 'multi-select'].includes(type)) {
      updateData.enumValues = Array.isArray(enumValues)
        ? enumValues.filter(v => v.trim() !== '')
        : [];
    }
    const existingField = await CustomField.findById(id);
      if (!existingField) {
        return res.status(404).json({ message: 'Custom field not found' });
      }

      const oldOptions = new Set(existingField.enumValues || []);
      const newOptions = new Set(updateData.enumValues || []);
      const deletedOptions = [...oldOptions].filter(option => !newOptions.has(option));

      // Update Variant documents that used deleted options
      if (deletedOptions.length && ['single-select', 'multi-select'].includes(type)) {
        const updateQuery = { [`customFieldValues.${id}`]: { $in: deletedOptions } };

        if (type === 'single-select') {
          await Variant.updateMany(updateQuery, {
            $unset: { [`customFieldValues.${id}`]: "" }
          });
        } else if (type === 'multi-select') {
          // First, remove deleted values from array
          await Variant.updateMany(updateQuery, {
            $pull: { [`customFieldValues.${id}`]: { $in: deletedOptions } }
          });

          // Then, unset if array becomes empty
          await Variant.updateMany(
            { [`customFieldValues.${id}`]: { $size: 0 } },
            { $unset: { [`customFieldValues.${id}`]: "" } }
          );
        }
      }
    const updatedField = await CustomField.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedField) {
      return res.status(404).json({ message: 'Custom field not found' });
    }

    res.json(updatedField);
  } catch (err) {
    console.error('Error updating custom field:', err);
    res.status(500).json({ message: 'Server error while updating custom field' });
  }
};

// Delete a custom field by ID
exports.deleteCustomField = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CustomField.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Custom field not found' });
    }

    res.json({ message: 'Custom field deleted successfully' });
  } catch (err) {
    console.error('Error deleting custom field:', err);
    res.status(500).json({ message: 'Server error while deleting custom field' });
  }
};
