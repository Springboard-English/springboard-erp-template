import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function RecordingDialog({
  recordingId,
  onClose,
}: {
  recordingId: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(recordingId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex w-[80vw] max-w-none flex-col overflow-hidden border-border/70 bg-card p-0 sm:max-w-[80vw]">
        <DialogHeader className="border-b border-border/70 px-6 py-4 text-left">
          <DialogTitle>Recording</DialogTitle>
        </DialogHeader>
        {recordingId && (
          <div className="p-3">
            <iframe
              src={`https://drive.google.com/file/d/${recordingId}/preview`}
              className="aspect-video w-full max-h-[calc(100dvh-10rem)] rounded-md"
              allow="autoplay"
              style={{ border: 'none' }}
              title="Recording Viewer"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
