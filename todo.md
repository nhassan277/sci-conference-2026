# SCI Conference 2026 Website TODO

## Pending Tasks
- [ ] Implement email notifications for new registrations
- [ ] Add admin dashboard to view/manage registrations

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
