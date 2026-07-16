// Sidebar navigation component for desktop layout.
import { Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;

const items = [
  { label: 'Dashboard', path: '/' },
  { label: 'Exercise Library', path: '/exercises' },
  { label: 'Workout Routines', path: '/routines' },
  { label: 'AI Assistant', path: '/ai' },
];

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={NavLink} to={item.path} end>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
