import { useEffect, useState } from 'react';
import {
  Typography, Button, IconButton, Dialog, DialogTitle, DialogContent,
  Tooltip, Paper, Box, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModelForm from '../components/ModelForm';

const ModelsPage = () => {
  const [models, setModels] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editModel, setEditModel] = useState(null);
  const navigate = useNavigate(); // ✅ Required to use navigate()

  const fetchModels = async () => {
    const res = await axios.get('/api/models');
    setModels(res.data);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this model?')) {
      await axios.delete(`/api/models/${id}`);
      fetchModels();
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Models</Typography>
        <Button startIcon={<AddIcon />} onClick={() => setOpenForm(true)} variant="contained">Add Model</Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model._id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.category?.name}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton onClick={() => { setEditModel(model); setOpenForm(true); }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(model._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Manage Variants">
                  <Button onClick={() => navigate(`/models/${model._id}/variants`)}>Variants</Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openForm} onClose={() => { setOpenForm(false); setEditModel(null); }} fullWidth maxWidth="sm">
        <DialogTitle>{editModel ? 'Edit Model' : 'Add Model'}</DialogTitle>
        <DialogContent>
          <ModelForm model={editModel} onClose={() => { setOpenForm(false); fetchModels(); setEditModel(null); }} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ModelsPage;
