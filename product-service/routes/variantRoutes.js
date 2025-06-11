const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');

router.get('/', variantController.getVariants);
router.post('/', variantController.addVariant);
router.put('/:id', variantController.updateVariant);
router.delete('/:id', variantController.deleteVariant);

module.exports = router;
