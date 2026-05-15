import { useContext, useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchField from '@/components/management/SearchField';
import AdvancedFiltersPanel from '@/components/management/AdvancedFiltersPanel';
import { BackgroundDetailViewContext } from '@/components/management/DetailLayout';
import CreateClassDialog, { type CreateClassDialogValues } from '@/components/management/CreateClassDialog';
import ProgressMetricCell from '@/components/management/ProgressMetricCell';
import { SearchableSelect } from '@/components/ui/searchable-select';
import SimpleDataTable, { type SimpleDataTableColumn } from '@/components/SimpleDataTable';
import { useAuth } from '@/context/AuthContext';
import { useGlobalStatus } from '@/context/GlobalStatusContext';
import { cn } from '@/lib/utils';
import { getManagementDetailRoute } from '@/routing/navigation';
import {
  createManagementClass,
  fetchInlineGroupOptions,
  fetchManagementClasses,
  type InlineOption,
  type ManagementClass,
} from '@/api_calls/UserData';
import { formatDate } from '@/utils/formatters';
import { toDetailReturnUrl, useResolvedDetailViewMode } from '@/utils/detailViewMode';
import { getUserScopes } from '@/utils/userScopes';
import { getQueryBoolean, getQueryNumber, getQueryParam, updateSearchParams } from '@/utils/urlQueryState';

const DEFAULT_PAGE_SIZE = 25;

export type ManagementClassRow = ManagementClass & { id: string };

function toSessionProgressPercent(totalSessions: number | null | undefined, completedSessions: number | null | undefined) {
  if (!Number.isFinite(totalSessions) || !totalSessions || totalSessions <= 0) {
    return 0;
  }

  const completed = typeof completedSessions === 'number' ? completedSessions : 0;
  return Math.max(0, (completed / totalSessions) * 100);
}

function toStudentCountPercent(studentMaxCount: number | null | undefined, studentCount: number | null | undefined) {
  if (!Number.isFinite(studentMaxCount) || !studentMaxCount || studentMaxCount <= 0) {
    return 0;
  }

  const currentCount = typeof studentCount === 'number' ? studentCount : 0;
  return Math.max(0, (currentCount / studentMaxCount) * 100);
}

export default function ManagementClassesTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
  const detailViewMode = useResolvedDetailViewMode();
  const { user } = useAuth();
  const { setStatus, clearStatus } = useGlobalStatus();
  const userScopes = getUserScopes(user);
  const canCreateClasses = userScopes.includes('classes_post');

  const queryClient = useQueryClient();
  const [classes, setClasses] = useState<ManagementClassRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => getQueryParam(searchParams, 'q'));
  const [searchDraft, setSearchDraft] = useState(() => getQueryParam(searchParams, 'qd', getQueryParam(searchParams, 'q')));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(() => getQueryBoolean(searchParams, 'adv', false));
  const [selectedGroupKey, setSelectedGroupKey] = useState(() => getQueryParam(searchParams, 'group'));
  const [selectedStatus, setSelectedStatus] = useState(() => getQueryParam(searchParams, 'status'));
  const [appliedGroupKey, setAppliedGroupKey] = useState(() => getQueryParam(searchParams, 'group'));
  const [appliedStatus, setAppliedStatus] = useState(() => getQueryParam(searchParams, 'status'));
  const [rowCount, setRowCount] = useState(DEFAULT_PAGE_SIZE + 1);
  const [classesPage, setClassesPage] = useState(() => getQueryNumber(searchParams, 'page', 0));
  const [classesPageSize, setClassesPageSize] = useState(() => getQueryNumber(searchParams, 'size', DEFAULT_PAGE_SIZE, 1));
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [createClassError, setCreateClassError] = useState<string | null>(null);
  const classesQuery = useQuery({
    queryKey: ['managementClasses', user?.username, classesPage, classesPageSize, searchQuery, appliedGroupKey, appliedStatus],
    queryFn: async () => {
      const limit = classesPageSize;
      const offset = classesPage * classesPageSize;
      const normalizedQuery = searchQuery.trim();
      const normalizedGroupKey = appliedGroupKey.trim();
      const normalizedStatus = appliedStatus.trim();

      const data = await fetchManagementClasses(
        limit,
        offset,
        normalizedQuery || undefined,
        normalizedGroupKey || undefined,
        normalizedStatus || undefined,
      );

      return { data, limit, offset };
    },
  });

  const groupOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['inlineGroupOptions'],
    queryFn: () => fetchInlineGroupOptions(),
    enabled: showAdvancedFilters || isCreateClassOpen,
  });

  const createClassMutation = useMutation({
    mutationFn: (values: CreateClassDialogValues) => createManagementClass(values),
  });

  const loading = classesQuery.isFetching;
  const alignTableOptionsToLeft = Boolean(
    isBackgroundDetailView && detailViewMode.floating && detailViewMode.collapsed === '1',
  );
  const createClassSaving = createClassMutation.isPending;
  const groupOptionsLoading = groupOptionsQuery.isFetching;
  const groupOptions = groupOptionsQuery.data ?? [];

  useEffect(() => {
    if (classesQuery.error) {
      const message = classesQuery.error instanceof Error
        ? classesQuery.error.message
        : 'Failed to load classes';
      setClasses([]);
      setRowCount(0);
      setError(message);
      return;
    }

    const queryData = classesQuery.data;
    if (!queryData) {
      return;
    }

    setError(null);
    const classesWithIds = queryData.data.map((item, index) => ({
      ...item,
      id: item.appsheet_key || `${item.name}-${item.date_start}-${queryData.offset + index}`,
    }));
    setClasses(classesWithIds);
    setRowCount(queryData.data.length < queryData.limit
      ? queryData.offset + queryData.data.length
      : queryData.offset + queryData.limit + 1);
  }, [classesQuery.data, classesQuery.error]);

  useEffect(() => {
    if (createClassError) {
      setStatus(createClassError, 'error');
      return;
    }

    if (error) {
      setStatus(error, 'error');
      return;
    }

    if (classesQuery.isFetching) {
      setStatus('Loading classes...');
      return;
    }

    clearStatus();
  }, [classesQuery.isFetching, clearStatus, createClassError, error, setStatus]);

  useEffect(() => () => {
    clearStatus();
  }, [clearStatus]);

  const submitClassesSearch = () => {
    setClassesPage(0);
    const nextQuery = searchDraft.trim();
    setSearchQuery(nextQuery);
    setSearchParams(updateSearchParams(searchParams, { q: nextQuery, qd: searchDraft, page: 0 }), { replace: true });
  };

  const applyAdvancedFilters = () => {
    setAppliedGroupKey(selectedGroupKey);
    setAppliedStatus(selectedStatus);
    setClassesPage(0);
    setSearchParams(updateSearchParams(searchParams, {
      group: selectedGroupKey,
      status: selectedStatus,
      page: 0,
    }), { replace: true });
  };

  const clearAdvancedFilters = () => {
    setSelectedGroupKey('');
    setSelectedStatus('');
  };

  const handleCreateClass = async (values: CreateClassDialogValues) => {
    try {
      setCreateClassError(null);
      await createClassMutation.mutateAsync(values);
      await queryClient.invalidateQueries({
        queryKey: ['managementClasses', user?.username],
      });
      setIsCreateClassOpen(false);
      setClassesPage(0);
      await classesQuery.refetch();
    } catch (err) {
      setCreateClassError(err instanceof Error ? err.message : 'Failed to create class');
    }
  };

  const classColumns = useMemo<SimpleDataTableColumn<ManagementClassRow>[]>(() => [
    {
      id: 'name',
      header: 'Class',
      className: 'min-w-[220px]',
      cellClassName: 'font-medium text-foreground',
      render: (row) => row.name || '-',
    },
    {
      id: 'class_group',
      header: 'Group',
      className: 'w-[150px]',
      render: (row) => row.class_group || '-',
    },
    {
      id: 'status',
      header: 'Status',
      className: 'w-[150px]',
      render: (row) => row.status || '-',
    },
    {
      id: 'date_range',
      header: 'Date Range',
      className: 'min-w-[260px]',
      render: (row) => `${formatDate(row.date_start)} - ${formatDate(row.date_end)}`,
    },
    {
      id: 'session_progress',
      header: 'Sessions',
      className: 'min-w-[260px]',
      render: (row) => (
        <ProgressMetricCell
          primaryLabel={`${row.completed_sessions ?? 0} / ${row.total_sessions ?? 0}`}
          secondaryLabel={`${Math.round(toSessionProgressPercent(row.total_sessions, row.completed_sessions))}%`}
          percent={toSessionProgressPercent(row.total_sessions, row.completed_sessions)}
        />
      ),
    },
    {
      id: 'student_count',
      header: 'Students',
      className: 'min-w-[260px]',
      render: (row) => (
        <ProgressMetricCell
          primaryLabel={`${row.student_count ?? 0} / ${row.student_max_count ?? 0}`}
          secondaryLabel={`${Math.round(toStudentCountPercent(row.student_max_count, row.student_count))}%`}
          percent={toStudentCountPercent(row.student_max_count, row.student_count)}
        />
      ),
    },
  ], []);

  return (
    <section className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
      <div
        className={cn(
          'shrink-0 flex flex-col gap-3 lg:flex-row',
          alignTableOptionsToLeft ? 'lg:items-start lg:justify-start' : 'lg:items-end lg:justify-between',
        )}
      >
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Classes</h2>
        </div>

        <div className={cn(
          'grid gap-2 sm:grid-cols-[minmax(16rem,1fr)_auto_auto_auto]',
          alignTableOptionsToLeft ? 'lg:ml-0' : 'lg:ml-auto',
        )}>
          <SearchField
            value={searchDraft}
            onChange={(value) => {
              setSearchDraft(value);
              if (value === '') {
                setSearchQuery('');
                setSearchParams(updateSearchParams(searchParams, { q: '', qd: '' }), { replace: true });
              }
            }}
            onSubmit={submitClassesSearch}
            placeholder="Search classes"
          />
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
            onClick={() => void classesQuery.refetch()}
            disabled={loading}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          {canCreateClasses && (
            <Button
              type="button"
              onClick={() => {
                setCreateClassError(null);
                setIsCreateClassOpen(true);
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
            <span className="text-muted-foreground">Class Group</span>
            <SearchableSelect
              value={selectedGroupKey}
              onValueChange={(value) => {
                setSelectedGroupKey(value);
              }}
              options={[
                { value: '', label: 'All groups' },
                ...groupOptions.map((option) => ({ value: option.value, label: option.name })),
              ]}
              placeholder="All groups"
              searchPlaceholder="Search groups..."
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Status</span>
            <SearchableSelect
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value);
              }}
              options={[
                { value: '', label: 'All statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Recruiting', label: 'Recruiting' },
                { value: 'Completed', label: 'Completed' },
              ]}
              placeholder="All statuses"
              searchPlaceholder="Search statuses..."
            />
          </label>
      </AdvancedFiltersPanel>


      <div data-table-viewport className="min-h-0 flex-1 overflow-hidden">
        <SimpleDataTable
          columns={classColumns}
          rows={classes}
          rowKey={(row) => row.id}
          loading={loading}
          loadingMessage="Loading classes..."
          emptyMessage="No classes returned by the API for this page."
          page={classesPage}
          pageSize={classesPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageChange={(nextPage) => {
            setClassesPage(nextPage);
            setSearchParams(updateSearchParams(searchParams, { page: nextPage }), { replace: true });
          }}
          onPageSizeChange={(nextPageSize) => {
            setClassesPageSize(nextPageSize);
            setClassesPage(0);
            setSearchParams(updateSearchParams(searchParams, { size: nextPageSize, page: 0 }), { replace: true });
          }}
          onRowClick={(row) => {
            if (!row.appsheet_key?.trim()) {
              return;
            }

            const query = new URLSearchParams({
              returnUrl: toDetailReturnUrl(`${location.pathname}${location.search}`),
            });
            navigate(
              `${getManagementDetailRoute('classes', row.appsheet_key)}?${query.toString()}`,
            );
          }}
          paginationMode="server"
          totalRowCount={rowCount}
        />
      </div>

      <CreateClassDialog
        open={isCreateClassOpen}
        saving={createClassSaving}
        error={createClassError}
        groupOptions={groupOptions}
        groupOptionsLoading={groupOptionsLoading}
        onClose={() => {
          if (createClassSaving) {
            return;
          }

          setIsCreateClassOpen(false);
          setCreateClassError(null);
        }}
        onSubmit={handleCreateClass}
      />
    </section>
  );
}
