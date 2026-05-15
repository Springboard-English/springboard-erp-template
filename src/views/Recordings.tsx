import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SimpleDataTable, { type SimpleDataTableColumn } from '@/components/SimpleDataTable';
import { fetchRecordings, Recording } from '../api_calls/UserData';
import { useAuth } from '../context/AuthContext';
import { useGlobalStatus } from '../context/GlobalStatusContext';

export default function Recordings() {
    const { user } = useAuth();
    const { setStatus, clearStatus } = useGlobalStatus();
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDraft, setSearchDraft] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(15);

    const columns = useMemo<SimpleDataTableColumn<Recording>[]>(() => [
        {
            id: 'class_name',
            header: 'Class',
            className: 'min-w-[180px]',
            cellClassName: 'font-medium text-foreground',
            render: (row) => row.class_name || '-',
        },
        {
            id: 'timestamp',
            header: 'Date & Time',
            className: 'min-w-[190px]',
            render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString() : '-',
        },
        {
            id: 'duration',
            header: 'Duration',
            className: 'w-[120px]',
            render: (row) => row.duration ?? '-',
        },
        {
            id: 'mentor_name',
            header: 'Mentor',
            className: 'min-w-[150px]',
            render: (row) => row.mentor_name || '-',
        },
        {
            id: 'ta_name',
            header: 'Teaching Assistant',
            className: 'min-w-[170px]',
            render: (row) => row.ta_name || '-',
        },
        {
            id: 'exp',
            header: 'Expires At',
            className: 'min-w-[190px]',
            render: (row) => row.exp ? new Date(row.exp).toLocaleString() : '-',
        },
        {
            id: 'iat',
            header: 'Issued At',
            className: 'min-w-[190px]',
            render: (row) => row.iat ? new Date(row.iat).toLocaleString() : '-',
        },
        {
            id: 'watch',
            header: 'Watch',
            className: 'w-[120px]',
            cellClassName: 'text-right',
            render: (row) => (
                <Button
                    type="button"
                    size="sm"
                    disabled={!row.id_recording}
                    onClick={() => setSelectedRecordingId(row.id_recording)}
                >
                    Watch
                </Button>
            ),
        },
    ], []);

    const recordingsQuery = useQuery({
        queryKey: ['recordings', user?.username],
        queryFn: () => fetchRecordings(),
    });
    const loading = recordingsQuery.isFetching;

    useEffect(() => {
        if (recordingsQuery.error) {
            setRecordings([]);
            setError(recordingsQuery.error instanceof Error ? recordingsQuery.error.message : 'Unknown error');
            return;
        }

        if (!recordingsQuery.data) {
            return;
        }

        setError(null);
        setRecordings(recordingsQuery.data);
    }, [recordingsQuery.data, recordingsQuery.error]);

    useEffect(() => {
        if (error) {
            setStatus(error, 'error');
            return;
        }

        if (recordingsQuery.isFetching) {
            setStatus('Loading recordings...');
            return;
        }

        clearStatus();
    }, [clearStatus, error, recordingsQuery.isFetching, setStatus]);

    useEffect(() => () => {
        clearStatus();
    }, [clearStatus]);

    const filteredRecordings = useMemo(() => {
        const query = searchQuery.toLowerCase();
        if (!query.trim()) {
            return recordings;
        }

        return recordings.filter((recording) => {
            return (
                recording.class_name?.toLowerCase().includes(query) ||
                recording.mentor_name?.toLowerCase().includes(query) ||
                recording.ta_name?.toLowerCase().includes(query) ||
                recording.duration?.toString().includes(query) ||
                new Date(recording.timestamp).toLocaleString().toLowerCase().includes(query) ||
                new Date(recording.exp).toLocaleString().toLowerCase().includes(query) ||
                new Date(recording.iat).toLocaleString().toLowerCase().includes(query)
            );
        });
    }, [recordings, searchQuery]);

    useEffect(() => {
        setPage(0);
    }, [searchQuery]);

    if (error) {
        return null;
    }

    return (
        <section className="w-full max-w-[1700px] space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">Recordings</h2>
                </div>

                <div className="grid gap-2 sm:grid-cols-[minmax(16rem,1fr)_auto]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchDraft}
                            onChange={(event) => setSearchDraft(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    setSearchQuery(searchDraft.trim());
                                }
                            }}
                            placeholder="Search recordings"
                            className="pl-9 pr-9"
                        />
                        {searchDraft && (
                            <button
                                type="button"
                                onClick={() => { setSearchDraft(''); setSearchQuery(''); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void recordingsQuery.refetch()}
                        disabled={loading}
                    >
                        <RefreshCw className="size-4" />
                        Refresh
                    </Button>
                </div>
            </div>


            <SimpleDataTable
                columns={columns}
                rows={filteredRecordings}
                rowKey={(row) => row.id_recording || row.timestamp}
                loading={loading}
                loadingMessage="Loading recordings..."
                emptyMessage="No recordings found."
                page={page}
                pageSize={pageSize}
                pageSizeOptions={[15, 30, 50]}
                onPageChange={setPage}
                onPageSizeChange={(nextPageSize) => {
                    setPageSize(nextPageSize);
                    setPage(0);
                }}
            />

            <Dialog
                open={Boolean(selectedRecordingId)}
                onOpenChange={(open) => !open && setSelectedRecordingId(null)}
            >
                <DialogContent className="w-[80vw] max-w-none overflow-hidden border-border/70 bg-card p-0 sm:max-w-[80vw]">
                    <DialogHeader className="border-b border-border/70 px-6 py-4 text-left">
                        <DialogTitle>Recording</DialogTitle>
                    </DialogHeader>
                    {selectedRecordingId && (
                        <div className="p-3">
                            <iframe
                                src={`https://drive.google.com/file/d/${selectedRecordingId}/preview`}
                                className="aspect-video w-full max-h-[calc(100dvh-10rem)] rounded-md"
                                allow="autoplay"
                                style={{ border: 'none' }}
                                title="Recording Viewer"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
