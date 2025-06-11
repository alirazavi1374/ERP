import { useEffect, useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import axios from 'axios';

const CategorySelect = ({ value, onChange, label = "Category" }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategoryOptions = (items, level = 0) => {
    return items.flatMap(cat => [
      <MenuItem key={cat._id} value={cat._id}>
        {'—'.repeat(level)} {cat.name}
      </MenuItem>,
      ...(cat.children ? renderCategoryOptions(cat.children, level + 1) : [])
    ]);
  };

  // Flat list if no tree is returned (e.g. for now)
  return (
    <FormControl fullWidth required>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label}>
        {loading ? (
          <MenuItem disabled><CircularProgress size={20} /></MenuItem>
        ) : (
          categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
