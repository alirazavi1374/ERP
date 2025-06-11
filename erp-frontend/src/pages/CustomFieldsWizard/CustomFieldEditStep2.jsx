import React, { useState } from 'react';
import {
  Box, TextField, Typography, IconButton, Button, Stack
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

const CustomFieldEditStep2 = ({ data, setData }) => {
  const [newOption, setNewOption] = useState('');

  const isSelectableType = ['single-select', 'multi-select'].includes(data.type);

  const handleAdd = () => {
    const trimmed = newOption.trim();
    if (trimmed && (!data.enumValues || !data.enumValues.includes(trimmed))) {
      setData({
        ...data,
        enumValues: [...(data.enumValues || []), trimmed]
      });
    }
    setNewOption('');
  };

  const handleDelete = (value) => {
    const updated = (data.enumValues || []).filter(opt => opt !== value);
    setData({
      ...data,
      enumValues: updated
    });
  };

  const handleEdit = (index, newValue) => {
    const updated = [...data.enumValues];
    updated[index] = newValue;
    setData({
      ...data,
      enumValues: updated
    });
  };

  if (!isSelectableType) {
    return <Typography>No additional configuration needed for this type.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Edit Options</Typography>

      <Stack spacing={1}>
        {(data.enumValues || []).map((opt, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1}>
            <TextField
              value={opt}
              onChange={(e) => handleEdit(index, e.target.value)}
              fullWidth
            />
            <IconButton onClick={() => handleDelete(opt)}><Delete /></IconButton>
          </Box>
        ))}

        <Box display="flex" alignItems="center" mt={2} gap={1}>
          <TextField
            label="New Option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            fullWidth
          />
          <IconButton onClick={handleAdd}><Add /></IconButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default CustomFieldEditStep2;
