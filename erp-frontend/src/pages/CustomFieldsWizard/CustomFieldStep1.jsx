import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';

const fieldTypes = [
  'single-select', 'multi-select', 'text', 'number',
  'currency', 'date', 'image'
];

const CustomFieldStep1 = ({ data, setData }) => {
  return (
    <Box>
      <TextField
        fullWidth
        label="Field Name"
        value={data.name || ''}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="Field Type"
        value={data.type || ''}
        onChange={(e) => setData({ ...data, type: e.target.value })}
        margin="normal"
      >
        {fieldTypes.map((type) => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default CustomFieldStep1;
