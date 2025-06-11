const express = require('express');
const router = express.Router();
const customFieldController = require('../controllers/customFieldController');

router.get('/', customFieldController.getAllCustomFields);
router.post('/', customFieldController.addCustomField);
router.get('/:id', customFieldController.getCustomField);
router.put('/:id', customFieldController.updateCustomField);
router.delete('/:id', customFieldController.deleteCustomField);
router.get('/:id/used-values', customFieldController.getUsedFieldValues);

module.exports = router;