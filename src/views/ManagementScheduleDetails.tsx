import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
    DetailHeader,
    DetailBreadcrumbs,
    DetailClassHeaderLabel,
    DetailFieldsTable,
    DetailView,
} from "@/components/management/DetailLayout";
import DetailLoadingView from "@/components/management/DetailLoadingView";
import OutdatedDataDialog from "@/components/management/OutdatedDataDialog";
import PendingChangesBar from "@/components/PendingChangesBar";
import {
    fetchAccountOptions,
    fetchInlineEmployeeOptions,
    fetchInlineSessionClassOptions,
    fetchDayblockOptions,
    deleteManagementSchedule,
    fetchManagementScheduleDetails,
    patchManagementSchedule,
    type InlineOption,
    type ManagementSchedule,
    type SchedulePatchRequest,
} from "@/api_calls/UserData";
import { useAuth } from "@/context/AuthContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import { isPermissionDeniedError } from "@/utils/permissions";
import { isOutdatedEditedAtConflictError } from "@/utils/conflictErrors";
import { toBackendTimeValue } from "@/utils/formatters";
import { getUserScopes } from "@/utils/userScopes";
import { toDetailReturnUrl } from "@/utils/detailViewMode";
import {
    getManagementClassRoute,
    MANAGEMENT_CLASSES_ROUTE,
    MANAGEMENT_SCHEDULES_ROUTE,
    normalizeRoutePath,
} from "@/routing/navigation";

type ScheduleEditableForm = {
    classKey: string;
    type: string;
    day: string;
    dayblock: string;
    time_start: string;
    time_end: string;
    mentorKey: string;
    taKey: string;
    accountKey: string;
    date_start: string;
    date_end: string;
    inactive: "true" | "false";
};

function isTemporaryScheduleType(type: string) {
    return type.trim().toLowerCase() === "temporary";
}

function formatScheduleDisplayName(
    source: Pick<
        ManagementSchedule,
        "name" | "day" | "time_start" | "time_end"
    >,
) {
    const className = source.name?.trim() || "Schedule";
    const day = source.day?.trim() || "-";
    const timeStart = source.time_start?.trim() || "-";
    const timeEnd = source.time_end?.trim() || "-";
    return `${className} - ${day} - ${timeStart} - ${timeEnd}`;
}

function formatScheduleTimeLabel(
    source: Pick<ManagementSchedule, "day" | "time_start" | "time_end">,
) {
    const day = source.day?.trim() || "-";
    const timeStart = source.time_start?.trim() || "-";
    const timeEnd = source.time_end?.trim() || "-";
    return `${day} - ${timeStart} - ${timeEnd}`;
}

function toScheduleEditableForm(
    source: ManagementSchedule,
): ScheduleEditableForm {
    return {
        classKey: source.class_key ?? "",
        type: source.type ?? "",
        day: source.day ?? "",
        dayblock: source.dayblock_key ?? source.dayblock ?? "",
        time_start: toBackendTimeValue(source.time_start) ?? "",
        time_end: toBackendTimeValue(source.time_end) ?? "",
        mentorKey: source.mentor_key ?? "",
        taKey: source.ta_key ?? "",
        accountKey: source.account_key ?? "",
        date_start: source.date_start ?? "",
        date_end: source.date_end ?? "",
        inactive: source.inactive ? "true" : "false",
    };
}

function buildSchedulePatch(
    current: ScheduleEditableForm,
    original: ScheduleEditableForm,
): SchedulePatchRequest {
    const payload: SchedulePatchRequest = {};

    const currentClassKey = current.classKey.trim();
    const originalClassKey = original.classKey.trim();
    if (currentClassKey !== originalClassKey) {
        payload.class_key = currentClassKey || null;
    }

    if (current.type.trim() !== original.type.trim()) {
        payload.type = current.type.trim() || null;
    }

    if (current.day.trim() !== original.day.trim()) {
        payload.day = current.day.trim() || null;
    }

    if (current.dayblock.trim() !== original.dayblock.trim()) {
        payload.dayblock = current.dayblock.trim() || null;
    }

    if (current.time_start.trim() !== original.time_start.trim()) {
        payload.time_start = current.time_start.trim()
            ? (toBackendTimeValue(current.time_start) ?? null)
            : null;
    }

    if (current.time_end.trim() !== original.time_end.trim()) {
        payload.time_end = current.time_end.trim()
            ? (toBackendTimeValue(current.time_end) ?? null)
            : null;
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

    const currentAccountKey = current.accountKey.trim();
    const originalAccountKey = original.accountKey.trim();
    if (currentAccountKey !== originalAccountKey) {
        payload.account_key = currentAccountKey || null;
    }

    if (isTemporaryScheduleType(current.type)) {
        if (current.date_start.trim() !== original.date_start.trim()) {
            payload.date_start = current.date_start.trim() || null;
        }

        if (current.date_end.trim() !== original.date_end.trim()) {
            payload.date_end = current.date_end.trim() || null;
        }
    }

    if (current.inactive !== original.inactive) {
        payload.inactive = current.inactive === "true";
    }

    return payload;
}

export default function ManagementScheduleDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const params = useParams<{ classKey?: string; scheduleKey: string }>();
    const { user } = useAuth();
    const { setStatus, clearStatus } = useGlobalStatus();
    const userScopes = getUserScopes(user);
    const canPatchSchedules = userScopes.includes("schedules_patch");
    const canDeleteSchedules = userScopes.includes("schedules_delete");

    const decodedScheduleKey = useMemo(
        () => decodeURIComponent(params.scheduleKey ?? ""),
        [params.scheduleKey],
    );
    const decodedClassKey = useMemo(
        () => decodeURIComponent(params.classKey ?? ""),
        [params.classKey],
    );
    const isClassScopedRoute = decodedClassKey.trim().length > 0;
    const query = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );
    const returnUrl = query.get("returnUrl");
    const resolvedReturnUrl = returnUrl ? normalizeRoutePath(returnUrl) : null;
    const scheduleDetailsQuery = useQuery({
        queryKey: [
            "managementScheduleDetails",
            user?.username,
            decodedScheduleKey,
        ],
        queryFn: () => fetchManagementScheduleDetails(decodedScheduleKey),
        enabled: Boolean(decodedScheduleKey.trim()),
    });

    const [schedule, setSchedule] = useState<ManagementSchedule | null>(null);
    const [loading, setLoading] = useState(Boolean(decodedScheduleKey.trim()));
    const [error, setError] = useState<string | null>(null);
    const [scheduleRefreshError, setScheduleRefreshError] = useState<
        string | null
    >(null);
    const [scheduleForm, setScheduleForm] =
        useState<ScheduleEditableForm | null>(null);
    const [scheduleOriginal, setScheduleOriginal] =
        useState<ScheduleEditableForm | null>(null);
    const [pendingScheduleChanges, setPendingScheduleChanges] =
        useState<SchedulePatchRequest>({});
    const [scheduleChangeError, setScheduleChangeError] = useState<
        string | null
    >(null);
    const [showOutdatedDataDialog, setShowOutdatedDataDialog] = useState(false);
    const [scheduleDeleteError, setScheduleDeleteError] = useState<
        string | null
    >(null);
    const [optionsError, setOptionsError] = useState<string | null>(null);
    const [classOptions, setClassOptions] = useState<InlineOption[]>([]);
    const [employeeOptions, setEmployeeOptions] = useState<InlineOption[]>([]);
    const [accountOptions, setAccountOptions] = useState<InlineOption[]>([]);
    const [accountOptionsError, setAccountOptionsError] = useState<
        string | null
    >(null);
    const [dayblockOptions, setDayblockOptions] = useState<InlineOption[]>([]);
    const patchScheduleMutation = useMutation({
        mutationFn: ({
            scheduleKey,
            payload,
        }: {
            scheduleKey: string;
            payload: SchedulePatchRequest;
        }) => patchManagementSchedule(scheduleKey, payload),
        onSuccess: async (patched) => {
            applyScheduleDetails(patched);
            await queryClient.invalidateQueries({
                queryKey: ["managementSchedules"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassSchedules"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementScheduleDetails"],
            });
        },
    });
    const deleteScheduleMutation = useMutation({
        mutationFn: (scheduleKey: string) => deleteManagementSchedule(scheduleKey),
    });
    const savingScheduleChanges = patchScheduleMutation.isPending;
    const deletingSchedule = deleteScheduleMutation.isPending;
    const optionsQuery = useQuery({
        queryKey: ["managementScheduleEditOptions", canPatchSchedules],
        queryFn: async () => {
            const [classesData, employeesData] = await Promise.all([
                fetchInlineSessionClassOptions(),
                fetchInlineEmployeeOptions(),
            ]);
            return { classesData, employeesData };
        },
        enabled: canPatchSchedules,
    });
    const accountOptionsQuery = useQuery({
        queryKey: [
            "managementScheduleAccountOptions",
            canPatchSchedules,
            scheduleForm?.classKey ?? schedule?.class_key ?? "",
            scheduleForm?.day ?? "",
            scheduleForm?.dayblock ?? "",
        ],
        queryFn: () =>
            fetchAccountOptions(-1, 0, undefined, {
                classKey: scheduleForm?.classKey ?? schedule?.class_key ?? "",
                day: scheduleForm?.day ?? "",
                dayblock: scheduleForm?.dayblock ?? "",
            }),
        enabled: canPatchSchedules,
    });
    const dayblockOptionsQuery = useQuery({
        queryKey: ["dayblockOptions"],
        queryFn: () => fetchDayblockOptions(),
    });
    const optionsLoading = optionsQuery.isFetching;
    const accountOptionsLoading = accountOptionsQuery.isFetching;
    const dayblockOptionsLoading = dayblockOptionsQuery.isFetching;

    const isTemporarySchedule = useMemo(
        () =>
            isTemporaryScheduleType(scheduleForm?.type ?? schedule?.type ?? ""),
        [scheduleForm?.type, schedule?.type],
    );
    const scheduleDisplayName = useMemo(() => {
        if (!schedule) {
            return "Schedule Details";
        }

        if (isClassScopedRoute) {
            return formatScheduleTimeLabel(schedule);
        }

        return formatScheduleDisplayName(schedule);
    }, [isClassScopedRoute, schedule]);

    const breadcrumbItems = useMemo(() => {
        if (isClassScopedRoute) {
            return [
                {
                    label: "Classes",
                    onClick: () => navigate(MANAGEMENT_CLASSES_ROUTE),
                },
                {
                    label:
                        query.get("className")?.trim() ||
                        schedule?.name ||
                        decodedClassKey ||
                        "Class Details",
                    onClick: handleBack,
                },
            ];
        }

        return [{ label: "Schedules", onClick: handleBack }];
    }, [
        decodedClassKey,
        handleBack,
        isClassScopedRoute,
        navigate,
        query,
        schedule?.name,
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

    const accountSelectOptions = useMemo(
        () => [
            { value: "", label: "-- Account --" },
            ...accountOptions.map((option) => ({
                value: option.value,
                label: option.name,
            })),
        ],
        [accountOptions],
    );
    const hasScheduleFieldChanged = (field: keyof ScheduleEditableForm) =>
        Boolean(scheduleForm) &&
        Boolean(scheduleOriginal) &&
        scheduleForm?.[field] !== scheduleOriginal?.[field];

    useEffect(() => {
        if (scheduleChangeError) {
            setStatus(scheduleChangeError, "error");
            return;
        }

        if (scheduleDeleteError) {
            setStatus(scheduleDeleteError, "error");
            return;
        }

        if (scheduleRefreshError) {
            setStatus(scheduleRefreshError, "error");
            return;
        }

        if (optionsError) {
            setStatus(optionsError, "error");
            return;
        }

        if (accountOptionsError) {
            setStatus(accountOptionsError, "error");
            return;
        }

        if (error || (!loading && (!schedule || !scheduleForm))) {
            setStatus(error ?? "Schedule not found.", "error");
            return;
        }

        if (loading) {
            setStatus("Loading schedule details...");
            return;
        }

        if (optionsLoading) {
            setStatus("Loading schedule edit options...");
            return;
        }

        if (accountOptionsLoading) {
            setStatus("Loading account options...");
            return;
        }

        if (dayblockOptionsLoading) {
            setStatus("Loading dayblock options...");
            return;
        }

        clearStatus();
    }, [
        clearStatus,
        accountOptionsError,
        accountOptionsLoading,
        dayblockOptionsLoading,
        error,
        loading,
        optionsError,
        optionsLoading,
        schedule,
        scheduleChangeError,
        scheduleDeleteError,
        scheduleRefreshError,
        scheduleForm,
        setStatus,
    ]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    useEffect(() => {
        if (!canPatchSchedules) {
            setOptionsError(null);
            setAccountOptionsError(null);
            setClassOptions([]);
            setEmployeeOptions([]);
            setAccountOptions([]);
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
                    : "Failed to load schedule edit options",
            );
            return;
        }
        if (!optionsQuery.data) {
            return;
        }
        setClassOptions(optionsQuery.data.classesData);
        setEmployeeOptions(optionsQuery.data.employeesData);
        setOptionsError(null);
    }, [canPatchSchedules, optionsQuery.data, optionsQuery.error]);

    useEffect(() => {
        if (!canPatchSchedules) {
            setAccountOptionsError(null);
            setAccountOptions([]);
            return;
        }

        if (accountOptionsQuery.error) {
            setAccountOptions([]);
            if (isPermissionDeniedError(accountOptionsQuery.error)) {
                setAccountOptionsError(null);
                return;
            }
            setAccountOptionsError(
                accountOptionsQuery.error instanceof Error
                    ? accountOptionsQuery.error.message
                    : "Failed to load account options",
            );
            return;
        }
        if (!accountOptionsQuery.data) {
            return;
        }
        const data = accountOptionsQuery.data;
        setAccountOptions(data);
        setAccountOptionsError(null);
        setScheduleForm((prev) => {
            if (!prev) {
                return prev;
            }

            if (
                !prev.accountKey ||
                data.some((option) => option.value === prev.accountKey)
            ) {
                return prev;
            }

            const next = { ...prev, accountKey: "" };
            if (scheduleOriginal) {
                setPendingScheduleChanges(
                    buildSchedulePatch(next, scheduleOriginal),
                );
            }
            return next;
        });
    }, [
        canPatchSchedules,
        accountOptionsQuery.data,
        accountOptionsQuery.error,
        scheduleOriginal,
    ]);

    useEffect(() => {
        if (dayblockOptionsQuery.error) {
            setDayblockOptions([]);
            return;
        }
        if (!dayblockOptionsQuery.data) {
            return;
        }
        setDayblockOptions(dayblockOptionsQuery.data);
    }, [dayblockOptionsQuery.data, dayblockOptionsQuery.error]);

    function handleBack() {
        if (isClassScopedRoute) {
            navigate(getManagementClassRoute(decodedClassKey, "schedules"));
            return;
        }

        if (resolvedReturnUrl?.trim()) {
            navigate(resolvedReturnUrl);
            return;
        }

        navigate(MANAGEMENT_SCHEDULES_ROUTE);
    }

    const applyScheduleDetails = (details: ManagementSchedule) => {
        setSchedule(details);
        const nextForm = toScheduleEditableForm(details);
        setScheduleForm(nextForm);
        setScheduleOriginal(nextForm);
        setPendingScheduleChanges({});
        setScheduleChangeError(null);
        setScheduleDeleteError(null);
        setScheduleRefreshError(null);
    };

    useEffect(() => {
        if (!decodedScheduleKey.trim()) {
            setError("Missing schedule identifier in URL.");
            setLoading(false);
            return;
        }

        if (scheduleDetailsQuery.error) {
            setError(
                scheduleDetailsQuery.error instanceof Error
                    ? scheduleDetailsQuery.error.message
                    : "Failed to load schedule details",
            );
            setLoading(false);
            return;
        }

        if (!scheduleDetailsQuery.data) {
            setLoading(scheduleDetailsQuery.isFetching);
            return;
        }

        applyScheduleDetails(scheduleDetailsQuery.data);
        setError(null);
        setLoading(false);
    }, [
        decodedScheduleKey,
        scheduleDetailsQuery.data,
        scheduleDetailsQuery.error,
        scheduleDetailsQuery.isFetching,
    ]);

    const handleFieldChange = <K extends keyof ScheduleEditableForm>(
        field: K,
        value: ScheduleEditableForm[K],
    ) => {
        setScheduleChangeError(null);
        setScheduleForm((prev) => {
            if (!prev || !scheduleOriginal) {
                return prev;
            }

            const next = { ...prev, [field]: value };
            setPendingScheduleChanges(
                buildSchedulePatch(next, scheduleOriginal),
            );
            return next;
        });
    };

    const handleCancelChanges = () => {
        if (!scheduleOriginal) {
            return;
        }
        setScheduleForm(scheduleOriginal);
        setPendingScheduleChanges({});
        setScheduleChangeError(null);
    };

    const handleSaveChanges = async () => {
        if (!schedule?.appsheet_key) {
            setScheduleChangeError("Missing schedule key.");
            return;
        }

        if (Object.keys(pendingScheduleChanges).length === 0) {
            return;
        }

        try {
            setScheduleChangeError(null);
            await patchScheduleMutation.mutateAsync({
                scheduleKey: schedule.appsheet_key,
                payload: {
                    ...pendingScheduleChanges,
                    edited_at: schedule.edited_at ?? null,
                },
            });
        } catch (err) {
            if (isOutdatedEditedAtConflictError(err)) {
                setShowOutdatedDataDialog(true);
                return;
            }
            setScheduleChangeError(
                err instanceof Error
                    ? err.message
                    : "Failed to update schedule",
            );
        }
    };

    const refreshOutdatedScheduleData = async () => {
        setShowOutdatedDataDialog(false);
        setScheduleChangeError(null);
        setPendingScheduleChanges({});
        await scheduleDetailsQuery.refetch();
    };

    const handleDeleteSchedule = async () => {
        if (!schedule?.appsheet_key?.trim()) {
            setScheduleDeleteError("Missing schedule key.");
            return;
        }

        if (!window.confirm(`Delete schedule "${scheduleDisplayName}"?`)) {
            return;
        }

        try {
            setScheduleDeleteError(null);
            await deleteScheduleMutation.mutateAsync(schedule.appsheet_key);
            await queryClient.invalidateQueries({
                queryKey: ["managementScheduleDetails"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementSchedules"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["managementClassSchedules"],
            });
            handleBack();
        } catch (err) {
            setScheduleDeleteError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete schedule",
            );
        }
    };

    if (loading || !schedule || !scheduleForm) {
        return <DetailLoadingView title="Loading schedule details..." />;
    }

    if (error) {
        return <DetailLoadingView title="Loading schedule details..." />;
    }

    return (
        <DetailView className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
            <DetailHeader
                breadcrumbs={
                    <DetailBreadcrumbs
                        items={breadcrumbItems}
                        current={scheduleDisplayName}
                    />
                }
                actions={
                    <>
                        {canDeleteSchedules ? (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => void handleDeleteSchedule()}
                                disabled={
                                    deletingSchedule ||
                                    savingScheduleChanges ||
                                    !schedule.appsheet_key.trim()
                                }
                            >
                                <Trash2 className="size-4" />
                                {deletingSchedule ? "Deleting..." : "Delete"}
                            </Button>
                        ) : null}
                    </>
                }
            />

            <DetailFieldsTable
                rows={[
                    {
                        label: (
                            <DetailClassHeaderLabel
                                classKey={
                                    scheduleForm.classKey || schedule.class_key
                                }
                                onOpenClass={() => {
                                    const target = getManagementClassRoute(
                                        (
                                            scheduleForm.classKey ||
                                            schedule.class_key ||
                                            ""
                                        ).trim(),
                                    );
                                    const query = new URLSearchParams();
                                    query.set(
                                        "returnUrl",
                                        toDetailReturnUrl(
                                            `${location.pathname}${location.search}`,
                                        ),
                                    );
                                    navigate(`${target}?${query.toString()}`);
                                }}
                            />
                        ),
                        value: canPatchSchedules ? (
                            <SearchableSelect
                                id="schedule-details-class"
                                value={scheduleForm.classKey}
                                onValueChange={(value) =>
                                    handleFieldChange("classKey", value)
                                }
                                options={classSelectOptions}
                                className={
                                    hasScheduleFieldChanged("classKey")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                disabled={
                                    savingScheduleChanges || optionsLoading
                                }
                                placeholder={
                                    optionsLoading
                                        ? "Loading classes..."
                                        : schedule.name || "-- Class --"
                                }
                                searchPlaceholder="Search classes..."
                            />
                        ) : (
                            schedule.name || "-"
                        ),
                    },
                    {
                        label: "Type",
                        value: (
                            <SearchableSelect
                                value={scheduleForm.type}
                                onValueChange={(value) =>
                                    handleFieldChange("type", value)
                                }
                                disabled={
                                    !canPatchSchedules || savingScheduleChanges
                                }
                                className={
                                    hasScheduleFieldChanged("type")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                options={[
                                    { value: "", label: "-- Type --" },
                                    { value: "Permanent", label: "Permanent" },
                                    { value: "Temporary", label: "Temporary" },
                                ]}
                                placeholder="-- Type --"
                            />
                        ),
                    },
                    {
                        label: "Day",
                        value: (
                            <SearchableSelect
                                value={scheduleForm.day}
                                onValueChange={(value) =>
                                    handleFieldChange("day", value)
                                }
                                disabled={
                                    !canPatchSchedules || savingScheduleChanges
                                }
                                className={
                                    hasScheduleFieldChanged("day")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                options={[
                                    { value: "", label: "-- Day --" },
                                    { value: "Monday", label: "Monday" },
                                    { value: "Tuesday", label: "Tuesday" },
                                    { value: "Wednesday", label: "Wednesday" },
                                    { value: "Thursday", label: "Thursday" },
                                    { value: "Friday", label: "Friday" },
                                    { value: "Saturday", label: "Saturday" },
                                    { value: "Sunday", label: "Sunday" },
                                ]}
                                placeholder="-- Day --"
                            />
                        ),
                    },
                    {
                        label: "Mentor",
                        value: canPatchSchedules ? (
                            <SearchableSelect
                                id="schedule-details-mentor"
                                value={scheduleForm.mentorKey}
                                onValueChange={(value) =>
                                    handleFieldChange("mentorKey", value)
                                }
                                options={employeeSelectOptions}
                                className={
                                    hasScheduleFieldChanged("mentorKey")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                disabled={
                                    savingScheduleChanges || optionsLoading
                                }
                                placeholder={
                                    optionsLoading
                                        ? "Loading mentors..."
                                        : schedule.mentor_name || "-- Mentor --"
                                }
                                searchPlaceholder="Search mentors..."
                            />
                        ) : (
                            schedule.mentor_name || "-"
                        ),
                    },
                    {
                        label: "Teaching Assistant",
                        value: canPatchSchedules ? (
                            <SearchableSelect
                                id="schedule-details-ta"
                                value={scheduleForm.taKey}
                                onValueChange={(value) =>
                                    handleFieldChange("taKey", value)
                                }
                                options={employeeSelectOptions}
                                className={
                                    hasScheduleFieldChanged("taKey")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                disabled={
                                    savingScheduleChanges || optionsLoading
                                }
                                placeholder={
                                    optionsLoading
                                        ? "Loading assistants..."
                                        : schedule.ta_name ||
                                          "-- Teaching Assistant --"
                                }
                                searchPlaceholder="Search assistants..."
                            />
                        ) : (
                            schedule.ta_name || "-- Teaching Assistant --"
                        ),
                    },
                    {
                        label: "Account",
                        value: canPatchSchedules ? (
                            <SearchableSelect
                                id="schedule-details-account"
                                value={scheduleForm.accountKey}
                                onValueChange={(value) =>
                                    handleFieldChange("accountKey", value)
                                }
                                options={accountSelectOptions}
                                className={
                                    hasScheduleFieldChanged("accountKey")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                disabled={
                                    savingScheduleChanges ||
                                    accountOptionsLoading
                                }
                                placeholder={
                                    accountOptionsLoading
                                        ? "Loading accounts..."
                                        : schedule.account || "-- Account --"
                                }
                                searchPlaceholder="Search accounts..."
                            />
                        ) : (
                            schedule.account || "-"
                        ),
                    },
                    {
                        label: "Day block",
                        value: (
                            <SearchableSelect
                                value={scheduleForm.dayblock}
                                onValueChange={(value) =>
                                    handleFieldChange("dayblock", value)
                                }
                                disabled={
                                    !canPatchSchedules || savingScheduleChanges
                                }
                                className={
                                    hasScheduleFieldChanged("dayblock")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                options={[
                                    { value: "", label: "-- Day block --" },
                                    ...dayblockOptions.map((option) => ({
                                        value: option.value,
                                        label: option.name,
                                    })),
                                ]}
                                placeholder={
                                    dayblockOptionsLoading
                                        ? "Loading day blocks..."
                                        : "-- Day block --"
                                }
                                searchPlaceholder="Search day blocks..."
                            />
                        ),
                    },
                    {
                        label: "Start Time",
                        value: (
                            <Input
                                className={`h-10 ${hasScheduleFieldChanged("time_start") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                type="time"
                                value={scheduleForm.time_start}
                                onChange={(event) =>
                                    handleFieldChange(
                                        "time_start",
                                        event.target.value,
                                    )
                                }
                                disabled={
                                    !canPatchSchedules || savingScheduleChanges
                                }
                            />
                        ),
                    },
                    {
                        label: "End Time",
                        value: (
                            <Input
                                className={`h-10 ${hasScheduleFieldChanged("time_end") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                type="time"
                                value={scheduleForm.time_end}
                                onChange={(event) =>
                                    handleFieldChange(
                                        "time_end",
                                        event.target.value,
                                    )
                                }
                                disabled={
                                    !canPatchSchedules || savingScheduleChanges
                                }
                            />
                        ),
                    },
                    ...(isTemporarySchedule
                        ? [
                              {
                                  label: "Date Start",
                                  value: (
                                      <Input
                                          className={`h-10 ${hasScheduleFieldChanged("date_start") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                          type="date"
                                          value={scheduleForm.date_start}
                                          onChange={(event) =>
                                              handleFieldChange(
                                                  "date_start",
                                                  event.target.value,
                                              )
                                          }
                                          disabled={
                                              !canPatchSchedules ||
                                              savingScheduleChanges
                                          }
                                      />
                                  ),
                              },
                              {
                                  label: "Date End",
                                  value: (
                                      <Input
                                          className={`h-10 ${hasScheduleFieldChanged("date_end") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                                          type="date"
                                          value={scheduleForm.date_end}
                                          onChange={(event) =>
                                              handleFieldChange(
                                                  "date_end",
                                                  event.target.value,
                                              )
                                          }
                                          disabled={
                                              !canPatchSchedules ||
                                              savingScheduleChanges
                                          }
                                      />
                                  ),
                              },
                          ]
                        : []),
                    {
                        label: "Inactive",
                        value: (
                            <SearchableSelect
                                value={scheduleForm.inactive}
                                onValueChange={(value) =>
                                    handleFieldChange(
                                        "inactive",
                                        value as "true" | "false",
                                    )
                                }
                                disabled={
                                    !canPatchSchedules || savingScheduleChanges
                                }
                                className={
                                    hasScheduleFieldChanged("inactive")
                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                        : undefined
                                }
                                options={[
                                    { value: "false", label: "No" },
                                    { value: "true", label: "Yes" },
                                ]}
                                placeholder="No"
                                searchPlaceholder="Search status..."
                            />
                        ),
                    },
                ]}
            />

            <PendingChangesBar
                pendingCount={
                    Object.keys(pendingScheduleChanges).length > 0 ? 1 : 0
                }
                saving={savingScheduleChanges}
                onSave={() => void handleSaveChanges()}
                onCancel={handleCancelChanges}
                disabled={!canPatchSchedules}
            />

            <OutdatedDataDialog
                open={showOutdatedDataDialog}
                onRefreshData={() => void refreshOutdatedScheduleData()}
                onCancelAction={() => setShowOutdatedDataDialog(false)}
                loading={savingScheduleChanges}
            />
        </DetailView>
    );
}
