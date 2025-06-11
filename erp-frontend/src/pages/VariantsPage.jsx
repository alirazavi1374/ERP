import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function VariantsPage() {
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    axios.get('/variants')
      .then(res => setVariants(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Variants</Typography>
      <List>
        {variants.map(variant => (
          <ListItem key={variant._id}>
            <ListItemText
              primary={variant.name}
              secondary={`Model: ${variant.model?.name || 'Unknown'}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
