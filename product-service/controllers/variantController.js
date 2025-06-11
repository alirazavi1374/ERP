const Variant = require('../models/Variant');
const Model = require('../models/Model');
const { getInheritedFields } = require('../utils/customFieldUtils');

exports.getVariants = async (req, res) => {
  const { modelId } = req.query;

  const query = modelId ? { model: modelId } : {};

  const variants = await Variant.find(query).populate({
    path: 'model',
    populate: { path: 'category' }
  });

  res.json(variants);
};

exports.addVariant = async (req, res) => {
  const { model, name, customValues } = req.body;

  const modelExists = await Model.findById(model);
  if (!modelExists) return res.status(400).json({ message: 'Invalid model' });

  const variant = new Variant({ model, name, customValues });
  await variant.save();
  res.status(201).json(variant);
};

exports.updateVariant = async (req, res) => {
  const { id } = req.params;
  const { name, customValues, model } = req.body;

  const existing = await Variant.findById(id);
  if (!existing) return res.status(404).json({ message: 'Variant not found' });

  // Block reassignment of the variant's model
  if (model && model !== existing.model.toString()) {
    return res.status(400).json({ message: 'Cannot change variant model after creation' });
  }

  existing.name = name;
  existing.customValues = customValues;
  await existing.save();

  res.json(existing);
};

exports.deleteVariant = async (req, res) => {
  const { id } = req.params;
  await Variant.findByIdAndDelete(id);
  res.status(200).json({ message: 'Variant deleted successfully' });
};
