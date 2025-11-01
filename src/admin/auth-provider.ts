import { DefaultAuthProvider } from 'adminjs';

import componentLoader from './component-loader.js';

// Mock database - replace with your actual database queries
const users = [
  {
    email: process.env.SUPERADMIN_EMAIL,
    password: process.env.SUPERADMIN_PASS, // In production, use hashed passwords
    role: 'SUPERADMIN',
  },
  {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASS,
    role: 'ADMIN',
  },
  // Add more users as needed
];

/**
 * Enhanced authentication with role support
 */
const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    // Find user by email (replace with your database query)
    const user = users.find((u) => u.email === email);

    if (user && user.password === password) {
      return {
        email: user.email,
        role: user.role,
        // Add other user properties you need
      };
    }

    return null;
  },
});

export default provider;
