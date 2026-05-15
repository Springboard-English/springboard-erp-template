import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchManagementClassFeedbackDetails, type ClassFeedback } from '@/api_calls/UserData';
import { useGlobalStatus } from '@/context/GlobalStatusContext';
import {
  getManagementClassContextFromPath,
  getManagementClassRoute,
  getManagementFeedbackRoute,
  isManagementFeedbackSection,
  MANAGEMENT_CLASSES_ROUTE,
  MANAGEMENT_FEEDBACKS_ROUTE,
  type ManagementFeedbackSection,
  normalizeRoutePath,
} from '@/routing/navigation';
import ManagementClassFeedbackDetails from './ManagementClassFeedbackDetails';
import DetailLoadingView from '@/components/management/DetailLoadingView';

export default function ManagementFeedbackDetailsRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ classKey?: string; feedbackKey: string; feedbackSection?: string }>();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const { setStatus, clearStatus } = useGlobalStatus();
  const decodedClassKey = useMemo(
    () => decodeURIComponent(params.classKey ?? ''),
    [params.classKey],
  );
  const isClassScopedRoute = decodedClassKey.trim().length > 0;
  const returnUrl = query.get('returnUrl');
  const resolvedReturnUrl = returnUrl ? normalizeRoutePath(returnUrl) : null;
  const returnClassContext = resolvedReturnUrl
    ? getManagementClassContextFromPath(resolvedReturnUrl)
    : null;

  const decodedFeedbackKey = useMemo(
    () => decodeURIComponent(params.feedbackKey ?? ''),
    [params.feedbackKey],
  );
  const activeTab = useMemo<ManagementFeedbackSection>(() => {
    const segment = params.feedbackSection;
    return segment && isManagementFeedbackSection(segment) ? segment : 'details';
  }, [params.feedbackSection]);
  const resolvedClassName = query.get('className')
    ?? (isClassScopedRoute ? decodedClassKey : returnClassContext?.classKey)
    ?? undefined;
  const resolvedRootLabel = isClassScopedRoute || returnClassContext ? 'Classes' : query.get('rootLabel') ?? 'Feedbacks';
  const resolvedReturnToPath = isClassScopedRoute
    ? getManagementClassRoute(decodedClassKey, 'feedbacks')
    : resolvedReturnUrl ?? query.get('returnTo') ?? MANAGEMENT_FEEDBACKS_ROUTE;
  const resolvedBackToRootPath = isClassScopedRoute || returnClassContext
    ? MANAGEMENT_CLASSES_ROUTE
    : query.get('backToRoot');
  const withCurrentSearch = useCallback(
    (pathname: string) => `${pathname}${location.search}`,
    [location.search],
  );

  const [feedback, setFeedback] = useState<ClassFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const feedbackQuery = useQuery({
    queryKey: ['managementFeedbackDetails', decodedFeedbackKey],
    queryFn: () => fetchManagementClassFeedbackDetails(decodedFeedbackKey),
    enabled: Boolean(decodedFeedbackKey.trim()),
  });
  const loading = feedbackQuery.isFetching;

  useEffect(() => {
    if (!params.feedbackSection || isManagementFeedbackSection(params.feedbackSection)) {
      return;
    }

    navigate(withCurrentSearch(getManagementFeedbackRoute(decodedFeedbackKey, {
      classKey: decodedClassKey || returnClassContext?.classKey || null,
      section: 'details',
    })), {
      replace: true,
    });
  }, [decodedClassKey, decodedFeedbackKey, navigate, params.feedbackSection, returnClassContext?.classKey, withCurrentSearch]);

  useEffect(() => {
    if (!decodedFeedbackKey.trim()) {
      setError('Missing feedback identifier in URL.');
      return;
    }

    if (feedbackQuery.error) {
      setError(feedbackQuery.error instanceof Error ? feedbackQuery.error.message : 'Failed to load feedback details');
      setFeedback(null);
      return;
    }

    if (!feedbackQuery.data) {
      return;
    }

    setError(null);
    setFeedback(feedbackQuery.data);
  }, [decodedFeedbackKey, feedbackQuery.data, feedbackQuery.error]);

  useEffect(() => {
    if (error || (!loading && !feedback)) {
      setStatus(error ?? 'Feedback not found.', 'error');
      return;
    }

    if (loading) {
      setStatus('Loading feedback details...');
      return;
    }

    clearStatus();
  }, [clearStatus, error, feedback, loading, setStatus]);

  useEffect(() => () => {
    clearStatus();
  }, [clearStatus]);

  if (loading || !feedback) {
    return <DetailLoadingView title="Loading feedback details..." />;
  }

  if (error) {
    return <DetailLoadingView title="Loading feedback details..." />;
  }

  const handleTabChange = (tab: ManagementFeedbackSection) => {
    navigate(withCurrentSearch(getManagementFeedbackRoute(decodedFeedbackKey, {
      classKey: decodedClassKey || returnClassContext?.classKey || null,
      section: tab,
    })));
  };

  return (
    <ManagementClassFeedbackDetails
      feedback={feedback}
      className={resolvedClassName ?? feedback.class_name ?? undefined}
      classKey={decodedClassKey || returnClassContext?.classKey || undefined}
      onBack={() => navigate(resolvedReturnToPath)}
      onBackToClassesList={() => navigate(
        resolvedBackToRootPath
          || (resolvedRootLabel === 'Classes' ? MANAGEMENT_CLASSES_ROUTE : MANAGEMENT_FEEDBACKS_ROUTE),
      )}
      rootLabel={resolvedRootLabel}
      returnUrl={resolvedReturnToPath}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
}
