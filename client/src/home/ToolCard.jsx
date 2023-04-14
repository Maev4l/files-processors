import { Card, CardContent, CardActionArea, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { lightGreen } from '@mui/material/colors';

const color = lightGreen[200];

const ToolCard = ({ card }) => {
  const { to, component } = card;
  const navigate = useNavigate();
  return (
    <Grid item style={{ display: 'flex' }}>
      <Card
        raised
        sx={{
          backgroundColor: color,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <CardActionArea onClick={() => navigate(to)}>
          <CardContent>{component}</CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default ToolCard;
