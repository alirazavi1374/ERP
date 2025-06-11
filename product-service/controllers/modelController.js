const Model = require('../models/Model');
const Category = require('../models/Category');

exports.getModels = async (req, res) => {
  const models = await Model.find().populate('category');
  res.json(models);
};

exports.addModel = async (req, res) => {
  const { name, category } = req.body;

  const catExists = await Category.findById(category);
  if (!catExists) return res.status(400).json({ message: 'Invalid category' });

  const model = new Model({ name, category });
  await model.save();
  res.status(201).json(model);
};

exports.updateModel = async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const catExists = await Category.findById(category);
  if (!catExists) return res.status(400).json({ message: 'Invalid category' });

  const model = await Model.findByIdAndUpdate(id, { name, category }, { new: true });
  res.json(model);
};


const Variant = require('../models/Variant'); // Make sure this is at the top

exports.deleteModel = async (req, res) => {
  try {
    const modelId = req.params.id;

    // Delete all related variants
    await Variant.deleteMany({ model: modelId });

    // Delete the model itself
    await Model.findByIdAndDelete(modelId);

    res.status(200).json({ message: 'Model and its variants deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete model.' });
  }
};

const { getInheritedFields } = require('../utils/customFieldUtils');

exports.getModelFields = async (req, res) => {
  const { id } = req.params;

  const model = await Model.findById(id).populate('category');
  if (!model) return res.status(404).json({ message: 'Model not found' });

  const fields = await getInheritedFields(model.category._id);
  res.json(fields);
};

exports.getModelById = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await Model.findById(id).populate('category');
    if (!model) return res.status(404).json({ message: 'Model not found' });
    res.json(model);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch model' });
  }
};