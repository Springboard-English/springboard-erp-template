import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
    Edit3,
    Plus,
    RefreshCw,
    Save,
    SlidersHorizontal,
    Trash2,
    X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    BackgroundDetailViewContext,
    DetailHeader,
    DetailBreadcrumbs,
    DetailFieldsTable,
    DetailTabbedSection,
    DetailView,
} from "@/components/management/DetailLayout";
import DetailLoadingView from "@/components/management/DetailLoadingView";
import RecordingDialog from "@/components/management/RecordingDialog";
import SearchField from "@/components/management/SearchField";
import SessionActionsCell from "@/components/management/SessionActionsCell";
import CreateScheduleDialog, {
    type CreateScheduleDialogValues,
} from "@/components/management/CreateScheduleDialog";
import CreateSessionDialog, {
    type CreateSessionDialogValues,
} from "@/components/management/CreateSessionDialog";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import SimpleDataTable, {
    type SimpleDataTableColumn,
} from "@/components/SimpleDataTable";
import { useAuth } from "@/context/AuthContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import {
    fetchDayblockOptions,
    fetchAccountOptions,
    fetchInlineGroupOptions,
    fetchManagementClassDetails,
    fetchManagementClassFeedbacks,
    fetchManagementClassRegistrations,
    ClassFeedback,
    ClassRegistration,
    createManagementSchedule,
    createManagementSession,
    fetchInlineEmployeeOptions,
    fetchInlineSessionClassOptions,
    fetchManagementClassSchedules,
    fetchManagementClassSessions,
    fetchManagementClassTests,
    type InlineOption,
    ManagementSchedule,
    ManagementTest,
    deleteManagementClass,
    patchManagementClass,
    patchRegistration,
} from "@/api_calls/UserData";
import { openSessionLink } from "@/utils/openSessionLink";
import {
    getManagementClassChildDetailRoute,
    getManagementClassRoute,
    isManagementClassSection,
    MANAGEMENT_CLASSES_ROUTE,
    normalizeRoutePath,
    type ManagementClassSection,
} from "@/routing/navigation";
import { type SessionRow, toSessionRows } from "@/utils/sessionRows";
import { getUserScopes, hasUserScope } from "@/utils/userScopes";
import {
    formatDate,
    formatUserTimestamp,
    getTextareaRows,
    toBackendBoundary,
    toBackendTimestamp,
} from "@/utils/formatters";
import {
    toDetailReturnUrl,
    useResolvedDetailViewMode,
} from "@/utils/detailViewMode";
import PendingChangesBar from "@/components/PendingChangesBar";
import ProgressMetricCell from "@/components/management/ProgressMetricCell";
import OutdatedDataDialog from "@/components/management/OutdatedDataDialog";
import { isOutdatedEditedAtConflictError } from "@/utils/conflictErrors";
import { type ManagementClassRow } from "./ManagementClassesTable";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 25;

type ManagementScheduleRow = ManagementSchedule & { id: string };
type ClassFeedbackRow = ClassFeedback & { id: string };
type ClassRegistrationRow = ClassRegistration & { id: string };
type ManagementTestRow = ManagementTest & { id: string };
type ClassDetailsTab = ManagementClassSection;
type ClassEditableForm = {
    group_key: string;
    class_name: string;
    status: string;
    date_start: string;
    date_end: string;
    notes: string;
};

function getFeedbackTimestamp(feedback: ClassFeedback) {
    const createdAt = feedback.created_at;
    const fallbackTimestamp = feedback.timestamp;
    if (typeof createdAt === "string" && createdAt.trim()) {
        return createdAt;
    }
    if (typeof fallbackTimestamp === "string" && fallbackTimestamp.trim()) {
        return fallbackTimestamp;
    }
    return undefined;
}

function toStudentCountPercent(
    studentMaxCount: number | null | undefined,
    studentCount: number | null | undefined,
) {
    if (
        !Number.isFinite(studentMaxCount) ||
        !studentMaxCount ||
        studentMaxCount <= 0
    ) {
        return 0;
    }

    const currentCount = typeof studentCount === "number" ? studentCount : 0;
    return Math.max(0, (currentCount / studentMaxCount) * 100);
}

function toSessionProgressPercent(
    totalSessions: number | null | undefined,
    completedSessions: number | null | undefined,
) {
    if (
        !Number.isFinite(totalSessions) ||
        !totalSessions ||
        totalSessions <= 0
    ) {
        return 0;
    }

    const completed =
        typeof completedSessions === "number" ? completedSessions : 0;
    return Math.max(0, (completed / totalSessions) * 100);
}

function toClassEditableForm(source: ManagementClassRow): ClassEditableForm {
    return {
        group_key: source.group_key ?? "",
        class_name: source.name ?? "",
        status: source.status ?? "",
        date_start: source.date_start ?? "",
        date_end: source.date_end ?? "",
        notes: source.notes ?? "",
    };
}

function buildClassPatch(
    current: ClassEditableForm,
    original: ClassEditableForm,
): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const groupKey = current.group_key.trim();
    const originalGroupKey = original.group_key.trim();
    if (groupKey !== originalGroupKey) {
        payload.group_key = groupKey || null;
    }

    const className = current.class_name.trim();
    const originalClassName = original.class_name.trim();
    if (className !== originalClassName) {
        payload.class_name = className || null;
    }

    const status = current.status.trim();
    const originalStatus = original.status.trim();
    if (status !== originalStatus) {
        payload.status = status || null;
    }

    const notes = current.notes.trim();
    const originalNotes = original.notes.trim();
    if (notes !== originalNotes) {
        payload.notes = notes || null;
    }

    const dateStart = current.date_start.trim();
    const originalDateStart = original.date_start.trim();
    if (dateStart !== originalDateStart) {
        payload.date_start = dateStart || null;
    }

    const dateEnd = current.date_end.trim();
    const originalDateEnd = original.date_end.trim();
    if (dateEnd !== originalDateEnd) {
        payload.date_end = dateEnd || null;
    }

    return payload;
}

function buildClassPatchWithOverrides(
    current: ClassEditableForm,
    original: ClassEditableForm,
    options?: {
        forceDateEndOverride?: boolean;
    },
): Record<string, unknown> {
    const payload = buildClassPatch(current, original);

    if (
        options?.forceDateEndOverride &&
        !Object.prototype.hasOwnProperty.call(payload, "date_end")
    ) {
        payload.date_end = current.date_end.trim() || null;
    }

    return payload;
}

export default function ManagementClassDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
    const detailViewMode = useResolvedDetailViewMode();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { classKey = "", classSection } = useParams<{
        classKey: string;
        classSection?: string;
    }>();
    const decodedClassKey = useMemo(
        () => decodeURIComponent(classKey),
        [classKey],
    );
    const returnUrl = useMemo(() => {
        const query = new URLSearchParams(location.search);
        const rawReturnUrl = query.get("returnUrl");
        return rawReturnUrl ? normalizeRoutePath(rawReturnUrl) : null;
    }, [location.search]);
    const withCurrentSearch = useCallback(
        (pathname: string) => `${pathname}${location.search}`,
        [location.search],
    );
    const detailsTab = useMemo<ClassDetailsTab>(() => {
        if (classSection && isManagementClassSection(classSection)) {
            return classSection;
        }

        return "details";
    }, [classSection]);
    const { setStatus, clearStatus } = useGlobalStatus();
    const userScopes = getUserScopes(user);
    const canPatchClasses = userScopes.includes("classes_patch");
    const canDeleteClasses = userScopes.includes("classes_delete");
    const canPatchRegistrations = userScopes.includes("registrations_patch");
    const canCreateSchedules = userScopes.includes("schedules_post");
    const canCreateSessions = userScopes.includes("sessions_post");
    const canViewFeedbacks = hasUserScope(user, "classes_feedbacks_get");

    useEffect(() => {
        if (!classSection || isManagementClassSection(classSection)) {
            return;
        }

        navigate(withCurrentSearch(getManagementClassRoute(decodedClassKey)), {
            replace: true,
        });
    }, [classSection, decodedClassKey, navigate, withCurrentSearch]);

    const [selectedClass, setSelectedClass] =
        useState<ManagementClassRow | null>(null);
    const [loading, setLoading] = useState(Boolean(decodedClassKey.trim()));
    const [error, setError] = useState<string | null>(null);

    const [classSchedules, setClassSchedules] = useState<
        ManagementScheduleRow[]
    >([]);
    const [showSchedulesAdvancedFilters, setShowSchedulesAdvancedFilters] =
        useState(true);
    const [schedulesClassOptions, setSchedulesClassOptions] = useState<
        InlineOption[]
    >([]);
    const [schedulesAccountOptions, setSchedulesAccountOptions] = useState<
        InlineOption[]
    >([]);
    const [schedulesEmployeeOptions, setSchedulesEmployeeOptions] = useState<
        InlineOption[]
    >([]);
    const [schedulesDayblockOptions, setSchedulesDayblockOptions] = useState<
        InlineOption[]
    >([]);
    const [schedulesFilterOptionsLoading, setSchedulesFilterOptionsLoading] =
        useState(false);
    const [schedulesSelectedMentorKey, setSchedulesSelectedMentorKey] =
        useState("");
    const [schedulesSelectedTaKey, setSchedulesSelectedTaKey] = useState("");
    const [schedulesSelectedAccountKey, setSchedulesSelectedAccountKey] =
        useState("");
    const [schedulesSelectedActive, setSchedulesSelectedActive] = useState<
        "true" | "false" | "all"
    >("true");
    const [schedulesSelectedType, setSchedulesSelectedType] = useState("");
    const [schedulesSelectedDay, setSchedulesSelectedDay] = useState("");
    const [schedulesSelectedDayblock, setSchedulesSelectedDayblock] =
        useState("");
    const [schedulesLoading, setSchedulesLoading] = useState(false);
    const [schedulesError, setSchedulesError] = useState<string | null>(null);
    const [schedulesRowCount, setSchedulesRowCount] = useState(
        DEFAULT_PAGE_SIZE + 1,
    );
    const [schedulesPage, setSchedulesPage] = useState(0);
    const [schedulesPageSize, setSchedulesPageSize] =
        useState(DEFAULT_PAGE_SIZE);
    const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
    const [createScheduleError, setCreateScheduleError] = useState<
        string | null
    >(null);

    const [classSessions, setClassSessions] = useState<SessionRow[]>([]);
    const [showSessionsAdvancedFilters, setShowSessionsAdvancedFilters] =
        useState(true);
    const [sessionsBeginDate, setSessionsBeginDate] = useState("");
    const [sessionsEndDate, setSessionsEndDate] = useState("");
    const [sessionsSelectedMentorKey, setSessionsSelectedMentorKey] =
        useState("");
    const [sessionsSelectedTaKey, setSessionsSelectedTaKey] = useState("");
    const [sessionsEmployeeOptions, setSessionsEmployeeOptions] = useState<
        InlineOption[]
    >([]);
    const [sessionsEmployeeOptionsLoading, setSessionsEmployeeOptionsLoading] =
        useState(false);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessionsError, setSessionsError] = useState<string | null>(null);
    const [sessionsRowCount, setSessionsRowCount] = useState(
        DEFAULT_PAGE_SIZE + 1,
    );
    const [selectedRecordingId, setSelectedRecordingId] = useState<
        string | null
    >(null);
    const [sessionsPage, setSessionsPage] = useState(0);
    const [sessionsPageSize, setSessionsPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [classSessionsOrder, setClassSessionsOrder] = useState<
        "asc" | "desc"
    >("desc");
    const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
    const [createSessionError, setCreateSessionError] = useState<string | null>(
        null,
    );
    const [classDeleteError, setClassDeleteError] = useState<string | null>(
        null,
    );
    const [groupOptions, setGroupOptions] = useState<InlineOption[]>([]);
    const [groupOptionsLoading, setGroupOptionsLoading] = useState(false);
    const [groupOptionsError, setGroupOptionsError] = useState<string | null>(
        null,
    );

    const [classTests, setClassTests] = useState<ManagementTestRow[]>([]);
    const [testsSearchQuery, setTestsSearchQuery] = useState("");
    const [testsDraft, setTestsDraft] = useState("");
    const [testsLoading, setTestsLoading] = useState(false);
    const [testsError, setTestsError] = useState<string | null>(null);
    const [testsRowCount, setTestsRowCount] = useState(DEFAULT_PAGE_SIZE + 1);
    const [testsPage, setTestsPage] = useState(0);
    const [testsPageSize, setTestsPageSize] = useState(DEFAULT_PAGE_SIZE);

    const [classFeedbacks, setClassFeedbacks] = useState<ClassFeedbackRow[]>(
        [],
    );
    const [feedbacksSearchQuery, setFeedbacksSearchQuery] = useState("");
    const [feedbacksDraft, setFeedbacksDraft] = useState("");
    const [showFeedbacksAdvancedFilters, setShowFeedbacksAdvancedFilters] =
        useState(false);
    const alignTableOptionsToLeft = Boolean(
        isBackgroundDetailView &&
            detailViewMode.floating &&
            detailViewMode.collapsed === "1",
    );
    const [feedbacksBeginDate, setFeedbacksBeginDate] = useState("");
    const [feedbacksEndDate, setFeedbacksEndDate] = useState("");
    const [feedbacksLoading, setFeedbacksLoading] = useState(false);
    const [feedbacksError, setFeedbacksError] = useState<string | null>(null);
    const [feedbacksRowCount, setFeedbacksRowCount] = useState(
        DEFAULT_PAGE_SIZE + 1,
    );
    const [feedbacksPage, setFeedbacksPage] = useState(0);
    const [feedbacksPageSize, setFeedbacksPageSize] =
        useState(DEFAULT_PAGE_SIZE);

    const [classRegistrations, setClassRegistrations] = useState<
        ClassRegistrationRow[]
    >([]);
    const [registrationsSearchQuery, setRegistrationsSearchQuery] =
        useState("");
    const [registrationsDraft, setRegistrationsDraft] = useState("");
    const [registrationsLoading, setRegistrationsLoading] = useState(false);
    const [registrationsError, setRegistrationsError] = useState<string | null>(
        null,
    );
    const [registrationsRowCount, setRegistrationsRowCount] = useState(
        DEFAULT_PAGE_SIZE + 1,
    );
    const [registrationsPage, setRegistrationsPage] = useState(0);
    const [registrationsPageSize, setRegistrationsPageSize] =
        useState(DEFAULT_PAGE_SIZE);
    const [classDetailError, setClassDetailError] = useState<string | null>(
        null,
    );
    const [showOutdatedDataDialog, setShowOutdatedDataDialog] = useState(false);
    const [classForm, setClassForm] = useState<ClassEditableForm | null>(null);
    const [classOriginal, setClassOriginal] =
        useState<ClassEditableForm | null>(null);
    const [pendingClassChanges, setPendingClassChanges] = useState<
        Record<string, unknown>
    >({});
    const [forceDateEndOverride, setForceDateEndOverride] = useState(false);
    const [editingRegistrationIds, setEditingRegistrationIds] = useState<
        Record<string, boolean>
    >({});
    const [registrationEditSnapshots, setRegistrationEditSnapshots] = useState<
        Record<string, ClassRegistrationRow>
    >({});
    const patchClassMutation = useMutation({
        mutationFn: ({
            classKey,
            payload,
        }: {
            classKey: string;
            payload: Record<string, unknown>;
        }) => patchManagementClass(classKey, payload),
        onSuccess: async (patched) => {
            if (!selectedClass) {
                return;
            }
            const updatedClass: ManagementClassRow = {
                ...selectedClass,
                ...patched,
                id: selectedClass.id,
            };
            setSelectedClass(updatedClass);
            await queryClient.invalidateQueries({
                queryKey: ["managementClassDetails"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClasses"],
            });
            const nextOriginal = toClassEditableForm(updatedClass);
            setClassForm(nextOriginal);
            setClassOriginal(nextOriginal);
            setPendingClassChanges({});
            setForceDateEndOverride(false);
        },
    });
    const classDetailSaving = patchClassMutation.isPending;
    const patchRegistrationMutation = useMutation({
        mutationFn: ({
            registrationKey,
            payload,
        }: {
            registrationKey: string;
            payload: Record<string, unknown>;
        }) => patchRegistration(registrationKey, payload),
    });
    const createClassSessionMutation = useMutation({
        mutationFn: (
            payload: CreateSessionDialogValues & { timestamp: string },
        ) => createManagementSession(payload),
    });
    const createClassScheduleMutation = useMutation({
        mutationFn: (values: CreateScheduleDialogValues) =>
            createManagementSchedule(values),
    });
    const deleteClassMutation = useMutation({
        mutationFn: (classKey: string) => deleteManagementClass(classKey),
    });
    const createSessionSaving = createClassSessionMutation.isPending;
    const createScheduleSaving = createClassScheduleMutation.isPending;
    const classDeleteLoading = deleteClassMutation.isPending;
    const classDetailsQuery = useQuery({
        queryKey: ["managementClassDetails", decodedClassKey],
        queryFn: () => fetchManagementClassDetails(decodedClassKey.trim()),
        enabled: Boolean(decodedClassKey.trim()),
    });
    const groupOptionsQuery = useQuery({
        queryKey: ["inlineGroupOptions"],
        queryFn: () => fetchInlineGroupOptions(),
        enabled: canPatchClasses,
    });
    const sessionsEmployeeOptionsQuery = useQuery({
        queryKey: ["inlineEmployeeOptions", "classDetailsSessions"],
        queryFn: () => fetchInlineEmployeeOptions(),
        enabled: showSessionsAdvancedFilters,
    });
    const schedulesFilterOptionsQuery = useQuery({
        queryKey: ["classSchedulesFilterOptions"],
        queryFn: async () => {
            const [classesData, employeesData, accountsData, dayblocksData] =
                await Promise.all([
                    fetchInlineSessionClassOptions(),
                    fetchInlineEmployeeOptions(),
                    fetchAccountOptions(),
                    fetchDayblockOptions(),
                ]);
            return { classesData, employeesData, accountsData, dayblocksData };
        },
        enabled: showSchedulesAdvancedFilters,
    });
    const schedulesDayblockOptionsQuery = useQuery({
        queryKey: ["dayblockOptions", "classDetails"],
        queryFn: () => fetchDayblockOptions(),
        enabled: detailsTab === "schedules",
    });

    useEffect(() => {
        const normalizedClassKey = decodedClassKey.trim();
        if (!normalizedClassKey) {
            setSelectedClass(null);
            setLoading(false);
            setError("Missing class identifier in URL.");
            return;
        }
        if (classDetailsQuery.error) {
            setSelectedClass(null);
            setError(
                classDetailsQuery.error instanceof Error
                    ? classDetailsQuery.error.message
                    : "Failed to load class details",
            );
            setLoading(false);
            return;
        }
        if (!classDetailsQuery.data) {
            setLoading(classDetailsQuery.isFetching);
            return;
        }
        const matchedClass = classDetailsQuery.data;
        const nextClass = {
            ...matchedClass,
            id: matchedClass.appsheet_key || "selected-class",
        };
        setSelectedClass(nextClass);
        setError(null);
        setLoading(false);
    }, [
        decodedClassKey,
        classDetailsQuery.data,
        classDetailsQuery.error,
        classDetailsQuery.isFetching,
    ]);

    useEffect(() => {
        if (!selectedClass) {
            return;
        }

        setSchedulesPage(0);
        setSchedulesPageSize(DEFAULT_PAGE_SIZE);
        setShowSchedulesAdvancedFilters(true);
        setSchedulesSelectedMentorKey("");
        setSchedulesSelectedTaKey("");
        setSchedulesSelectedAccountKey("");
        setSchedulesSelectedActive("true");
        setSchedulesSelectedType("");
        setSchedulesSelectedDay("");
        setSchedulesSelectedDayblock("");

        setSessionsPage(0);
        setShowSessionsAdvancedFilters(true);
        setClassSessionsOrder("desc");
        setTestsPage(0);
        setFeedbacksPage(0);
        setRegistrationsPage(0);
        setSelectedRecordingId(null);
        const initialForm = toClassEditableForm(selectedClass);
        setClassForm(initialForm);
        setClassOriginal(initialForm);
        setPendingClassChanges({});
        setForceDateEndOverride(false);
        setClassDetailError(null);
        setClassDeleteError(null);
    }, [selectedClass]);

    useEffect(() => {
        if (!canPatchClasses) {
            setGroupOptions([]);
            setGroupOptionsError(null);
            setGroupOptionsLoading(false);
            return;
        }
        if (groupOptionsQuery.error) {
            setGroupOptions([]);
            setGroupOptionsError(
                groupOptionsQuery.error instanceof Error
                    ? groupOptionsQuery.error.message
                    : "Failed to load group options",
            );
            setGroupOptionsLoading(false);
            return;
        }
        if (!groupOptionsQuery.data) {
            setGroupOptionsLoading(groupOptionsQuery.isFetching);
            return;
        }
        setGroupOptions(groupOptionsQuery.data);
        setGroupOptionsError(null);
        setGroupOptionsLoading(groupOptionsQuery.isFetching);
    }, [
        canPatchClasses,
        groupOptionsQuery.data,
        groupOptionsQuery.error,
        groupOptionsQuery.isFetching,
    ]);

    const loadSchedulesForClass = async (appsheetKey: string) => {
        if (!appsheetKey.trim()) {
            setClassSchedules([]);
            setSchedulesError("Missing class key for selected class");
            return;
        }
        setSchedulesError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementClassSchedules", appsheetKey],
        });
        await classSchedulesQuery.refetch();
    };

    const loadSessionsForClass = async () => {
        if (!selectedClass) {
            return;
        }
        setSessionsError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementClassSessions", selectedClass.appsheet_key],
        });
        await classSessionsQuery.refetch();
    };

    const loadTestsForClass = async () => {
        if (!selectedClass) {
            return;
        }
        setTestsError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementClassTests", selectedClass.appsheet_key],
        });
        await classTestsQuery.refetch();
    };

    const loadFeedbacksForClass = async (appsheetKey: string) => {
        setFeedbacksError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementClassFeedbacks", appsheetKey],
        });
        await classFeedbacksQuery.refetch();
    };

    const loadRegistrationsForClass = async (classKey: string) => {
        setRegistrationsError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementClassRegistrations", classKey],
        });
        await classRegistrationsQuery.refetch();
    };

    useEffect(() => {
        if (!showSessionsAdvancedFilters) {
            setSessionsEmployeeOptions([]);
            setSessionsEmployeeOptionsLoading(false);
            return;
        }
        if (sessionsEmployeeOptionsQuery.error) {
            setSessionsEmployeeOptions([]);
            setSessionsEmployeeOptionsLoading(false);
            return;
        }
        if (!sessionsEmployeeOptionsQuery.data) {
            setSessionsEmployeeOptionsLoading(
                sessionsEmployeeOptionsQuery.isFetching,
            );
            return;
        }
        setSessionsEmployeeOptions(sessionsEmployeeOptionsQuery.data);
        setSessionsEmployeeOptionsLoading(
            sessionsEmployeeOptionsQuery.isFetching,
        );
    }, [
        showSessionsAdvancedFilters,
        sessionsEmployeeOptionsQuery.data,
        sessionsEmployeeOptionsQuery.error,
        sessionsEmployeeOptionsQuery.isFetching,
    ]);

    useEffect(() => {
        if (!showSchedulesAdvancedFilters) {
            return;
        }
        if (schedulesFilterOptionsQuery.error) {
            setSchedulesClassOptions([]);
            setSchedulesEmployeeOptions([]);
            setSchedulesAccountOptions([]);
            setSchedulesDayblockOptions([]);
            setSchedulesFilterOptionsLoading(false);
            return;
        }
        if (!schedulesFilterOptionsQuery.data) {
            setSchedulesFilterOptionsLoading(
                schedulesFilterOptionsQuery.isFetching,
            );
            return;
        }
        setSchedulesClassOptions(schedulesFilterOptionsQuery.data.classesData);
        setSchedulesEmployeeOptions(
            schedulesFilterOptionsQuery.data.employeesData,
        );
        setSchedulesAccountOptions(
            schedulesFilterOptionsQuery.data.accountsData,
        );
        setSchedulesDayblockOptions(
            schedulesFilterOptionsQuery.data.dayblocksData,
        );
        setSchedulesFilterOptionsLoading(
            schedulesFilterOptionsQuery.isFetching,
        );
    }, [
        showSchedulesAdvancedFilters,
        schedulesFilterOptionsQuery.data,
        schedulesFilterOptionsQuery.error,
        schedulesFilterOptionsQuery.isFetching,
    ]);

    useEffect(() => {
        if (detailsTab !== "schedules") {
            return;
        }
        if (schedulesDayblockOptionsQuery.error) {
            return;
        }
        if (!schedulesDayblockOptionsQuery.data) {
            return;
        }
        setSchedulesDayblockOptions(schedulesDayblockOptionsQuery.data);
    }, [
        detailsTab,
        schedulesDayblockOptionsQuery.data,
        schedulesDayblockOptionsQuery.error,
    ]);

    const classSchedulesQuery = useQuery({
        queryKey: [
            "managementClassSchedules",
            selectedClass?.appsheet_key,
            schedulesPage,
            schedulesPageSize,
            schedulesSelectedMentorKey,
            schedulesSelectedTaKey,
            schedulesSelectedAccountKey,
            schedulesSelectedActive,
            schedulesSelectedType,
            schedulesSelectedDay,
            schedulesSelectedDayblock,
        ],
        queryFn: async () => {
            const appsheetKey = selectedClass?.appsheet_key ?? "";
            const limit = schedulesPageSize;
            const offset = schedulesPage * schedulesPageSize;
            const normalizedMentorKey = schedulesSelectedMentorKey.trim();
            const normalizedTaKey = schedulesSelectedTaKey.trim();
            const normalizedAccountKey = schedulesSelectedAccountKey.trim();
            const normalizedType = schedulesSelectedType.trim();
            const normalizedDay = schedulesSelectedDay.trim();
            const normalizedDayblock = schedulesSelectedDayblock.trim();
            const activeFilter =
                schedulesSelectedActive === "all"
                    ? undefined
                    : schedulesSelectedActive === "true";
            const requestFilters = {
                mentorKey: normalizedMentorKey || undefined,
                taKey: normalizedTaKey || undefined,
                accountKey: normalizedAccountKey || undefined,
                active: activeFilter,
                type: normalizedType || undefined,
                day: normalizedDay || undefined,
                dayblock: normalizedDayblock || undefined,
            };
            const data = await fetchManagementClassSchedules(
                appsheetKey,
                limit,
                offset,
                requestFilters,
            );
            return { data, limit, offset };
        },
        enabled:
            Boolean(selectedClass?.appsheet_key) && detailsTab === "schedules",
    });

    const classSessionsQuery = useQuery({
        queryKey: [
            "managementClassSessions",
            selectedClass?.appsheet_key,
            sessionsPage,
            sessionsPageSize,
            sessionsBeginDate,
            sessionsEndDate,
            sessionsSelectedMentorKey,
            sessionsSelectedTaKey,
            classSessionsOrder,
        ],
        queryFn: async () => {
            const appsheetKey = selectedClass?.appsheet_key ?? "";
            const limit = sessionsPageSize;
            const offset = sessionsPage * sessionsPageSize;
            const begin = toBackendBoundary(sessionsBeginDate, "start");
            const end = toBackendBoundary(sessionsEndDate, "end");
            const normalizedMentorKey = sessionsSelectedMentorKey.trim();
            const normalizedTaKey = sessionsSelectedTaKey.trim();
            const data = await fetchManagementClassSessions(
                appsheetKey,
                limit,
                offset,
                {
                    begin,
                    end,
                    mentorKey: normalizedMentorKey || undefined,
                    taKey: normalizedTaKey || undefined,
                    order: classSessionsOrder,
                },
            );
            return { data, limit, offset };
        },
        enabled:
            Boolean(selectedClass?.appsheet_key) && detailsTab === "sessions",
    });

    const classTestsQuery = useQuery({
        queryKey: [
            "managementClassTests",
            selectedClass?.appsheet_key,
            testsPage,
            testsPageSize,
        ],
        queryFn: async () => {
            const appsheetKey = selectedClass?.appsheet_key ?? "";
            const limit = testsPageSize;
            const offset = testsPage * testsPageSize;
            const data = await fetchManagementClassTests(
                appsheetKey,
                limit,
                offset,
            );
            return { data, limit, offset };
        },
        enabled: Boolean(selectedClass?.appsheet_key) && detailsTab === "tests",
    });

    const classRegistrationsQuery = useQuery({
        queryKey: [
            "managementClassRegistrations",
            selectedClass?.appsheet_key,
            registrationsPage,
            registrationsPageSize,
        ],
        queryFn: async () => {
            const appsheetKey = selectedClass?.appsheet_key ?? "";
            const limit = registrationsPageSize;
            const offset = registrationsPage * registrationsPageSize;
            const data = await fetchManagementClassRegistrations(
                appsheetKey,
                limit,
                offset,
            );
            return { data, limit, offset };
        },
        enabled:
            Boolean(selectedClass?.appsheet_key) &&
            detailsTab === "registrations",
    });

    const classFeedbacksQuery = useQuery({
        queryKey: [
            "managementClassFeedbacks",
            selectedClass?.appsheet_key,
            feedbacksPage,
            feedbacksPageSize,
            feedbacksBeginDate,
            feedbacksEndDate,
        ],
        queryFn: async () => {
            const appsheetKey = selectedClass?.appsheet_key ?? "";
            const limit = feedbacksPageSize;
            const offset = feedbacksPage * feedbacksPageSize;
            const begin = toBackendBoundary(feedbacksBeginDate, "start");
            const end = toBackendBoundary(feedbacksEndDate, "end");
            const data = await fetchManagementClassFeedbacks(
                appsheetKey,
                limit,
                offset,
                begin,
                end,
            );
            return { data, limit, offset };
        },
        enabled:
            Boolean(selectedClass?.appsheet_key) &&
            detailsTab === "feedbacks" &&
            canViewFeedbacks,
    });

    useEffect(() => {
        if (detailsTab === "schedules") {
            setSchedulesLoading(classSchedulesQuery.isFetching);
            if (classSchedulesQuery.error) {
                setSchedulesError(
                    classSchedulesQuery.error instanceof Error
                        ? classSchedulesQuery.error.message
                        : "Failed to load class schedules",
                );
                return;
            }
            if (!classSchedulesQuery.data) {
                return;
            }
            setSchedulesError(null);
            const { data, limit, offset } = classSchedulesQuery.data;
            const schedulesWithIds = data.map((schedule, index) => ({
                ...schedule,
                id:
                    schedule.appsheet_key ||
                    `${schedule.type}-${schedule.day}-${schedule.time_start}-${offset + index}`,
            }));
            setClassSchedules(schedulesWithIds);
            setSchedulesRowCount(
                data.length < limit ? offset + data.length : offset + limit + 1,
            );
            return;
        }

        if (detailsTab === "sessions") {
            setSessionsLoading(classSessionsQuery.isFetching);
            if (classSessionsQuery.error) {
                setSessionsError(
                    classSessionsQuery.error instanceof Error
                        ? classSessionsQuery.error.message
                        : "Failed to load class sessions",
                );
                return;
            }
            if (!classSessionsQuery.data) {
                return;
            }
            setSessionsError(null);
            const { data, limit, offset } = classSessionsQuery.data;
            setClassSessions(toSessionRows(data, offset));
            setSessionsRowCount(
                data.length < limit ? offset + data.length : offset + limit + 1,
            );
            return;
        }

        if (detailsTab === "tests") {
            setTestsLoading(classTestsQuery.isFetching);
            if (classTestsQuery.error) {
                setTestsError(
                    classTestsQuery.error instanceof Error
                        ? classTestsQuery.error.message
                        : "Failed to load tests",
                );
                return;
            }
            if (!classTestsQuery.data || !selectedClass) {
                return;
            }
            setTestsError(null);
            const { data, limit, offset } = classTestsQuery.data;
            setClassTests(
                data.map((item, index) => ({
                    ...item,
                    id:
                        item.appsheet_key ||
                        `${selectedClass.appsheet_key}-${offset + index}`,
                })),
            );
            setTestsRowCount(
                data.length < limit ? offset + data.length : offset + limit + 1,
            );
            return;
        }

        if (detailsTab === "registrations") {
            setRegistrationsLoading(classRegistrationsQuery.isFetching);
            if (classRegistrationsQuery.error) {
                setRegistrationsError(
                    classRegistrationsQuery.error instanceof Error
                        ? classRegistrationsQuery.error.message
                        : "Failed to load registrations",
                );
                return;
            }
            if (!classRegistrationsQuery.data) {
                return;
            }
            setRegistrationsError(null);
            const { data, limit, offset } = classRegistrationsQuery.data;
            const registrationsWithIds = data.map((registration, index) => ({
                ...registration,
                id:
                    registration.appsheet_key ||
                    `${registration.student_name}-${registration.class_name}-${offset + index}`,
            }));
            setClassRegistrations(registrationsWithIds);
            setEditingRegistrationIds({});
            setRegistrationEditSnapshots({});
            setRegistrationsRowCount(
                data.length < limit ? offset + data.length : offset + limit + 1,
            );
            return;
        }

        if (detailsTab === "feedbacks" && canViewFeedbacks) {
            setFeedbacksLoading(classFeedbacksQuery.isFetching);
            if (classFeedbacksQuery.error) {
                setFeedbacksError(
                    classFeedbacksQuery.error instanceof Error
                        ? classFeedbacksQuery.error.message
                        : "Failed to load feedbacks",
                );
                return;
            }
            if (!classFeedbacksQuery.data) {
                return;
            }
            setFeedbacksError(null);
            const { data, limit, offset } = classFeedbacksQuery.data;
            const feedbacksWithIds = data.map((fb, index) => ({
                ...fb,
                id:
                    fb.appsheet_key ||
                    fb.id ||
                    getFeedbackTimestamp(fb) ||
                    `${fb.student_name || "feedback"}-${offset + index}`,
            }));
            setClassFeedbacks(feedbacksWithIds);
            setFeedbacksRowCount(
                data.length < limit ? offset + data.length : offset + limit + 1,
            );
        }
    }, [
        detailsTab,
        selectedClass,
        classSchedulesQuery.data,
        classSchedulesQuery.error,
        classSchedulesQuery.isFetching,
        classSessionsQuery.data,
        classSessionsQuery.error,
        classSessionsQuery.isFetching,
        classTestsQuery.data,
        classTestsQuery.error,
        classTestsQuery.isFetching,
        classRegistrationsQuery.data,
        classRegistrationsQuery.error,
        classRegistrationsQuery.isFetching,
        classFeedbacksQuery.data,
        classFeedbacksQuery.error,
        classFeedbacksQuery.isFetching,
        canViewFeedbacks,
    ]);

    const filteredClassTests = useMemo(() => {
        const query = testsSearchQuery.trim().toLowerCase();
        return classTests.filter((test) => {
            if (query) {
                const matchesSearch =
                    test.name?.toLowerCase().includes(query) ||
                    test.group_name?.toLowerCase().includes(query) ||
                    formatUserTimestamp(test.timestamp ?? undefined)
                        .toLowerCase()
                        .includes(query);
                if (!matchesSearch) {
                    return false;
                }
            }
            return true;
        });
    }, [classTests, testsSearchQuery]);

    const filteredClassFeedbacks = useMemo(() => {
        const query = feedbacksSearchQuery.trim().toLowerCase();
        return classFeedbacks.filter((feedback) => {
            if (query) {
                const matchesSearch =
                    feedback.student_name?.toLowerCase().includes(query) ||
                    feedback.class_name?.toLowerCase().includes(query) ||
                    feedback.request?.toLowerCase().includes(query) ||
                    feedback.feedback_extra?.toLowerCase().includes(query) ||
                    formatUserTimestamp(getFeedbackTimestamp(feedback))
                        .toLowerCase()
                        .includes(query);
                if (!matchesSearch) {
                    return false;
                }
            }
            return true;
        });
    }, [classFeedbacks, feedbacksSearchQuery]);

    const filteredClassRegistrations = useMemo(() => {
        if (!registrationsSearchQuery.trim()) {
            return classRegistrations;
        }

        const query = registrationsSearchQuery.toLowerCase();
        return classRegistrations.filter(
            (item) =>
                item.student_name?.toLowerCase().includes(query) ||
                item.class_name?.toLowerCase().includes(query) ||
                item.status?.toLowerCase().includes(query) ||
                item.target?.toLowerCase().includes(query) ||
                item.target_detail?.toLowerCase().includes(query) ||
                (item.sessions?.toString() || "").includes(query),
        );
    }, [classRegistrations, registrationsSearchQuery]);

    const handleRegistrationEditClick = (id: string) => {
        setRegistrationsError(null);
        const currentRow = classRegistrations.find((row) => row.id === id);
        if (currentRow) {
            setRegistrationEditSnapshots((prev) => ({
                ...prev,
                [id]: { ...currentRow },
            }));
        }
        setEditingRegistrationIds((prev) => ({ ...prev, [id]: true }));
    };

    const handleRegistrationCancelClick = (id: string) => {
        const snapshot = registrationEditSnapshots[id];
        if (snapshot) {
            setClassRegistrations((prev) =>
                prev.map((row) => (row.id === id ? snapshot : row)),
            );
        }
        setEditingRegistrationIds((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
        setRegistrationEditSnapshots((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handleRegistrationFieldChange = <
        K extends keyof ClassRegistrationRow,
    >(
        id: string,
        field: K,
        value: ClassRegistrationRow[K],
    ) => {
        setClassRegistrations((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row,
            ),
        );
    };

    const processRegistrationRowUpdate = async (
        newRow: ClassRegistrationRow,
        oldRow: ClassRegistrationRow,
    ) => {
        const payload: Record<string, unknown> = {};
        if (newRow.sessions !== oldRow.sessions)
            payload.sessions = newRow.sessions ?? null;
        if (newRow.target !== oldRow.target)
            payload.target = newRow.target || null;
        if (newRow.target_detail !== oldRow.target_detail)
            payload.target_detail = newRow.target_detail || null;
        if (newRow.status !== oldRow.status)
            payload.status = newRow.status || null;
        if (Object.keys(payload).length === 0) return oldRow;
        payload.edited_at = oldRow.edited_at ?? null;
        const patched = await patchRegistrationMutation.mutateAsync({
            registrationKey: String(oldRow.appsheet_key),
            payload,
        });
        const updatedRow: ClassRegistrationRow = {
            ...(oldRow as ClassRegistrationRow),
            ...patched,
            id: String(oldRow.id),
        };
        setClassRegistrations((prev) =>
            prev.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
        );
        return updatedRow;
    };

    const handleRegistrationSaveClick = async (id: string) => {
        const currentRow = classRegistrations.find((row) => row.id === id);
        const originalRow = registrationEditSnapshots[id] ?? currentRow;
        if (!currentRow || !originalRow) {
            return;
        }

        try {
            setRegistrationsError(null);
            await processRegistrationRowUpdate(currentRow, originalRow);
            setEditingRegistrationIds((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            setRegistrationEditSnapshots((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } catch (err) {
            setRegistrationsError(
                err instanceof Error
                    ? err.message
                    : "Failed to update registration",
            );
        }
    };

    const handleClassFieldChange = <K extends keyof ClassEditableForm>(
        field: K,
        value: ClassEditableForm[K],
    ) => {
        setClassDetailError(null);
        setClassForm((prev) => {
            if (!prev || !classOriginal) {
                return prev;
            }
            const next = { ...prev, [field]: value };
            let nextForceDateEndOverride = forceDateEndOverride;
            if (field === "date_end") {
                const normalizedValue = String(value ?? "").trim();
                const normalizedOriginalDateEnd = classOriginal.date_end.trim();

                if (
                    selectedClass?.expected &&
                    normalizedValue === normalizedOriginalDateEnd
                ) {
                    nextForceDateEndOverride = true;
                } else if (normalizedValue !== normalizedOriginalDateEnd) {
                    nextForceDateEndOverride = false;
                } else if (!selectedClass?.expected) {
                    nextForceDateEndOverride = false;
                }

                setForceDateEndOverride(nextForceDateEndOverride);
            }
            setPendingClassChanges(
                buildClassPatchWithOverrides(next, classOriginal, {
                    forceDateEndOverride: nextForceDateEndOverride,
                }),
            );
            return next;
        });
    };

    const cancelClassDetailChanges = () => {
        if (!classOriginal) {
            return;
        }
        setClassForm(classOriginal);
        setPendingClassChanges({});
        setForceDateEndOverride(false);
        setClassDetailError(null);
    };

    const handleClassDetailPatch = async () => {
        if (!selectedClass?.appsheet_key) {
            setClassDetailError("Missing class key");
            return;
        }

        if (Object.keys(pendingClassChanges).length === 0) {
            return;
        }

        try {
            setClassDetailError(null);
            await patchClassMutation.mutateAsync({
                classKey: selectedClass.appsheet_key,
                payload: {
                    ...pendingClassChanges,
                    edited_at: selectedClass.edited_at ?? null,
                },
            });
        } catch (err) {
            if (isOutdatedEditedAtConflictError(err)) {
                setShowOutdatedDataDialog(true);
                return;
            }
            setClassDetailError(
                err instanceof Error ? err.message : "Failed to update class",
            );
        }
    };

    const refreshOutdatedClassData = async () => {
        setShowOutdatedDataDialog(false);
        setClassDetailError(null);
        setPendingClassChanges({});
        setForceDateEndOverride(false);
        await classDetailsQuery.refetch();
    };

    const handleCreateSession = async (values: CreateSessionDialogValues) => {
        try {
            setCreateSessionError(null);
            const timestamp = toBackendTimestamp(values.timestamp);
            if (!timestamp) {
                throw new Error("Invalid session timestamp");
            }
            await createClassSessionMutation.mutateAsync({
                ...values,
                timestamp,
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementSessions", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassSessions", user?.username],
            });
            setIsCreateSessionOpen(false);
            await loadSessionsForClass();
        } catch (err) {
            setCreateSessionError(
                err instanceof Error ? err.message : "Failed to create session",
            );
        }
    };

    const handleCreateSchedule = async (values: CreateScheduleDialogValues) => {
        if (!selectedClass?.appsheet_key?.trim()) {
            setCreateScheduleError("Missing class key");
            return;
        }

        try {
            setCreateScheduleError(null);
            await createClassScheduleMutation.mutateAsync(values);
            await queryClient.invalidateQueries({
                queryKey: ["managementSchedules", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassSchedules", user?.username],
            });
            setIsCreateScheduleOpen(false);
            setSchedulesPage(0);
            await loadSchedulesForClass(selectedClass.appsheet_key);
        } catch (err) {
            setCreateScheduleError(
                err instanceof Error
                    ? err.message
                    : "Failed to create schedule",
            );
        }
    };

    const handleDeleteClass = async () => {
        if (!selectedClass || !selectedClass.appsheet_key.trim()) {
            setClassDeleteError("Missing class key");
            return;
        }

        const classLabel = selectedClass.name || selectedClass.appsheet_key;
        if (!window.confirm(`Delete class "${classLabel}"?`)) {
            return;
        }

        try {
            setClassDeleteError(null);
            await deleteClassMutation.mutateAsync(selectedClass.appsheet_key);
            await queryClient.invalidateQueries({
                queryKey: ["managementClasses", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassDetails", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassSchedules", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassSessions", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassTests", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassRegistrations", user?.username],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassFeedbacks", user?.username],
            });
            navigate(returnUrl ?? MANAGEMENT_CLASSES_ROUTE);
        } catch (err) {
            setClassDeleteError(
                err instanceof Error ? err.message : "Failed to delete class",
            );
        }
    };

    const scheduleColumns = useMemo<
        SimpleDataTableColumn<ManagementScheduleRow>[]
    >(
        () => [
            {
                id: "time_start",
                header: "Start Time",
                className: "min-w-[120px]",
                render: (row) => row.time_start || "-",
            },
            {
                id: "time_end",
                header: "End Time",
                className: "min-w-[120px]",
                render: (row) => row.time_end || "-",
            },
            {
                id: "day",
                header: "Day of Week",
                className: "min-w-[140px]",
                render: (row) => row.day || "-",
            },
            {
                id: "dayblock",
                header: "Day block",
                className: "min-w-[140px]",
                render: (row) => {
                    const dayblockKey = row.dayblock_key ?? row.dayblock;
                    const matched = dayblockKey
                        ? schedulesDayblockOptions.find(
                              (option) => option.value === dayblockKey,
                          )
                        : undefined;
                    return (
                        row.dayblock_name || matched?.name || dayblockKey || "-"
                    );
                },
            },
            {
                id: "date_start",
                header: "Date Start",
                className: "min-w-[140px]",
                render: (row) => formatDate(row.date_start ?? undefined),
            },
            {
                id: "date_end",
                header: "Date End",
                className: "min-w-[140px]",
                render: (row) => formatDate(row.date_end ?? undefined),
            },
            {
                id: "mentor_name",
                header: "Mentor",
                className: "min-w-[160px]",
                render: (row) => row.mentor_name || "-",
            },
            {
                id: "ta_name",
                header: "Teaching Assistant",
                className: "min-w-[170px]",
                render: (row) => row.ta_name || "-",
            },
            {
                id: "account",
                header: "Account",
                className: "min-w-[150px]",
                render: (row) => row.account || "-",
            },
            {
                id: "inactive",
                header: "Inactive",
                className: "w-[110px]",
                render: (row) => (row.inactive ? "Yes" : "No"),
            },
        ],
        [schedulesDayblockOptions],
    );

    const sessionColumns = useMemo<SimpleDataTableColumn<SessionRow>[]>(
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

    const testColumns = useMemo<SimpleDataTableColumn<ManagementTestRow>[]>(
        () => [
            {
                id: "name",
                header: "Test Name",
                className: "min-w-[220px]",
                cellClassName: "font-medium text-foreground",
                render: (row) => row.name || "-",
            },
            {
                id: "group_name",
                header: "Test Group",
                className: "min-w-[180px]",
                render: (row) => row.group_name || "-",
            },
            {
                id: "timestamp",
                header: "Timestamp",
                className: "min-w-[180px]",
                render: (row) =>
                    formatUserTimestamp(row.timestamp ?? undefined),
            },
        ],
        [],
    );

    const feedbackColumns = useMemo<SimpleDataTableColumn<ClassFeedbackRow>[]>(
        () => [
            {
                id: "student_name",
                header: "Student",
                className: "min-w-[220px]",
                cellClassName: "font-medium text-foreground",
                render: (row) => row.student_name || "-",
            },
            {
                id: "timestamp",
                header: "Timestamp",
                className: "min-w-[220px]",
                render: (row) => formatUserTimestamp(getFeedbackTimestamp(row)),
            },
        ],
        [],
    );

    const registrationColumns = useMemo<
        SimpleDataTableColumn<ClassRegistrationRow>[]
    >(() => {
        const columns: SimpleDataTableColumn<ClassRegistrationRow>[] = [
            {
                id: "student_name",
                header: "Student",
                className: "min-w-[180px]",
                render: (row) => row.student_name || "-",
            },
            {
                id: "class_name",
                header: "Class",
                className: "min-w-[180px]",
                render: (row) => row.class_name || "-",
            },
            {
                id: "sessions",
                header: "Sessions",
                className: "w-[120px]",
                render: (row) => {
                    const isEditing = Boolean(editingRegistrationIds[row.id]);
                    return isEditing ? (
                        <Input
                            type="number"
                            value={row.sessions ?? ""}
                            onChange={(event) =>
                                handleRegistrationFieldChange(
                                    row.id,
                                    "sessions",
                                    event.target.value === ""
                                        ? (null as never)
                                        : (Number(event.target.value) as never),
                                )
                            }
                            className="w-24"
                        />
                    ) : (
                        (row.sessions ?? "-")
                    );
                },
            },
            {
                id: "target",
                header: "Target",
                className: "min-w-[180px]",
                render: (row) => {
                    const isEditing = Boolean(editingRegistrationIds[row.id]);
                    return isEditing ? (
                        <Input
                            value={row.target ?? ""}
                            onChange={(event) =>
                                handleRegistrationFieldChange(
                                    row.id,
                                    "target",
                                    event.target.value as never,
                                )
                            }
                        />
                    ) : (
                        row.target || "-"
                    );
                },
            },
            {
                id: "target_detail",
                header: "Target Detail",
                className: "min-w-[260px]",
                render: (row) => {
                    const isEditing = Boolean(editingRegistrationIds[row.id]);
                    return isEditing ? (
                        <Textarea
                            value={row.target_detail ?? ""}
                            onChange={(event) =>
                                handleRegistrationFieldChange(
                                    row.id,
                                    "target_detail",
                                    event.target.value as never,
                                )
                            }
                            rows={getTextareaRows(row.target_detail, 2)}
                            className="min-h-0 resize-y leading-6"
                        />
                    ) : (
                        <div className="whitespace-pre-wrap break-words text-sm leading-6">
                            {row.target_detail || "-"}
                        </div>
                    );
                },
            },
            {
                id: "status",
                header: "Status",
                className: "min-w-[150px]",
                render: (row) => {
                    const isEditing = Boolean(editingRegistrationIds[row.id]);
                    return isEditing ? (
                        <SearchableSelect
                            value={row.status ?? ""}
                            onValueChange={(value) =>
                                handleRegistrationFieldChange(
                                    row.id,
                                    "status",
                                    value as never,
                                )
                            }
                            options={[
                                { value: "", label: "-- Status --" },
                                ...["Active", "Recruiting", "Completed"].map(
                                    (option) => ({
                                        value: option,
                                        label: option,
                                    }),
                                ),
                            ]}
                            placeholder="-- Status --"
                            searchPlaceholder="Search status..."
                        />
                    ) : (
                        row.status || "-"
                    );
                },
            },
        ];

        if (canPatchRegistrations) {
            columns.push({
                id: "actions",
                header: "Actions",
                className: "w-[190px]",
                cellClassName: "text-right",
                render: (row) => {
                    const isEditing = Boolean(editingRegistrationIds[row.id]);
                    return isEditing ? (
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                    void handleRegistrationSaveClick(row.id)
                                }
                            >
                                <Save className="size-4" />
                                Save
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleRegistrationCancelClick(row.id)
                                }
                            >
                                <X className="size-4" />
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegistrationEditClick(row.id)}
                        >
                            <Edit3 className="size-4" />
                            Edit
                        </Button>
                    );
                },
            });
        }

        return columns;
    }, [
        canPatchRegistrations,
        editingRegistrationIds,
        registrationEditSnapshots,
        classRegistrations,
    ]);

    const defaultClassSessionTimestamp = dayjs(sessionsBeginDate || undefined)
        .hour(9)
        .minute(0)
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm");
    const defaultScheduleDateStart = selectedClass?.date_start ?? "";
    const defaultScheduleDateEnd = selectedClass?.date_end ?? "";
    const pendingClassCount =
        Object.keys(pendingClassChanges).length > 0 ? 1 : 0;
    const detailsTabLabel =
        pendingClassCount > 0 ? `Details (${pendingClassCount})` : "Details";
    const hasClassFieldChanged = (field: keyof ClassEditableForm) =>
        Boolean(classForm) &&
        Boolean(classOriginal) &&
        (classForm?.[field] !== classOriginal?.[field] ||
            (field === "date_end" && forceDateEndOverride));

    useEffect(() => {
        if (classDetailError) {
            setStatus(classDetailError, "error");
            return;
        }

        if (classDeleteError) {
            setStatus(classDeleteError, "error");
            return;
        }

        if (groupOptionsError) {
            setStatus(groupOptionsError, "error");
            return;
        }

        if (createScheduleError) {
            setStatus(createScheduleError, "error");
            return;
        }

        if (createSessionError) {
            setStatus(createSessionError, "error");
            return;
        }

        if (error || (!loading && !selectedClass)) {
            setStatus(
                error ?? "Class not found for the selected URL.",
                "error",
            );
            return;
        }

        if (loading) {
            setStatus("Loading class details...");
            return;
        }

        if (detailsTab === "schedules") {
            if (schedulesError) {
                setStatus(schedulesError, "error");
                return;
            }
            if (schedulesLoading || schedulesFilterOptionsLoading) {
                setStatus("Loading schedules...");
                return;
            }
        }

        if (detailsTab === "sessions") {
            if (sessionsError) {
                setStatus(sessionsError, "error");
                return;
            }
            if (sessionsLoading) {
                setStatus("Loading sessions...");
                return;
            }
        }

        if (detailsTab === "tests") {
            if (testsError) {
                setStatus(testsError, "error");
                return;
            }
            if (testsLoading) {
                setStatus("Loading tests...");
                return;
            }
        }

        if (detailsTab === "registrations") {
            if (registrationsError) {
                setStatus(registrationsError, "error");
                return;
            }
            if (registrationsLoading) {
                setStatus("Loading registrations...");
                return;
            }
        }

        if (detailsTab === "feedbacks") {
            if (feedbacksError) {
                setStatus(feedbacksError, "error");
                return;
            }
            if (feedbacksLoading) {
                setStatus("Loading feedbacks...");
                return;
            }
        }

        clearStatus();
    }, [
        classDetailError,
        classDeleteError,
        clearStatus,
        createScheduleError,
        createSessionError,
        detailsTab,
        error,
        groupOptionsError,
        feedbacksError,
        feedbacksLoading,
        loading,
        registrationsError,
        registrationsLoading,
        schedulesError,
        schedulesFilterOptionsLoading,
        schedulesLoading,
        selectedClass,
        sessionsError,
        sessionsLoading,
        setStatus,
        testsError,
        testsLoading,
    ]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    if (loading || !selectedClass) {
        return <DetailLoadingView title="Loading class details..." />;
    }

    if (error) {
        return <DetailLoadingView title="Loading class details..." />;
    }

    return (
        <DetailView className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
            <DetailHeader
                breadcrumbs={
                    <DetailBreadcrumbs
                        items={[
                            {
                                label: "Classes",
                                onClick: () =>
                                    navigate(
                                        returnUrl ?? MANAGEMENT_CLASSES_ROUTE,
                                    ),
                            },
                        ]}
                        current={selectedClass.name}
                    />
                }
                actions={
                    canDeleteClasses ? (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleDeleteClass()}
                            disabled={
                                classDeleteLoading ||
                                classDetailSaving ||
                                !selectedClass.appsheet_key.trim()
                            }
                        >
                            <Trash2 className="size-4" />
                            {classDeleteLoading ? "Deleting..." : "Delete"}
                        </Button>
                    ) : null
                }
            />

            <DetailTabbedSection
                tabs={[
                    {
                        value: "details",
                        label: detailsTabLabel,
                        hasPendingChanges: pendingClassCount > 0,
                    },
                    { value: "schedules", label: "Schedules" },
                    { value: "sessions", label: "Sessions" },
                    { value: "tests", label: "Tests" },
                    { value: "registrations", label: "Registrations" },
                    ...(canViewFeedbacks
                        ? [{ value: "feedbacks" as const, label: "Feedbacks" }]
                        : []),
                ]}
                activeTab={detailsTab}
                onChange={(nextTab) => {
                    if (!isManagementClassSection(nextTab)) {
                        return;
                    }

                    navigate(
                        withCurrentSearch(
                            getManagementClassRoute(
                                selectedClass.appsheet_key,
                                nextTab,
                            ),
                        ),
                    );
                }}
                className="flex min-h-0 flex-1 flex-col"
                contentClassName="min-h-0 overflow-y-auto overflow-x-hidden pr-1"
            >
                {detailsTab === "details" && (
                    <>
                        {classForm && (
                            <DetailFieldsTable
                                rows={[
                                    {
                                        label: "Group",
                                        value: (
                                            <SearchableSelect
                                                value={classForm.group_key}
                                                onValueChange={(value) =>
                                                    handleClassFieldChange(
                                                        "group_key",
                                                        value,
                                                    )
                                                }
                                                className={
                                                    hasClassFieldChanged(
                                                        "group_key",
                                                    )
                                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                        : undefined
                                                }
                                                disabled={
                                                    !canPatchClasses ||
                                                    classDetailSaving ||
                                                    groupOptionsLoading
                                                }
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "-- Group --",
                                                    },
                                                    ...groupOptions.map(
                                                        (option) => ({
                                                            value: option.value,
                                                            label: option.name,
                                                        }),
                                                    ),
                                                ]}
                                                placeholder="-- Group --"
                                                searchPlaceholder="Search group..."
                                            />
                                        ),
                                    },
                                    {
                                        label: "Class Name",
                                        value: (
                                            <Input
                                                className={`h-10 ${hasClassFieldChanged("class_name") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                                value={classForm.class_name}
                                                onChange={(event) =>
                                                    handleClassFieldChange(
                                                        "class_name",
                                                        event.target.value,
                                                    )
                                                }
                                                disabled={
                                                    !canPatchClasses ||
                                                    classDetailSaving
                                                }
                                            />
                                        ),
                                    },
                                    {
                                        label: "Status",
                                        value: (
                                            <SearchableSelect
                                                value={classForm.status}
                                                onValueChange={(value) =>
                                                    handleClassFieldChange(
                                                        "status",
                                                        value,
                                                    )
                                                }
                                                className={
                                                    hasClassFieldChanged(
                                                        "status",
                                                    )
                                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                        : undefined
                                                }
                                                disabled={
                                                    !canPatchClasses ||
                                                    classDetailSaving
                                                }
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "-- Status --",
                                                    },
                                                    {
                                                        value: "Active",
                                                        label: "Active",
                                                    },
                                                    {
                                                        value: "Recruiting",
                                                        label: "Recruiting",
                                                    },
                                                    {
                                                        value: "Completed",
                                                        label: "Completed",
                                                    },
                                                ]}
                                                placeholder="-- Status --"
                                                searchPlaceholder="Search status..."
                                            />
                                        ),
                                    },
                                    {
                                        label: "Date Start",
                                        value: (
                                            <Input
                                                className={`h-10 ${hasClassFieldChanged("date_start") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                                type="date"
                                                value={classForm.date_start}
                                                onChange={(event) =>
                                                    handleClassFieldChange(
                                                        "date_start",
                                                        event.target.value,
                                                    )
                                                }
                                                disabled={
                                                    !canPatchClasses ||
                                                    classDetailSaving
                                                }
                                            />
                                        ),
                                    },
                                    {
                                        label: "Date End",
                                        value: (
                                            <div className="flex items-center gap-3">
                                                <Input
                                                    className={`h-10 ${hasClassFieldChanged("date_end") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                                    type="date"
                                                    value={classForm.date_end}
                                                    onChange={(event) =>
                                                        handleClassFieldChange(
                                                            "date_end",
                                                            event.target.value,
                                                        )
                                                    }
                                                    disabled={
                                                        !canPatchClasses ||
                                                        classDetailSaving
                                                    }
                                                />
                                                {selectedClass.expected &&
                                                !hasClassFieldChanged(
                                                    "date_end",
                                                ) ? (
                                                    <span className="text-sm text-muted-foreground">
                                                        Calculated
                                                    </span>
                                                ) : null}
                                            </div>
                                        ),
                                    },
                                    {
                                        label: "Notes",
                                        value: (
                                            <div className="flex items-center gap-3">
                                                <Textarea
                                                    className={`h-10 ${hasClassFieldChanged("notes") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                                    value={classForm.notes}
                                                    onChange={(event) =>
                                                        handleClassFieldChange(
                                                            "notes",
                                                            event.target.value,
                                                        )
                                                    }
                                                    disabled={
                                                        !canPatchClasses ||
                                                        classDetailSaving
                                                    }
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        )}
                    </>
                )}

                {detailsTab === "schedules" && (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <div
                            className={cn(
                                "shrink-0 flex flex-col gap-3 lg:flex-row lg:items-end",
                                alignTableOptionsToLeft
                                    ? "lg:justify-start"
                                    : "lg:justify-end",
                            )}
                        >
                            <div
                                className={cn(
                                    "flex flex-wrap gap-2",
                                    alignTableOptionsToLeft
                                        ? "justify-start lg:ml-0"
                                        : "justify-end lg:ml-auto",
                                )}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowSchedulesAdvancedFilters(
                                            (prev) => !prev,
                                        )
                                    }
                                >
                                    <SlidersHorizontal className="size-4" />
                                    Advanced
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        void loadSchedulesForClass(
                                            selectedClass.appsheet_key,
                                        )
                                    }
                                    disabled={schedulesLoading}
                                >
                                    <RefreshCw className="size-4" />
                                    Refresh
                                </Button>
                                {canCreateSchedules && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setCreateScheduleError(null);
                                            setIsCreateScheduleOpen(true);
                                        }}
                                    >
                                        <Plus className="size-4" />
                                        Create
                                    </Button>
                                )}
                            </div>
                        </div>

                        {showSchedulesAdvancedFilters && (
                            <div className="grid gap-2 rounded-lg border border-border/70 bg-card/60 p-3 sm:grid-cols-2 lg:grid-cols-4">
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Class
                                    </span>
                                    <SearchableSelect
                                        value={selectedClass.appsheet_key}
                                        onValueChange={() => undefined}
                                        disabled
                                        options={[
                                            {
                                                value: selectedClass.appsheet_key,
                                                label:
                                                    selectedClass.name ||
                                                    "Selected class",
                                            },
                                            ...schedulesClassOptions.map(
                                                (option) => ({
                                                    value: option.value,
                                                    label: option.name,
                                                }),
                                            ),
                                        ]}
                                        placeholder="Selected class"
                                        searchPlaceholder="Search classes..."
                                    />
                                </label>

                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Mentor
                                    </span>
                                    <SearchableSelect
                                        value={schedulesSelectedMentorKey}
                                        onValueChange={(value) => {
                                            setSchedulesSelectedMentorKey(
                                                value,
                                            );
                                            setSchedulesPage(0);
                                        }}
                                        options={[
                                            { value: "", label: "All mentors" },
                                            ...schedulesEmployeeOptions.map(
                                                (option) => ({
                                                    value: option.value,
                                                    label: option.name,
                                                }),
                                            ),
                                        ]}
                                        placeholder="All mentors"
                                        searchPlaceholder="Search mentors..."
                                    />
                                </label>

                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Teaching Assistant
                                    </span>
                                    <SearchableSelect
                                        value={schedulesSelectedTaKey}
                                        onValueChange={(value) => {
                                            setSchedulesSelectedTaKey(value);
                                            setSchedulesPage(0);
                                        }}
                                        options={[
                                            { value: "", label: "All TAs" },
                                            ...schedulesEmployeeOptions.map(
                                                (option) => ({
                                                    value: option.value,
                                                    label: option.name,
                                                }),
                                            ),
                                        ]}
                                        placeholder="All TAs"
                                        searchPlaceholder="Search assistants..."
                                    />
                                </label>

                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Account
                                    </span>
                                    <SearchableSelect
                                        value={schedulesSelectedAccountKey}
                                        onValueChange={(value) => {
                                            setSchedulesSelectedAccountKey(
                                                value,
                                            );
                                            setSchedulesPage(0);
                                        }}
                                        options={[
                                            {
                                                value: "",
                                                label: "All accounts",
                                            },
                                            ...schedulesAccountOptions.map(
                                                (option) => ({
                                                    value: option.value,
                                                    label: option.name,
                                                }),
                                            ),
                                        ]}
                                        placeholder="All accounts"
                                        searchPlaceholder="Search accounts..."
                                    />
                                </label>

                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Active
                                    </span>
                                    <SearchableSelect
                                        value={schedulesSelectedActive}
                                        onValueChange={(value) => {
                                            setSchedulesSelectedActive(
                                                value as
                                                    | "true"
                                                    | "false"
                                                    | "all",
                                            );
                                            setSchedulesPage(0);
                                        }}
                                        options={[
                                            {
                                                value: "true",
                                                label: "Active only",
                                            },
                                            {
                                                value: "false",
                                                label: "Inactive only",
                                            },
                                            {
                                                value: "all",
                                                label: "All statuses",
                                            },
                                        ]}
                                        placeholder="Active only"
                                        searchPlaceholder="Search status..."
                                    />
                                </label>

                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Type
                                    </span>
                                    <SearchableSelect
                                        value={schedulesSelectedType}
                                        onValueChange={(value) => {
                                            setSchedulesSelectedType(value);
                                            setSchedulesPage(0);
                                        }}
                                        options={[
                                            { value: "", label: "All types" },
                                            {
                                                value: "Permanent",
                                                label: "Permanent",
                                            },
                                            {
                                                value: "Temporary",
                                                label: "Temporary",
                                            },
                                        ]}
                                        placeholder="All types"
                                    />
                                </label>

                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Day
                                    </span>
                                    <SearchableSelect
                                        value={schedulesSelectedDay}
                                        onValueChange={(value) => {
                                            setSchedulesSelectedDay(value);
                                            setSchedulesPage(0);
                                        }}
                                        options={[
                                            { value: "", label: "All days" },
                                            {
                                                value: "Monday",
                                                label: "Monday",
                                            },
                                            {
                                                value: "Tuesday",
                                                label: "Tuesday",
                                            },
                                            {
                                                value: "Wednesday",
                                                label: "Wednesday",
                                            },
                                            {
                                                value: "Thursday",
                                                label: "Thursday",
                                            },
                                            {
                                                value: "Friday",
                                                label: "Friday",
                                            },
                                            {
                                                value: "Saturday",
                                                label: "Saturday",
                                            },
                                            {
                                                value: "Sunday",
                                                label: "Sunday",
                                            },
                                        ]}
                                        placeholder="All days"
                                    />
                                </label>

                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Dayblock
                                    </span>
                                    <SearchableSelect
                                        value={schedulesSelectedDayblock}
                                        onValueChange={(value) => {
                                            setSchedulesSelectedDayblock(value);
                                            setSchedulesPage(0);
                                        }}
                                        options={[
                                            {
                                                value: "",
                                                label: "All day blocks",
                                            },
                                            ...schedulesDayblockOptions.map(
                                                (option) => ({
                                                    value: option.value,
                                                    label: option.name,
                                                }),
                                            ),
                                        ]}
                                        placeholder="All day blocks"
                                        searchPlaceholder="Search day blocks..."
                                    />
                                </label>
                            </div>
                        )}
                        <div className="min-h-0 flex-1">
                            <SimpleDataTable
                                columns={scheduleColumns}
                                rows={classSchedules}
                                rowKey={(row) => row.id}
                                loading={schedulesLoading}
                                loadingMessage="Loading schedules..."
                                emptyMessage="No schedules found."
                                page={schedulesPage}
                                pageSize={schedulesPageSize}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onPageChange={setSchedulesPage}
                                onPageSizeChange={(nextPageSize) => {
                                    setSchedulesPageSize(nextPageSize);
                                    setSchedulesPage(0);
                                }}
                                onRowClick={(row) => {
                                    if (!row.appsheet_key?.trim()) {
                                        return;
                                    }

                                    const query = new URLSearchParams();
                                    query.set(
                                        "returnUrl",
                                        toDetailReturnUrl(
                                            `${location.pathname}${location.search}`,
                                        ),
                                    );
                                    if (selectedClass.name?.trim()) {
                                        query.set(
                                            "className",
                                            selectedClass.name,
                                        );
                                    }

                                    navigate(
                                        `${getManagementClassChildDetailRoute(
                                            selectedClass.appsheet_key,
                                            "schedules",
                                            row.appsheet_key,
                                        )}${query.size > 0 ? `?${query.toString()}` : ""}`,
                                    );
                                }}
                                paginationMode="server"
                                totalRowCount={schedulesRowCount}
                            />
                        </div>
                    </div>
                )}

                {detailsTab === "sessions" && (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <ProgressMetricCell
                            primaryLabel={`${selectedClass.completed_sessions ?? 0} / ${selectedClass.total_sessions ?? 0}`}
                            secondaryLabel="Sessions completed"
                            percent={toSessionProgressPercent(
                                selectedClass.total_sessions,
                                selectedClass.completed_sessions,
                            )}
                        />
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowSessionsAdvancedFilters(
                                            (prev) => !prev,
                                        )
                                    }
                                >
                                    <SlidersHorizontal className="size-4" />
                                    Advanced
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => void loadSessionsForClass()}
                                    disabled={sessionsLoading}
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

                        {showSessionsAdvancedFilters && (
                            <div className="grid gap-2 rounded-lg border border-border/70 p-3 sm:grid-cols-2 lg:grid-cols-4">
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Mentor
                                    </span>
                                    <SearchableSelect
                                        value={sessionsSelectedMentorKey}
                                        onValueChange={(value) => {
                                            setSessionsSelectedMentorKey(value);
                                            setSessionsPage(0);
                                        }}
                                        options={[
                                            {
                                                value: "",
                                                label: "All mentors",
                                            },
                                            ...sessionsEmployeeOptions.map(
                                                (option) => ({
                                                    value: option.value,
                                                    label: option.name,
                                                }),
                                            ),
                                        ]}
                                        placeholder={
                                            sessionsEmployeeOptionsLoading
                                                ? "Loading mentors..."
                                                : "All mentors"
                                        }
                                        searchPlaceholder="Search mentors..."
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Teaching Assistant
                                    </span>
                                    <SearchableSelect
                                        value={sessionsSelectedTaKey}
                                        onValueChange={(value) => {
                                            setSessionsSelectedTaKey(value);
                                            setSessionsPage(0);
                                        }}
                                        options={[
                                            {
                                                value: "",
                                                label: "All teaching assistants",
                                            },
                                            ...sessionsEmployeeOptions.map(
                                                (option) => ({
                                                    value: option.value,
                                                    label: option.name,
                                                }),
                                            ),
                                        ]}
                                        placeholder={
                                            sessionsEmployeeOptionsLoading
                                                ? "Loading teaching assistants..."
                                                : "All teaching assistants"
                                        }
                                        searchPlaceholder="Search teaching assistants..."
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Begin Date
                                    </span>
                                    <input
                                        type="date"
                                        value={sessionsBeginDate}
                                        onChange={(event) => {
                                            setSessionsBeginDate(
                                                event.target.value,
                                            );
                                            setSessionsPage(0);
                                        }}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        End Date
                                    </span>
                                    <input
                                        type="date"
                                        value={sessionsEndDate}
                                        onChange={(event) => {
                                            setSessionsEndDate(
                                                event.target.value,
                                            );
                                            setSessionsPage(0);
                                        }}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    />
                                </label>
                            </div>
                        )}
                        <div className="min-h-0 flex-1">
                            <SimpleDataTable
                                columns={sessionColumns}
                                rows={classSessions}
                                rowKey={(row) => row.id}
                                loading={sessionsLoading}
                                loadingMessage="Loading sessions..."
                                emptyMessage="No sessions found."
                                page={sessionsPage}
                                pageSize={sessionsPageSize}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onPageChange={setSessionsPage}
                                onPageSizeChange={(nextPageSize) => {
                                    setSessionsPageSize(nextPageSize);
                                    setSessionsPage(0);
                                }}
                                onRowClick={(row) => {
                                    if (!row.appsheet_key?.trim()) {
                                        return;
                                    }

                                    const query = new URLSearchParams();
                                    query.set(
                                        "returnUrl",
                                        toDetailReturnUrl(
                                            `${location.pathname}${location.search}`,
                                        ),
                                    );
                                    const resolvedClassName =
                                        row.class_name?.trim() ||
                                        selectedClass?.name?.trim();
                                    if (resolvedClassName) {
                                        query.set(
                                            "className",
                                            resolvedClassName,
                                        );
                                    }

                                    navigate(
                                        `${getManagementClassChildDetailRoute(
                                            selectedClass.appsheet_key,
                                            "sessions",
                                            row.appsheet_key,
                                        )}${query.size > 0 ? `?${query.toString()}` : ""}`,
                                    );
                                }}
                                paginationMode="server"
                                totalRowCount={sessionsRowCount}
                                sortBy="timestamp"
                                sortOrder={classSessionsOrder}
                                onSortChange={(columnId, nextOrder) => {
                                    if (columnId !== "timestamp") {
                                        return;
                                    }
                                    setClassSessionsOrder(nextOrder);
                                    setSessionsPage(0);
                                }}
                            />
                        </div>
                    </div>
                )}

                {detailsTab === "tests" && (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <SearchField
                                value={testsDraft}
                                onChange={(v) => {
                                    setTestsDraft(v);
                                    if (v === "") setTestsSearchQuery("");
                                }}
                                onSubmit={() =>
                                    setTestsSearchQuery(testsDraft.trim())
                                }
                                placeholder="Search tests"
                                className={cn(
                                    "relative w-full lg:max-w-sm",
                                    alignTableOptionsToLeft
                                        ? "lg:ml-0"
                                        : "lg:ml-auto",
                                )}
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => void loadTestsForClass()}
                                    disabled={testsLoading}
                                >
                                    <RefreshCw className="size-4" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                        <div className="min-h-0 flex-1">
                            <SimpleDataTable
                                columns={testColumns}
                                rows={filteredClassTests}
                                rowKey={(row) => row.id}
                                loading={testsLoading}
                                loadingMessage="Loading tests..."
                                emptyMessage="No tests found."
                                page={testsPage}
                                pageSize={testsPageSize}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onPageChange={setTestsPage}
                                onPageSizeChange={(nextPageSize) => {
                                    setTestsPageSize(nextPageSize);
                                    setTestsPage(0);
                                }}
                                onRowClick={(row) => {
                                    if (
                                        !row.appsheet_key?.trim() ||
                                        !selectedClass?.appsheet_key?.trim()
                                    ) {
                                        return;
                                    }

                                    const query = new URLSearchParams();
                                    query.set(
                                        "returnUrl",
                                        toDetailReturnUrl(
                                            `${location.pathname}${location.search}`,
                                        ),
                                    );
                                    if (selectedClass.name?.trim()) {
                                        query.set(
                                            "className",
                                            selectedClass.name,
                                        );
                                    }

                                    navigate(
                                        `${getManagementClassChildDetailRoute(
                                            selectedClass.appsheet_key,
                                            "tests",
                                            row.appsheet_key,
                                        )}${query.size > 0 ? `?${query.toString()}` : ""}`,
                                    );
                                }}
                                paginationMode="server"
                                totalRowCount={testsRowCount}
                            />
                        </div>
                    </div>
                )}

                {detailsTab === "registrations" && (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <ProgressMetricCell
                            primaryLabel={`${selectedClass.student_count ?? 0} / ${selectedClass.student_max_count ?? 0}`}
                            secondaryLabel="Registered students"
                            percent={toStudentCountPercent(
                                selectedClass.student_max_count,
                                selectedClass.student_count,
                            )}
                        />
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <SearchField
                                value={registrationsDraft}
                                onChange={(v) => {
                                    setRegistrationsDraft(v);
                                    if (v === "")
                                        setRegistrationsSearchQuery("");
                                }}
                                onSubmit={() =>
                                    setRegistrationsSearchQuery(
                                        registrationsDraft.trim(),
                                    )
                                }
                                placeholder="Search registrations"
                                className={cn(
                                    "relative w-full lg:max-w-sm",
                                    alignTableOptionsToLeft
                                        ? "lg:ml-0"
                                        : "lg:ml-auto",
                                )}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    void loadRegistrationsForClass(
                                        selectedClass.appsheet_key,
                                    )
                                }
                                disabled={registrationsLoading}
                            >
                                <RefreshCw className="size-4" />
                                Refresh
                            </Button>
                        </div>
                        <div className="min-h-0 flex-1">
                            <SimpleDataTable
                                columns={registrationColumns}
                                rows={filteredClassRegistrations}
                                rowKey={(row) => row.id}
                                loading={registrationsLoading}
                                loadingMessage="Loading registrations..."
                                emptyMessage="No registrations found."
                                page={registrationsPage}
                                pageSize={registrationsPageSize}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onPageChange={setRegistrationsPage}
                                onPageSizeChange={(nextPageSize) => {
                                    setRegistrationsPageSize(nextPageSize);
                                    setRegistrationsPage(0);
                                }}
                                paginationMode="server"
                                totalRowCount={registrationsRowCount}
                            />
                        </div>
                    </div>
                )}

                {canViewFeedbacks && detailsTab === "feedbacks" && (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <SearchField
                                value={feedbacksDraft}
                                onChange={(v) => {
                                    setFeedbacksDraft(v);
                                    if (v === "") setFeedbacksSearchQuery("");
                                }}
                                onSubmit={() =>
                                    setFeedbacksSearchQuery(
                                        feedbacksDraft.trim(),
                                    )
                                }
                                placeholder="Search feedbacks"
                                className={cn(
                                    "relative w-full lg:max-w-sm",
                                    alignTableOptionsToLeft
                                        ? "lg:ml-0"
                                        : "lg:ml-auto",
                                )}
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowFeedbacksAdvancedFilters(
                                            (prev) => !prev,
                                        )
                                    }
                                >
                                    <SlidersHorizontal className="size-4" />
                                    Advanced
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        void loadFeedbacksForClass(
                                            selectedClass.appsheet_key,
                                        )
                                    }
                                    disabled={feedbacksLoading}
                                >
                                    <RefreshCw className="size-4" />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {showFeedbacksAdvancedFilters && (
                            <div className="grid gap-2 rounded-lg border border-border/70 p-3 sm:grid-cols-2 lg:grid-cols-4">
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Begin Date
                                    </span>
                                    <input
                                        type="date"
                                        value={feedbacksBeginDate}
                                        onChange={(event) => {
                                            setFeedbacksBeginDate(
                                                event.target.value,
                                            );
                                            setFeedbacksPage(0);
                                        }}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        End Date
                                    </span>
                                    <input
                                        type="date"
                                        value={feedbacksEndDate}
                                        onChange={(event) => {
                                            setFeedbacksEndDate(
                                                event.target.value,
                                            );
                                            setFeedbacksPage(0);
                                        }}
                                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                    />
                                </label>
                            </div>
                        )}
                        <div className="min-h-0 flex-1">
                            <SimpleDataTable
                                columns={feedbackColumns}
                                rows={filteredClassFeedbacks}
                                rowKey={(row) => row.id}
                                loading={feedbacksLoading}
                                loadingMessage="Loading feedbacks..."
                                emptyMessage="No feedbacks found."
                                page={feedbacksPage}
                                pageSize={feedbacksPageSize}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onPageChange={setFeedbacksPage}
                                onPageSizeChange={(nextPageSize) => {
                                    setFeedbacksPageSize(nextPageSize);
                                    setFeedbacksPage(0);
                                }}
                                onRowClick={(row) => {
                                    if (!row.appsheet_key?.trim()) {
                                        return;
                                    }

                                    const query = new URLSearchParams();
                                    query.set(
                                        "returnUrl",
                                        toDetailReturnUrl(
                                            `${location.pathname}${location.search}`,
                                        ),
                                    );
                                    if (selectedClass?.name?.trim()) {
                                        query.set(
                                            "className",
                                            selectedClass.name,
                                        );
                                    }

                                    navigate(
                                        `${getManagementClassChildDetailRoute(
                                            selectedClass.appsheet_key,
                                            "feedbacks",
                                            row.appsheet_key,
                                        )}${query.size > 0 ? `?${query.toString()}` : ""}`,
                                    );
                                }}
                                paginationMode="server"
                                totalRowCount={feedbacksRowCount}
                            />
                        </div>
                    </div>
                )}
            </DetailTabbedSection>

            <RecordingDialog
                recordingId={selectedRecordingId}
                onClose={() => setSelectedRecordingId(null)}
            />

            <CreateScheduleDialog
                open={isCreateScheduleOpen}
                saving={createScheduleSaving}
                error={createScheduleError}
                defaultClassKey={selectedClass.appsheet_key}
                defaultDateStart={defaultScheduleDateStart}
                defaultDateEnd={defaultScheduleDateEnd}
                onClose={() => {
                    if (createScheduleSaving) {
                        return;
                    }
                    setIsCreateScheduleOpen(false);
                    setCreateScheduleError(null);
                }}
                onSubmit={handleCreateSchedule}
            />

            <CreateSessionDialog
                open={isCreateSessionOpen}
                saving={createSessionSaving}
                error={createSessionError}
                defaultClassKey={selectedClass.appsheet_key}
                defaultTimestamp={defaultClassSessionTimestamp}
                onClose={() => {
                    if (createSessionSaving) {
                        return;
                    }
                    setIsCreateSessionOpen(false);
                    setCreateSessionError(null);
                }}
                onSubmit={handleCreateSession}
            />

            <PendingChangesBar
                pendingCount={pendingClassCount}
                saving={classDetailSaving}
                onSave={handleClassDetailPatch}
                onCancel={cancelClassDetailChanges}
                saveLabel="Save class changes"
            />

            <OutdatedDataDialog
                open={showOutdatedDataDialog}
                onRefreshData={() => void refreshOutdatedClassData()}
                onCancelAction={() => setShowOutdatedDataDialog(false)}
                loading={classDetailSaving}
            />
        </DetailView>
    );
}
