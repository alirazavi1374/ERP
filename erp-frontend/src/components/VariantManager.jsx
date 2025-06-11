import { useEffect, useState } from 'react';
import {
  TextField, Button, IconButton, Box, Typography, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CustomFieldForm from './CustomFieldForm';

const VariantManager = ({ modelId }) => {
  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({ name: '', customFieldValues: {} });
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    const fetchVariants = async () => {
      const res = await axios.get(`/api/variants?modelId=${modelId}`);
      setVariants(res.data);
    };

    const fetchCustomFields = async () => {
      const modelRes = await axios.get(`/api/models/${modelId}`);
      const categoryId = modelRes.data.category?._id;
      const fieldsRes = await axios.get(`/api/custom-fields?categoryId=${categoryId}`);
      setCustomFields(fieldsRes.data);
    };

    fetchVariants();
    fetchCustomFields();
  }, [modelId]);

  const handleAddVariant = async () => {
    const payload = { ...newVariant, model: modelId };
    await axios.post('/api/variants', payload);
    setNewVariant({ name: '', customFieldValues: {} });
    const res = await axios.get(`/api/variants?modelId=${modelId}`);
    setVariants(res.data);
  };

  const handleDeleteVariant = async (id) => {
    if (window.confirm('Delete this variant?')) {
      await axios.delete(`/api/variants/${id}`);
      const res = await axios.get(`/api/variants?modelId=${modelId}`);
      setVariants(res.data);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Add New Variant</Typography>
      <TextField
        label="Variant Name"
        value={newVariant.name}
        onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
        fullWidth
        margin="normal"
      />
      <CustomFieldForm
        fields={customFields}
        values={newVariant.customFieldValues}
        onChange={(updatedValues) =>
          setNewVariant({ ...newVariant, customFieldValues: updatedValues })
        }
      />
      <Button variant="contained" onClick={handleAddVariant}>Add Variant</Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Existing Variants</Typography>
      {variants.map((variant) => (
        <Box key={variant._id} sx={{ mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1">{variant.name}</Typography>
          {Object.entries(variant.customFieldValues || {}).map(([key, val]) => (
            <Typography key={key} variant="body2">{key}: {Array.isArray(val) ? val.join(', ') : val}</Typography>
          ))}
          <IconButton onClick={() => handleDeleteVariant(variant._id)}><DeleteIcon /></IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default VariantManager;
