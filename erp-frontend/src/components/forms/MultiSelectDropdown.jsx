import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const MultiSelectDropdown = ({
  label,
  options,
  value = [],
  onChange,
  getOptionLabel = (option) => option.name || '',
  placeholder = '',
  disabled = false
}) => {
  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      getOptionLabel={getOptionLabel}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, val) => option._id === val._id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
        />
      )}
      disabled={disabled}
      fullWidth
    />
  );
};

export default MultiSelectDropdown;
