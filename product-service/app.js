const express = require('express');
const mongoose = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const categoryRoutes = require('./routes/categoryRoutes');
const modelRoutes = require('./routes/modelRoutes');
const variantRoutes = require('./routes/variantRoutes');
const customFieldRoutes = require('./routes/customFieldRoutes');
const Category = require('./models/Category');


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/custom-fields', customFieldRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//Default Category Seeder
async function createDefaultCategory() {
  const exists = await Category.findOne({ name: 'Default Category' });
  if (!exists) {
    const defaultCat = new Category({ name: 'Default Category', parent: null });
    await defaultCat.save();
    console.log('Default Category created.');
  }
}
createDefaultCategory();