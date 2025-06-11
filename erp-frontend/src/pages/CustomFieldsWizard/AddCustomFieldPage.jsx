import React from 'react';
import EntityAddWizard from '../../components/forms/EntityAddWizard';
import CustomFieldStep1 from './CustomFieldStep1';
import CustomFieldStep2 from './CustomFieldStep2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCustomFieldPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await axios.post('/api/custom-fields', {
        name: formData.name,
        type: formData.type,
        enumValues: formData.enumValues || []
      });
      alert('Custom field added!');
      navigate('/custom-fields');
    } catch (err) {
      console.error(err);
      alert('Failed to add custom field');
    }
  };

  return (
    <EntityAddWizard
      title="Add New Custom Field"
      steps={[CustomFieldStep1, CustomFieldStep2]}
      onSubmit={handleSubmit}
    />
  );
};

export default AddCustomFieldPage;
