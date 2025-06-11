import React from 'react';
import EntityAddWizard from '../../components/forms/EntityAddWizard';
import CategoryStep1 from './CategoryStep1';
import CategoryStep2 from './CategoryStep2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCategoryPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const res = await axios.post('/api/categories', {
        name: formData.name,
        parent: formData.parent || null,
        customFields: formData.customFields || []
      });
      alert('Category added successfully!');
      navigate('/categories');
    } catch (err) {
      console.error(err);
      alert('Failed to add category.');
    }
    console.log('Form Data:', formData);
  };

  return (
    <EntityAddWizard
      title="Add New Category"
      steps={[CategoryStep1, CategoryStep2]}
      onSubmit={handleSubmit}
    />
  );
};

export default AddCategoryPage;
