import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import AdvancedFiltersPanel from "@/components/management/AdvancedFiltersPanel";
import SimpleDataTable, {
  type SimpleDataTableColumn,
} from "@/components/SimpleDataTable";
import {
  fetchInlineEmployeeOptions,
  fetchSessions,
  type InlineOption,
} from "../api_calls/UserData";
import { useAuth } from "../context/AuthContext";
import { useGlobalStatus } from "../context/GlobalStatusContext";
import { openSessionLink } from "../utils/openSessionLink";
import { toBackendBoundary } from "../utils/formatters";
import { type SessionRow, toSessionRows } from "../utils/sessionRows";
import { hasUserScope } from "../utils/userScopes";
import { getQueryBoolean, getQueryNumber, getQueryParam, updateSearchParams } from "../utils/urlQueryState";

const DEFAULT_PAGE_SIZE = 25;

export default function SessionTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { setStatus, clearStatus } = useGlobalStatus();
  const canStartSessions = hasUserScope(user, "sessions_start");
  const canJoinSessions = hasUserScope(user, "sessions_join");
  const [error, setError] = useState<string | null>(null);
  const [beginDate, setBeginDate] = useState(() => getQueryParam(searchParams, "begin"));
  const [endDate, setEndDate] = useState(() => getQueryParam(searchParams, "end"));
  const [appliedBeginDate, setAppliedBeginDate] = useState(() => getQueryParam(searchParams, "begin"));
  const [appliedEndDate, setAppliedEndDate] = useState(() => getQueryParam(searchParams, "end"));
  const [mentorKey, setMentorKey] = useState(() => getQueryParam(searchParams, "mentor"));
  const [taKey, setTaKey] = useState(() => getQueryParam(searchParams, "ta"));
  const [appliedMentorKey, setAppliedMentorKey] = useState(() => getQueryParam(searchParams, "mentor"));
  const [appliedTaKey, setAppliedTaKey] = useState(() => getQueryParam(searchParams, "ta"));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(() => getQueryBoolean(searchParams, "adv", false));
  const [page, setPage] = useState(() => getQueryNumber(searchParams, "page", 0));
  const [pageSize, setPageSize] = useState(() => getQueryNumber(searchParams, "size", DEFAULT_PAGE_SIZE, 1));
  const [rowCount, setRowCount] = useState(DEFAULT_PAGE_SIZE + 1);
  const [sessionOrder, setSessionOrder] = useState<"asc" | "desc">(() => getQueryParam(searchParams, "order", "desc") === "asc" ? "asc" : "desc");

  const sessionsQuery = useQuery({
    queryKey: ['sessions', user?.username, page, pageSize, appliedBeginDate, appliedEndDate, appliedMentorKey, appliedTaKey, sessionOrder],
    queryFn: async () => {
      const limit = pageSize;
      const offset = page * pageSize;
      const begin = toBackendBoundary(appliedBeginDate, "start");
      const end = toBackendBoundary(appliedEndDate, "end");
      const normalizedMentorKey = appliedMentorKey.trim();
      const normalizedTaKey = appliedTaKey.trim();

      const data = await fetchSessions({
        begin,
        end,
        mentorKey: normalizedMentorKey || undefined,
        taKey: normalizedTaKey || undefined,
        limit,
        offset,
        order: sessionOrder,
      });

      return { data, limit, offset };
    },
  });

  const employeeOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['inlineEmployeeOptions'],
    queryFn: () => fetchInlineEmployeeOptions(),
    enabled: showAdvancedFilters,
  });

  const loading = sessionsQuery.isFetching;
  const sessions = useMemo(() => {
    const data = sessionsQuery.data;
    if (!data) {
      return [] as SessionRow[];
    }

    return toSessionRows(data.data, data.offset);
  }, [sessionsQuery.data]);
  const employeeOptions = employeeOptionsQuery.data ?? [];
  const employeeOptionsLoading = employeeOptionsQuery.isFetching;

  useEffect(() => {
    if (sessionsQuery.error) {
      const message = sessionsQuery.error instanceof Error
        ? sessionsQuery.error.message
        : "Failed to load sessions";
      setRowCount(0);
      setError(message);
      return;
    }

    const data = sessionsQuery.data;
    if (!data) {
      return;
    }

    setError(null);
    if (data.data.length < data.limit) {
      setRowCount(data.offset + data.data.length);
      return;
    }

    setRowCount(data.offset + data.limit + 1);
  }, [sessionsQuery.data, sessionsQuery.error]);

  useEffect(() => {
    if (error) {
      setStatus(error, 'error');
      return;
    }

    if (sessionsQuery.isFetching) {
      setStatus('Loading sessions...');
      return;
    }

    clearStatus();
  }, [clearStatus, error, sessionsQuery.isFetching, setStatus]);

  useEffect(() => () => {
    clearStatus();
  }, [clearStatus]);

  const columns = useMemo<SimpleDataTableColumn<SessionRow>[]>(() => {
    const baseColumns: SimpleDataTableColumn<SessionRow>[] = [
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
          row.timestamp ? new Date(row.timestamp).toLocaleString() : "-",
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
        header: "Action",
        className: "w-[140px]",
        cellClassName: "text-right",
        render: (row) => {
          if (canStartSessions) {
            return (
              <Button
                type="button"
                size="sm"
                disabled={!row.start_url}
                onClick={() =>
                  row.start_url && void openSessionLink(row.start_url)
                }
              >
                Start
              </Button>
            );
          }

          return (
            <Button
              type="button"
              size="sm"
              disabled={!canJoinSessions || !row.join_url}
              onClick={() => row.join_url && void openSessionLink(row.join_url)}
            >
              Join
            </Button>
          );
        },
      },
    ];

    return baseColumns;
  }, [canJoinSessions, canStartSessions]);

  const applyAdvancedFilters = () => {
    setAppliedBeginDate(beginDate);
    setAppliedEndDate(endDate);
    setAppliedMentorKey(mentorKey);
    setAppliedTaKey(taKey);
    setPage(0);
    setSearchParams(updateSearchParams(searchParams, {
      begin: beginDate,
      end: endDate,
      mentor: mentorKey,
      ta: taKey,
      page: 0,
    }), { replace: true });
  };

  const clearAdvancedFilters = () => {
    setBeginDate("");
    setEndDate("");
    setMentorKey("");
    setTaKey("");
  };

  return (
    <section className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
      <div className="shrink-0 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Sessions</h2>
        </div>

        <div className="grid gap-2 sm:grid-cols-[minmax(0rem,1fr)_auto_auto]">
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
            onClick={() => void sessionsQuery.refetch()}
            disabled={loading}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <AdvancedFiltersPanel
        open={showAdvancedFilters}
        onClear={clearAdvancedFilters}
        onApply={applyAdvancedFilters}
      >
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Mentor</span>
            <SearchableSelect
              value={mentorKey}
              onValueChange={setMentorKey}
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
              value={taKey}
              onValueChange={setTaKey}
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
            <span className="text-muted-foreground">Begin Date</span>
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
          loadingMessage="Loading sessions..."
          emptyMessage="No sessions found."
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
          sortBy="timestamp"
          sortOrder={sessionOrder}
          onSortChange={(columnId, nextOrder) => {
            if (columnId !== "timestamp") {
              return;
            }
            setSessionOrder(nextOrder);
            setPage(0);
            setSearchParams(updateSearchParams(searchParams, { order: nextOrder, page: 0 }), { replace: true });
          }}
        />
      </div>
    </section>
  );
}
