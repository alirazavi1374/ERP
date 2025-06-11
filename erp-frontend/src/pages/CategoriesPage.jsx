import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Typography
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Settings as SettingsIcon, ExpandLess, ExpandMore
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManageCustomFieldsDialog from '../components/ManageCustomFieldsDialog';

const CategoryRow = ({ category, level, childrenMap, onEdit, onDelete, onManage }) => {
  const [open, setOpen] = useState(true);
  const children = childrenMap[category._id] || [];

  return (
    <>
      <TableRow>
        <TableCell sx={{ pl: level * 4 }}>
          {children.length > 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          <Typography variant="body1" component="span">
            {category.name}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Tooltip title={category.name === 'Default Category' ? 'Cannot edit default category' : 'Edit'}>
            <span>
              <IconButton
                onClick={() => onEdit(category)}
                disabled={category.name === 'Default Category'}
              >
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={category.name === 'Default Category' ? 'Cannot delete default category' : 'Delete'}>
            <span>
              <IconButton
                onClick={() => onDelete(category)}
                disabled={category.name === 'Default Category'}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Manage Custom Fields">
            <IconButton onClick={() => onManage(category)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      {open && children.map(child => (
        <CategoryRow
          key={child._id}
          category={child}
          level={level + 1}
          childrenMap={childrenMap}
          onEdit={onEdit}
          onDelete={onDelete}
          onManage={onManage}
        />
      ))}
    </>
  );
};

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [fieldManagerCategory, setFieldManagerCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error("Expected array but got:", res.data);
          setCategories([]);
        }
      })
      .catch(err => {
        console.error(err);
        setCategories([]);
      });
  }, []);

  const handleEdit = (category) => {
    navigate(`/categories/edit/${category._id}`);
  };

  const handleDelete = (category) => {
    setDeleteTarget(category);
  };

  const confirmDelete = async (keepData) => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/categories/${deleteTarget._id}`, {
        data: { keepData }
      });
      setCategories(prev => prev.filter(cat => cat._id !== deleteTarget._id));
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleManageFields = (category) => {
    setFieldManagerCategory(category);
  };

  const handleAddCategory = () => {
    navigate('/categories/add');
  };

  const buildHierarchy = () => {
    const roots = [], childrenMap = {};
    categories.forEach(cat => {
      if (cat.parentId) {
        childrenMap[cat.parentId] = [...(childrenMap[cat.parentId] || []), cat];
      } else {
        roots.push(cat);
      }
    });
    return { roots, childrenMap };
  };

  const { roots, childrenMap } = buildHierarchy();
  const paginatedRoots = roots.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Categories</Typography>
          <Tooltip title="Add Category">
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCategory}>
              Add
            </Button>
          </Tooltip>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRoots.map(cat => (
                <CategoryRow
                  key={cat._id}
                  category={cat}
                  level={0}
                  childrenMap={childrenMap}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onManage={handleManageFields}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={roots.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 1 }}>
            Do you want to delete this category? You can choose to keep related subcategories and models, which will move them to the default category.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => confirmDelete(true)} color="primary">Keep Related Data</Button>
          <Button onClick={() => confirmDelete(false)} color="error">Delete All</Button>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Manage Custom Fields Dialog */}
      <ManageCustomFieldsDialog
        open={!!fieldManagerCategory}
        onClose={(updated) => {
          if (updated) window.location.reload();
          setFieldManagerCategory(null);
        }}
        category={fieldManagerCategory}
      />
    </Box>
  );
};

export default CategoryPage;
