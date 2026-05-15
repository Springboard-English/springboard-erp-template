import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import AdvancedFiltersPanel from "@/components/management/AdvancedFiltersPanel";
import { BackgroundDetailViewContext } from "@/components/management/DetailLayout";
import CreateScheduleDialog, {
    type CreateScheduleDialogValues,
} from "@/components/management/CreateScheduleDialog";
import SimpleDataTable, {
    type SimpleDataTableColumn,
} from "@/components/SimpleDataTable";
import {
    createManagementSchedule,
    fetchAccountOptions,
    fetchDayblockOptions,
    fetchInlineEmployeeOptions,
    fetchInlineSessionClassOptions,
    fetchManagementSchedules,
    type InlineOption,
    type ManagementSchedule,
} from "@/api_calls/UserData";
import { getManagementDetailRoute } from "@/routing/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import { cn } from "@/lib/utils";
import { getUserScopes } from "@/utils/userScopes";
import { toDetailReturnUrl, useResolvedDetailViewMode } from "@/utils/detailViewMode";
import {
    getQueryBoolean,
    getQueryNumber,
    getQueryParam,
    updateSearchParams,
} from "@/utils/urlQueryState";

const DEFAULT_PAGE_SIZE = 25;

type ManagementScheduleRow = ManagementSchedule & { id: string };

export default function ManagementSchedulesTable() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
    const detailViewMode = useResolvedDetailViewMode();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { setStatus, clearStatus } = useGlobalStatus();
    const userScopes = getUserScopes(user);
    const canCreateSchedules = userScopes.includes("schedules_post");
    const [error, setError] = useState<string | null>(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(() =>
        getQueryBoolean(searchParams, "adv", true),
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
    const [selectedAccountKey, setSelectedAccountKey] = useState(() =>
        getQueryParam(searchParams, "account"),
    );
    const [selectedActive, setSelectedActive] = useState<
        "true" | "false" | "all"
    >(() => {
        const value = getQueryParam(searchParams, "active", "true");
        return value === "false" || value === "all" ? value : "true";
    });
    const [selectedType, setSelectedType] = useState(() =>
        getQueryParam(searchParams, "type"),
    );
    const [selectedDay, setSelectedDay] = useState(() =>
        getQueryParam(searchParams, "day"),
    );
    const [selectedDayblock, setSelectedDayblock] = useState(() =>
        getQueryParam(searchParams, "dayblock"),
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
    const [appliedAccountKey, setAppliedAccountKey] = useState(() =>
        getQueryParam(searchParams, "account"),
    );
    const [appliedActive, setAppliedActive] = useState<"true" | "false" | "all">(() => {
        const value = getQueryParam(searchParams, "active", "true");
        return value === "false" || value === "all" ? value : "true";
    });
    const [appliedType, setAppliedType] = useState(() =>
        getQueryParam(searchParams, "type"),
    );
    const [appliedDay, setAppliedDay] = useState(() =>
        getQueryParam(searchParams, "day"),
    );
    const [appliedDayblock, setAppliedDayblock] = useState(() =>
        getQueryParam(searchParams, "dayblock"),
    );
    const [rowCount, setRowCount] = useState(DEFAULT_PAGE_SIZE + 1);
    const [page, setPage] = useState(() => getQueryNumber(searchParams, "page", 0));
    const [pageSize, setPageSize] = useState(() =>
        getQueryNumber(searchParams, "size", DEFAULT_PAGE_SIZE, 1),
    );
    const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
    const [createScheduleError, setCreateScheduleError] = useState<
        string | null
    >(null);
    const filterOptionsQuery = useQuery({
        queryKey: ["managementScheduleFilters"],
        queryFn: async () => {
            const [classOptions, employeeOptions, accountOptions, dayblockOptions] =
                await Promise.all([
                    fetchInlineSessionClassOptions(),
                    fetchInlineEmployeeOptions(),
                    fetchAccountOptions(),
                    fetchDayblockOptions(),
                ]);
            return { classOptions, employeeOptions, accountOptions, dayblockOptions };
        },
        enabled: showAdvancedFilters || isCreateScheduleOpen,
    });
    const dayblockOptionsQuery = useQuery<InlineOption[]>({
        queryKey: ["dayblockOptions"],
        queryFn: () => fetchDayblockOptions(),
    });
    const schedulesQuery = useQuery({
        queryKey: [
            "managementSchedules",
            user?.username,
            page,
            pageSize,
            appliedClassKey,
            appliedMentorKey,
            appliedTaKey,
            appliedAccountKey,
            appliedActive,
            appliedType,
            appliedDay,
            appliedDayblock,
        ],
        queryFn: async () => {
            const limit = pageSize;
            const offset = page * pageSize;
            const normalizedClassKey = appliedClassKey.trim();
            const normalizedMentorKey = appliedMentorKey.trim();
            const normalizedTaKey = appliedTaKey.trim();
            const normalizedAccountKey = appliedAccountKey.trim();
            const normalizedType = appliedType.trim();
            const normalizedDay = appliedDay.trim();
            const normalizedDayblock = appliedDayblock.trim();
            const activeFilter =
                appliedActive === "all"
                    ? undefined
                    : appliedActive === "true";
            const data = await fetchManagementSchedules(limit, offset, {
                classKey: normalizedClassKey || undefined,
                mentorKey: normalizedMentorKey || undefined,
                taKey: normalizedTaKey || undefined,
                accountKey: normalizedAccountKey || undefined,
                active: activeFilter,
                type: normalizedType || undefined,
                day: normalizedDay || undefined,
                dayblock: normalizedDayblock || undefined,
            });
            return { data, limit, offset };
        },
    });
    const createScheduleMutation = useMutation({
        mutationFn: (values: CreateScheduleDialogValues) =>
            createManagementSchedule(values),
    });
    const loading = schedulesQuery.isFetching;
    const alignTableOptionsToLeft = Boolean(
        isBackgroundDetailView &&
            detailViewMode.floating &&
            detailViewMode.collapsed === "1",
    );
    const createScheduleSaving = createScheduleMutation.isPending;
    const classOptions = filterOptionsQuery.data?.classOptions ?? [];
    const accountOptions = filterOptionsQuery.data?.accountOptions ?? [];
    const employeeOptions = filterOptionsQuery.data?.employeeOptions ?? [];
    const dayblockOptions =
        filterOptionsQuery.data?.dayblockOptions ?? dayblockOptionsQuery.data ?? [];
    const schedules = useMemo<ManagementScheduleRow[]>(
        () =>
            schedulesQuery.data
                ? schedulesQuery.data.data.map((item, index) => ({
                      ...item,
                      id:
                          item.appsheet_key ||
                          `${item.name}-${item.day}-${item.time_start}-${schedulesQuery.data.offset + index}`,
                  }))
                : [],
        [schedulesQuery.data],
    );

    const dayblockLabelsByKey = useMemo(
        () =>
            new Map(
                dayblockOptions.map((option) => [option.value, option.name]),
            ),
        [dayblockOptions],
    );

    const getDayblockLabel = (row: ManagementScheduleRow) => {
        const dayblockKey = row.dayblock_key ?? row.dayblock;
        const fallbackLabel = dayblockKey
            ? dayblockLabelsByKey.get(dayblockKey)
            : undefined;
        return row.dayblock_name || fallbackLabel || dayblockKey || "-";
    };

    const columns = useMemo<SimpleDataTableColumn<ManagementScheduleRow>[]>(
        () => [
            {
                id: "name",
                header: "Class",
                className: "min-w-[220px]",
                cellClassName: "font-medium text-foreground",
                render: (row) => row.name || "-",
            },
            {
                id: "type",
                header: "Type",
                className: "min-w-[120px]",
                render: (row) => row.type || "-",
            },
            {
                id: "day",
                header: "Day",
                className: "min-w-[100px]",
                render: (row) => row.day || "-",
            },
            {
                id: "dayblock",
                header: "Day block",
                className: "min-w-[120px]",
                render: (row) => getDayblockLabel(row),
            },
            {
                id: "time_start",
                header: "Start",
                className: "min-w-[110px]",
                render: (row) => row.time_start || "-",
            },
            {
                id: "time_end",
                header: "End",
                className: "min-w-[110px]",
                render: (row) => row.time_end || "-",
            },
            {
                id: "mentor_name",
                header: "Mentor",
                className: "min-w-[170px]",
                render: (row) => row.mentor_name || "-",
            },
            {
                id: "ta_name",
                header: "Teaching Assistant",
                className: "min-w-[190px]",
                render: (row) => row.ta_name || "-",
            },
            {
                id: "account",
                header: "Account",
                className: "min-w-[220px]",
                render: (row) => row.account || "-",
            },
            {
                id: "inactive",
                header: "Inactive",
                className: "min-w-[110px]",
                render: (row) => (row.inactive ? "Yes" : "No"),
            },
        ],
        [dayblockLabelsByKey],
    );

    useEffect(() => {
        if (schedulesQuery.error) {
            setRowCount(0);
            setError(
                schedulesQuery.error instanceof Error
                    ? schedulesQuery.error.message
                    : "Failed to load schedules",
            );
            return;
        }

        if (!schedulesQuery.data) {
            return;
        }

        setError(null);
        if (schedulesQuery.data.data.length < schedulesQuery.data.limit) {
            setRowCount(schedulesQuery.data.offset + schedulesQuery.data.data.length);
            return;
        }
        setRowCount(schedulesQuery.data.offset + schedulesQuery.data.limit + 1);
    }, [schedulesQuery.data, schedulesQuery.error]);

    useEffect(() => {
        if (error) {
            setStatus(error, "error");
            return;
        }

        if (schedulesQuery.isFetching) {
            setStatus("Loading schedules...");
            return;
        }

        clearStatus();
    }, [clearStatus, error, schedulesQuery.isFetching, setStatus]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    const handleCreateSchedule = async (values: CreateScheduleDialogValues) => {
        try {
            setCreateScheduleError(null);
            await createScheduleMutation.mutateAsync(values);
            await queryClient.invalidateQueries({
                queryKey: ["managementSchedules", user?.username],
            });
            setIsCreateScheduleOpen(false);
            setPage(0);
            await schedulesQuery.refetch();
        } catch (err) {
            setCreateScheduleError(
                err instanceof Error ? err.message : "Failed to create schedule",
            );
        }
    };

    const applyAdvancedFilters = () => {
        setAppliedClassKey(selectedClassKey);
        setAppliedMentorKey(selectedMentorKey);
        setAppliedTaKey(selectedTaKey);
        setAppliedAccountKey(selectedAccountKey);
        setAppliedActive(selectedActive);
        setAppliedType(selectedType);
        setAppliedDay(selectedDay);
        setAppliedDayblock(selectedDayblock);
        setPage(0);
        setSearchParams(
            updateSearchParams(searchParams, {
                class: selectedClassKey,
                mentor: selectedMentorKey,
                ta: selectedTaKey,
                account: selectedAccountKey,
                active: selectedActive,
                type: selectedType,
                day: selectedDay,
                dayblock: selectedDayblock,
                page: 0,
            }),
            { replace: true },
        );
    };

    const clearAdvancedFilters = () => {
        setSelectedClassKey("");
        setSelectedMentorKey("");
        setSelectedTaKey("");
        setSelectedAccountKey("");
        setSelectedActive("true");
        setSelectedType("");
        setSelectedDay("");
        setSelectedDayblock("");
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
                        Schedules
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
                            setSearchParams(updateSearchParams(searchParams, { adv: nextShow }), { replace: true });
                        }}
                    >
                        <SlidersHorizontal className="size-4" />
                        Advanced
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => void schedulesQuery.refetch()}
                        disabled={loading}
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

            <AdvancedFiltersPanel
                open={showAdvancedFilters}
                onClear={clearAdvancedFilters}
                onApply={applyAdvancedFilters}
            >
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
                            onValueChange={(value) => {
                                setSelectedMentorKey(value);
                            }}
                            options={[
                                { value: "", label: "All mentors" },
                                ...employeeOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
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
                            value={selectedTaKey}
                            onValueChange={(value) => {
                                setSelectedTaKey(value);
                            }}
                            options={[
                                { value: "", label: "All TAs" },
                                ...employeeOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
                            ]}
                            placeholder="All TAs"
                            searchPlaceholder="Search assistants..."
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Account</span>
                        <SearchableSelect
                            value={selectedAccountKey}
                            onValueChange={(value) => {
                                setSelectedAccountKey(value);
                            }}
                            options={[
                                { value: "", label: "All accounts" },
                                ...accountOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
                            ]}
                            placeholder="All accounts"
                            searchPlaceholder="Search accounts..."
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Active</span>
                        <SearchableSelect
                            value={selectedActive}
                            onValueChange={(value) => {
                                setSelectedActive(
                                    value as "true" | "false" | "all",
                                );
                            }}
                            options={[
                                { value: "true", label: "Active only" },
                                { value: "false", label: "Inactive only" },
                                { value: "all", label: "All statuses" },
                            ]}
                            placeholder="Active only"
                            searchPlaceholder="Search status..."
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Type</span>
                        <SearchableSelect
                            value={selectedType}
                            onValueChange={(value) => {
                                setSelectedType(value);
                            }}
                            options={[
                                { value: "", label: "All types" },
                                { value: "Permanent", label: "Permanent" },
                                { value: "Temporary", label: "Temporary" },
                            ]}
                            placeholder="All types"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Day</span>
                        <SearchableSelect
                            value={selectedDay}
                            onValueChange={(value) => {
                                setSelectedDay(value);
                            }}
                            options={[
                                { value: "", label: "All days" },
                                { value: "Monday", label: "Monday" },
                                { value: "Tuesday", label: "Tuesday" },
                                { value: "Wednesday", label: "Wednesday" },
                                { value: "Thursday", label: "Thursday" },
                                { value: "Friday", label: "Friday" },
                                { value: "Saturday", label: "Saturday" },
                                { value: "Sunday", label: "Sunday" },
                            ]}
                            placeholder="All days"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span className="text-muted-foreground">Dayblock</span>
                        <SearchableSelect
                            value={selectedDayblock}
                            onValueChange={(value) => {
                                setSelectedDayblock(value);
                            }}
                            options={[
                                { value: "", label: "All day blocks" },
                                ...dayblockOptions.map((option) => ({
                                    value: option.value,
                                    label: option.name,
                                })),
                            ]}
                            placeholder="All day blocks"
                            searchPlaceholder="Search day blocks..."
                        />
                    </label>
            </AdvancedFiltersPanel>

            <div data-table-viewport className="min-h-0 flex-1 overflow-hidden">
                <SimpleDataTable
                    columns={columns}
                    rows={schedules}
                    rowKey={(row) => row.id}
                    onRowClick={(row) => {
                        if (!row.appsheet_key) {
                            return;
                        }

                        const query = new URLSearchParams({
                            returnUrl: toDetailReturnUrl(
                                `${location.pathname}${location.search}`,
                            ),
                        });

                        navigate(
                            `${getManagementDetailRoute("schedules", row.appsheet_key)}?${query.toString()}`,
                        );
                    }}
                    loading={loading}
                    loadingMessage="Loading schedules..."
                    emptyMessage="No schedules found."
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
                    paginationMode="server"
                    totalRowCount={rowCount}
                />
            </div>

            <CreateScheduleDialog
                open={isCreateScheduleOpen}
                saving={createScheduleSaving}
                error={createScheduleError}
                defaultClassKey={selectedClassKey}
                onClose={() => {
                    if (createScheduleSaving) {
                        return;
                    }
                    setIsCreateScheduleOpen(false);
                    setCreateScheduleError(null);
                }}
                onSubmit={handleCreateSchedule}
            />
        </section>
    );
}
