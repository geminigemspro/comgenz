# Private Support Web App

**Status:** Draft for review  
**First release:** Responsive web app  
**Initial audience:** High-net-worth individuals and politically exposed persons, primarily in India and Singapore  
**Planning scale:** Approximately 50 admins and 300 users

## 1. Product objective

Give each invited user a discreet place to contact their designated support admin. Users can sign in from a supported browser, read messages sent while they were away, and reply in the same conversation. The platform operator can review conversations and hand over a user to another admin without losing history.

## 2. Roles and access

For launch, each admin operates independently. The platform has no shared organization inbox or user directory.

| Capability | Superadmin | Admin | User |
| --- | --- | --- | --- |
| Create and suspend admin accounts | Yes | — | — |
| Invite users | — | Yes | — |
| View user roster | All users | Currently assigned users | — |
| Read conversations | All, with audited access | Currently assigned conversations | Own conversation |
| Send chat messages | — | Currently assigned conversations | Own conversation |
| Reassign or close a user account | Yes | — | — |
| View privileged audit events | Yes | — | — |

The admin who invites a user becomes the initial assignee. The user has one conversation tied to their account. A reassignment changes the conversation's access rights while preserving its history and the identity of each historical sender. Superadmin access is read-only within the conversation interface. Show users a concise privacy notice before first use that explains superadmin access and history transfer during handover.

## 3. Launch journeys

### Invite and activate

1. The superadmin creates an admin invitation from the dashboard. Once activated, the admin can invite users from their own dashboard.
2. The recipient follows a single-use email link, sets a password, and signs in. Invitations expire after 48 hours. Resending invalidates the previous invitation.
3. Admins and superadmins enroll in authenticator-app multifactor authentication before accessing privileged screens. Users sign in with email and password and can use the email-based password reset flow.
4. The dashboard shows pending, active, and suspended accounts where the viewer has permission. An existing email address cannot silently create a second account or move a user between admins. Error messages must avoid exposing accounts outside the viewer's scope.

### Send and receive messages

- The user lands in their own conversation. An admin lands in an inbox of assigned users ordered by recent activity, with unread counts.
- Either participant can send a plain-text message. Display sender, timestamp, and a sending, sent, or failed state. Mark a message sent only after it has been saved. Retries use a client-generated message ID to prevent duplicates.
- Load recent history first and let participants page back. On reconnect, fetch messages missed while offline. Live updates accelerate delivery while the app is open.
- Update unread state when the participant views the relevant messages. Superadmin reviews leave participant unread counts intact.
- Render messages as plain text. Keep message content out of email, push notifications, analytics, and routine logs. Provide in-app unread indicators at launch.

### Reassign and suspend

- The superadmin selects an active replacement admin and confirms the transfer. The user sees the new admin's display name and can continue in the existing conversation.
- Apply the assignment update and its audit event together. Subsequent reads, sends, and history requests from the outgoing admin are denied, even from an open session. A send racing with reassignment must be checked against the assignment when the send is committed.
- When an admin is suspended, preserve their assigned conversations. Users can read their history while waiting for reassignment. Pause new sends and show the user that support is temporarily unavailable.
- A suspended user loses access to the app. The conversation stays available to authorized staff under the retention policy, with sends paused. The superadmin can restore access or close the account.

## 4. Privacy, security, and retention

- Use Supabase Auth for identity, Postgres for accounts, assignments, encrypted messages and audit events, and Realtime for in-app update signals. Keep account provisioning and privileged operations server-side.
- Encrypt message bodies on the server before writing to Supabase, using authenticated encryption and versioned keys managed separately from message storage. Decrypt only after checking the caller's role, account status, and current assignment. Use TLS for transport. This access model supports authorized superadmin review and is server-decryptable.
- Restrict direct database access with row-level security. The message API must enforce authorization on every operation, including decryption and paginated history. Keep service credentials out of clients. Realtime signals should carry no message content or sensitive conversation metadata. Fetch content through the authorized API, including after reconnect and handover.
- Minimize stored profile data. Collect only email, display name, role, account state, and support assignment for launch. Store message routing and timing separately from message bodies. Use generic invitation and reset emails.
- Audit account creation, suspension, reassignment, superadmin conversation access, and retention purges. Record actor, target, event, timestamp, and outcome without message content. Require a reason for superadmin conversation access and reassignment. Restrict audit access and protect it against modification through the application.
- **Proposed retention default:** Keep message history while the user account remains open, including during suspension. Purge messages and unnecessary profile data 12 months after account closure. Keep security audit events for 12 months from creation. Participants cannot edit or delete messages in the first release. Define an operator workflow for approved early deletion and document backup expiry so the live purge and backup removal timelines are clear.
- **Production gate:** Confirm retention periods, hosting region, cross-border data handling, and account deletion procedures for the intended India and Singapore rollout before using real customer data. Review key recovery, key rotation, and access logs before launch.

## 5. Scope after the first release

Consider private image and document sharing, voice notes, voice and video calls, and notifications outside the app. Files would require encrypted uploads and authorized downloads. Calls would require a media transport decision, with the same pairing rule applied to signaling. Mobile clients, paid plans, and automated billing are deferred. Onboarding and billing are handled manually at launch.

The future Flutter client should share the same authentication, authorization, message API, and data model. The Flutter folder is reserved for that client.

## 6. Release acceptance

| Scenario | Pass condition |
| --- | --- |
| Invitation | An invited user activates once, lands in their own conversation, and cannot reuse the link. An uninvited person cannot self-register. |
| Isolation | A user or admin who guesses another conversation ID cannot read history, send, or obtain content through a live subscription. |
| Offline delivery | Messages sent while the recipient is away appear in order after sign-in. A reconnect recovers missed messages and a retry creates no duplicate. |
| Handover | The incoming admin sees the full history, the user keeps the same conversation, and the outgoing admin's next read or send fails without requiring sign-out. |
| Suspension | A suspended account cannot continue using a previously issued session to read or send messages. Users waiting for a replacement admin can read their history. |
| Superadmin review | An MFA-authenticated superadmin can read any conversation after giving a reason. A durable audit entry is written before content is returned. |
| Storage and logs | Stored message bodies and database backups contain ciphertext. Routine logs and live events contain no message bodies. An authorized client can read historical messages after a key rotation. |
| Retention | A test account past its retention deadline is purged and unavailable through the app. The purge is audited and backup expiry is documented. |
| Pilot readiness | Verify expected usage with 50 admins and 300 users, including reconnect bursts, handovers during active sessions, and restoration from backup. Target text delivery within two seconds for 95% of messages between connected participants under agreed pilot load. |

## 7. Implementation references

- [Supabase Realtime authorization](https://supabase.com/docs/guides/realtime/authorization)
- [Supabase Storage bucket access](https://supabase.com/docs/guides/storage/buckets/fundamentals)
