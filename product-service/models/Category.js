const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  customFields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomField' }],
});

module.exports = mongoose.model('Category', CategorySchema);
