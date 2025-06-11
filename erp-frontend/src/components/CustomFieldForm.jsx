import {
  TextField, MenuItem, Checkbox, FormControlLabel, FormGroup, FormControl,
  InputLabel, Select, OutlinedInput, ListItemText
} from '@mui/material';

const CustomFieldForm = ({ fields, values, onChange }) => {
  const handleFieldChange = (field, newValue) => {
    onChange({ ...values, [field.name]: newValue });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
      {fields.map((field) => {
        const currentValue = values[field.name] ?? '';

        switch (field.type) {
          case 'text':
            return (
              <TextField
                key={field._id}
                label={field.name}
                value={currentValue}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                fullWidth
              />
            );
          case 'number':
            return (
              <TextField
                key={field._id}
                label={field.name}
                type="number"
                value={currentValue}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                fullWidth
              />
            );
          case 'date':
            return (
              <TextField
                key={field._id}
                label={field.name}
                type="date"
                InputLabelProps={{ shrink: true }}
                value={currentValue}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                fullWidth
              />
            );
          case 'currency':
            return (
              <TextField
                key={field._id}
                label={`${field.name} (Currency)`}
                type="number"
                value={currentValue}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                fullWidth
              />
            );
          case 'single-select':
            return (
              <FormControl key={field._id} fullWidth>
                <InputLabel>{field.name}</InputLabel>
                <Select
                  value={currentValue}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  label={field.name}
                >
                  {(field.options || []).map((opt, i) => (
                    <MenuItem key={i} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          case 'multi-select':
            return (
              <FormControl key={field._id} fullWidth>
                <InputLabel>{field.name}</InputLabel>
                <Select
                  multiple
                  value={currentValue || []}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  input={<OutlinedInput label={field.name} />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {(field.options || []).map((opt, i) => (
                    <MenuItem key={i} value={opt}>
                      <Checkbox checked={(currentValue || []).includes(opt)} />
                      <ListItemText primary={opt} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default CustomFieldForm;
