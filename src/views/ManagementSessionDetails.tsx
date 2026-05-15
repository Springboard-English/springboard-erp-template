import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SimpleDataTable, {
    type SimpleDataTableColumn,
} from "@/components/SimpleDataTable";
import {
    BackgroundDetailViewContext,
    DetailHeader,
    DetailBreadcrumbs,
    DetailClassHeaderLabel,
    DetailFieldsTable,
    DetailTabbedSection,
    DetailView,
} from "@/components/management/DetailLayout";
import RecordingDialog from "@/components/management/RecordingDialog";
import SearchField from "@/components/management/SearchField";
import OutdatedDataDialog from "@/components/management/OutdatedDataDialog";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import {
    AttendancePatchRequest,
    fetchInlineEmployeeOptions,
    fetchInlineSessionClassOptions,
    InlineOption,
    Session,
    SessionPatchRequest,
    SessionAttendance,
    deleteManagementSession,
    fetchManagementSessionAttendances,
    fetchManagementSessionDetails,
    patchManagementSession,
    patchSessionAttendance,
} from "@/api_calls/UserData";
import { openSessionLink } from "@/utils/openSessionLink";
import { useAuth } from "@/context/AuthContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import { isOutdatedEditedAtConflictError } from "@/utils/conflictErrors";
import { getUserScopes } from "@/utils/userScopes";
import {
    toDetailReturnUrl,
    useResolvedDetailViewMode,
} from "@/utils/detailViewMode";
import PendingChangesBar from "@/components/PendingChangesBar";
import {
    formatUserTimestamp,
    getTextareaRows,
    toBackendTimestamp,
    toDateTimeLocalValue,
} from "@/utils/formatters";
import { isPermissionDeniedError } from "@/utils/permissions";
import {
    getManagementClassContextFromPath,
    getManagementClassRoute,
    getManagementSessionRoute,
    isManagementSessionSection,
    MANAGEMENT_CLASSES_ROUTE,
    MANAGEMENT_SESSIONS_ROUTE,
    type ManagementSessionSection,
    normalizeRoutePath,
} from "@/routing/navigation";
import DetailLoadingView from "@/components/management/DetailLoadingView";
import { cn } from "@/lib/utils";

type SessionAttendanceRow = SessionAttendance & { id: string };
export type SessionComingFrom = "managementClasses" | "managementSessions";
type SessionEditableForm = {
    classKey: string;
    mentorKey: string;
    taKey: string;
    timestamp: string;
    duration: string;
    password: string;
    remarks: string;
};

interface ManagementSessionDetailsContentProps {
    session: Session;
    comingFrom: SessionComingFrom;
    onBack: () => void;
    onBackToClassesList?: () => void;
    activeTab: ManagementSessionSection;
    onTabChange: (tab: ManagementSessionSection) => void;
}

export default function ManagementSessionDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{
        classKey?: string;
        sessionKey: string;
        sessionSection?: string;
    }>();
    const query = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );
    const queryComingFrom = query.get("from");
    const returnUrl = query.get("returnUrl");
    const resolvedReturnUrl = returnUrl ? normalizeRoutePath(returnUrl) : null;
    const returnClassContext = resolvedReturnUrl
        ? getManagementClassContextFromPath(resolvedReturnUrl)
        : null;
    const queryClassKey = query.get("classKey") ?? undefined;
    const queryClassName = query.get("className") ?? undefined;
    const decodedClassKey = useMemo(
        () => decodeURIComponent(params.classKey ?? ""),
        [params.classKey],
    );
    const isClassScopedRoute = decodedClassKey.trim().length > 0;
    const resolvedComingFrom: SessionComingFrom = isClassScopedRoute
        ? "managementClasses"
        : queryComingFrom === "managementClasses" || returnClassContext
          ? "managementClasses"
          : "managementSessions";
    const resolvedReturnToPath = isClassScopedRoute
        ? getManagementClassRoute(decodedClassKey, "sessions")
        : resolvedReturnUrl;
    const resolvedSelectedClassKey =
        decodedClassKey ||
        queryClassKey?.trim() ||
        returnClassContext?.classKey ||
        "";
    const resolvedSelectedClassName = queryClassName?.trim() || "";
    const decodedSessionKey = useMemo(
        () => decodeURIComponent(params.sessionKey ?? ""),
        [params.sessionKey],
    );
    const activeTab = useMemo<ManagementSessionSection>(() => {
        const segment = params.sessionSection;
        return segment && isManagementSessionSection(segment)
            ? segment
            : "details";
    }, [params.sessionSection]);
    const withCurrentSearch = useCallback(
        (pathname: string) => `${pathname}${location.search}`,
        [location.search],
    );
    const { setStatus, clearStatus } = useGlobalStatus();

    const [session, setSession] = useState<Session | null>(null);
    const [error, setError] = useState<string | null>(null);
    const sessionDetailsQuery = useQuery({
        queryKey: ["managementSessionDetails", decodedSessionKey],
        queryFn: () => fetchManagementSessionDetails(decodedSessionKey),
        enabled: Boolean(decodedSessionKey.trim()),
    });
    const loading = sessionDetailsQuery.isFetching;

    useEffect(() => {
        if (!decodedSessionKey.trim()) {
            setError("Missing session identifier in URL.");
            setSession(null);
            return;
        }

        if (sessionDetailsQuery.error) {
            setError(
                sessionDetailsQuery.error instanceof Error
                    ? sessionDetailsQuery.error.message
                    : "Failed to load session details",
            );
            setSession(null);
            return;
        }
        if (!sessionDetailsQuery.data) {
            return;
        }

        const details = sessionDetailsQuery.data;
        const hasClassContext = Boolean(
            resolvedSelectedClassKey || resolvedSelectedClassName,
        );
        if (
            (details.class_key?.trim() && details.class_name?.trim()) ||
            !hasClassContext
        ) {
            setSession(details);
        } else {
            setSession({
                ...details,
                class_key:
                    details.class_key?.trim() || resolvedSelectedClassKey,
                class_name:
                    details.class_name?.trim() || resolvedSelectedClassName,
            });
        }
        setError(null);
    }, [
        decodedSessionKey,
        resolvedSelectedClassKey,
        resolvedSelectedClassName,
        sessionDetailsQuery.data,
        sessionDetailsQuery.error,
    ]);

    useEffect(() => {
        if (error || (!loading && !session)) {
            setStatus(error ?? "Session not found.", "error");
            return;
        }

        if (loading) {
            setStatus("Loading session details...");
            return;
        }

        clearStatus();
    }, [clearStatus, error, loading, session, setStatus]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    useEffect(() => {
        if (
            !params.sessionSection ||
            isManagementSessionSection(params.sessionSection)
        ) {
            return;
        }

        navigate(
            withCurrentSearch(
                getManagementSessionRoute(decodedSessionKey, {
                    classKey: decodedClassKey || null,
                    section: "details",
                }),
            ),
            {
                replace: true,
            },
        );
    }, [
        decodedClassKey,
        decodedSessionKey,
        navigate,
        params.sessionSection,
        withCurrentSearch,
    ]);

    const handleBack = () => {
        if (resolvedReturnToPath?.trim()) {
            navigate(resolvedReturnToPath);
            return;
        }

        navigate(MANAGEMENT_SESSIONS_ROUTE);
    };

    const handleBackToClassesList = () => {
        navigate(MANAGEMENT_CLASSES_ROUTE);
    };

    const handleTabChange = (tab: ManagementSessionSection) => {
        navigate(
            withCurrentSearch(
                getManagementSessionRoute(decodedSessionKey, {
                    classKey: decodedClassKey || null,
                    section: tab,
                }),
            ),
        );
    };

    if (loading || !session) {
        return <DetailLoadingView title="Loading session details..." />;
    }

    if (error) {
        return <DetailLoadingView title="Loading session details..." />;
    }

    return (
        <ManagementSessionDetailsContent
            session={session}
            comingFrom={resolvedComingFrom}
            onBack={handleBack}
            onBackToClassesList={handleBackToClassesList}
            activeTab={activeTab}
            onTabChange={handleTabChange}
        />
    );
}

function toSessionEditableForm(source: Session): SessionEditableForm {
    return {
        classKey: source.class_key ?? "",
        mentorKey: source.mentor_key ?? "",
        taKey: source.ta_key ?? "",
        timestamp: toDateTimeLocalValue(source.timestamp),
        duration:
            source.duration !== null && source.duration !== undefined
                ? String(source.duration)
                : "",
        password: source.password ?? "",
        remarks: source.remarks ?? "",
    };
}

function buildSessionPatch(
    current: SessionEditableForm,
    original: SessionEditableForm,
): SessionPatchRequest {
    const payload: SessionPatchRequest = {};

    const currentClassKey = current.classKey.trim();
    const originalClassKey = original.classKey.trim();
    if (currentClassKey !== originalClassKey) {
        payload.class_key = currentClassKey || null;
    }

    const currentMentorKey = current.mentorKey.trim();
    const originalMentorKey = original.mentorKey.trim();
    if (currentMentorKey !== originalMentorKey) {
        payload.mentor_key = currentMentorKey || null;
    }

    const currentTaKey = current.taKey.trim();
    const originalTaKey = original.taKey.trim();
    if (currentTaKey !== originalTaKey) {
        payload.ta_key = currentTaKey || null;
    }

    const currentTimestamp = current.timestamp.trim();
    const originalTimestamp = original.timestamp.trim();
    if (currentTimestamp !== originalTimestamp) {
        payload.timestamp = currentTimestamp
            ? (toBackendTimestamp(currentTimestamp) ?? null)
            : null;
    }

    if (current.duration.trim() !== original.duration.trim()) {
        payload.duration = current.duration.trim()
            ? Number(current.duration.trim())
            : null;
    }

    const currentPassword = current.password.trim();
    const originalPassword = original.password.trim();
    if (currentPassword !== originalPassword) {
        payload.password = currentPassword || null;
    }

    const currentRemarks = current.remarks.trim();
    const originalRemarks = original.remarks.trim();
    if (currentRemarks !== originalRemarks) {
        payload.remarks = currentRemarks || null;
    }

    return payload;
}

function ManagementSessionDetailsContent({
    session,
    comingFrom,
    onBack,
    onBackToClassesList,
    activeTab,
    onTabChange,
}: ManagementSessionDetailsContentProps) {
    const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
    const detailViewMode = useResolvedDetailViewMode();
    const alignTableOptionsToLeft = Boolean(
        isBackgroundDetailView &&
            detailViewMode.floating &&
            detailViewMode.collapsed === "1",
    );
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const attendanceStatusOptions = [
        "On time",
        "Late",
        "Absent",
        "Absent (Noted)",
    ] as const;
    const { user } = useAuth();
    const { setStatus, clearStatus } = useGlobalStatus();
    const userScopes = getUserScopes(user);
    const canPatchSessions = userScopes.includes("sessions_patch");
    const canDeleteSessions = userScopes.includes("sessions_delete");
    const [sessionDetails, setSessionDetails] = useState<Session | null>(null);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [classOptions, setClassOptions] = useState<InlineOption[]>([]);
    const [employeeOptions, setEmployeeOptions] = useState<InlineOption[]>([]);
    const [optionsError, setOptionsError] = useState<string | null>(null);
    const [attendances, setAttendances] = useState<SessionAttendanceRow[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchDraft, setSearchDraft] = useState("");
    const [selectedRecordingId, setSelectedRecordingId] = useState<
        string | null
    >(null);
    const [sessionForm, setSessionForm] = useState<SessionEditableForm>(() =>
        toSessionEditableForm(session),
    );
    const [sessionOriginal, setSessionOriginal] = useState<SessionEditableForm>(
        () => toSessionEditableForm(session),
    );
    const [pendingSessionChanges, setPendingSessionChanges] =
        useState<SessionPatchRequest>({});
    const [sessionChangeError, setSessionChangeError] = useState<string | null>(
        null,
    );
    const [sessionDeleteError, setSessionDeleteError] = useState<string | null>(
        null,
    );
    const [pendingAttendanceChanges, setPendingAttendanceChanges] = useState<
        Record<string, AttendancePatchRequest>
    >({});
    const [showOutdatedDataDialog, setShowOutdatedDataDialog] = useState(false);
    const [savingAttendances, setSavingAttendances] = useState(false);
    const [attendanceOriginals, setAttendanceOriginals] = useState<
        Record<string, SessionAttendanceRow>
    >({});
    const [attendancesPage, setAttendancesPage] = useState(0);
    const [attendancesPageSize, setAttendancesPageSize] = useState(10);
    const hasOpenDialog = Boolean(selectedRecordingId);

    const sessionKey = session.appsheet_key || "";
    const sessionDetailsQuery = useQuery({
        queryKey: ["managementSessionDetailsContent", sessionKey],
        queryFn: () => fetchManagementSessionDetails(sessionKey),
        enabled: Boolean(sessionKey.trim()),
    });
    const attendancesQuery = useQuery({
        queryKey: ["managementSessionAttendances", sessionKey],
        queryFn: () => fetchManagementSessionAttendances(sessionKey),
        enabled: Boolean(sessionKey.trim()),
    });
    const optionsQuery = useQuery({
        queryKey: ["managementSessionEditOptions", canPatchSessions],
        queryFn: async () => {
            const [classesData, employeesData] = await Promise.all([
                fetchInlineSessionClassOptions(),
                fetchInlineEmployeeOptions(),
            ]);
            return { classesData, employeesData };
        },
        enabled: canPatchSessions,
    });
    const detailsLoading = sessionDetailsQuery.isFetching;
    const loading = attendancesQuery.isFetching;
    const optionsLoading = optionsQuery.isFetching;
    const displaySession = sessionDetails ?? session;
    const patchSessionMutation = useMutation({
        mutationFn: ({
            sessionKey: key,
            payload,
        }: {
            sessionKey: string;
            payload: SessionPatchRequest;
        }) => patchManagementSession(key, payload),
    });
    const patchSessionAttendanceMutation = useMutation({
        mutationFn: ({
            attendanceKey,
            payload,
        }: {
            attendanceKey: string;
            payload: AttendancePatchRequest;
        }) => patchSessionAttendance(attendanceKey, payload),
    });
    const deleteSessionMutation = useMutation({
        mutationFn: (key: string) => deleteManagementSession(key),
    });
    const savingSessionChanges = patchSessionMutation.isPending;
    const deletingSession = deleteSessionMutation.isPending;

    const buildAttendancePatch = (
        currentRow: SessionAttendanceRow,
        originalRow: SessionAttendanceRow,
    ): AttendancePatchRequest => {
        const payload: AttendancePatchRequest = {};
        if (currentRow.status !== originalRow.status)
            payload.status = currentRow.status || null;
        if (currentRow.camera !== originalRow.camera)
            payload.camera = currentRow.camera;
        if (currentRow.mic !== originalRow.mic) payload.mic = currentRow.mic;
        if ((currentRow.remarks ?? null) !== (originalRow.remarks ?? null))
            payload.remarks = currentRow.remarks || null;
        return payload;
    };

    const handleAttendanceFieldChange = <K extends keyof SessionAttendanceRow>(
        id: string,
        field: K,
        value: SessionAttendanceRow[K],
    ) => {
        setError(null);
        setAttendances((prev) => {
            const nextRows = prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row,
            );
            const updatedRow = nextRows.find((row) => row.id === id);
            const originalRow = attendanceOriginals[id];

            if (updatedRow && originalRow) {
                const payload = buildAttendancePatch(updatedRow, originalRow);
                setPendingAttendanceChanges((prevPending) => {
                    if (Object.keys(payload).length === 0) {
                        const { [id]: _removed, ...rest } = prevPending;
                        return rest;
                    }

                    return { ...prevPending, [id]: payload };
                });
            }

            return nextRows;
        });
    };

    useEffect(() => {
        if (!sessionKey.trim()) {
            setSessionDetails(null);
            setDetailsError("Missing session key for selected session");
            setAttendances([]);
            setError("Missing session key for selected session");
            return;
        }

        if (sessionDetailsQuery.error) {
            setDetailsError(
                sessionDetailsQuery.error instanceof Error
                    ? sessionDetailsQuery.error.message
                    : "Failed to load session details",
            );
        } else if (sessionDetailsQuery.data) {
            const data = sessionDetailsQuery.data;
            const normalizedClassKey =
                data.class_key?.trim() || session.class_key?.trim() || "";
            const normalizedClassName =
                data.class_name?.trim() || session.class_name?.trim() || "";
            setSessionDetails({
                ...session,
                ...data,
                class_key: normalizedClassKey,
                class_name: normalizedClassName,
            });
            setDetailsError(null);
        }

        if (attendancesQuery.error) {
            setError(
                attendancesQuery.error instanceof Error
                    ? attendancesQuery.error.message
                    : "Failed to load attendances",
            );
            setAttendances([]);
        } else if (attendancesQuery.data) {
            const rows = attendancesQuery.data.map((attendance, index) => {
                const fallbackId = `${sessionKey}-${index}`;
                const rawId =
                    attendance.appsheet_key || attendance.student_name;
                return {
                    ...attendance,
                    id: rawId.trim() ? rawId : fallbackId,
                };
            });
            setAttendances(rows);
            setAttendanceOriginals(
                rows.reduce<Record<string, SessionAttendanceRow>>(
                    (acc, row) => {
                        acc[row.id] = row;
                        return acc;
                    },
                    {},
                ),
            );
            setPendingAttendanceChanges({});
            setError(null);
        }
    }, [
        session,
        sessionKey,
        sessionDetailsQuery.data,
        sessionDetailsQuery.error,
        attendancesQuery.data,
        attendancesQuery.error,
    ]);

    useEffect(() => {
        if (!canPatchSessions) {
            setOptionsError(null);
            setClassOptions([]);
            setEmployeeOptions([]);
            return;
        }

        if (optionsQuery.error) {
            setClassOptions([]);
            setEmployeeOptions([]);
            if (isPermissionDeniedError(optionsQuery.error)) {
                setOptionsError(null);
                return;
            }
            setOptionsError(
                optionsQuery.error instanceof Error
                    ? optionsQuery.error.message
                    : "Failed to load session edit options",
            );
            return;
        }

        if (!optionsQuery.data) {
            return;
        }

        setClassOptions(optionsQuery.data.classesData);
        setEmployeeOptions(optionsQuery.data.employeesData);
        setOptionsError(null);
    }, [canPatchSessions, optionsQuery.data, optionsQuery.error]);

    useEffect(() => {
        const nextForm = toSessionEditableForm(displaySession);
        setSessionForm(nextForm);
        setSessionOriginal(nextForm);
        setPendingSessionChanges({});
        setSessionChangeError(null);
        setSessionDeleteError(null);
    }, [
        displaySession.appsheet_key,
        displaySession.timestamp,
        displaySession.duration,
        displaySession.class_key,
        displaySession.mentor_key,
        displaySession.ta_key,
        displaySession.password,
        displaySession.remarks,
    ]);

    const classSelectOptions = useMemo(
        () => [
            { value: "", label: "-- Class --" },
            ...classOptions.map((option) => ({
                value: option.value,
                label: option.name,
            })),
        ],
        [classOptions],
    );

    const employeeSelectOptions = useMemo(
        () => [
            { value: "", label: "Unassigned" },
            ...employeeOptions.map((option) => ({
                value: option.value,
                label: option.name,
            })),
        ],
        [employeeOptions],
    );

    const filteredAttendances = useMemo(() => {
        if (!searchQuery.trim()) {
            return attendances;
        }

        const query = searchQuery.toLowerCase();
        return attendances.filter((attendance) =>
            Object.entries(attendance).some(([key, value]) => {
                if (key === "id" || value === null || value === undefined) {
                    return false;
                }

                if (typeof value === "object") {
                    return JSON.stringify(value).toLowerCase().includes(query);
                }

                return String(value).toLowerCase().includes(query);
            }),
        );
    }, [attendances, searchQuery]);

    const pendingAttendanceCount = useMemo(
        () => Object.keys(pendingAttendanceChanges).length,
        [pendingAttendanceChanges],
    );
    const pendingSessionCount = useMemo(
        () => (Object.keys(pendingSessionChanges).length > 0 ? 1 : 0),
        [pendingSessionChanges],
    );
    const pendingCombinedCount = pendingSessionCount + pendingAttendanceCount;
    const detailsTabLabel =
        pendingSessionCount > 0
            ? `Details (${pendingSessionCount})`
            : "Details";
    const attendancesTabLabel =
        pendingAttendanceCount > 0
            ? `Attendances (${pendingAttendanceCount})`
            : "Attendances";

    const hasSessionFieldChanged = (field: keyof SessionEditableForm) =>
        sessionForm[field] !== sessionOriginal[field];

    const hasAttendanceFieldChanged = (
        id: string,
        field: keyof AttendancePatchRequest,
    ) => {
        const payload = pendingAttendanceChanges[id];
        return (
            Boolean(payload) &&
            Object.prototype.hasOwnProperty.call(payload, field)
        );
    };

    const attendanceColumns = useMemo<
        SimpleDataTableColumn<SessionAttendanceRow>[]
    >(
        () => [
            {
                id: "student_name",
                header: "Student",
                className: "min-w-[180px]",
                cellClassName: "align-middle",
                render: (row) => (
                    <div className="text-sm">{row.student_name || "-"}</div>
                ),
            },
            {
                id: "status",
                header: "Status",
                className: "w-[180px] text-center",
                cellClassName: "align-middle text-center",
                render: (row) =>
                    canPatchSessions ? (
                        <SearchableSelect
                            value={row.status || ""}
                            onValueChange={(value) =>
                                handleAttendanceFieldChange(
                                    row.id,
                                    "status",
                                    value,
                                )
                            }
                            options={[
                                { value: "", label: "-- Status --" },
                                ...attendanceStatusOptions.map((option) => ({
                                    value: option,
                                    label: option,
                                })),
                            ]}
                            className={`mx-auto h-9 max-w-[150px] ${hasAttendanceFieldChanged(row.id, "status") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                            placeholder="-- Status --"
                            searchPlaceholder="Search status..."
                        />
                    ) : (
                        <div className="text-sm">{row.status || "-"}</div>
                    ),
            },
            {
                id: "camera",
                header: "Camera",
                className: "w-[110px] text-center",
                cellClassName: "align-middle text-center",
                render: (row) =>
                    canPatchSessions ? (
                        <input
                            type="checkbox"
                            checked={Boolean(row.camera)}
                            onChange={(event) =>
                                handleAttendanceFieldChange(
                                    row.id,
                                    "camera",
                                    event.target.checked,
                                )
                            }
                            className={`size-4 rounded border-input accent-primary ${hasAttendanceFieldChanged(row.id, "camera") ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-background" : ""}`}
                        />
                    ) : (
                        <div className="text-sm">
                            {row.camera ? "Yes" : "No"}
                        </div>
                    ),
            },
            {
                id: "mic",
                header: "Mic",
                className: "w-[110px] text-center",
                cellClassName: "align-middle text-center",
                render: (row) =>
                    canPatchSessions ? (
                        <input
                            type="checkbox"
                            checked={Boolean(row.mic)}
                            onChange={(event) =>
                                handleAttendanceFieldChange(
                                    row.id,
                                    "mic",
                                    event.target.checked,
                                )
                            }
                            className={`size-4 rounded border-input accent-primary ${hasAttendanceFieldChanged(row.id, "mic") ? "ring-2 ring-primary/60 ring-offset-2 ring-offset-background" : ""}`}
                        />
                    ) : (
                        <div className="text-sm">{row.mic ? "Yes" : "No"}</div>
                    ),
            },
            {
                id: "remarks",
                header: "Remarks",
                className: "min-w-[280px]",
                cellClassName: "align-top",
                render: (row) =>
                    canPatchSessions ? (
                        <Textarea
                            value={row.remarks || ""}
                            onChange={(event) =>
                                handleAttendanceFieldChange(
                                    row.id,
                                    "remarks",
                                    event.target.value,
                                )
                            }
                            rows={getTextareaRows(row.remarks)}
                            className={`min-h-0 resize-none leading-6 ${hasAttendanceFieldChanged(row.id, "remarks") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                        />
                    ) : (
                        <div className="whitespace-pre-wrap break-words text-sm leading-6">
                            {row.remarks?.trim() || "-"}
                        </div>
                    ),
            },
        ],
        [canPatchSessions, attendanceStatusOptions],
    );

    const savePendingAttendanceChanges = async () => {
        const pendingEntries = Object.entries(pendingAttendanceChanges);
        if (pendingEntries.length === 0) {
            return;
        }

        try {
            setSavingAttendances(true);
            setError(null);

            const successfulRows: Record<string, SessionAttendanceRow> = {};
            let firstFailure: string | null = null;
            let hasOutdatedConflict = false;

            for (const [id, payload] of pendingEntries) {
                const currentRow = attendances.find((row) => row.id === id);
                if (!currentRow?.appsheet_key) {
                    if (!firstFailure) {
                        firstFailure =
                            "Missing attendance key for one or more rows";
                    }
                    continue;
                }

                try {
                    const patched =
                        await patchSessionAttendanceMutation.mutateAsync({
                            attendanceKey: currentRow.appsheet_key,
                            payload: {
                                ...payload,
                                edited_at: currentRow.edited_at ?? null,
                            },
                        });
                    successfulRows[id] = {
                        ...currentRow,
                        ...patched,
                        id,
                    };
                } catch (err) {
                    if (isOutdatedEditedAtConflictError(err)) {
                        hasOutdatedConflict = true;
                        break;
                    }
                    if (!firstFailure) {
                        firstFailure =
                            err instanceof Error
                                ? err.message
                                : "Failed to update attendance";
                    }
                }
            }

            if (Object.keys(successfulRows).length > 0) {
                setAttendances((prev) =>
                    prev.map((row) => successfulRows[row.id] ?? row),
                );
                setAttendanceOriginals((prev) => ({
                    ...prev,
                    ...successfulRows,
                }));
                setPendingAttendanceChanges((prev) => {
                    const next = { ...prev };
                    Object.keys(successfulRows).forEach((id) => {
                        delete next[id];
                    });
                    return next;
                });
            }

            if (firstFailure) {
                setError(firstFailure);
            }
            if (hasOutdatedConflict) {
                setShowOutdatedDataDialog(true);
            }
        } finally {
            setSavingAttendances(false);
        }
    };

    const cancelPendingAttendanceChanges = () => {
        const originalRows = attendances.map(
            (row) => attendanceOriginals[row.id] ?? row,
        );
        setAttendances(originalRows);
        setPendingAttendanceChanges({});
        setError(null);
    };

    const handleSessionFieldChange = <K extends keyof SessionEditableForm>(
        field: K,
        value: SessionEditableForm[K],
    ) => {
        setSessionChangeError(null);
        setSessionForm((prev) => {
            const next = {
                ...prev,
                [field]: value,
            };
            setPendingSessionChanges(buildSessionPatch(next, sessionOriginal));
            return next;
        });
    };

    const savePendingChanges = async () => {
        if (!sessionKey.trim()) {
            setSessionChangeError("Missing session key");
            return;
        }

        const hasPendingSessionChanges =
            Object.keys(pendingSessionChanges).length > 0;
        const hasPendingAttendanceChanges =
            Object.keys(pendingAttendanceChanges).length > 0;
        if (!hasPendingSessionChanges && !hasPendingAttendanceChanges) {
            return;
        }

        setSessionChangeError(null);
        setError(null);

        if (hasPendingSessionChanges) {
            const durationText = sessionForm.duration.trim();
            if (durationText && Number.isNaN(Number(durationText))) {
                setSessionChangeError("Duration must be a valid number");
                return;
            }

            try {
                const patched = await patchSessionMutation.mutateAsync({
                    sessionKey,
                    payload: {
                        ...pendingSessionChanges,
                        edited_at:
                            (sessionDetails ?? session).edited_at ?? null,
                    },
                });
                setSessionDetails((prev) => ({
                    ...(prev ?? session),
                    ...patched,
                }));
                const nextForm = toSessionEditableForm({
                    ...(sessionDetails ?? session),
                    ...patched,
                });
                setSessionForm(nextForm);
                setSessionOriginal(nextForm);
                setPendingSessionChanges({});
            } catch (err) {
                if (isOutdatedEditedAtConflictError(err)) {
                    setShowOutdatedDataDialog(true);
                    return;
                }
                setSessionChangeError(
                    err instanceof Error
                        ? err.message
                        : "Failed to update session",
                );
            }
        }

        if (hasPendingAttendanceChanges) {
            await savePendingAttendanceChanges();
        }
    };

    const cancelPendingChanges = () => {
        setSessionForm(sessionOriginal);
        setPendingSessionChanges({});
        setSessionChangeError(null);
        cancelPendingAttendanceChanges();
    };

    const refreshOutdatedSessionData = async () => {
        setShowOutdatedDataDialog(false);
        setSessionChangeError(null);
        setError(null);
        setPendingSessionChanges({});
        setPendingAttendanceChanges({});
        await Promise.all([
            sessionDetailsQuery.refetch(),
            attendancesQuery.refetch(),
        ]);
    };

    const handleDeleteSession = async () => {
        if (!sessionKey.trim()) {
            setSessionDeleteError("Missing session key");
            return;
        }

        const sessionLabel =
            comingFrom === "managementClasses"
                ? `${displaySession.class_name || "-"} - ${formatUserTimestamp(displaySession.timestamp)}`
                : formatUserTimestamp(displaySession.timestamp);
        if (!window.confirm(`Delete session "${sessionLabel}"?`)) {
            return;
        }

        try {
            setSessionDeleteError(null);
            await deleteSessionMutation.mutateAsync(sessionKey);
            await queryClient.invalidateQueries({
                queryKey: ["managementSessions"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassSessions"],
            });
            onBack();
        } catch (err) {
            setSessionDeleteError(
                err instanceof Error ? err.message : "Failed to delete session",
            );
        }
    };

    const breadcrumbItems =
        comingFrom === "managementClasses"
            ? [
                  { label: "Classes", onClick: onBackToClassesList ?? onBack },
                  { label: displaySession.class_name || "-", onClick: onBack },
              ]
            : [{ label: "Sessions", onClick: onBack }];
    const breadcrumbTitle =
        comingFrom === "managementClasses"
            ? formatUserTimestamp(displaySession.timestamp)
            : `${displaySession.class_name || "-"} - ${formatUserTimestamp(displaySession.timestamp)}`;

    useEffect(() => {
        if (detailsError) {
            setStatus(detailsError, "error");
            return;
        }

        if (sessionChangeError) {
            setStatus(sessionChangeError, "error");
            return;
        }

        if (sessionDeleteError) {
            setStatus(sessionDeleteError, "error");
            return;
        }

        if (optionsError) {
            setStatus(optionsError, "error");
            return;
        }

        if (error) {
            setStatus(error, "error");
            return;
        }

        if (detailsLoading) {
            setStatus("Refreshing session details...");
            return;
        }

        if (loading) {
            setStatus("Loading attendances...");
            return;
        }

        clearStatus();
    }, [
        clearStatus,
        detailsError,
        detailsLoading,
        error,
        loading,
        optionsError,
        sessionDeleteError,
        sessionChangeError,
        setStatus,
    ]);

    return (
        <DetailView className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
            <DetailHeader
                breadcrumbs={
                    <DetailBreadcrumbs
                        items={breadcrumbItems}
                        current={breadcrumbTitle}
                    />
                }
                actions={
                    <>
                        <Button
                            type="button"
                            size="sm"
                            disabled={!displaySession.start_url}
                            onClick={() =>
                                displaySession.start_url &&
                                void openSessionLink(displaySession.start_url)
                            }
                        >
                            Start
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={!displaySession.join_url}
                            onClick={() =>
                                displaySession.join_url &&
                                void openSessionLink(displaySession.join_url)
                            }
                        >
                            Join
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={!displaySession.id_recording}
                            onClick={() =>
                                setSelectedRecordingId(
                                    displaySession.id_recording ?? null,
                                )
                            }
                        >
                            Watch Recording
                        </Button>
                        {canDeleteSessions ? (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => void handleDeleteSession()}
                                disabled={
                                    deletingSession ||
                                    savingAttendances ||
                                    savingSessionChanges ||
                                    !sessionKey.trim()
                                }
                            >
                                <Trash2 className="size-4" />
                                {deletingSession ? "Deleting..." : "Delete"}
                            </Button>
                        ) : null}
                    </>
                }
            />
            <DetailTabbedSection
                tabs={[
                    {
                        value: "details",
                        label: detailsTabLabel,
                        hasPendingChanges: pendingSessionCount > 0,
                    },
                    {
                        value: "attendances",
                        label: attendancesTabLabel,
                        hasPendingChanges: pendingAttendanceCount > 0,
                    },
                ]}
                activeTab={activeTab}
                onChange={(value) => {
                    if (isManagementSessionSection(value)) {
                        onTabChange(value);
                    }
                }}
                className="flex min-h-0 flex-1 flex-col"
                contentClassName="min-h-0 overflow-y-auto overflow-x-hidden pr-1"
            >
                {activeTab === "details" && (
                    <div className="space-y-4">
                        <DetailFieldsTable
                            rows={[
                                {
                                    label: (
                                        <DetailClassHeaderLabel
                                            classKey={
                                                sessionForm.classKey ||
                                                displaySession.class_key
                                            }
                                            onOpenClass={() => {
                                                const target =
                                                    getManagementClassRoute(
                                                        (
                                                            sessionForm.classKey ||
                                                            displaySession.class_key ||
                                                            ""
                                                        ).trim(),
                                                    );
                                                const query =
                                                    new URLSearchParams();
                                                query.set(
                                                    "returnUrl",
                                                    toDetailReturnUrl(
                                                        `${location.pathname}${location.search}`,
                                                    ),
                                                );
                                                navigate(
                                                    `${target}?${query.toString()}`,
                                                );
                                            }}
                                        />
                                    ),
                                    value: canPatchSessions ? (
                                        <SearchableSelect
                                            id="session-details-class"
                                            value={sessionForm.classKey}
                                            onValueChange={(value) =>
                                                handleSessionFieldChange(
                                                    "classKey",
                                                    value,
                                                )
                                            }
                                            options={classSelectOptions}
                                            className={
                                                hasSessionFieldChanged(
                                                    "classKey",
                                                )
                                                    ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                    : undefined
                                            }
                                            disabled={
                                                savingSessionChanges ||
                                                optionsLoading
                                            }
                                            placeholder={
                                                optionsLoading
                                                    ? "Loading classes..."
                                                    : displaySession.class_name ||
                                                      "-- Class --"
                                            }
                                            searchPlaceholder="Search classes..."
                                        />
                                    ) : (
                                        displaySession.class_name || "-"
                                    ),
                                },
                                {
                                    label: "Mentor",
                                    value: canPatchSessions ? (
                                        <SearchableSelect
                                            id="session-details-mentor"
                                            value={sessionForm.mentorKey}
                                            onValueChange={(value) =>
                                                handleSessionFieldChange(
                                                    "mentorKey",
                                                    value,
                                                )
                                            }
                                            options={employeeSelectOptions}
                                            className={
                                                hasSessionFieldChanged(
                                                    "mentorKey",
                                                )
                                                    ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                    : undefined
                                            }
                                            disabled={
                                                savingSessionChanges ||
                                                optionsLoading
                                            }
                                            placeholder={
                                                optionsLoading
                                                    ? "Loading mentors..."
                                                    : displaySession.mentor_name ||
                                                      "-- Mentor --"
                                            }
                                            searchPlaceholder="Search mentors..."
                                        />
                                    ) : (
                                        displaySession.mentor_name || "-"
                                    ),
                                },
                                {
                                    label: "Teaching Assistant",
                                    value: canPatchSessions ? (
                                        <SearchableSelect
                                            id="session-details-ta"
                                            value={sessionForm.taKey}
                                            onValueChange={(value) =>
                                                handleSessionFieldChange(
                                                    "taKey",
                                                    value,
                                                )
                                            }
                                            options={employeeSelectOptions}
                                            className={
                                                hasSessionFieldChanged("taKey")
                                                    ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                    : undefined
                                            }
                                            disabled={
                                                savingSessionChanges ||
                                                optionsLoading
                                            }
                                            placeholder={
                                                optionsLoading
                                                    ? "Loading assistants..."
                                                    : displaySession.ta_name ||
                                                      "-- Teaching Assistant --"
                                            }
                                            searchPlaceholder="Search assistants..."
                                        />
                                    ) : (
                                        displaySession.ta_name || "-"
                                    ),
                                },
                                {
                                    label: "Meeting ID",
                                    value: displaySession.id_meeting || "-",
                                },
                                {
                                    label: "Timestamp",
                                    value: canPatchSessions ? (
                                        <Input
                                            className={`h-10 ${hasSessionFieldChanged("timestamp") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                            type="datetime-local"
                                            value={sessionForm.timestamp}
                                            onChange={(event) =>
                                                handleSessionFieldChange(
                                                    "timestamp",
                                                    event.target.value,
                                                )
                                            }
                                            step={60}
                                        />
                                    ) : (
                                        displaySession.timestamp || "-"
                                    ),
                                },
                                {
                                    label: "Duration (min)",
                                    value: canPatchSessions ? (
                                        <Input
                                            className={`h-10 ${hasSessionFieldChanged("duration") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                            type="number"
                                            min={0}
                                            value={sessionForm.duration}
                                            onChange={(event) =>
                                                handleSessionFieldChange(
                                                    "duration",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="60"
                                        />
                                    ) : (
                                        (displaySession.duration ?? "-")
                                    ),
                                },
                                {
                                    label: "Password",
                                    value: canPatchSessions ? (
                                        <Input
                                            className={`h-10 ${hasSessionFieldChanged("password") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                            type="text"
                                            value={sessionForm.password}
                                            onChange={(event) =>
                                                handleSessionFieldChange(
                                                    "password",
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Password"
                                        />
                                    ) : (
                                        displaySession.password || "-"
                                    ),
                                },
                                {
                                    label: "Remarks",
                                    value: canPatchSessions ? (
                                        <Textarea
                                            value={sessionForm.remarks}
                                            onChange={(event) =>
                                                handleSessionFieldChange(
                                                    "remarks",
                                                    event.target.value,
                                                )
                                            }
                                            rows={getTextareaRows(
                                                sessionForm.remarks,
                                            )}
                                            className={`min-h-0 resize-y bg-transparent leading-6 dark:bg-input/30 ${hasSessionFieldChanged("remarks") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                        />
                                    ) : (
                                        <div className="whitespace-pre-wrap break-words leading-6 text-muted-foreground">
                                            {displaySession.remarks?.trim() ||
                                                "-"}
                                        </div>
                                    ),
                                    valueClassName: "leading-6",
                                },
                            ]}
                        />
                    </div>
                )}

                {activeTab === "attendances" && (
                    <section className="flex min-h-0 h-full flex-col space-y-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <SearchField
                                value={searchDraft}
                                onChange={(v) => {
                                    setSearchDraft(v);
                                    if (v === "") setSearchQuery("");
                                }}
                                onSubmit={() =>
                                    setSearchQuery(searchDraft.trim())
                                }
                                placeholder="Search attendances"
                                className={cn(
                                    "relative min-w-0 w-full lg:max-w-md",
                                    alignTableOptionsToLeft
                                        ? "lg:ml-0"
                                        : "lg:ml-auto",
                                )}
                            />

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        void sessionDetailsQuery.refetch();
                                        void attendancesQuery.refetch();
                                    }}
                                    disabled={
                                        loading ||
                                        detailsLoading ||
                                        savingAttendances ||
                                        savingSessionChanges
                                    }
                                >
                                    <RefreshCw className="size-4" />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        <div
                            className="min-h-0 flex-1 overflow-hidden rounded-2xl"
                            style={{
                                filter: "drop-shadow(0 18px 40px rgba(0, 0, 0, 0.1))",
                            }}
                        >
                            <SimpleDataTable
                                columns={attendanceColumns}
                                rows={filteredAttendances}
                                rowKey={(row) => row.id}
                                loading={loading}
                                loadingMessage="Loading attendances..."
                                emptyMessage="No attendances found."
                                page={attendancesPage}
                                pageSize={attendancesPageSize}
                                onPageChange={setAttendancesPage}
                                onPageSizeChange={setAttendancesPageSize}
                            />
                        </div>
                    </section>
                )}
            </DetailTabbedSection>

            <RecordingDialog
                recordingId={selectedRecordingId}
                onClose={() => setSelectedRecordingId(null)}
            />

            <PendingChangesBar
                pendingCount={pendingCombinedCount}
                saving={savingAttendances || savingSessionChanges}
                onSave={savePendingChanges}
                onCancel={cancelPendingChanges}
                saveLabel="Save pending changes"
                dimmed={hasOpenDialog}
                disabled={hasOpenDialog}
            />

            <OutdatedDataDialog
                open={showOutdatedDataDialog}
                onRefreshData={() => void refreshOutdatedSessionData()}
                onCancelAction={() => setShowOutdatedDataDialog(false)}
                loading={savingAttendances || savingSessionChanges}
            />
        </DetailView>
    );
}
