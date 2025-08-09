// /src/components/layout/Footer.js
import React from 'react';
import { Box, Typography, Link, Stack, Divider, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * An attractive, futuristic, and responsive footer component.
 */
const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        p: { xs: 2, md: 3 },
        mt: 'auto', // Pushes footer to the bottom of the content
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {/* Left Side: Copyright */}
        <Typography variant="body2" color="text.secondary">
          © {currentYear} EBS Cards. All Rights Reserved.
        </Typography>

        {/* Center: Brand Name */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          EBS<span style={{ color: theme.palette.primary.main }}>Cards</span>
        </Typography>

        {/* Right Side: Links */}
        <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="#" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link href="#" variant="body2" color="text.secondary" sx={{ textDecoration: 'none' }}>
              Terms of Service
            </Link>
          </motion.div>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
