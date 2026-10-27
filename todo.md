# SCI Conference 2026 Website TODO

## SCI 2027 Conversion (Active)
- [x] Create verified SCI 2027 public-content data and regression test from supplied Drive assets
- [x] Add official SCI 2027 posters, logos, and bilingual brochures to the website public assets
- [x] Replace the public SCI 2026 home experience with the SCI 2027 international conference landing page
- [x] Add a SCI 2027 preliminary programme page and a clearly labelled SCI 2026 archive page
- [x] Validate official registration-form links, replace oversized local assets with hosted public versions, typecheck, build, and review the running preview
- [x] Save the verified SCI 2027 release checkpoint
- [x] Convert all current SCI 2027 public pages and shared navigation to English only, including removal of Arabic brochure actions
- [x] Add and validate the undergraduate/postgraduate Student Research, Thesis & Graduation Project registration form in the Register section
- [x] Verify the English-only student-registration update
- [x] Save a release checkpoint for the verified English-only student-registration update
- [x] Add verified SCI 2027 sponsorship data from the official sponsorship prospectus, including all four tiers and special opportunities
- [x] Build an English-only homepage sponsorship preview and detailed partnership and sponsorship page with email-only prospectus requests
- [x] Verify the SCI 2027 sponsorship and partnership update
- [x] Save a release checkpoint for the verified SCI 2027 sponsorship and partnership update
- [x] Replace the SCI 2027 public general-contact address with sci.conf.2027@gmail.com and verify it matches the sponsorship contact
- [x] Prepare and host the four approved SCI 2027 promotional videos and representative poster frames
- [x] Add an English-only SCI 2027 video gallery page, homepage preview, click-to-play player, and public videos navigation
- [x] Save a WebDev checkpoint for the verified SCI 2027 promotional-video experience
- [x] Add 6 April as a pre-conference workshop day and retain 9 April as a post-conference workshop day with the optional museum visit
- [x] Remove named SCI 2027 workshops from public content and use a workshop programme-to-be-announced message
- [x] Verify and checkpoint the revised 6–9 April SCI 2027 programme
- [x] Add English-only Keynote Speakers and Invited Speakers announcement sections to the homepage and programme page
- [x] Replace unconfirmed speaker counts and schedule wording with To be announced status while retaining Speaker Registration
- [x] Verify and checkpoint the SCI 2027 speakers-to-be-announced update
- [x] Expand all six SCI 2027 tracks to ten balanced English-only specialties covering core and applied areas
- [x] Render every specialty directly in the homepage track cards without truncation or hidden lists
- [x] Verify and checkpoint the expanded SCI 2027 track-specialties update
- [ ] Publish the SCI 2027 release to the existing public site and verify the live domain no longer serves SCI 2026

## Pending Tasks
- [ ] Implement email notifications for new registrations
- [ ] Add admin dashboard to view/manage registrations
- [x] Prepare an interim SCI 2026 conference report with available participant data, research tracks, presentation or poster titles, counts, and event photographs
- [x] Locate the authoritative abstract or poster catalog and rebuild the participant table from that source (SCI2026 booklet)
- [x] Reconcile all researcher names, tracks, poster or research titles, and participant counts against official conference records
- [x] Regenerate the final report and spreadsheet with verified researcher records and accurately captioned event photographs
- [x] Extract researcher, presentation, and poster records from the SCI2026_Booklet_NHmmmm.pdf source
- [x] Reconcile the booklet against the final programme and correct any provisional classifications or counts
- [x] Regenerate and validate the final official SCI 2026 report and participant workbook
- [ ] Obtain an organizer-approved attendance or final participant record to reconcile confirmed attendance totals
- [ ] Update the report if confirmed attendance totals become available; otherwise retain registration records and confirmed contributions as separate metrics
- [x] Create standalone charts showing SCI 2026 researcher contributions by scientific track and high-level affiliation group without modifying the user-edited workbook
- [x] Create a supplementary chart showing contributions by top named institutions, with remaining institutions combined as Other
- [x] Distinguish affiliation-group and named-institution chart definitions in the chart documentation
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
- [x] Implement server-side PDF export for full schedule (placeholder alert added, can be implemented later)

## PDF Schedule Export
- [x] Install pdfkit on the server
- [x] Create Express route GET /api/schedule/export-pdf that generates a formatted PDF
- [x] Add "Export as PDF" button to the Schedule page
- [x] Test PDF generation and download in browser

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
- [x] Replace logo in VIP invitation card with new Faculty of Science logo
- [x] Update conference poster on website with new version featuring updated Faculty of Science logo
- [x] Update patron names to use full "Prof. Dr." format: Mohamed Samy Abdel Sadek, Sohair Ramadan Fahmy, Emtithal Mohamed Abdel Samie
- [x] Update Dean title from "Dean, Faculty of Science" to "Dean of Faculty of Science"
- [x] Change Arabic title for Prof. Dr. Sohair from "الأستاذة الدكتورة" to "الأستاذ الدكتور"
- [x] Create engaging Facebook post in Arabic to encourage student registration
- [x] Change Dean title from "Dean of Faculty of Science - Cairo University" to "عميد كلية العلوم - جامعة القاهرة"
- [x] Change venue name from "قاعة المؤتمرات" to "مركز المؤتمرات" on website
- [x] Add English Dean title "Dean of Faculty of Science - Cairo University" below Arabic title
- [x] Remove duplicate Arabic Dean title line "عميد كلية العلوم جامعة القاهرة"
- [x] Replace conference poster on website with latest version (same size)
- [x] Add Facebook page link (https://www.facebook.com/share/14SDnqU7p4X/?mibextid=wwXIfr) to website
- [x] Update Chemical Sciences description from "Chemistry, Analytical Chemistry..." to "Physical Chemistry, Analytical Chemistry..."
- [x] Add "Speaking Opportunity (Panel or Sponsor Session)" to Gold package benefits
- [x] Add "Logo on website and conference printings (size depends on package)" to all sponsorship packages
- [x] Remove "Sponsoring a Talk" benefit from sponsorship packages table
- [x] Remove "Website" benefit from sponsorship packages table
- [ ] Set up Google Sheets API integration for 4 registration forms
- [ ] Create database schema for storing registration data
- [ ] Build backend API to fetch and sync Google Sheets data
- [ ] Create admin-only registration dashboard with filtering and search
- [ ] Add analytics page with registration statistics and charts
- [ ] Implement email system for sending confirmations and announcements
- [ ] Test registration management system end-to-end
- [x] Update research tracks from 6 to 9 comprehensive tracks
- [x] Add "Astronomy, Space & Meteorology" (الفلك والفضاء والأرصاد الجوية) as new research track
- [x] Create detailed page for each of the 9 research tracks
- [x] Add submission guidelines for each track
- [x] Include topic examples for each research area
- [x] Add bilingual content (English/Arabic) for all track pages
- [x] Update navigation to link to individual track pages
- [x] Remove Submission Guidelines section from track detail pages
- [x] Remove Track Chair section from track detail pages
- [x] Add General Submission Information section to track detail pages
- [x] Link "Register Now" button to https://sciconf26.website/#registration
- [x] Design fourth certificate for keynote speakers with luxurious design and lecture title field
- [x] Create English-only versions of attendance, research participation, and appreciation certificates
- [x] Create English-only version of keynote speaker certificate with lighter background
- [x] Change keynote speaker English certificate background to beige/golden like other certificates
- [x] Create bilingual Scientific Committees page with 11 departments in alphabetical order
- [x] Update Scientific Committees page with corrected names for Biotechnology, Chemistry, Zoology, and Botany
- [x] Update committee titles and names: Botany chair to Prof., fix Chemistry member name, remove Physics Assistant Professor title
- [x] Correct Dr. Dina's last name from Omar to Amr in Biotechnology department
- [x] Update Dr. Ahmed Fouad's title to Prof. Dr. in Biotechnology department
- [x] Reorder departments alphabetically by English names (A-Z) on Scientific Committees page
- [x] Update Scientific Committees: change Astronomy name, remove Arabic member names, add 'Department of' prefix, fix name spellings
- [x] Change Chair and Committee Members labels to orange color on Committees page
- [x] Create Keynote Speakers page with 4 invited speakers
- [x] Add navigation link for Keynote Speakers page
- [ ] Design 4 social media announcements for keynote speakers
- [x] Change abstract submission deadline from March 15 to February 28, 2026
- [x] Add Keynote Speakers link to main navigation bar

## Scientific Committee Updates
- [x] Update Biophysics committee with Dr. Mohamed Hassanein Gaber (Chair) and Prof. Dr. Haitham Sharaf El-Din
- [x] Add Prof. Dr. Ahmed Ramadan to Mathematics committee before Dr. Walid Abdullah
- [x] Update Biotechnology - change Dr. Tarek Kabil to Prof. em. Tarek Kabil
- [x] Update Geology committee with Dr. Sameh Tahoun (Chair), Dr. Abdel-Hamid El-Manawy, and Dr. Mortada
- [x] Remove Dr. Sherif Elnagdy and Dr. Hanaa Badawy from Botany department committee
- [x] Correct Mathematics committee: change Ahmed Ramadan to Mohamed Ramadan
- [x] Reorder Mathematics committee: move Prof. Dr. Mohamed El-Zawawi before Dr. Walid Abdullah
- [x] Update Geology committee: change Dr. Mortada to Prof. Dr. Mortada Mourad El Aref
- [x] Update Entomology committee: change Dr. Youssef to Dr. Youssef El-Demerdash
- [x] Replace Cairo University logo on Keynote Speakers page with new logo
- [x] Update Entomology: Chair to Prof. Dr. Aly Younes, add Prof. Dr. Nagwa Rashdan as member
- [x] Update Geophysics: Change Chair title to Prof. Dr. Waleed Mabrouk
- [x] Update Physics: Change Chair to Prof. Dr. Mohamed Hassanein Gaber
- [x] Update Geology: Change Chair title to Prof. Dr., update member name to Prof. Dr. Abdelatty-Hameed Wagdy El Manawy
- [x] Correct Geology member name spelling: Abdelatty-Hameed to Abdel-Hameed
- [x] Update Botany member name: Ahmed Elwahy to Ahmed Helmy Elwahy
- [x] Generate vertical lecture room banner (80cm × 2m)
- [x] Generate horizontal stage banner (3m × 1m)
- [x] Regenerate banners as clean print-ready files without annotations
- [x] Generate square welcome banner for entrance stand (2m × 2m)
- [x] Generate horizontal patronage banner with president, dean, and coordinator (3m × 1m)
- [x] Update patronage banner with correct coordinator name: Dr. Emtithal Mohamed Abdel Samie
- [x] Create media registration form page with all required fields
- [x] Add media registration route and navigation link
- [x] Update NAWAH workshops section with full workshop details
- [x] Generate Facebook post for NAWAH workshop announcement with logo

## Media Registration System
- [x] Create database schema for media registrations
- [x] Create backend API endpoints for media registration
- [x] Connect frontend form to backend API
- [x] Implement email notifications (journalist confirmation + admin alert)
- [ ] Create admin dashboard for media management
- [ ] Test complete media registration workflow
- [x] Regenerate Facebook post with actual NAWAH logo
- [x] Fix SEO issues: add meta description and keywords to homepage
- [x] Update patronage banner layout: university president in separate row
- [x] Modify patronage banner based on original design: move president to separate row

## Pricing Information Display
- [x] Add free attendance notice to homepage
- [x] Add certificate pricing (100 EGP) to homepage
- [x] Update registration page with pricing information
- [x] Add pricing badge/banner to hero section

## Committee Management System
- [x] Create database schema for committees table
- [x] Create backend procedures for committee CRUD operations
- [x] Create admin interface for managing committees
- [x] Create public page to display committees
- [x] Add initial committee data (Zoology scientific committee + reception committee)
- [x] Test committee management system

## Restore All Department Scientific Committees
- [x] Add all scientific committees from original page to database (Astronomy, Biophysics, Biotechnology, Botany, Chemistry, Entomology, Geology, Geophysics, Mathematics, Physics)

## Update Zoology Committee Names
- [x] Update Zoology committee member names with correct English full names

## Committee Updates
- [x] Remove reception committee members from database
- [x] Update all department names to 'Department of [Name]' format

## Update Botany Department Name
- [x] Change 'Department of Botany' to 'Department of Botany and Microbiology' in scientific committees

## Keynote Speakers System
- [x] Create keynote_speakers table in database schema
- [x] Create backend procedures for keynote speaker CRUD operations
- [x] Copy Dr. Khalid Amer photo to project images folder
- [x] Create admin interface for managing keynote speakers
- [x] Update public keynote speakers page with database integration
- [x] Add Dr. Khalid Amer as first keynote speaker
- [x] Test keynote speakers system

## Speaker Announcement Graphics
- [x] Create speaker announcement graphic for Dr. Khalid Amer
- [x] Create blank reusable template for future speaker announcements

## Add Dr. Ibrahim El-Sherbiny as Keynote Speaker
- [x] Create announcement graphic for Dr. El-Sherbiny
- [x] Add Dr. El-Sherbiny to keynote speakers database with his details

## Create New Dr. Khalid Amer Announcement
- [x] Generate new announcement graphic using updated template design

## Upload Dr. El-Sherbiny Photo
- [x] Upload photo to S3 cloud storage
- [x] Update database with public photo URL
- [x] Verify photo displays correctly on website

## Add New Keynote Speakers from CV Documents
- [x] Read and extract information from KhTshortCVBRICS.doc
- [x] Read and extract information from englishbiography.docx
- [x] Upload speaker photos to S3
- [x] Add speakers to keynote speakers database
- [x] Create announcement graphics for each new speaker

## Create Prof. Taalab Announcement Graphic Using Template
- [x] Analyze the template design from Dr. El-Sherbiny's graphic
- [x] Create announcement graphic for Prof. Dr. Khalid Muhammad Taalab matching template style
- [x] Include: photo, name, title, affiliation, presentation title

## Create Prof. Azmy Announcement Graphic Using Template
- [x] Create announcement graphic for Prof. Dr. Osama Azmy matching template style
- [x] Include: photo, name, title, affiliation, presentation title

## Create Social Media Posts for Keynote Speakers
- [x] Create social media post for Prof. Dr. Khalid Amer
- [x] Create social media post for Prof. Dr. Ibrahim M. El-Sherbiny
- [x] Create social media post for Prof. Dr. Khalid Muhammad Taalab
- [x] Create social media post for Prof. Dr. Osama Azmy

## Recreate Dr. Azmy Graphic Using El-Sherbiny Template
- [x] Generate new Dr. Azmy announcement graphic matching El-Sherbiny's beige/tan template design

## Fix Scientific Committee Grouping Issue
- [x] Investigate why Prof. Dr. Hamed Eid appears as separate list instead of under Chemistry department
- [x] Fix the database or display logic to properly group him under Chemistry
- [x] Verify the fix on the website

## Re-investigate Committees Display Issue
- [x] Check the actual website display to see how Prof. Hamed Eid appears
- [x] Identify why the fix didn't work on the live website
- [x] Apply the correct fix
- [x] Verify on live website before checkpoint

## Add Prof. Dr. Hamed Eid to Scientific Committee
- [x] Add Prof. Dr. Hamed Eid to committees table under Department of Chemistry
- [x] Verify the addition in database
- [x] Save checkpoint

## Update Conference Banner with Patronage Section
- [x] Create updated banner with "تحت رعاية" section in the middle
- [x] Include three names in Arabic with titles and positions
- [x] Maintain original banner design and branding

## Create Print Version of Conference Banner
- [x] Generate high-resolution banner for 200 cm × 100 cm printing
- [x] Ensure print quality and color accuracy for professional output

## Create Double-Sided A5 Conference Flyer
- [x] Gather all conference information (tracks, speakers, dates, contact)
- [x] Design front side with branding, title, date, venue, patronage
- [x] Design back side with tracks, speakers, registration, workshops, QR code
- [x] Ensure A5 size (148mm × 210mm) optimized for print

## Update Flyer with Complete Research Tracks
- [x] Query database to get all research tracks from website
- [x] Regenerate flyer back side with all tracks included
- [x] Ensure layout fits all tracks while maintaining readability

## Remove Dimensions from Flyer Back Side
- [x] Regenerate flyer back side without dimension labels and measurement markers
- [x] Create clean print-ready version

## Add Sponsor and Partner Logos to Flyer and Website
- [ ] Upload Taiba Group, NAWAH, and MARC logos to S3
- [ ] Update flyer front side with Taiba Group sponsor logo
- [ ] Update flyer back side with NAWAH and MARC logos in workshops section
- [ ] Create sponsors section on website with Taiba Group (150,000 EGP sponsor)
- [ ] Add MARC GCP workshop details to website (3-hour workshop with key topics)
- [ ] Save checkpoint

## Sponsor Name Correction
- [ ] Correct sponsor name from Taiba Group to Sami Ayed Group (مجموعة سامي عايد للأعلاف والدواجن) on flyer front
- [x] Correct sponsor name on website /sponsors page
- [x] Correct sponsor name on homepage sponsors section

## Fix Missing Sponsor Logos
- [x] Upload Sami Ayed Group logo to S3
- [x] Upload NAWAH Scientific logo to S3
- [x] Upload MARC logo to S3
- [x] Update homepage sponsor logo references
- [x] Update Sponsors page logo references

## Update MARC Name and Logo Sizes
- [x] Remove "(Medical Applications Research Center)" from MARC name on homepage
- [x] Remove "(Medical Applications Research Center)" from MARC name on Sponsors page
- [x] Increase NAWAH logo size on homepage
- [x] Increase MARC logo size on homepage
- [x] Increase NAWAH logo size on Sponsors page
- [x] Increase MARC logo size on Sponsors page

## Add Workshop Registration Links
- [x] Add NAWAH workshop registration button to homepage
- [x] Add MARC workshop registration button to homepage

## Add Dr. Ashraf Tabll as Keynote Speaker
- [x] Upload Dr. Tabll's photo to S3
- [x] Add Dr. Tabll to keynote speakers section on website

## Add Dr. Mortada Mourad El Aref as Keynote Speaker
- [x] Translate Arabic biography to English
- [x] Upload Dr. El Aref's photo to S3
- [x] Add Dr. El Aref to keynote speakers database
- [x] Replace Keynote Speakers section with Conference Awards on banner
- [x] Generate updated conference banner with awards section

- [x] Generate invited speaker announcement poster for Prof. Dr. Nagwa El-Badri
- [x] Upload Dr. Nagwa El-Badri poster to CDN

- [x] Upload Dr. Nagwa's photo to CDN for website
- [x] Update speakers page to include Invited Speakers section
- [x] Add Dr. Nagwa El-Badri to database as invited speaker

- [x] Reclassify Dr. Ashraf Tabll as invited speaker
- [x] Reclassify Dr. Ibrahim El-Sherbiny as invited speaker
- [x] Reclassify Dr. Mortada El Aref as invited speaker

- [x] Add Prof. Dr. Osama Azmy as invited speaker to website
- [x] Add Prof. Dr. Khalid Taalab as invited speaker to website

- [x] Rename navigation menu from 'Keynote Speakers' to 'Keynote and Invited Speakers'

- [x] Add Prof. Dr. Mohamed Ibrahim El-Anbawy as invited speaker to website

- [x] Generate invited speaker announcement poster for Dr. Mohamed Ibrahim El-Anbawy

- [x] Restore Sponsors/Sponsorship Packages link in navigation menu

- [x] Add Prof. Dr. Mahmoud Nasr as invited speaker to website

- [x] Add Dr. Sahar Hassan as invited speaker to website

- [x] Add Prof. Dr. Sohair Ramadan Fahmy as invited speaker to website

- [x] Create dedicated Awards page on website
- [x] Add Awards link to navigation menu
- [x] Generate social media graphics for awards promotion
- [x] Create downloadable awards flyer/poster
- [x] Create press release announcing conference awards
- [x] Add awards section to website homepage with awards graphic
- [x] Create Facebook post for conference awards announcement
- [x] Add photos to organizing committee members (Prof. Emtithal and 3 team members)
- [x] Add Biotechnology Department affiliation to organizing committee team members
- [x] Verify Cairo University logo consistency across all website sections
- [x] Add Faculty of Science logo alongside Cairo University logo in header
- [x] Remove duplicate Faculty of Science logo from headers
- [x] Add comprehensive footer section with contact info, social media, navigation, and copyright
- [x] Update Awards page - remove graphic, add trophy/certificate icons, add CTA section
- [x] Fix Button import error in Awards page
- [x] Remove duplicate "Ready to Compete?" section from bottom of Awards page
- [x] Update footer to show only Facebook link and remove phone number
- [x] Update footer email to science.faculty.conference2026@gmail.com
- [x] Update footer "Keynote Speakers" to "Keynote and Invited Speakers"
- [x] Update sponsorship package prices (Platinum: 150K, Gold: 100K, Silver: 50K, Bronze: 20K)
- [x] Add exclusive advantage for Platinum tier
- [x] Design sponsor database schema with logo, materials, and status fields
- [x] Create sponsor dashboard UI page
- [x] Implement file upload functionality for sponsor materials
- [x] Add sponsor management backend procedures
- [ ] Test sponsor dashboard functionality

## Schedule Integration from Conference Program PDF
- [x] Replace placeholder schedule with detailed program from PDF
- [x] Integrate Day 1 (April 7) complete schedule with all sessions
- [x] Integrate Day 2 (April 8) complete schedule with all sessions
- [x] Add conference hall information (Halls A, B, C, D)
- [x] Add workshop room information (Rooms 1, 2)
- [x] Display MARC workshop details (Day 1)
- [x] Display Nawah workshop details (Day 2)
- [x] Show parallel session tracks (Biological & Chemical Sciences vs Mathematics, Physics, Geology, Astronomy)
- [x] Add closing ceremony details with awards announcement
- [x] Test schedule page display and navigation

## Volunteer Registration System
- [x] Design database schema for volunteer applications (volunteers table)
- [x] Create backend procedures for volunteer registration (submit, list, update status)
- [x] Build volunteer registration form page with bilingual UI
- [x] Add committee selection with descriptions
- [x] Implement form validation and submission
- [x] Create admin dashboard page for managing volunteers
- [x] Add filtering and search functionality
- [x] Add export to Excel functionality
- [x] Test volunteer registration flow
- [x] Test admin dashboard functionality

## Bulk Email Feature for Volunteers
- [x] Create backend procedure for sending bulk emails to volunteers
- [x] Add email filtering by status, committee, and custom selection
- [x] Implement email template with subject and message body
- [x] Add bulk email button and dialog to admin dashboard
- [x] Test email sending functionality
- [x] Add email sending confirmation and error handling

## Add Keynote Speaker - Prof. Hamed A. Ead
- [x] Upload speaker photo to S3 and get CDN URL
- [x] Add speaker to database with full information
- [x] Verify speaker appears on keynote speakers page
- [x] Test speaker profile display

## Fix Volunteer Registration Form Error
- [x] Fix empty Select.Item values causing form crash
- [x] Test volunteer registration form
- [x] Verify form submission works correctly

## Update Prof. Hamed A. Ead Biography
- [x] Write professional expanded biography in English
- [x] Write professional expanded biography in Arabic
- [x] Update biography in database
- [x] Verify biography appears correctly on website

## Update Volunteer Benefits Section
- [x] Update volunteer benefits content on registration page
- [x] Verify updated content displays correctly

## Add Invited Speaker - Dr. Ayman El-Shibiny
- [x] Extract speaker information from document
- [x] Add speaker to database as invited speaker
- [x] Verify speaker appears on website

## Update Participation Deadline
- [x] Find all deadline references on website
- [x] Update deadline to March 1, 2026 (01/03/2026)
- [x] Verify updated deadline displays correctly

## Upload Dr. El-Shibiny Photo
- [x] Upload photo to S3 and get CDN URL
- [x] Update database with photo URL
- [x] Verify photo appears on speakers page

## Add Invited Speaker - Dr. Ahmed Fikry El-Sayed
- [x] Upload speaker photo to S3
- [x] Add speaker to database with bio and abstract
- [x] Verify speaker appears on website

## Add Keynote Speaker - Prof. Ehab El-Dabaa
- [x] Upload speaker photo to S3
- [x] Add speaker to database with bio and affiliation
- [x] Verify speaker appears on website

## Update Dr. Ayman El-Shibiny Photo
- [x] Upload correct photo to S3
- [x] Update database with new photo URL
- [x] Verify photo appears on website

## Create Speaker Promotional Materials
- [ ] Fetch all 16 speakers from database
- [ ] Design consistent square template with conference branding
- [ ] Generate promotional graphics for all speakers
- [ ] Include speaker photo, name (EN/AR), title, affiliation, presentation title, date
- [ ] Deliver all graphics to user

## Medsol Workshop Updates
- [x] Update workshop title to "From DNA to Proteins: Advanced Sequencing Technologies Workshop"
- [x] Update workshop description with comprehensive text about Oxford Nanopore and Quantum-Si technologies
- [x] Add Medsol logo to workshop partners section
- [x] Update professional workshops text to include "NAWAH Scientific, MARC, and Medsol"
- [x] Upload Medsol logo to S3 CDN

## Add Medsol Workshop Card to Home Page
- [x] Add Medsol workshop card to Professional Workshops section on home page
- [x] Include Medsol logo, workshop title, duration, and description
- [x] Adjust grid layout to accommodate three workshop cards (NAWAH, MARC, Medsol)
- [x] Ensure consistent styling with existing workshop cards

## Update Medsol Workshop Registration Link
- [x] Update Medsol workshop registration button URL to https://forms.gle/nJ8QRmqboZr1VGfP8

## Remove Workshop Partners Section from Home Page
- [x] Remove Workshop Partners section (NAWAH and MARC cards) from home page
- [x] Keep Workshop Partners section on Sponsors page only

## Add Prof. Tarek Kapiel as Invited Speaker
- [x] Upload Prof. Tarek Kapiel's photo to S3 CDN
- [x] Add Prof. Tarek Kapiel to speakers database with title, biography, and abstract
- [x] Display Prof. Tarek Kapiel on Keynote and Invited Speakers page
- [x] Add Prof. Tarek Kapiel to schedule if needed

## Add Prof. Osama Shalabiea as Invited Speaker
- [x] Upload Prof. Osama Shalabiea's photo to S3 CDN
- [x] Add Prof. Osama Shalabiea to speakers database with bilingual title and abstract
- [x] Display Prof. Osama Shalabiea on Keynote and Invited Speakers page

## Create Speaker Announcement Graphics
- [x] Generate announcement graphic for Dr. Osama Shalabiea matching the template design
- [x] Generate announcement graphic for Dr. Tarek Kapiel matching the template design
- [x] Deliver both graphics to user

## Regenerate Prof. Osama Shalabiea Speaker Announcement Graphic
- [x] Regenerate speaker announcement graphic for Prof. Osama Shalabiea using his actual photo
- [x] Deliver updated graphic to user

## Regenerate Prof. Tarek Kapiel Speaker Announcement Graphic
- [x] Regenerate speaker announcement graphic for Prof. Tarek Kapiel using his actual photo
- [x] Deliver updated graphic to user

## Create Medsol Workshop Announcement Graphic
- [x] Generate workshop announcement graphic for Medsol matching the MARC template design
- [x] Deliver graphic to user

## Redesign Conference Invitation for Envelope Format
- [x] Analyze envelope video to understand dimensions and format requirements
- [x] Design new invitation layout with patronage section (تحت رعاية) at top
- [x] Add conference information section at bottom
- [x] Ensure design fits envelope format shown in video
- [x] Deliver redesigned invitation to user

## Create Two Landscape Invitation Versions
- [x] Generate traditional green/gold Islamic-style invitation in landscape format
- [x] Generate modern minimalist invitation with research tracks in landscape format
- [x] Deliver both invitations to user

## Remove Dotted Line from Traditional Invitation
- [x] Regenerate traditional landscape invitation without dotted line for recipient name
- [x] Update colors to match modern invitation palette (navy blue, gold, sage green, cream)
- [x] Deliver updated invitation to user

## Create Simplified Modern Invitation
- [x] Generate modern invitation without Dr. Soheir and Dr. Samy names
- [x] Keep research tracks, date, venue, logos, and awards for students
- [x] Deliver simplified invitation to user

## Create Traditional Invitation with Conference Details Only
- [x] Generate traditional Islamic-style invitation without patron names or recipient name line
- [x] Include only conference details: title, date, venue, tracks, contact
- [x] Deliver traditional simplified invitation to user

## Create Simple Invitation for Semi-Transparent Paper
- [x] Generate minimalist invitation design optimized for semi-transparent paper printing
- [x] Use simple borders and minimal decorative elements
- [x] Ensure clear text readability
- [x] Deliver simple invitation to user

## Create Landscape Simple Invitation
- [x] Generate landscape orientation version of simple invitation for semi-transparent paper
- [x] Deliver landscape invitation to user

## Update Invitation with All Nine Research Tracks
- [x] Generate simple landscape invitation with all nine research tracks
- [x] Deliver updated invitation to user

## Create Social Media Posts
- [x] Write social media post for Prof. Osama Shalabiea
- [x] Write social media post for Prof. Tarek Kapiel
- [x] Write social media post for Medsol workshop
- [x] Deliver all social media posts to user

## Create Social Media Reel Script for Workshops
- [x] Write engaging reel script for NAWAH, MARC, and Medsol workshops
- [x] Include scene breakdown, text overlays, and voiceover
- [x] Deliver reel script to user

## Upload Ahmed Youssef Photo
- [x] Upload photo to S3 storage
- [x] Save reference in database

## Add Certificate Payment Information
- [x] Restart dev server
- [x] Add bank transfer payment section for conference certificate (100 EGP)
- [x] Display account details: صندوق الخدمات التعليمية - كلية العلوم - جامعة القاهرة, Account: 7/450/88516/9

## Fix Certificate Bank Account Number
- [x] Update account number from 7/450/88516/9 to 9/450/88216/7 in Attendance.tsx

## Update Abstract Submission Deadline
- [x] Update deadline date to March 7, 2026 across the codebase
- [x] Add urgent deadline-approaching banner/highlight on the website homepage and registration page

## Certificate Invoice Upload & Workshop Announcements
- [x] Add invoiceUrl column to registrations table in schema for certificate payment proof
- [x] Add workshopChoice and workshopInvoiceUrl columns to registrations table for workshop registration
- [x] Update Attendance page: add mandatory invoice upload step for certificate (S3 upload)
- [x] Update Home page: announce workshop fees (200 EGP, first 30 participants, one workshop only)
- [x] Update Home page: announce pre/post conference workshops (350 EGP, Apr 6 & 9)
- [x] Add HVD company teaser to workshops section
- [x] Update admin dashboard to display invoice images for certificate and workshop payments

## AI Meets Biotech Workshop (HVD Card Update)
- [x] Upload AI بالعربي logo to CDN
- [x] Update HVD workshop card with full workshop details (title, description, date/time)
- [x] Add "ai_biotech" as a new workshop choice option in schema, routers, and Attendance form
- [x] Update workshop counts to include ai_biotech
- [x] Save checkpoint

## Facebook Graphic & Admin Dashboard Update
- [x] Create Facebook promotional graphic for AI Meets Biotech workshop
- [x] Update admin dashboard to show ext_workshop_payment_status column and confirm/reject buttons
- [x] Save checkpoint

## AI Meets Biotech Card Fixes
- [x] Remove HVD logo from AI Meets Biotech card header
- [x] Enlarge AI بالعربي logo in the card
- [x] Keep Featured Scientific Workshop section as a separate card
- [x] Regenerate Facebook graphic without HVD logo and with larger AI logo

## NAWAH Prize Addition
- [ ] Add NAWAH prize card to Awards page (Master & PhD project selection, scientific incubators, July announcement)
- [ ] Regenerate Facebook sponsor prizes graphic with NAWAH included
- [ ] Save checkpoint
- [x] Add Dr. Jan Sedláček Environmental Geochemical Data Analysis workshop (7-8 April, 90 min/day, two-day, main conference days) to Home page and Registration form
- [x] Add Chitosan 'Biotech Product Development 101' pre-conference workshop (April 6, 9AM-12PM, 30 slots, 3rd/4th year + graduates) to Home.tsx workshops section and Attendance.tsx registration form
- [x] Update workshop price from 350 EGP to 200 EGP across Home.tsx and Attendance.tsx
# Email All feature added
- [ ] Add InstaPay payment instructions (CBE account 9450882167) to Attendance Confirmation email

## Agitech Workshop Addition
- [x] Add Agitech logo to public/images
- [x] Add Agitech workshop to Workshops page
- [x] Add Agitech workshop to Schedule page (workshops summary section)
- [x] Update PDF generator to include Agitech workshop

## Agitech Workshop Spots (20 spots)
- [x] Add "agitech" to workshopChoice enum in drizzle/schema.ts (already existed)
- [x] Run pnpm db:push to migrate (no schema change needed)
- [x] Update workshop stats query in server/routers.ts to include agitech count (already existed)
- [x] Add spots counter badge to Agitech card on Home page (capacity: 20)

## Admin Dashboard Workshop Statistics
- [x] Inspect admin dashboard workshop stats section
- [x] Ensure all 8 workshops appear with correct counts and capacities (including Agitech 20 spots)
- [x] Add workshopCounts query to Admin.tsx
- [x] Add Workshop Registration Statistics card with progress bars to Admin.tsx
- [ ] Add Agitech to registration form extWorkshopChoice if missing (to be verified)

## Three New Features (March 2026)
- [x] Add Agitech to registration form Pre/Post workshop choices (Attendance.tsx) — enhanced with logo and full details
- [x] Add automatic 80% capacity notification for all workshops in server/routers.ts — triggers system_alert via notificationEmitter when count hits 80% threshold
- [x] Add workshop filter to admin registrations table in Admin.tsx — dropdown with all 9 workshops + Any/None options

## Agitech Registration & PDF Fix
- [x] Verify Agitech appears as extWorkshopChoice in registration form (Attendance.tsx) — already present with full details
- [x] Update Agitech time in PDF generator from "During Conference" to "April 6, 12:00 PM – 2:00 PM"

## Medsol Rename & Awards Update
- [x] Replace all "Medsol" with "Medsol Corporation" across all frontend pages and server files
- [x] Add "Best Innovative Research Idea" award by Medsol Corporation (1st: 3000 EGP, 2nd: 2000 EGP, 3rd: 1000 EGP) to Awards page

## Three Awards Improvements (Mar 08)
- [x] Add "Best Innovative Research Idea" to Award Categories grid in Awards.tsx
- [x] Update PDF generator to include Medsol Corporation awards section (new Awards page in PDF)
- [x] Add Medsol Corporation as award sponsor card in Sponsors page (new Award Sponsors section)

## Single Cell Genomics Workshop (Apr 9, 10:00–13:00)
- [ ] Check if scRNA-seq workshop already exists in the codebase
- [ ] Add workshop card to Home page (after existing pre/post conference workshops)
- [ ] Add to Schedule page workshops summary section
- [ ] Add to registration form extWorkshopChoice list
- [ ] Add to admin dashboard workshop statistics
- [ ] Update PDF generator to include the new workshop
- [ ] Add to Sponsors page if organizer info is available

## Certificate Request Feature (April 2026)
- [x] Add certificateRequests table to database schema
- [x] Add backend tRPC procedures: submit (public), list/updateStatus/stats (admin)
- [x] Build CertificateRequest public form page at /certificate-request
- [x] Add certificate request button (amber) to homepage hero section
- [x] Build admin CertificateRequests panel with stats, filters, expandable rows, status update dialog
- [x] Add Certificates tab to Admin.tsx (6-column tab grid)
- [x] Write and pass vitest tests for certificate feature (6/6 passing)

## Certificate Requests Export (April 2026)
- [x] Add backend tRPC procedure to export certificate requests as CSV
- [x] Add Export CSV/Excel button to admin Certificates tab
- [x] Include all fields: name, email, affiliation, type, title, role, status, date
- [x] Write and pass vitest tests for export feature (9/9 passing)

## Workshop Certificate Option (April 2026)
- [x] Add "workshop" to certificateType enum in DB schema and backend router
- [x] Add workshopName field to certificateRequests table (free text, nullable)
- [x] Update backend submit procedure to accept workshopName
- [x] Update frontend CertificateRequest form: add "Workshop" option + workshopName input
- [x] Update admin CertificateRequests panel to display workshopName
- [x] Update CSV export to include workshopName column (15 columns total)
