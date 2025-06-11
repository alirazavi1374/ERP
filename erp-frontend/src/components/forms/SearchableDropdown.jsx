import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const SearchableDropdown = ({
  label,
  options,
  value,
  onChange,
  getOptionLabel = (option) => option.name || '',
  disabled = false,
  placeholder = ''
}) => {
  return (
    <Autocomplete
      disablePortal
      options={options}
      getOptionLabel={getOptionLabel}
      value={value || null}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, val) => option._id === val._id}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} variant="outlined" />
      )}
      disabled={disabled}
      fullWidth
    />
  );
};

export default SearchableDropdown;
