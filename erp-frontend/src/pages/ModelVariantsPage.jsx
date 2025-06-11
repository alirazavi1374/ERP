import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, IconButton, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import VariantManager from '../components/VariantManager';

const ModelVariantsPage = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);

  useEffect(() => {
    axios.get(`/api/models/${modelId}`)
      .then(res => setModel(res.data))
      .catch(err => {
        console.error(err);
        alert('Failed to load model');
        navigate('/models');
      });
  }, [modelId, navigate]);

  if (!model) return null;

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={() => navigate('/models')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">Manage Variants: {model.name}</Typography>
        </Box>

        <VariantManager modelId={modelId} />
      </Paper>
    </Box>
  );
};

export default ModelVariantsPage;
