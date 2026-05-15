import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Plus, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import AdvancedFiltersPanel from "@/components/management/AdvancedFiltersPanel";
import { BackgroundDetailViewContext } from "@/components/management/DetailLayout";
import RecordingDialog from "@/components/management/RecordingDialog";
import SessionActionsCell from "@/components/management/SessionActionsCell";
import CreateSessionDialog, {
    type CreateSessionDialogValues,
} from "@/components/management/CreateSessionDialog";
import SimpleDataTable, {
    type SimpleDataTableColumn,
} from "@/components/SimpleDataTable";
import {
    createManagementSession,
    fetchInlineClassOptions,
    fetchInlineEmployeeOptions,
    fetchInlineGroupOptions,
    fetchInlineSessionClassOptions,
    fetchManagementSessions,
    type InlineOption,
} from "@/api_calls/UserData";
import { openSessionLink } from "@/utils/openSessionLink";
import { type SessionRow, toSessionRows } from "@/utils/sessionRows";
import { useAuth } from "@/context/AuthContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import { cn } from "@/lib/utils";
import { getManagementDetailRoute } from "@/routing/navigation";
import { toBackendBoundary, toBackendTimestamp } from "@/utils/formatters";
import { toDetailReturnUrl, useResolvedDetailViewMode } from "@/utils/detailViewMode";
import { getUserScopes } from "@/utils/userScopes";
import {
    getQueryBoolean,
    getQueryNumber,
    getQueryParam,
    updateSearchParams,
} from "@/utils/urlQueryState";

const DEFAULT_PAGE_SIZE = 25;

interface ManagementSessionTableProps {
    title: string;
}

export default function ManagementSessionTable({
    title,
}: ManagementSessionTableProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
    const detailViewMode = useResolvedDetailViewMode();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { setStatus, clearStatus } = useGlobalStatus();
    const userScopes = getUserScopes(user);
    const canCreateSessions = userScopes.includes("sessions_post");
    const [error, setError] = useState<string | null>(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(() =>
        getQueryBoolean(searchParams, "adv", true),
    );
    const [selectedGroupKey, setSelectedGroupKey] = useState(() =>
        getQueryParam(searchParams, "group"),
    );
    const [selectedClassKey, setSelectedClassKey] = useState(() =>
        getQueryParam(searchParams, "class"),
    );
    const [selectedMentorKey, setSelectedMentorKey] = useState(() =>
        getQueryParam(searchParams, "mentor"),
    );
    const [selectedTaKey, setSelectedTaKey] = useState(() =>
        getQueryParam(searchParams, "ta"),
    );
    const [beginDate, setBeginDate] = useState(() =>
        getQueryParam(searchParams, "begin", dayjs().format("YYYY-MM-DD")),
    );
    const [endDate, setEndDate] = useState(() =>
        getQueryParam(searchParams, "end", dayjs().format("YYYY-MM-DD")),
    );
    const [appliedGroupKey, setAppliedGroupKey] = useState(() =>
        getQueryParam(searchParams, "group"),
    );
    const [appliedClassKey, setAppliedClassKey] = useState(() =>
        getQueryParam(searchParams, "class"),
    );
    const [appliedMentorKey, setAppliedMentorKey] = useState(() =>
        getQueryParam(searchParams, "mentor"),
    );
    const [appliedTaKey, setAppliedTaKey] = useState(() =>
        getQueryParam(searchParams, "ta"),
    );
    const [appliedBeginDate, setAppliedBeginDate] = useState(() =>
        getQueryParam(searchParams, "begin", dayjs().format("YYYY-MM-DD")),
    );
    const [appliedEndDate, setAppliedEndDate] = useState(() =>
        getQueryParam(searchParams, "end", dayjs().format("YYYY-MM-DD")),
    );
    const [rowCount, setRowCount] = useState(DEFAULT_PAGE_SIZE + 1);
    const [page, setPage] = useState(() => getQueryNumber(searchParams, "page", 0));
    const [pageSize, setPageSize] = useState(() =>
        getQueryNumber(searchParams, "size", DEFAULT_PAGE_SIZE, 1),
    );
    const [sessionOrder, setSessionOrder] = useState<"asc" | "desc">(() =>
        getQueryParam(searchParams, "order", "desc") === "asc" ? "asc" : "desc",
    );
    const [selectedRecordingId, setSelectedRecordingId] = useState<
        string | null
    >(null);
    const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
    const [createSessionError, setCreateSessionError] = useState<string | null>(
        null,
    );
    const groupOptionsQuery = useQuery<InlineOption[]>({
        queryKey: ["inlineGroupOptions"],
        queryFn: () => fetchInlineGroupOptions(),
        enabled: showAdvancedFilters,
    });
    const classOptionsQuery = useQuery<InlineOption[]>({
        queryKey: ["inlineClassOptions", selectedGroupKey],
        queryFn: () => {
            const normalizedGroupKey = selectedGroupKey.trim();
            return normalizedGroupKey
                ? fetchInlineClassOptions(normalizedGroupKey)
                : fetchInlineSessionClassOptions();
        },
        enabled: showAdvancedFilters,
    });
    const employeeOptionsQuery = useQuery<InlineOption[]>({
        queryKey: ["inlineEmployeeOptions"],
        queryFn: () => fetchInlineEmployeeOptions(),
        enabled: showAdvancedFilters,
    });
    const sessionsQuery = useQuery({
        queryKey: [
            "managementSessions",
            user?.username,
            page,
            pageSize,
            appliedBeginDate,
            appliedEndDate,
            appliedGroupKey,
            appliedClassKey,
            appliedMentorKey,
            appliedTaKey,
            sessionOrder,
        ],
        queryFn: async () => {
            const limit = pageSize;
            const offset = page * pageSize;
            const begin = toBackendBoundary(appliedBeginDate, "start");
            const end = toBackendBoundary(appliedEndDate, "end");
            const normalizedGroupKey = appliedGroupKey.trim();
            const normalizedClassKey = appliedClassKey.trim();
            const normalizedMentorKey = appliedMentorKey.trim();
            const normalizedTaKey = appliedTaKey.trim();
            const data = await fetchManagementSessions(limit, offset, {
                begin,
                end,
                groupKey: normalizedGroupKey || undefined,
                classKey: normalizedClassKey || undefined,
                mentorKey: normalizedMentorKey || undefined,
                taKey: normalizedTaKey || undefined,
                order: sessionOrder,
            });

            return { data, limit, offset };
        },
    });
    const createSessionMutation = useMutation({
        mutationFn: (payload: CreateSessionDialogValues & { timestamp: string }) =>
            createManagementSession(payload),
    });
    const loading = sessionsQuery.isFetching;
    const alignTableOptionsToLeft = Boolean(
        isBackgroundDetailView &&
            detailViewMode.floating &&
            detailViewMode.collapsed === "1",
    );
    const createSessionSaving = createSessionMutation.isPending;
    const groupOptions = groupOptionsQuery.data ?? [];
    const classOptions = classOptionsQuery.data ?? [];
    const employeeOptions = employeeOptionsQuery.data ?? [];
    const employeeOptionsLoading = employeeOptionsQuery.isFetching;
    const sessions = useMemo<SessionRow[]>(
        () =>
            sessionsQuery.data
                ? toSessionRows(sessionsQuery.data.data, sessionsQuery.data.offset)
                : [],
        [sessionsQuery.data],
    );

    const columns = useMemo<SimpleDataTableColumn<SessionRow>[]>(
        () => [
            {
                id: "class_name",
                header: "Class",
                className: "min-w-[200px]",
                cellClassName: "font-medium text-foreground",
                render: (row) => row.class_name || "-",
            },
            {
                id: "timestamp",
                header: "Date & Time",
                className: "min-w-[200px]",
                cellClassName: "font-medium text-foreground",
                sortable: true,
                render: (row) =>
                    row.timestamp
                        ? new Date(row.timestamp).toLocaleString()
                        : "-",
            },
            {
                id: "duration",
                header: "Duration (min)",
                className: "w-[140px]",
                render: (row) => row.duration ?? "-",
            },
            {
                id: "mentor_name",
                header: "Mentor",
                className: "min-w-[150px]",
                render: (row) => row.mentor_name || "-",
            },
            {
                id: "ta_name",
                header: "Teaching Assistant",
                className: "min-w-[170px]",
                render: (row) => row.ta_name || "-",
            },
            {
                id: "actions",
                header: "Actions",
                className: "min-w-[300px]",
                cellClassName: "text-right",
                render: (row) => (
                    <SessionActionsCell
                        startUrl={row.start_url}
                        joinUrl={row.join_url}
                        recordingId={row.id_recording}
                        onOpenLink={(url) => openSessionLink(url)}
                        onWatchRecording={(recordingId) =>
                            setSelectedRecordingId(recordingId)
                        }
                    />
                ),
            },
        ],
        [],
    );

    useEffect(() => {
        if (sessionsQuery.error) {
            setRowCount(0);
            setError(
                sessionsQuery.error instanceof Error
                    ? sessionsQuery.error.message
                    : "Failed to load sessions",
            );
            return;
        }

        if (!sessionsQuery.data) {
            return;
        }

        setError(null);
        if (sessionsQuery.data.data.length < sessionsQuery.data.limit) {
            setRowCount(sessionsQuery.data.offset + sessionsQuery.data.data.length);
            return;
        }
        setRowCount(sessionsQuery.data.offset + sessionsQuery.data.limit + 1);
    }, [sessionsQuery.data, sessionsQuery.error]);

    useEffect(() => {
        if (createSessionError) {
            setStatus(createSessionError, "error");
            return;
        }

        if (error) {
            setStatus(error, "error");
            return;
        }

        if (sessionsQuery.isFetching) {
            setStatus(`Loading ${title.toLowerCase()}...`);
            return;
        }

        clearStatus();
    }, [
        clearStatus,
        createSessionError,
        error,
        sessionsQuery.isFetching,
        setStatus,
        title,
    ]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    const defaultCreateTimestamp = dayjs(beginDate || undefined)
        .hour(9)
        .minute(0)
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm");

    const handleCreateSession = async (values: CreateSessionDialogValues) => {
        try {
            setCreateSessionError(null);
            const timestamp = toBackendTimestamp(values.timestamp);
            if (!timestamp) {
                throw new Error("Invalid session timestamp");
            }
            await createSessionMutation.mutateAsync({
                ...values,
                timestamp,
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementSessions", user?.username],
            });
            setIsCreateSessionOpen(false);
            await sessionsQuery.refetch();
        } catch (err) {
            setCreateSessionError(
                err instanceof Error ? err.message : "Failed to create session",
            );
        }
    };

    const applyAdvancedFilters = () => {
        setAppliedGroupKey(selectedGroupKey);
        setAppliedClassKey(selectedClassKey);
        setAppliedMentorKey(selectedMentorKey);
        setAppliedTaKey(selectedTaKey);
        setAppliedBeginDate(beginDate);
        setAppliedEndDate(endDate);
        setPage(0);
        setSearchParams(
            updateSearchParams(searchParams, {
                group: selectedGroupKey,
                class: selectedClassKey,
                mentor: selectedMentorKey,
                ta: selectedTaKey,
                begin: beginDate,
                end: endDate,
                page: 0,
            }),
            { replace: true },
        );
    };

    const clearAdvancedFilters = () => {
        const today = dayjs().format("YYYY-MM-DD");
        setSelectedGroupKey("");
        setSelectedClassKey("");
        setSelectedMentorKey("");
        setSelectedTaKey("");
        setBeginDate(today);
        setEndDate(today);
    };

    return (
        <section className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
            <div
                className={cn(
                    "shrink-0 flex flex-col gap-3 lg:flex-row",
                    alignTableOptionsToLeft
                        ? "lg:items-start lg:justify-start"
                        : "lg:items-end lg:justify-between",
                )}
            >
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">
                        {title}
                    </h2>
                </div>

                <div
                    className={cn(
                        "grid gap-2 sm:grid-cols-[minmax(0rem,1fr)_auto_auto_auto]",
                        alignTableOptionsToLeft ? "lg:ml-0" : "lg:ml-auto",
                    )}
                >
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            const nextShow = !showAdvancedFilters;
                            setShowAdvancedFilters(nextShow);
                            setSearchParams(
                                updateSearchParams(searchParams, { adv: nextShow }),
                                { replace: true },
                            );
                        }}
                    >
                        <SlidersHorizontal className="size-4" />
                        Advanced
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void sessionsQuery.refetch()}
                        disabled={loading}
                    >
                        <RefreshCw className="size-4" />
                        Refresh
                    </Button>

                    {canCreateSessions && (
                        <Button
                            type="button"
                            onClick={() => {
                                setCreateSessionError(null);
                                setIsCreateSessionOpen(true);
                            }}
                        >
                            <Plus className="size-4" />
                            Create
                        </Button>
                    )}
                </div>
            </div>

            <AdvancedFiltersPanel
                open={showAdvancedFilters}
                onClear={clearAdvancedFilters}
                onApply={applyAdvancedFilters}
            >
                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">
                            Class Group
                        </span>
                        <SearchableSelect
                            value={selectedGroupKey}
                            onValueChange={(value) => {
                                setSelectedGroupKey(value);
                                setSelectedClassKey("");
                            }}
                            options={[
                                { value: "", label: "All groups" },
                                ...groupOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
                            ]}
                            placeholder="All groups"
                            searchPlaceholder="Search groups..."
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Class</span>
                        <SearchableSelect
                            value={selectedClassKey}
                            onValueChange={(value) => {
                                setSelectedClassKey(value);
                            }}
                            options={[
                                { value: "", label: "All classes" },
                                ...classOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
                            ]}
                            placeholder="All classes"
                            searchPlaceholder="Search classes..."
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Mentor</span>
                        <SearchableSelect
                            value={selectedMentorKey}
                            onValueChange={setSelectedMentorKey}
                            options={[
                                { value: "", label: "All mentors" },
                                ...employeeOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
                            ]}
                            placeholder={employeeOptionsLoading ? "Loading mentors..." : "All mentors"}
                            searchPlaceholder="Search mentors..."
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Teaching Assistant</span>
                        <SearchableSelect
                            value={selectedTaKey}
                            onValueChange={setSelectedTaKey}
                            options={[
                                { value: "", label: "All teaching assistants" },
                                ...employeeOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
                            ]}
                            placeholder={employeeOptionsLoading ? "Loading teaching assistants..." : "All teaching assistants"}
                            searchPlaceholder="Search teaching assistants..."
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">
                            Begin Date
                        </span>
                        <input
                            type="date"
                            value={beginDate}
                            onChange={(event) => {
                                setBeginDate(event.target.value);
                            }}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">End Date</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) => {
                                setEndDate(event.target.value);
                            }}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        />
                    </label>
            </AdvancedFiltersPanel>

            <div data-table-viewport className="min-h-0 flex-1 overflow-hidden">
                <SimpleDataTable
                    columns={columns}
                    rows={sessions}
                    rowKey={(row) => row.id}
                    loading={loading}
                    loadingMessage={`Loading ${title.toLowerCase()}...`}
                    emptyMessage={`No ${title.toLowerCase()} found.`}
                    page={page}
                    pageSize={pageSize}
                    pageSizeOptions={[10, 25, 50, 100]}
                    onPageChange={(nextPage) => {
                        setPage(nextPage);
                        setSearchParams(updateSearchParams(searchParams, { page: nextPage }), { replace: true });
                    }}
                    onPageSizeChange={(nextPageSize) => {
                        setPageSize(nextPageSize);
                        setPage(0);
                        setSearchParams(updateSearchParams(searchParams, { size: nextPageSize, page: 0 }), { replace: true });
                    }}
                    onRowClick={(row) => {
                        if (!row.appsheet_key?.trim()) {
                            return;
                        }

                        const query = new URLSearchParams({
                            from: "managementSessions",
                            returnUrl: toDetailReturnUrl(
                                `${location.pathname}${location.search}`,
                            ),
                        });

                        navigate(
                            `${getManagementDetailRoute("sessions", row.appsheet_key)}?${query.toString()}`,
                        );
                    }}
                    paginationMode="server"
                    totalRowCount={rowCount}
                    sortBy="timestamp"
                    sortOrder={sessionOrder}
                    onSortChange={(columnId, nextOrder) => {
                        if (columnId !== "timestamp") {
                            return;
                        }
                        setSessionOrder(nextOrder);
                        setPage(0);
                        setSearchParams(
                            updateSearchParams(searchParams, { order: nextOrder, page: 0 }),
                            { replace: true },
                        );
                    }}
                />
            </div>

            <RecordingDialog
                recordingId={selectedRecordingId}
                onClose={() => setSelectedRecordingId(null)}
            />

            <CreateSessionDialog
                open={isCreateSessionOpen}
                saving={createSessionSaving}
                error={createSessionError}
                defaultTimestamp={defaultCreateTimestamp}
                onClose={() => {
                    if (createSessionSaving) {
                        return;
                    }
                    setIsCreateSessionOpen(false);
                    setCreateSessionError(null);
                }}
                onSubmit={handleCreateSession}
            />
        </section>
    );
}
