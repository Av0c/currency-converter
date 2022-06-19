import React from 'react';
import { Box } from '@mui/material';
import { Converter } from './components/Converter';

const App = (): React.ReactElement => {
  return (
    <Box
      sx={{
        height: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Converter />
    </Box>
  );
};

export default App;
