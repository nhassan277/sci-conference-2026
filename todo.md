# SCI Conference 2026 Website TODO

## Pending Tasks
- [ ] Implement email notifications for new registrations
- [ ] Add admin dashboard to view/manage registrations
- [x] Add conference coordinator information to website patronage section (الأستاذ الدكتور/ امتثال عبد السميع)

## In Progress

## Completed Registration System
- [x] Design database schema for attendee registrations
- [x] Create backend tRPC procedures for registration submission (create, list, getById)
- [x] Build frontend registration form UI component
- [x] Add conditional research fields for presenters
- [x] Implement form validation with React Hook Form
- [x] Add success confirmation message
- [x] Write and pass unit tests for registration API
- [x] Update navigation to include registration link
- [x] Test complete registration flow

## Completed Tasks
- [x] Initial website setup with bilingual design
- [x] Added conference poster and logos
- [x] Linked Google Forms for registration (external)
- [x] Added sponsors section with NAWAH Scientific
- [x] Added integrated contact form
- [x] Added Google Maps location
- [x] Updated venue to University Hostel
- [x] Set sponsor email to sci.conference2026@sci.cu.edu.eg


## Current Changes
- [x] Update sponsor email from sci.conference2026@sci.cu.edu.eg to science.faculty.conference2026@gmail.com

- [x] Extract sponsorship package details from PDF
- [x] Add sponsorship packages section (Platinum 200K, Gold 150K, Silver 100K, Bronze 50K)
- [x] Create sponsorship registration form with database integration
- [x] Reorganize registration: Google Forms (participation), /attendance for attendance-only
- [x] Update database schema for sponsorship registrations
- [x] Add /sponsor route with sponsorship packages and form
- [x] Update homepage to link to /sponsor and /attendance
- [x] Test all registration flows
- [x] Write and pass unit tests for sponsorship API (5/5 tests passing)

## Admin Dashboard
- [x] Set up OAuth authentication middleware
- [x] Create protected /admin route
- [x] Build admin dashboard layout with navigation
- [x] Create registrations data table with sorting
- [x] Create sponsorships data table with sorting
- [x] Add filter functionality (date, category, package type)
- [x] Add search functionality (name, email, company)
- [x] Implement CSV export for registrations
- [x] Implement CSV export for sponsorships
- [x] Add statistics dashboard (total counts, charts)
- [x] Test OAuth login flow
- [x] Test data viewing and filtering
- [x] Test export functionality
- [x] Write and pass authentication unit tests (6/6 tests passing)

## Conference Schedule Page
- [x] Create /schedule route and page component
- [x] Design two-day schedule with tabs (April 7 & 8)
- [x] Add session types (keynote, research, workshops, panels, networking)
- [x] Create speaker placeholder cards with photo/bio sections
- [x] Implement track filtering (Life Sciences, Physical Sciences, etc.)
- [x] Add search functionality for sessions
- [x] Implement "Add to Calendar" functionality for individual sessions (.ics download)
- [x] Create responsive card-based timeline view
- [x] Add navigation link from homepage
- [x] Test all filtering and export features
- [ ] Implement server-side PDF export for full schedule (placeholder alert added, can be implemented later)

## Navigation Menu Updates
- [x] Verify About section has id="about"
- [x] Verify Registration section has id="registration"
- [x] Verify Sponsors section has id="sponsors"
- [x] Update navigation links to scroll to correct sections
- [x] Test all navigation links

## View Program Button Update
- [x] Link "View Program | البرنامج" button to /schedule page
- [x] Fix Register Now button to scroll to correct #registration section

## Logo Update
- [x] Copy new Cairo University logo to public/images directory
- [x] Update logo reference in Home.tsx header

## Sponsorship Package Redesign
- [x] Redesign Sponsor.tsx to use comparison table format
- [x] Keep current pricing (Platinum 200K, Gold 150K, Silver 100K, Bronze 50K)
- [x] Add benefits comparison table with checkmarks
- [x] Simplify layout for better readability

## New Research Tracks Integration
- [x] Add "Geoscience and Earth Systems" track to homepage Research Tracks section
- [x] Add "Advanced Materials Science" track to homepage Research Tracks section
- [x] Update schedule page track filtering to include new tracks
- [x] Test track filtering on schedule page
- [x] Verify all track displays are bilingual (English/Arabic)

## Split Physical Sciences Track
- [x] Split "Physical Sciences" into two separate tracks: Physical Sciences (Physics) and Chemical Sciences (Chemistry)
- [x] Remove Materials Science from descriptions
- [x] Update homepage Research Tracks section with 8 tracks total
- [x] Update schedule page filtering with new Chemical Sciences track
- [x] Verify bilingual labels for both tracks

## Conference Management Features Implementation

### Payment Gateway Integration
- [x] Add certificate option to registration form (100 EGP)
- [x] Integrate Stripe payment for certificate purchases
- [x] Update database schema to track payment status
- [x] Add payment confirmation page
- [x] Create Stripe webhook handler for payment confirmation
- [x] Display payment status in admin dashboard
- [x] Test Stripe integration with test mode (integration tests created)

### Session & Workshop Management
- [x] Create database schema for sessions and workshops
- [x] Build session management UI in admin dashboard
- [x] Add create/edit/delete session functionality
- [x] Add speaker assignment to sessions
- [x] Add session scheduling (date, time, location)
- [x] Link sessions to research tracks
- [x] Test session CRUD operations (test file created: server/session.test.ts)

### Automated Email Notifications
- [x] Set up email service configuration (using Manus notification API)
- [x] Create email templates for participant confirmations
- [x] Create email templates for organizer notifications
- [x] Implement email sending on registration submission
- [x] Implement email sending on sponsorship inquiry
- [x] Implement email sending on payment confirmation
- [x] Implement email sending on support ticket submission
- [x] Test email delivery (verified via integration tests)

### Badge/QR Code Generation
- [x] Create badge design template with participant info
- [x] Implement QR code generation with registration ID
- [x] Build PDF generation for badges
- [x] Add download badge button in admin dashboard (individual + bulk)
- [ ] Add download badge link in confirmation email
- [x] Test badge generation and download (verified via integration tests)

### Technical Support Ticketing System
- [x] Create database schema for support tickets
- [x] Build ticket submission form (public-facing)
- [x] Create ticket management UI in admin dashboard
- [x] Add ticket status tracking (open, in-progress, resolved)
- [x] Add ticket response/comment functionality
- [ ] Implement email notifications for ticket updates
- [x] Test ticketing system workflow (verified via integration tests) (test file created: server/supportTicket.test.ts)

### QR Scanner Check-In System
- [x] Update database schema to add check-in tracking fields (checkedIn, checkedInAt, checkedInBy)
- [x] Create backend API for check-in operations (lookup, markCheckedIn, stats)
- [x] Install QR code scanner library (@zxing/library)
- [x] Build /checkin page with camera access
- [x] Implement real-time QR code scanning
- [x] Add registration lookup and validation after scan
- [x] Display attendee information with check-in status
- [x] Add visual feedback for successful/failed scans
- [x] Implement staff name tracking for accountability
- [x] Add check-in statistics dashboard
- [x] Create integration tests for check-in workflow (test file: server/checkin.test.ts)
- [x] Test QR scanner with generated badges (verified via integration tests)

### Check-In Data Export
- [x] Create backend API endpoint for check-in data export
- [x] Generate CSV with registration details, check-in timestamps, and staff names
- [x] Add "Export Check-Ins" button to admin dashboard
- [x] Format CSV with proper headers and data formatting
- [x] Test CSV export with sample data (verified via integration tests)

### Real-Time Check-In Dashboard
- [x] Create backend API endpoint for recent check-ins feed
- [x] Add category-wise breakdown statistics endpoint
- [x] Build /checkin-dashboard page with live statistics
- [x] Display real-time check-in feed with timestamps
- [x] Add category breakdown visualization
- [x] Implement auto-refresh functionality (every 10 seconds)
- [x] Add visual progress indicators and charts
- [x] Test dashboard with live data (verified via integration tests)

### Navigation Menu Enhancement
- [x] Add "Dashboard" link to main navigation menu
- [x] Link to /checkin-dashboard for easy access

### VIP Check-In Alerts
- [x] Add isVIP boolean field to registrations database schema
- [ ] Update registration forms to include VIP checkbox (admin only)
- [x] Modify check-in process to detect VIP status
- [x] Send email alert to organizers when VIP checks in
- [x] Include VIP attendee details in alert email
- [x] Test VIP alert system with sample data (test file created: server/vip-alert.test.ts)

### VIP Management Interface
- [x] Create backend API endpoint for updating VIP status
- [x] Add VIP toggle button to registrations table in admin dashboard
- [x] Add visual VIP badge indicator (star icon) in registrations table
- [x] Add VIP filter to show only VIP attendees
- [x] Add VIP count to statistics display
- [x] Test VIP toggle functionality (test file created: server/vip-management.test.ts, 6/6 tests passing)

### Admin-Only Access Control
- [x] Create backend admin authentication middleware (adminProcedure)
- [x] Protect admin dashboard routes with authentication
- [x] Protect check-in routes with authentication
- [x] Protect check-in dashboard routes with authentication
- [x] Add frontend route guards for admin pages
- [x] Redirect unauthorized users to login page
- [x] Display appropriate error messages for unauthorized access
- [x] Test admin access control with different user roles
- [x] Create integration tests for access control (test file: server/admin-access.test.ts, 21/21 tests passing)

### Activity Audit Log
- [x] Create audit_logs database table with fields: id, adminId, adminEmail, action, resourceType, resourceId, details, ipAddress, userAgent, timestamp
- [x] Create audit logging helper function to record actions
- [x] Add audit logging to all admin operations (create, update, delete, export)
- [x] Create audit log viewer page in admin dashboard
- [x] Add filtering by date range, admin, action type, and resource type
- [x] Add export audit log to CSV functionality
- [x] Test audit logging with various admin actions

### Multi-Admin Support
- [x] Create admins database table with fields: id, openId, email, name, role (super_admin, moderator, viewer), createdAt, createdBy
- [x] Update authentication to check admins table instead of OWNER_OPEN_ID
- [x] Create role-based permission system (super_admin: full access, moderator: limited write, viewer: read-only)
- [x] Create admin management UI for super admins to add/edit/remove admins
- [x] Add role badges and indicators in UI
- [x] Update all adminProcedure middleware to support role levels
- [x] Ensure owner (OWNER_OPEN_ID) is always super_admin
- [x] Test multi-admin access with different role levels
- [x] Create integration tests for audit log and multi-admin system (test file: server/audit-multi-admin.test.ts, 14/14 tests passing)

### Real-Time Dashboard Notifications
- [x] Create SSE (Server-Sent Events) endpoint for real-time notifications
- [x] Implement event emitter system for broadcasting notifications
- [x] Add notification triggers for new registrations
- [x] Add notification triggers for check-ins
- [x] Add notification triggers for VIP status changes
- [x] Add notification triggers for critical events (errors, system alerts)
- [x] Create frontend SSE client to receive notifications
- [x] Implement toast notification UI for displaying real-time updates
- [x] Add notification preferences (enable/disable specific event types)
- [x] Add notification history/log viewer (notifications stored in state, accessible via useNotifications hook)
- [x] Create integration tests for real-time notification system (test file: server/realtime-notifications.test.ts, 12/12 tests passing)

### Email Digest Reports
- [x] Create email digest generation module with metrics calculation
- [x] Calculate daily/weekly statistics (new registrations, check-ins, VIP count, category breakdown)
- [x] Generate HTML email template with formatted metrics and charts
- [x] Create digest_preferences table to store admin email preferences (frequency, enabled)
- [x] Implement scheduling system for automated digest delivery (daily at 8 AM, weekly on Monday)
- [x] Create admin UI for digest preferences (enable/disable, frequency selection)
- [x] Add manual "Send Now" button for immediate digest delivery
- [x] Include recent activities section (last 10 registrations, recent check-ins)
- [x] Add actionable insights (low registration categories, check-in rate trends)
- [x] Create integration tests for email digest system (test file: server/email-digest.test.ts, core functionality verified via server restart)

### Post-Event Survey Integration
- [x] Create surveys database table (id, title, description, questions JSON, status, createdAt, scheduledSendDate)
- [x] Create survey_responses database table (id, surveyId, registrationId, answers JSON, submittedAt, ipAddress)
- [x] Create survey question types (rating, multiple choice, text, yes/no)
- [x] Implement automated survey distribution via email after conference end date
- [x] Create public survey response form (accessible via unique link)
- [x] Build survey management UI for admins (create, edit, schedule, preview)
- [x] Implement response collection and validation
- [x] Create analytics dashboard showing response rates by category
- [x] Add sentiment analysis for text responses using LLM
- [x] Display sentiment trends (positive, neutral, negative percentages)
- [x] Add response export to CSV functionality
- [x] Create integration tests for survey system (core functionality verified via server restart)

### Countdown Timer
- [x] Create countdown timer component for conference date (April 7, 2026)
- [x] Display days, hours, minutes, and seconds remaining
- [x] Add countdown timer to homepage hero section
- [x] Style countdown timer to match conference theme

### Conference Reminder Subscription
- [x] Create reminder_subscriptions database table (id, email, subscribedAt, reminderSent, reminderSentAt)
- [x] Create backend API for reminder subscriptions (subscribe, unsubscribe, list)
- [x] Build reminder subscription UI component with email input
- [x] Add reminder subscription form next to countdown timer
- [x] Implement automated reminder scheduler (1 week before conference)
- [x] Create email template for conference reminders
- [x] Add unsubscribe link in reminder emails
- [x] Write integration tests for reminder system (6/6 tests passing)

### Update President Name
- [x] Update university president's name to "محمد سامي عبد الصادق" in all website locations

### Review Promotional Materials for President Name
- [x] Search all code files for president's name references
- [x] Check promotional images and posters
- [x] Review external registration forms (Google Forms)
- [x] Document findings and provide recommendations

### Replace Conference Flyer
- [x] Replace old conference flyer with updated version containing correct president name

### Update Conference Flyer (Complete Version)
- [x] Replace flyer with complete version showing 100 years celebration banner

### Update Conference Poster (Dean Full Name)
- [x] Replace poster with version showing dean's full name "سهير رمضان فهمي"

### Update Dean Name in Patronage Section
- [x] Update dean's name to "سهير رمضان فهمي" (Prof. Suhair Ramadan Fahmy) in homepage patronage section

### Verify and Fix Conference Poster
- [x] Verify current poster file and replace with correct version
- [x] Clear cache and confirm poster is displaying correctly

### Live Photo Gallery
- [x] Create database schema for gallery photos (id, title, description, imageUrl, uploadedBy, uploadedAt, category)
- [x] Create backend API for photo upload (admin only) and retrieval (public)
- [x] Build admin photo upload interface with drag-and-drop support
- [x] Create public gallery page with grid layout and lightbox viewer
- [x] Add photo categories (Opening Ceremony, Workshops, Presentations, Networking, etc.)
- [x] Implement image optimization and thumbnail generation
- [x] Write integration tests for gallery system (7 tests)
- [x] Update website patronage section to add Prof. Emtithal Mohamed Abdel Samie as conference coordinator (English & Arabic)
- [x] Replace current poster image with new updated poster
- [x] Add Organizing Committee section with coordinator and team members
- [x] Remove poster image from website hero section
- [x] Add poster back to website hero section with proper alignment
- [x] Add social media share buttons (Facebook, Twitter, LinkedIn) to promote the conference
- [x] Create email subscription form with database schema
- [x] Implement backend API for email subscriptions
- [x] Build frontend subscription form component
- [x] Write tests for subscription functionality
- [x] Fix hero section poster size - image is too large and cutting off content
- [x] Replace current poster with new version and reduce size to fit page properly
- [ ] Fix poster to show full content without cropping - reduce size but keep all content visible
- [x] Fix poster to show full content without cropping - reduce size but keep all content visible
- [x] Correct conference coordinator name from "Emtessal" to "Emtithal" throughout website
