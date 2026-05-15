import { useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import AdvancedFiltersPanel from '@/components/management/AdvancedFiltersPanel';
import { BackgroundDetailViewContext } from '@/components/management/DetailLayout';
import SimpleDataTable, { type SimpleDataTableColumn } from '@/components/SimpleDataTable';
import {
  ClassFeedback,
  fetchManagementClasses,
  fetchManagementFeedbacks,
  type InlineOption,
} from '@/api_calls/UserData';
import { useAuth } from '@/context/AuthContext';
import { useGlobalStatus } from '@/context/GlobalStatusContext';
import { cn } from '@/lib/utils';
import { getManagementDetailRoute } from '@/routing/navigation';
import { toDetailReturnUrl, useResolvedDetailViewMode } from '@/utils/detailViewMode';
import { formatUserTimestamp, toBackendBoundary } from '@/utils/formatters';
import { getQueryBoolean, getQueryNumber, getQueryParam, updateSearchParams } from '@/utils/urlQueryState';

const DEFAULT_PAGE_SIZE = 25;

type ClassFeedbackRow = ClassFeedback & { id: string };

export default function ManagementFeedbacksTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
  const detailViewMode = useResolvedDetailViewMode();
  const { user } = useAuth();
  const { setStatus, clearStatus } = useGlobalStatus();
  const [feedbacks, setFeedbacks] = useState<ClassFeedbackRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => getQueryParam(searchParams, 'q'));
  const [searchDraft, setSearchDraft] = useState(() => getQueryParam(searchParams, 'qd', getQueryParam(searchParams, 'q')));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(() => getQueryBoolean(searchParams, 'adv', false));
  const [classOptions, setClassOptions] = useState<InlineOption[]>([]);
  const [selectedClassKey, setSelectedClassKey] = useState(() => getQueryParam(searchParams, 'class'));
  const [beginDate, setBeginDate] = useState(() => getQueryParam(searchParams, 'begin'));
  const [endDate, setEndDate] = useState(() => getQueryParam(searchParams, 'end'));
  const [appliedClassKey, setAppliedClassKey] = useState(() => getQueryParam(searchParams, 'class'));
  const [appliedBeginDate, setAppliedBeginDate] = useState(() => getQueryParam(searchParams, 'begin'));
  const [appliedEndDate, setAppliedEndDate] = useState(() => getQueryParam(searchParams, 'end'));
  const [rowCount, setRowCount] = useState(DEFAULT_PAGE_SIZE + 1);
  const [page, setPage] = useState(() => getQueryNumber(searchParams, 'page', 0));
  const [pageSize, setPageSize] = useState(() => getQueryNumber(searchParams, 'size', DEFAULT_PAGE_SIZE, 1));

  const columns = useMemo<SimpleDataTableColumn<ClassFeedbackRow>[]>(() => [
    {
      id: 'student_name',
      header: 'Student',
      className: 'min-w-[220px]',
      cellClassName: 'font-medium text-foreground',
      render: (row) => row.student_name || '-',
    },
    {
      id: 'class_name',
      header: 'Class',
      className: 'min-w-[220px]',
      render: (row) => row.class_name || '-',
    },
    {
      id: 'created_at',
      header: 'Timestamp',
      className: 'min-w-[220px]',
      render: (row) => formatUserTimestamp(row.created_at ?? undefined),
    },
  ], []);

  const feedbacksQuery = useQuery({
    queryKey: ['managementFeedbacks', user?.username, page, pageSize, appliedClassKey, appliedBeginDate, appliedEndDate],
    queryFn: async () => {
      const limit = pageSize;
      const offset = page * pageSize;
      const begin = toBackendBoundary(appliedBeginDate, 'start');
      const end = toBackendBoundary(appliedEndDate, 'end');
      const normalizedClassKey = appliedClassKey.trim();
      const data = await fetchManagementFeedbacks(
        limit,
        offset,
        normalizedClassKey || undefined,
        begin,
        end,
      );
      return { data, limit, offset };
    },
  });

  const classOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['managementClassOptions'],
    queryFn: async () => {
      const classes = await fetchManagementClasses(-1, 0);
      return classes
        .filter((item) => item.appsheet_key && item.name)
        .map((item) => ({ value: item.appsheet_key, name: item.name }));
    },
    enabled: showAdvancedFilters,
  });
  const loading = feedbacksQuery.isFetching;
  const alignTableOptionsToLeft = Boolean(
    isBackgroundDetailView && detailViewMode.floating && detailViewMode.collapsed === '1',
  );

  useEffect(() => {
    if (feedbacksQuery.error) {
      const message = feedbacksQuery.error instanceof Error ? feedbacksQuery.error.message : 'Failed to load feedbacks';
      setFeedbacks([]);
      setRowCount(0);
      setError(message);
      return;
    }

    const queryData = feedbacksQuery.data;
    if (!queryData) {
      return;
    }

    setError(null);
    const feedbacksWithIds = queryData.data.map((feedback, index) => ({
      ...feedback,
      id: feedback.appsheet_key || `${feedback.student_name}-${feedback.class_name}-${queryData.offset + index}`,
    }));
    setFeedbacks(feedbacksWithIds);

    if (queryData.data.length < queryData.limit) {
      setRowCount(queryData.offset + queryData.data.length);
      return;
    }
    setRowCount(queryData.offset + queryData.limit + 1);
  }, [feedbacksQuery.data, feedbacksQuery.error]);

  useEffect(() => {
    if (classOptionsQuery.data) {
      setClassOptions(classOptionsQuery.data);
      return;
    }
    if (classOptionsQuery.error) {
      setClassOptions([]);
    }
  }, [classOptionsQuery.data, classOptionsQuery.error]);

  useEffect(() => {
    const state = (location.state as { sidebarResetTab?: string } | null) ?? null;
    if (state?.sidebarResetTab === 'feedbacks') {
      setSearchDraft('');
      setSearchQuery('');
      setSearchParams(updateSearchParams(searchParams, { q: '', qd: '', page: 0 }), { replace: true });
    }
  }, [location.key, location.state, searchParams, setSearchParams]);

  useEffect(() => {
    if (error) {
      setStatus(error, 'error');
      return;
    }

    if (feedbacksQuery.isFetching) {
      setStatus('Loading feedbacks...');
      return;
    }

    clearStatus();
  }, [clearStatus, error, feedbacksQuery.isFetching, setStatus]);

  useEffect(() => () => {
    clearStatus();
  }, [clearStatus]);

  const filteredFeedbacks = useMemo(() => {
    if (!searchQuery.trim()) {
      return feedbacks;
    }

    const query = searchQuery.toLowerCase();
    return feedbacks.filter((feedback) => (
      feedback.student_name?.toLowerCase().includes(query) ||
      feedback.class_name?.toLowerCase().includes(query) ||
      feedback.request?.toLowerCase().includes(query) ||
      feedback.feedback_extra?.toLowerCase().includes(query) ||
      formatUserTimestamp(feedback.created_at ?? undefined).toLowerCase().includes(query)
    ));
  }, [feedbacks, searchQuery]);

  const applyAdvancedFilters = () => {
    setAppliedClassKey(selectedClassKey);
    setAppliedBeginDate(beginDate);
    setAppliedEndDate(endDate);
    setPage(0);
    setSearchParams(updateSearchParams(searchParams, {
      class: selectedClassKey,
      begin: beginDate,
      end: endDate,
      page: 0,
    }), { replace: true });
  };

  const clearAdvancedFilters = () => {
    setSelectedClassKey('');
    setBeginDate('');
    setEndDate('');
  };

  return (
    <section className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
      <div
        className={cn(
          'shrink-0 flex flex-col gap-3 lg:flex-row',
          alignTableOptionsToLeft ? 'lg:items-start lg:justify-start' : 'lg:items-end lg:justify-between',
        )}
      >
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Feedbacks</h2>
        </div>

        <div className={cn(
          'grid gap-2 sm:grid-cols-[minmax(16rem,1fr)_auto_auto]',
          alignTableOptionsToLeft ? 'lg:ml-0' : 'lg:ml-auto',
        )}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchDraft}
              onChange={(event) => {
                const value = event.target.value;
                setSearchDraft(value);
                setSearchParams(updateSearchParams(searchParams, { qd: value }), { replace: true });
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  const nextQuery = searchDraft.trim();
                  setSearchQuery(nextQuery);
                  setSearchParams(updateSearchParams(searchParams, { q: nextQuery, page: 0 }), { replace: true });
                }
              }}
              placeholder="Search feedbacks"
              className="pl-9 pr-9"
            />
            {searchDraft && (
              <button
                type="button"
                onClick={() => {
                  setSearchDraft('');
                  setSearchQuery('');
                  setSearchParams(updateSearchParams(searchParams, { q: '', qd: '', page: 0 }), { replace: true });
                }}
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
            onClick={() => void feedbacksQuery.refetch()}
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
            <span className="text-muted-foreground">Class</span>
            <SearchableSelect
              value={selectedClassKey}
              onValueChange={(value) => {
                setSelectedClassKey(value);
              }}
              options={[
                { value: '', label: 'All classes' },
                ...classOptions.map((option) => ({ value: option.value, label: option.name })),
              ]}
              placeholder="All classes"
              searchPlaceholder="Search classes..."
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
          rows={filteredFeedbacks}
          rowKey={(row) => row.id}
          loading={loading}
          loadingMessage="Loading feedbacks..."
          emptyMessage="No feedbacks found."
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
              returnUrl: toDetailReturnUrl(`${location.pathname}${location.search}`),
              rootLabel: 'Feedbacks',
            });
            if (row.class_name?.trim()) {
              query.set('className', row.class_name);
            }

            navigate(
              `${getManagementDetailRoute('feedbacks', row.appsheet_key)}?${query.toString()}`,
            );
          }}
          paginationMode="server"
          totalRowCount={rowCount}
        />
      </div>
    </section>
  );
}
