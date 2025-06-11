import React, { useEffect } from 'react';
import { TextField, MenuItem, Box } from '@mui/material';

const fieldTypes = [
  'single-select', 'multi-select', 'text',
  'number', 'currency', 'date', 'image'
];

const CustomFieldEditStep1 = ({ data, setData }) => {
  useEffect(() => {
    // Set previousType only once when the component loads
    if (!data.previousType && data.type) {
      setData(prev => ({ ...prev, previousType: prev.type }));
    }
  }, [data, setData]);

  const handleChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Field Name"
        value={data.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="Field Type"
        value={data.type || ''}
        onChange={(e) => handleChange('type', e.target.value)}
        margin="normal"
      >
        {fieldTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default CustomFieldEditStep1;
