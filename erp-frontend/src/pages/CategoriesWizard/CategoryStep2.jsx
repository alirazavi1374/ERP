import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import MultiSelectDropdown from '../../components/forms/MultiSelectDropdown';
import axios from 'axios';

const CategoryStep2 = ({ data, setData }) => {
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    axios.get('/api/custom-fields')
      .then(res => setCustomFields(res.data))
      .catch(err => setCustomFields([]));
  }, []);

  const selected = customFields.filter(f => (data.customFields || []).includes(f._id));

  const handleChange = (selectedFields) => {
    const ids = selectedFields.map(f => f._id);
    setData({ ...data, customFields: ids });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Assign Custom Fields
      </Typography>
      <MultiSelectDropdown
        label="Custom Fields"
        options={customFields}
        value={selected}
        onChange={handleChange}
        getOptionLabel={(f) => f.name}
        placeholder="Select custom fields to assign to this category"
      />
    </Box>
  );
};

export default CategoryStep2;
