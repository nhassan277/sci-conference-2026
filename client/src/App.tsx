import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import Sponsor from "./pages/Sponsor";
import Admin from "./pages/Admin";
import Schedule from "./pages/Schedule";
import Support from "./pages/Support";
import CheckIn from "./pages/CheckIn";
import CheckInDashboard from "./pages/CheckInDashboard";
import AdminManagement from "./pages/AdminManagement";
import AuditLog from "./pages/AuditLog";
import DigestSettings from "./pages/DigestSettings";
import SurveyResponse from "./pages/SurveyResponse";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/attendance"} component={Attendance} />
      <Route path={"/sponsor"} component={Sponsor} />
      <Route path={"/schedule"} component={Schedule} />
      <Route path={"/support"} component={Support} />
      <Route path={"/checkin"} component={CheckIn} />
      <Route path={"/checkin-dashboard"} component={CheckInDashboard} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin-management"} component={AdminManagement} />
      <Route path={"/audit-log"} component={AuditLog} />
      <Route path={"/digest-settings"} component={DigestSettings} />
      <Route path={"/survey/:token"} component={SurveyResponse} />
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
