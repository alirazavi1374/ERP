import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';

const EntityEditWizard = ({ title, steps, onSubmit, initialData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialData || {});

  const StepComponent = steps[activeStep];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleFinish = () => onSubmit(formData);

  return (
    <Box p={4}>
      <h2>{title}</h2>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((_, index) => (
          <Step key={index}><StepLabel>Step {index + 1}</StepLabel></Step>
        ))}
      </Stepper>
      <StepComponent data={formData} setData={setFormData} />
      <Box mt={3} display="flex" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        {activeStep === steps.length - 1
          ? <Button variant="contained" onClick={handleFinish}>Save</Button>
          : <Button variant="contained" onClick={handleNext}>Next</Button>}
      </Box>
    </Box>
  );
};

export default EntityEditWizard;
