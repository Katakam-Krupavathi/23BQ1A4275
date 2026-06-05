import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Box, Typography, Tabs, Tab, Card, CardContent, Badge,
  IconButton, Select, MenuItem, FormControl, InputLabel, Pagination,
  List, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress, Alert
} from '@mui/material';
import { Work, Assignment, Event, Inbox, History, MarkChatRead } from '@mui/icons-material';

const BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

export default function Dashboard() {
  const [view, setView] = useState(0);
  const [kind, setKind] = useState('All');
  const [pg, setPg] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [seen, setSeen] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('_read_matrix') || '[]');
    } catch (_) {
      return [];
    }
  });

  
  const syncFeed = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      let url = `${BASE_URL}?page=${pg}&limit=${view === 0 ? 10 : 5}`;
      if (view === 1 && kind !== 'All') url += `&notification_type=${kind}`;
      
      const r = await fetch(url);
      if (!r.ok) throw new Error('Network execution error');
      const res = await r.json();
      
      let raw = res.notifications || [];
      if (view === 0) {
        const order = { Placement: 3, Result: 2, Event: 1 };
        raw = [...raw].sort((a, b) => {
          const wA = order[a.Type] || 0;
          const wB = order[b.Type] || 0;
          if (wA !== wB) return wB - wA;
          return new Date((b.Timestamp || '').replace(' ', 'T')) - new Date((a.Timestamp || '').replace(' ', 'T'));
        });
      }
      setData(raw);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [view, kind, pg]);

  useEffect(() => {
    syncFeed();
  }, [syncFeed]);

  const toggleTab = (e, val) => {
    setView(val);
    setPg(1);
    setKind('All');
    setData([]);
  };

  const markRead = (id) => {
    if (seen.includes(id)) return;
    const next = [...seen, id];
    setSeen(next);
    localStorage.setItem('_read_matrix', JSON.stringify(next));
  };

  const getIcon = (t) => {
    if (t === 'Placement') return <Work color="primary" />;
    if (t === 'Result') return <Assignment color="success" />;
    return <Event color="secondary" />;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="700" color="text.primary">Intelligence Feed Hub</Typography>
          <Typography variant="caption" color="text.secondary">Stage 2 Telemetry Stream System</Typography>
        </Box>
        <Tabs value={view} onChange={toggleTab} variant="scrollable" scrollButtons="auto">
          <Tab icon={<Inbox fontSize="small" />} label="Priority Inbox" iconPosition="start" />
          <Tab icon={<History fontSize="small" />} label="General History" iconPosition="start" />
        </Tabs>
      </Box>

      {view === 1 && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Filter Category</InputLabel>
            <Select value={kind} label="Filter Category" onChange={(e) => { setKind(e.target.value); setPg(1); }}>
              <MenuItem value="All">All Notifications</MenuItem>
              <MenuItem value="Placement">Placements</MenuItem>
              <MenuItem value="Result">Results</MenuItem>
              <MenuItem value="Event">Events</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {err && <Alert severity="error" sx={{ mb: 3 }}>{err}</Alert>}

      <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {loading ? (
            <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}><CircularProgress size={32} /></Box>
          ) : data.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>No notification units parsed.</Typography>
          ) : (
            <List disablePadding>
              {data.map((node, i) => {
                const isRead = seen.includes(node.ID);
                return (
                  <React.Fragment key={node.ID || i}>
                    <ListItem 
                      onClick={() => markRead(node.ID)}
                      secondaryAction={
                        !isRead && (
                          <IconButton size="small" onClick={() => markRead(node.ID)}>
                            <MarkChatRead fontSize="small" color="action" />
                          </IconButton>
                        )
                      }
                      sx={{ 
                        p: 2, 
                        cursor: 'pointer',
                        backgroundColor: isRead ? 'transparent' : 'action.hover',
                        transition: 'background-color 0.2s',
                        '&:hover': { backgroundColor: 'action.selected' }
                      }}
                    >
                      <ListItemIcon>
                        <Badge color="error" variant="dot" invisible={isRead}>
                          {getIcon(node.Type)}
                        </Badge>
                      </ListItemIcon>
                      <ListItemText 
                        primary={node.Message} 
                        secondary={`${node.Type} • ${node.Timestamp}`}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: isRead ? '400' : '600', color: 'text.primary' }}
                        secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      />
                    </ListItem>
                    {i < data.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>

      {view === 1 && !loading && data.length > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination page={pg} count={pg + 1} onChange={(e, p) => setPg(p)} color="primary" size="small" />
        </Box>
      )}
    </Container>
  );
}