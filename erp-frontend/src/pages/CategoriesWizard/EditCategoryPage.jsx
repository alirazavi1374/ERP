import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, MenuItem, Typography
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch all categories for the parent selection dropdown
  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  // Load current category data to prefill the form
  useEffect(() => {
    axios.get('/api/categories')
      .then(res => {
        const category = res.data.find(cat => cat._id === id);
        if (category) {
          if (category.name === 'Default Category') {
            alert('The Default Category cannot be edited.');
            navigate('/categories');
            return;
          }
          setName(category.name || '');
          setParentId(category.parentId || '');
        }
      })
      .catch(err => {
        console.error('Failed to load category:', err);
        alert('Error loading category');
        navigate('/categories');
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/categories/${id}`, { name, parentId });
      navigate('/categories');
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Failed to update category');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Edit Category</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          select
          fullWidth
          label="Parent Category"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          margin="normal"
        >
          <MenuItem value="">None (Top level)</MenuItem>
          {categories
            .filter(cat => cat._id !== id)
            .map(cat => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
        </TextField>
        <Box mt={3}>
          <Button type="submit" variant="contained">Save</Button>
          <Button onClick={() => navigate('/categories')} sx={{ ml: 2 }}>Cancel</Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditCategoryPage;
