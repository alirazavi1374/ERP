import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';
import ModelsPage from './pages/ModelsPage';
import ModelVariantsPage from './pages/ModelVariantsPage';
import VariantsPage from './pages/VariantsPage';
import CustomFieldsPage from './pages/CustomFieldsPage';
import AddCustomFieldPage from './pages/CustomFieldsWizard/AddCustomFieldPage';
import EditCustomFieldPage from './pages/CustomFieldsWizard/EditCustomFieldPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AddCategoryPage from './pages/CategoriesWizard/AddCategoryPage';
import EditCategoryPage from './pages/CategoriesWizard/EditCategoryPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:modelId/variants" element={<ModelVariantsPage />} />
          <Route path="/variants" element={<VariantsPage />} />
          <Route path="/custom-fields" element={<CustomFieldsPage />} />
          <Route path="/custom-fields/add" element={<AddCustomFieldPage />} />
          <Route path="/custom-fields/edit/:id" element={<EditCustomFieldPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/add" element={<AddCategoryPage />} />
          <Route path="/categories/edit/:id" element={<EditCategoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
