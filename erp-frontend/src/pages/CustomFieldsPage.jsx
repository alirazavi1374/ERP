import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Tooltip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Correct placement

const fieldTypes = [
  'single-select', 'multi-select', 'text', 'number',
  'currency', 'date', 'image'
];

const CustomFieldsPage = () => {
  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', type: '' });
  const navigate = useNavigate(); // ✅ Hook inside the component

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = () => {
    axios.get('/api/custom-fields')
      .then(res => setFields(res.data))
      .catch(err => console.error(err));
  };

  const handleOpen = (field = null) => {
    setEditing(field);
    setForm(field ? { name: field.name, type: field.type } : { name: '', type: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSave = () => {
    const method = editing ? axios.put : axios.post;
    const url = editing ? `/api/custom-fields/${editing._id}` : '/api/custom-fields';

    method(url, form)
      .then(() => {
        fetchFields();
        handleClose();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (fieldId) => {
    if (window.confirm('Are you sure you want to delete this custom field?')) {
      axios.delete(`/api/custom-fields/${fieldId}`)
        .then(() => fetchFields())
        .catch(err => console.error(err));
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Custom Fields</h2>
        <Tooltip title="Add Custom Field">
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/custom-fields/add')}>
            Add
          </Button>
        </Tooltip>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map(field => (
              <TableRow key={field._id}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.type}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => navigate(`/custom-fields/edit/${field._id}`)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(field._id)}><Delete /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Edit Custom Field' : 'Add Custom Field'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            margin="normal"
          >
            {fieldTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomFieldsPage;
