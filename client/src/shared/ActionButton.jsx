import { Button } from '@mui/material';

const ActionButton = ({ onClick, label, ...rest }) => (
  <Button sx={{ m: '0.5rem' }} variant="contained" onClick={onClick} {...rest}>
    {label}
  </Button>
);

export default ActionButton;
