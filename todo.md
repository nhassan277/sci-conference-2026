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
