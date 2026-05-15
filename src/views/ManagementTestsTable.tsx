import { useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import AdvancedFiltersPanel from '@/components/management/AdvancedFiltersPanel';
import { BackgroundDetailViewContext } from '@/components/management/DetailLayout';
import SimpleDataTable, { type SimpleDataTableColumn } from '@/components/SimpleDataTable';
import CreateTestDialog from '@/components/management/CreateTestDialog';
import {
  createManagementTest,
  fetchInlineGroupOptions,
  fetchManagementTests,
  type InlineOption,
  type ManagementTest,
} from '@/api_calls/UserData';
import { useAuth } from '@/context/AuthContext';
import { useGlobalStatus } from '@/context/GlobalStatusContext';
import { cn } from '@/lib/utils';
import { getManagementDetailRoute } from '@/routing/navigation';
import { toDetailReturnUrl, useResolvedDetailViewMode } from '@/utils/detailViewMode';
import { getUserScopes } from '@/utils/userScopes';
import { getQueryBoolean, getQueryNumber, getQueryParam, updateSearchParams } from '@/utils/urlQueryState';

const DEFAULT_PAGE_SIZE = 25;

type ManagementTestRow = ManagementTest & {
  id: string;
};

export default function ManagementTestsTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
  const detailViewMode = useResolvedDetailViewMode();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { setStatus, clearStatus } = useGlobalStatus();
  const userScopes = getUserScopes(user);
  const canCreateTests = userScopes.includes('tests_post');
  const [tests, setTests] = useState<ManagementTestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => getQueryParam(searchParams, 'q'));
  const [searchDraft, setSearchDraft] = useState(() => getQueryParam(searchParams, 'qd', getQueryParam(searchParams, 'q')));
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(() => getQueryBoolean(searchParams, 'adv', false));
  const [selectedGroupKey, setSelectedGroupKey] = useState(() => getQueryParam(searchParams, 'group'));
  const [appliedGroupKey, setAppliedGroupKey] = useState(() => getQueryParam(searchParams, 'group'));
  const [rowCount, setRowCount] = useState(DEFAULT_PAGE_SIZE + 1);
  const [page, setPage] = useState(() => getQueryNumber(searchParams, 'page', 0));
  const [pageSize, setPageSize] = useState(() => getQueryNumber(searchParams, 'size', DEFAULT_PAGE_SIZE, 1));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [groupOptions, setGroupOptions] = useState<InlineOption[]>([]);

  const columns = useMemo<SimpleDataTableColumn<ManagementTestRow>[]>(() => [
    {
      id: 'name',
      header: 'Test Name',
      className: 'min-w-[220px]',
      cellClassName: 'font-medium text-foreground',
      render: (row) => row.name || '-',
    },
    {
      id: 'group_name',
      header: 'Test Group',
      className: 'min-w-[180px]',
      render: (row) => row.group_name || '-',
    },
    {
      id: 'timestamp',
      header: 'Timestamp',
      className: 'min-w-[180px]',
      render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString() : '-',
    },
  ], []);

  const testsQuery = useQuery({
    queryKey: ['managementTests', user?.username, page, pageSize, appliedGroupKey],
    queryFn: async () => {
      const limit = pageSize;
      const offset = page * pageSize;
      const normalizedGroupKey = appliedGroupKey.trim();
      const data = await fetchManagementTests(limit, offset, normalizedGroupKey || undefined);
      return { data, limit, offset };
    },
  });

  const groupOptionsQuery = useQuery<InlineOption[]>({
    queryKey: ['inlineGroupOptions'],
    queryFn: () => fetchInlineGroupOptions(),
    enabled: showAdvancedFilters || isCreateDialogOpen,
  });

  const createTestMutation = useMutation({
    mutationFn: (values: { group_key: string; name: string }) => createManagementTest(values),
  });

  const loading = testsQuery.isFetching;
  const alignTableOptionsToLeft = Boolean(
    isBackgroundDetailView && detailViewMode.floating && detailViewMode.collapsed === '1',
  );
  const creating = createTestMutation.isPending;
  const groupOptionsLoading = groupOptionsQuery.isFetching;

  useEffect(() => {
    if (testsQuery.error) {
      const message = testsQuery.error instanceof Error ? testsQuery.error.message : 'Failed to load tests';
      setTests([]);
      setRowCount(0);
      setError(message);
      return;
    }

    const queryData = testsQuery.data;
    if (!queryData) {
      return;
    }

    setError(null);
    setTests(queryData.data.map((test, index) => ({
      ...test,
      id: test.appsheet_key || `${queryData.offset + index}`,
    })));

    if (queryData.data.length < queryData.limit) {
      setRowCount(queryData.offset + queryData.data.length);
      return;
    }
    setRowCount(queryData.offset + queryData.limit + 1);
  }, [testsQuery.data, testsQuery.error]);

  useEffect(() => {
    if (groupOptionsQuery.data) {
      setGroupOptions(groupOptionsQuery.data);
      return;
    }
    if (groupOptionsQuery.error) {
      setCreateError(groupOptionsQuery.error instanceof Error ? groupOptionsQuery.error.message : 'Failed to load group options');
      setGroupOptions([]);
    }
  }, [groupOptionsQuery.data, groupOptionsQuery.error]);

  useEffect(() => {
    const state = (location.state as { sidebarResetTab?: string } | null) ?? null;
    if (state?.sidebarResetTab === 'tests') {
      setSearchDraft('');
      setSearchQuery('');
      setSearchParams(updateSearchParams(searchParams, { q: '', qd: '', page: 0 }), { replace: true });
    }
  }, [location.key, location.state, searchParams, setSearchParams]);

  useEffect(() => {
    if (createError) {
      setStatus(createError, 'error');
      return;
    }

    if (error) {
      setStatus(error, 'error');
      return;
    }

    if (testsQuery.isFetching) {
      setStatus('Loading tests...');
      return;
    }

    clearStatus();
  }, [clearStatus, createError, error, setStatus, testsQuery.isFetching]);

  useEffect(() => () => {
    clearStatus();
  }, [clearStatus]);

  const handleCreateTest = async (values: { group_key: string; name: string }) => {
    try {
      setCreateError(null);
      await createTestMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ['managementTests', user?.username] });
      setIsCreateDialogOpen(false);
      setPage(0);
      await testsQuery.refetch();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create test');
    }
  };

  const handleRowClick = (row: ManagementTestRow) => {
    if (!row.appsheet_key) {
      return;
    }

    const query = new URLSearchParams({
      returnUrl: toDetailReturnUrl(`${location.pathname}${location.search}`),
    });

    navigate(
      `${getManagementDetailRoute('tests', row.appsheet_key)}?${query.toString()}`,
    );
  };

  const applyAdvancedFilters = () => {
    setAppliedGroupKey(selectedGroupKey);
    setPage(0);
    setSearchParams(updateSearchParams(searchParams, { group: selectedGroupKey, page: 0 }), { replace: true });
  };

  const clearAdvancedFilters = () => {
    setSelectedGroupKey('');
  };

  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) {
      return tests;
    }

    const query = searchQuery.toLowerCase();
    return tests.filter((test) => (
      test.name.toLowerCase().includes(query)
      || (test.group_name || '').toLowerCase().includes(query)
      || (test.timestamp ? new Date(test.timestamp).toLocaleString().toLowerCase() : '').includes(query)
    ));
  }, [tests, searchQuery]);

  return (
    <section className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
      <div
        className={cn(
          'shrink-0 flex flex-col gap-3 lg:flex-row',
          alignTableOptionsToLeft ? 'lg:items-start lg:justify-start' : 'lg:items-end lg:justify-between',
        )}
      >
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Tests</h2>
        </div>

        <div className={cn(
          'grid gap-2 sm:grid-cols-[minmax(16rem,1fr)_auto_auto_auto]',
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
              placeholder="Search tests"
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

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void testsQuery.refetch()}
              disabled={loading}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
            {canCreateTests && (
              <Button
                type="button"
                onClick={() => {
                  setCreateError(null);
                  setIsCreateDialogOpen(true);
                }}
                disabled={loading}
              >
                <Plus className="size-4" />
                Create
              </Button>
            )}
          </div>
        </div>
      </div>

      <AdvancedFiltersPanel
        open={showAdvancedFilters}
        onClear={clearAdvancedFilters}
        onApply={applyAdvancedFilters}
      >
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Test Group</span>
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
      </AdvancedFiltersPanel>


      <div data-table-viewport className="min-h-0 flex-1 overflow-hidden">
        <SimpleDataTable
          columns={columns}
          rows={filteredTests}
          rowKey={(row) => row.id}
          loading={loading}
          loadingMessage="Loading tests..."
          emptyMessage="No tests found."
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
            handleRowClick(row);
          }}
          paginationMode="server"
          totalRowCount={rowCount}
        />
      </div>

      <CreateTestDialog
        open={isCreateDialogOpen}
        saving={creating}
        error={createError}
        groupOptions={groupOptions}
        loadingGroups={groupOptionsLoading}
        onClose={() => {
          if (!creating) {
            setIsCreateDialogOpen(false);
          }
        }}
        onSubmit={handleCreateTest}
      />
    </section>
  );
}
