import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, List, ListItem, ListItemText, IconButton, Checkbox, Typography
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const ManageCustomFieldsDialog = ({ open, onClose, category }) => {
  const [inheritedFields, setInheritedFields] = useState([]);
  const [allFields, setAllFields] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState([]);

  useEffect(() => {
    if (!open || !category) return;

    const fetchData = async () => {
      try {
        const [inheritedRes, allRes] = await Promise.all([
          axios.get(`/api/categories/${category._id}/custom-fields`),
          axios.get('/api/custom-fields')
        ]);

        setInheritedFields(inheritedRes.data || []);
        setAllFields(allRes.data || []);
        setSelectedToAdd([]);
      } catch (err) {
        console.error('Failed to fetch custom fields:', err);
      }
    };

    fetchData();
  }, [open, category]);

  const handleToggleAdd = (fieldId) => {
    setSelectedToAdd((prev) =>
      prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
    );
  };

  const handleAddFields = async () => {
    try {
      await axios.post(`/api/categories/${category._id}/custom-fields`, {
        fieldIds: selectedToAdd
      });
      onClose(true); // trigger reload
    } catch (err) {
      console.error('Failed to add fields:', err);
      alert('Failed to add fields');
    }
  };

  const handleDeleteField = async (fieldId) => {
    try {
      await axios.delete(`/api/categories/${category._id}/custom-fields/${fieldId}`);
      onClose(true); // trigger reload
    } catch (err) {
      console.error('Failed to delete field:', err);
      alert('Failed to delete field');
    }
  };

  if (!open || !category) return null;

  const inheritedFieldIds = inheritedFields.map(f => f._id);
  const availableFields = allFields.filter(f => !inheritedFieldIds.includes(f._id));
  const directlyLinkedIds = category.customFields || [];

  return (
    <Dialog open={true} onClose={() => onClose(false)} fullWidth maxWidth="md">
      <DialogTitle>Manage Custom Fields for {category.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Linked Fields (can delete if directly linked)</Typography>
        <List>
          {inheritedFields.map(field => (
            <ListItem
              key={field._id}
              secondaryAction={
                directlyLinkedIds.includes(field._id) ? (
                  <IconButton onClick={() => handleDeleteField(field._id)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null
              }
            >
              <ListItemText primary={field.name} secondary={field.type} />
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle1" mt={2}>Available Fields (can add)</Typography>
        <List>
          {availableFields.map(field => (
            <ListItem
              key={field._id}
              secondaryAction={
                <Checkbox
                  checked={selectedToAdd.includes(field._id)}
                  onChange={() => handleToggleAdd(field._id)}
                />
              }
            >
              <ListItemText primary={field.name} secondary={field.type} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleAddFields} variant="contained" disabled={selectedToAdd.length === 0}>
          Add Selected Fields
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageCustomFieldsDialog;
