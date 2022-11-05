import { Button } from '@mui/material';

const ConvertButton = ({ onClick, ...rest }) => (
  <Button sx={{ m: '0.5rem' }} variant="contained" onClick={onClick} {...rest}>
    Convert
  </Button>
);

export default ConvertButton;
