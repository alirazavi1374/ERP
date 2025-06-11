const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { getInheritedCustomFields } = require('../utils/inheritanceUtils');
const CustomField = require('../models/CustomField');

router.get('/', categoryController.getCategories);
router.get('/:id/custom-fields', async (req, res) => {
  try {
    const allFieldIds = await getInheritedCustomFields(req.params.id);
    const fields = await CustomField.find({ _id: { $in: allFieldIds } });
    res.json(fields);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', categoryController.addCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);


module.exports = router;
