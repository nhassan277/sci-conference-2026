import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
}

export function SocialShareButtons({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = "Science at the Core of Innovation - SCI 2026",
  description = "Join us at the SCI 2026 Conference on April 7-8, 2026 at Cairo University. Building Effective Partnerships between Universities and Industry."
}: SocialShareButtonsProps) {
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnFacebook}
          className="hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnTwitter}
          className="hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnLinkedIn}
          className="hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
