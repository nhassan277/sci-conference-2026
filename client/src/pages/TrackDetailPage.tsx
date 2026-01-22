import { useParams, useLocation } from "wouter";
import TrackDetail from "@/components/TrackDetail";
import { tracksData } from "@/data/tracksData";
import NotFound from "./NotFound";

export default function TrackDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const trackId = params.trackId;

  if (!trackId || !tracksData[trackId]) {
    return <NotFound />;
  }

  const track = tracksData[trackId];

  return <TrackDetail track={track} />;
}
