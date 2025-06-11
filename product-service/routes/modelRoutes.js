const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

router.get('/', modelController.getModels);
router.post('/', modelController.addModel);
router.put('/:id', modelController.updateModel);
router.delete('/:id', modelController.deleteModel);
router.get('/:id/fields', modelController.getModelFields); // specific
router.get('/:id', modelController.getModelById);          // generic — comes last
module.exports = router;