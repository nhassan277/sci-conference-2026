import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import Admin from "./pages/Admin";
import Sci2027Programme from "./pages/Sci2027Programme";
import Sci2026Archive from "./pages/Sci2026Archive";
import Sci2027Sponsorship from "./pages/Sci2027Sponsorship";
import Sci2027Videos from "./pages/Sci2027Videos";
import Sci2027OrganizationUnit from "./pages/Sci2027OrganizationUnit";
import Support from "./pages/Support";
import CheckIn from "./pages/CheckIn";
import CheckInDashboard from "./pages/CheckInDashboard";
import AdminManagement from "./pages/AdminManagement";
import AuditLog from "./pages/AuditLog";
import DigestSettings from "./pages/DigestSettings";
import SurveyResponse from "./pages/SurveyResponse";
import ResearchTracks from "./pages/ResearchTracks";
import TrackDetailPage from "./pages/TrackDetailPage";
import Committees from "./pages/Committees";
import KeynoteSpeakers from "./pages/KeynoteSpeakers";
import MediaRegistration from "./pages/MediaRegistration";
import Awards from "./pages/Awards";
import Abstracts from "./pages/Abstracts";
import SponsorDashboard from "./pages/SponsorDashboard";
import CommitteeManagement from "./pages/admin/CommitteeManagement";
import KeynoteSpeakersManagement from "./pages/admin/KeynoteSpeakersManagement";
import VolunteerRegistration from "./pages/VolunteerRegistration";
import VolunteerManagement from "./pages/admin/VolunteerManagement";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import WorkshopGEE from "./pages/WorkshopGEE";
import LiveGallery from "./pages/LiveGallery";
// import GalleryUpload from "./pages/GalleryUpload";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/attendance"} component={Attendance} />
      <Route path={"/sponsorship"} component={Sci2027Sponsorship} />
      <Route path={"/sponsor"} component={Sci2027Sponsorship} />
      <Route path={"/sponsors"} component={Sci2027Sponsorship} />
      <Route path={"/videos"} component={Sci2027Videos} />
      <Route path={"/programme"} component={Sci2027Programme} />
      <Route path={"/conference-organization-unit"} component={Sci2027OrganizationUnit} />
      <Route path={"/schedule"} component={Sci2027Programme} />
      <Route path={"/archive-2026"} component={Sci2026Archive} />
      <Route path={"/support"} component={Support} />
      <Route path={"/checkin"} component={CheckIn} />
      <Route path={"/checkin-dashboard"} component={CheckInDashboard} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin-management"} component={AdminManagement} />
      <Route path={"/audit-log"} component={AuditLog} />
      <Route path={"/digest-settings"} component={DigestSettings} />
      <Route path={"/survey/:token"} component={SurveyResponse} />
      <Route path={"/tracks"} component={ResearchTracks} />
      <Route path={"/tracks/:trackId"} component={TrackDetailPage} />
      <Route path={"/committees"} component={Committees} />
      <Route path={"/speakers"} component={KeynoteSpeakers} />
      <Route path={"/media-registration"} component={MediaRegistration} />
      <Route path={"/awards"} component={Awards} />
      <Route path={"/abstracts"} component={Abstracts} />
      <Route path={"/sponsor-dashboard"} component={SponsorDashboard} />
      <Route path={"/admin/committees"} component={CommitteeManagement} />
      <Route path={"/admin/speakers"} component={KeynoteSpeakersManagement} />
      <Route path={"/volunteer"} component={VolunteerRegistration} />
      <Route path={"/admin/volunteers"} component={VolunteerManagement} />
      <Route path={"/admin/announcements"} component={AnnouncementsManagement} />
      <Route path={"/workshop/gee-remote-sensing"} component={WorkshopGEE} />
      <Route path={"/live-gallery"} component={LiveGallery} />
      {/* <Route path={"/gallery-upload"} component={GalleryUpload} /> */}
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
