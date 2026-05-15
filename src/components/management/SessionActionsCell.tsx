import { Clapperboard, LogIn, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionActionsCellProps {
    startUrl?: string;
    joinUrl?: string;
    recordingId?: string;
    onOpenLink: (url: string) => void | Promise<void>;
    onWatchRecording: (recordingId: string) => void;
}

export default function SessionActionsCell({
    startUrl,
    joinUrl,
    recordingId,
    onOpenLink,
    onWatchRecording,
}: SessionActionsCellProps) {
    return (
        <div className="flex flex-wrap justify-end gap-2">
            <Button
                type="button"
                size="sm"
                disabled={!startUrl}
                aria-label="Start session"
                onClick={(event) => {
                    event.stopPropagation();
                    if (startUrl) {
                        void onOpenLink(startUrl);
                    }
                }}
            >
                <Play className="size-4" aria-hidden="true" />
                Start
            </Button>

            <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!joinUrl}
                aria-label="Join session"
                onClick={(event) => {
                    event.stopPropagation();
                    if (joinUrl) {
                        void onOpenLink(joinUrl);
                    }
                }}
            >
                <LogIn className="size-4" aria-hidden="true" />
                Join
            </Button>

            <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!recordingId}
                aria-label="Watch recording"
                onClick={(event) => {
                    event.stopPropagation();
                    if (recordingId) {
                        onWatchRecording(recordingId);
                    }
                }}
            >
                <Clapperboard className="size-4" aria-hidden="true" />
                Watch
            </Button>
        </div>
    );
}