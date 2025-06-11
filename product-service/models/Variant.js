const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },
  name: { type: String, required: true },
  customValues: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Supports various types: string, number, etc.
    default: {}
  }
});

module.exports = mongoose.model('Variant', VariantSchema);
