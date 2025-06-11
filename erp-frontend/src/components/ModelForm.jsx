import { useEffect, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import CategorySelect from './CategorySelect';

const ModelForm = ({ model, onClose }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (model) {
      setName(model.name);
      setCategoryId(model.category?._id || '');
    }
  }, [model]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, category: categoryId };

    try {
      if (model) {
        await axios.put(`/api/models/${model._id}`, payload);
      } else {
        await axios.post('/api/models', payload);
      }
      onClose();
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      <TextField
        label="Model Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <CategorySelect value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
      <Button variant="contained" type="submit">{model ? 'Update' : 'Create'}</Button>
    </Box>
  );
};

export default ModelForm;
