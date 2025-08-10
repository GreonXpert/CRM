// ===========================
// src/pages/settings/SettingsPage.js
// ===========================
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { Save } from '@mui/icons-material';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    autoSave: true,
    apiUrl: 'http://localhost:7736/api',
    timeout: 30000,
  });

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Application Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={() => handleToggle('smsNotifications')}
                  />
                }
                label="SMS Notifications"
                sx={{ display: 'block' }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Preferences
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={() => handleToggle('darkMode')}
                  />
                }
                label="Dark Mode"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoSave}
                    onChange={() => handleToggle('autoSave')}
                  />
                }
                label="Auto Save"
                sx={{ display: 'block' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="API URL"
                name="apiUrl"
                value={settings.apiUrl}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Request Timeout (ms)"
                name="timeout"
                type="number"
                value={settings.timeout}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              <Alert severity="warning" sx={{ mb: 2 }}>
                Changes to API configuration will require an application restart.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save All Settings
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage ;
