# Technical Specifications: Private Support Web App

## System Architecture Overview

The application will be built using a modern web architecture with:
- Frontend: React.js application with Supabase integration
- Backend: Supabase platform (Auth, Database, Realtime)
- Authentication: Supabase Auth with MFA for privileged roles
- Real-time communication: Supabase Realtime for chat updates
- Data storage: Postgres database with encrypted message bodies

## Database Schema Design

### Tables

1. **users**
   - id (UUID, primary key)
   - email (text, unique)
   - display_name (text)
   - role (enum: 'superadmin', 'admin', 'user')
   - account_status (enum: 'pending', 'active', 'suspended', 'closed')
   - created_at (timestamp)
   - updated_at (timestamp)

2. **invitations**
   - id (UUID, primary key)
   - email (text, unique)
   - role (enum: 'admin', 'user')
   - invited_by (UUID, references users.id)
   - expires_at (timestamp)
   - is_used (boolean)
   - created_at (timestamp)

3. **conversations**
   - id (UUID, primary key)
   - user_id (UUID, references users.id)
   - admin_id (UUID, references users.id)
   - created_at (timestamp)
   - updated_at (timestamp)
   - status (enum: 'active', 'suspended')

4. **messages**
   - id (UUID, primary key)
   - conversation_id (UUID, references conversations.id)
   - sender_id (UUID, references users.id)
   - content (text - encrypted)
   - sent_at (timestamp)
   - status (enum: 'sending', 'sent', 'failed')
   - message_id (text) - for deduplication

5. **audit_logs**
   - id (UUID, primary key)
   - actor_id (UUID, references users.id)
   - target_id (UUID)
   - action (text)
   - details (jsonb)
   - timestamp (timestamp)

6. **mfa_sessions**
   - id (UUID, primary key)
   - user_id (UUID, references users.id)
   - session_token (text)
   - created_at (timestamp)
   - expires_at (timestamp)

## Authentication Flow

### Invitation and Activation
1. Superadmin creates invitation via dashboard
2. Email sent with single-use link containing invitation token
3. User clicks link and sets password
4. System validates token and activates account
5. Invitation expires after 48 hours

### Login Process
1. User enters email and password
2. For privileged roles (superadmin/admin), MFA required before accessing dashboard
3. Session managed through Supabase Auth

## Real-time Messaging Implementation

### Supabase Realtime Integration
- Subscribe to conversation channels for real-time updates
- Channels named by conversation ID
- Messages published to specific conversation channels
- Client-side handling of incoming messages with offline support

### Message Handling
1. When sending message:
   - Generate client-side message ID
   - Send to server with unique identifier
   - Update UI immediately with "sending" status
   - On successful save, update to "sent"
2. Offline support:
   - Queue messages when offline
   - Retry on reconnection
   - Prevent duplicates using message IDs

## Security and Privacy Implementation

### Encryption
- Message bodies encrypted server-side before storage
- Use authenticated encryption with versioned keys
- Keys managed separately from message storage
- Decrypt only after checking caller's role, account status, and assignment

### Access Control
- Row Level Security (RLS) on all tables
- Supabase Auth integration for role-based access
- Superadmin can read any conversation with audit logging
- No direct database access from client applications

### Audit Logging
- All operations logged in audit_logs table
- Include actor, target, action, timestamp, and outcome
- Keep message content out of routine logs
- Protect audit logs against modification through application

## User Roles and Permissions

### Superadmin
- Create and suspend admin accounts
- View user roster (all users)
- Read all conversations with audited access
- Reassign or close user accounts
- View privileged audit events
- Access any conversation after MFA authentication

### Admin
- Invite users
- View assigned users roster
- Read assigned conversations
- Send chat messages in assigned conversations
- Reassign users to other admins (with history preservation)

### User
- Access their own conversation only
- Read messages sent while away
- Reply in the same conversation
- See superadmin access and history transfer during handover

## API Endpoints

### Authentication
- POST /auth/invite - Create invitation
- POST /auth/activate - Activate account with invitation token
- POST /auth/login - User login
- POST /auth/mfa - MFA authentication
- POST /auth/logout - Logout

### Users
- GET /users/me - Get current user info
- GET /users/:id - Get user details
- PUT /users/:id - Update user info
- POST /users/suspend - Suspend user account

### Conversations
- GET /conversations - List assigned conversations
- GET /conversations/:id - Get conversation details
- GET /conversations/:id/messages - Get messages in conversation
- POST /conversations/:id/messages - Send message
- PUT /conversations/:id/reassign - Reassign user to new admin

### Audit
- GET /audit - List audit events
- GET /audit/:id - Get specific audit event

## Performance Considerations

1. Message history loading:
   - Load recent messages first (100-200 messages)
   - Implement pagination for older messages
   - Cache conversation metadata in client

2. Real-time updates:
   - Subscribe to conversation channels
   - Handle reconnect scenarios gracefully
   - Show message sending status and delivery confirmation

3. Offline support:
   - Local message queue
   - Automatic retry on reconnection
   - Sync when online

## Testing Strategy

### Unit Tests
- Authentication flows
- Message sending/receiving logic
- Role-based access controls
- Encryption/decryption functions

### Integration Tests
- Full user journey from invitation to conversation
- Reassignment and suspension scenarios
- Real-time messaging functionality
- Audit logging verification

### End-to-end Tests
- Complete user acceptance testing
- Performance under pilot load conditions
- Offline/online behavior validation
- Security and privacy compliance checks

## Implementation Notes

1. **Supabase Integration**:
   - Use Supabase Auth for identity management
   - Implement Row Level Security on all tables
   - Leverage Supabase Realtime for live updates
   - Use Supabase Storage for any file attachments (future feature)

2. **Security**:
   - All message content encrypted server-side
   - No sensitive data in logs or client-side storage
   - MFA required for superadmin and admin roles
   - Comprehensive audit logging

3. **User Experience**:
   - Responsive design for all device sizes
   - Clear privacy notices on first use
   - Intuitive conversation interface
   - Visual indicators for message status (sending, sent, failed)

This specification provides the technical foundation for implementing the Private Support Web App according to the PRD requirements.