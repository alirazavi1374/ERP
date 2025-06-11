import React, { useEffect, useState } from 'react';
import { TextField, Box } from '@mui/material';
import SearchableDropdown from '../../components/forms/SearchableDropdown';
import axios from 'axios';

const CategoryStep1 = ({ data, setData }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => {
        if (Array.isArray(res.data)) setCategories(res.data);
        else setCategories([]);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <Box>
      <TextField
        fullWidth
        label="Category Name"
        value={data.name || ''}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        margin="normal"
      />

      <SearchableDropdown
        label="Parent Category (optional)"
        options={categories}
        value={categories.find(c => c._id === data.parent) || null}
        onChange={(parent) => setData({ ...data, parent: parent?._id || null })}
        placeholder="Select a parent category"
      />
    </Box>
  );
};

export default CategoryStep1;
