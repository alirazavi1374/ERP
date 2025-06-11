const mongoose = require('mongoose');

const CustomFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['single-select', 'multi-select', 'text', 'number', 'currency', 'date', 'image'],
    required: true
  },
  enumValues: [{ type: String }], // ✅ matches frontend data structure
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false } // optional
});

module.exports = mongoose.model('CustomField', CustomFieldSchema);
