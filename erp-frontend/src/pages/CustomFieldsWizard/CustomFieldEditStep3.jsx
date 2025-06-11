import React, { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Button, Checkbox, List, ListItem,
  ListItemText, ListItemIcon
} from '@mui/material';
import axios from 'axios';

const CustomFieldEditStep2 = ({ data, setData }) => {
  const [loading, setLoading] = useState(false);
  const [suggestedValues, setSuggestedValues] = useState([]);
  const [selected, setSelected] = useState([]);

  const needsEnumSetup =
    (['single-select', 'multi-select'].includes(data.type)) &&
    data.previousType &&
    data.previousType !== data.type;

  useEffect(() => {
    if (needsEnumSetup && data._id) {
      setLoading(true);
      axios.get(`/api/custom-fields/${data._id}/used-values`)
        .then(res => {
          setSuggestedValues(res.data || []);
          setSelected(res.data || []);
        })
        .catch(() => setSuggestedValues([]))
        .finally(() => setLoading(false));
    }
  }, [needsEnumSetup, data._id]);

  const toggleSelect = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleAccept = () => {
    setData({ ...data, enumValues: selected });
  };

  const handleIgnore = () => {
    setData({ ...data, enumValues: [] });
  };

  if (!needsEnumSetup) {
    return (
      <Typography color="text.secondary">
        No field type change detected. No migration step required.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Convert Existing Values to Enum Options
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : suggestedValues.length === 0 ? (
        <Typography>No values found to convert.</Typography>
      ) : (
        <>
          <List dense>
            {suggestedValues.map((value, index) => (
              <ListItem key={index} button onClick={() => toggleSelect(value)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(value)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={value} />
              </ListItem>
            ))}
          </List>

          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" onClick={handleAccept}>
              Accept Selected Values
            </Button>
            <Button variant="outlined" onClick={handleIgnore}>
              Ignore and Remove All
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomFieldEditStep2;
