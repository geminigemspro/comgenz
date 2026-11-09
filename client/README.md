# Comgenz Client

This is the frontend application for the Private Support Web App.

## Project Structure

- `src/` - Source code directory
  - `components/` - Reusable UI components
  - `pages/` - Page-level components
  - `services/` - API service layer
  - `utils/` - Utility functions
  - `assets/` - Static assets like images and icons

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Features Implemented

- Authentication flow (login, logout)
- Dashboard with conversation list
- Responsive UI components
- Mock data for demonstration

## Planned Next Steps

1. Connect to Supabase backend
2. Implement real authentication
3. Add messaging functionality
4. Implement user management features
5. Add security and privacy features
6. Implement full real-time messaging with Supabase Realtime

## Technology Stack

- React.js (v18+)
- Vite (build tool)
- Supabase (backend services)
- CSS Modules (styling)

## Design Principles

- Responsive design for all device sizes
- Clear privacy notices and user guidance
- Intuitive conversation interface
- Visual indicators for message status and unread counts