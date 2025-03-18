
import { Button } from "@/components/ui/button";

interface FeedTabsProps {
  showWebcams: boolean;
  onToggleWebcams: (show: boolean) => void;
}

const FeedTabs = ({ showWebcams, onToggleWebcams }: FeedTabsProps) => {
  return (
    <div className="absolute top-16 left-0 right-0 z-10 py-2 px-4 flex justify-center gap-2 glass">
      <Button 
        variant={!showWebcams ? "default" : "outline"}
        size="sm"
        onClick={() => onToggleWebcams(false)}
        className="rounded-full"
      >
        TEST Feed
      </Button>
      <Button 
        variant={showWebcams ? "default" : "outline"}
        size="sm"
        onClick={() => onToggleWebcams(true)}
        className="rounded-full"
      >
        Live Streams
      </Button>
    </div>
  );
};

export default FeedTabs;
