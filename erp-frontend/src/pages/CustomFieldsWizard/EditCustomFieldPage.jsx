import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import EntityEditWizard from '../../components/forms/EntityEditWizard';
import CustomFieldEditStep1 from './CustomFieldEditStep1';
import CustomFieldEditStep2 from './CustomFieldEditStep2';

const EditCustomFieldPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/custom-fields/${id}`)
      .then(res => setInitialData(res.data))
      .catch(err => {
        console.error('Failed to fetch custom field:', err);
        alert('Failed to load field data.');
        navigate('/custom-fields');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await axios.put(`/api/custom-fields/${id}`, {
        name: formData.name,
        type: formData.type,
        enumValues: formData.enumValues || []
      });
      alert('Custom field updated successfully.');
      navigate('/custom-fields');
    } catch (err) {
      console.error('Error updating custom field:', err);
      alert('Failed to update field.');
    }
  };

  if (loading || !initialData) return <div>Loading...</div>;

  return (
    <EntityEditWizard
      title="Edit Custom Field"
      steps={[CustomFieldEditStep1, CustomFieldEditStep2]}
      onSubmit={handleSubmit}
      initialData={initialData}
    />
  );
};

export default EditCustomFieldPage;
