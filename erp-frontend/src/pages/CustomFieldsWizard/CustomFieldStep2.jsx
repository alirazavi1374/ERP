import React from 'react';
import { Box, TextField, IconButton, Typography, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const CustomFieldStep2 = ({ data, setData }) => {
  const isSelectType = ['single-select', 'multi-select'].includes(data.type);

  if (!isSelectType) return (
    <Typography color="text.secondary">
      No additional options required for type: <strong>{data.type}</strong>
    </Typography>
  );

  const values = data.enumValues || [];

  const handleAdd = () => {
    setData({ ...data, enumValues: [...values, ''] });
  };

  const handleChange = (index, value) => {
    const updated = [...values];
    updated[index] = value;
    setData({ ...data, enumValues: updated });
  };

  const handleRemove = (index) => {
    const updated = values.filter((_, i) => i !== index);
    setData({ ...data, enumValues: updated });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Enum Values</Typography>
      {values.map((val, index) => (
        <Box display="flex" alignItems="center" key={index} mb={1}>
          <TextField
            fullWidth
            label={`Value ${index + 1}`}
            value={val}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          <IconButton onClick={() => handleRemove(index)}><Delete /></IconButton>
        </Box>
      ))}
      <Button startIcon={<Add />} onClick={handleAdd}>Add Value</Button>
    </Box>
  );
};

export default CustomFieldStep2;
