import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toDetailReturnUrl } from "@/utils/detailViewMode";
import {
    fetchManagementTestDetails,
    type ManagementTest,
} from "@/api_calls/UserData";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import {
    getManagementTestRoute,
    getManagementClassContextFromPath,
    getManagementClassRoute,
    isManagementAssessmentSection,
    isManagementTestSection,
    MANAGEMENT_CLASSES_ROUTE,
    MANAGEMENT_TESTS_ROUTE,
    type ManagementAssessmentSection,
    type ManagementTestSection,
    normalizeRoutePath,
} from "@/routing/navigation";
import ManagementTestDetails from "./ManagementTestDetails";
import DetailLoadingView from "@/components/management/DetailLoadingView";

export default function ManagementTestDetailsRoute() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams<{
        classKey?: string;
        testKey: string;
        testSection?: string;
        assessmentId?: string;
        assessmentSection?: string;
    }>();
    const query = useMemo(
        () => new URLSearchParams(location.search),
        [location.search],
    );
    const { setStatus, clearStatus } = useGlobalStatus();
    const decodedClassKey = useMemo(
        () => decodeURIComponent(params.classKey ?? ""),
        [params.classKey],
    );
    const isClassScopedRoute = decodedClassKey.trim().length > 0;
    const returnUrl = query.get("returnUrl");
    const resolvedReturnUrl = returnUrl ? normalizeRoutePath(returnUrl) : null;
    const returnClassContext = resolvedReturnUrl
        ? getManagementClassContextFromPath(resolvedReturnUrl)
        : null;

    const decodedTestKey = useMemo(
        () => decodeURIComponent(params.testKey ?? ""),
        [params.testKey],
    );
    const activeTab = useMemo<ManagementTestSection>(() => {
        const segment = params.testSection;
        return segment && isManagementTestSection(segment)
            ? segment
            : "details";
    }, [params.testSection]);
    const activeAssessmentId = useMemo(() => {
        if (activeTab !== "assessments") {
            return null;
        }
        const segment = params.assessmentId;
        return segment ? decodeURIComponent(segment) : null;
    }, [activeTab, params.assessmentId]);
    const activeAssessmentTab = useMemo<ManagementAssessmentSection>(() => {
        if (activeTab !== "assessments") {
            return "details";
        }
        const segment = params.assessmentSection;
        return segment && isManagementAssessmentSection(segment)
            ? segment
            : "details";
    }, [activeTab, params.assessmentSection]);
    const resolvedReturnToPath = isClassScopedRoute
        ? getManagementClassRoute(decodedClassKey, "tests")
        : (resolvedReturnUrl ??
          query.get("returnTo") ??
          MANAGEMENT_TESTS_ROUTE);
    const resolvedRootLabel =
        isClassScopedRoute || returnClassContext
            ? "Classes"
            : (query.get("rootLabel") ?? "Tests");
    const resolvedParentLabel =
        isClassScopedRoute || returnClassContext
            ? query.get("className") ||
              decodedClassKey ||
              returnClassContext?.classKey ||
              null
            : query.get("parentLabel");
    const resolvedBackToRootPath =
        isClassScopedRoute || returnClassContext
            ? MANAGEMENT_CLASSES_ROUTE
            : query.get("backToRoot");
    const resolvedScopedClassKey = isClassScopedRoute
        ? decodedClassKey
        : (returnClassContext?.classKey ?? query.get("scopedClassKey"));

    const [test, setTest] = useState<ManagementTest | null>(null);
    const [error, setError] = useState<string | null>(null);
    const testDetailsQuery = useQuery({
        queryKey: ["managementTestDetails", decodedTestKey],
        queryFn: () => fetchManagementTestDetails(decodedTestKey),
        enabled: Boolean(decodedTestKey.trim()),
    });
    const loading = testDetailsQuery.isFetching;
    const classContextKey =
        decodedClassKey || returnClassContext?.classKey || null;
    const withCurrentSearch = (pathname: string) =>
        `${pathname}${location.search}`;
    const navigationOptions = {} as const;

    useEffect(() => {
        if (
            params.testSection &&
            !isManagementTestSection(params.testSection)
        ) {
            navigate(
                withCurrentSearch(
                    getManagementTestRoute(decodedTestKey, {
                        classKey: classContextKey,
                        section: "details",
                    }),
                ),
                { ...navigationOptions, replace: true },
            );
            return;
        }

        if (params.assessmentId && activeTab !== "assessments") {
            navigate(
                withCurrentSearch(
                    getManagementTestRoute(decodedTestKey, {
                        classKey: classContextKey,
                        section: activeTab,
                    }),
                ),
                { ...navigationOptions, replace: true },
            );
            return;
        }

        if (
            activeTab === "assessments" &&
            params.assessmentSection &&
            !isManagementAssessmentSection(params.assessmentSection)
        ) {
            navigate(
                withCurrentSearch(
                    getManagementTestRoute(decodedTestKey, {
                        classKey: classContextKey,
                        section: "assessments",
                        assessmentId: params.assessmentId ?? null,
                        assessmentSection: "details",
                    }),
                ),
                { ...navigationOptions, replace: true },
            );
            return;
        }

        if (isClassScopedRoute && activeTab === "sessions") {
            navigate(
                withCurrentSearch(
                    getManagementTestRoute(decodedTestKey, {
                        classKey: decodedClassKey,
                        section: "sections",
                    }),
                ),
                { ...navigationOptions, replace: true },
            );
            return;
        }

        if (!decodedTestKey.trim()) {
            setError("Missing test identifier in URL.");
            return;
        }
        if (testDetailsQuery.error) {
            setError(
                testDetailsQuery.error instanceof Error
                    ? testDetailsQuery.error.message
                    : "Failed to load test details",
            );
            setTest(null);
            return;
        }
        if (!testDetailsQuery.data) {
            return;
        }
        setError(null);
        setTest(testDetailsQuery.data);
    }, [
        activeTab,
        classContextKey,
        decodedClassKey,
        decodedTestKey,
        isClassScopedRoute,
        navigate,
        params.assessmentId,
        params.assessmentSection,
        params.testSection,
        testDetailsQuery.data,
        testDetailsQuery.error,
        withCurrentSearch,
    ]);

    useEffect(() => {
        if (error || (!loading && !test)) {
            setStatus(error ?? "Test not found.", "error");
            return;
        }

        if (loading) {
            setStatus("Loading test details...");
            return;
        }

        clearStatus();
    }, [clearStatus, error, loading, setStatus, test]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    if (loading || !test) {
        return <DetailLoadingView title="Loading test details..." />;
    }

    if (error) {
        return <DetailLoadingView title="Loading test details..." />;
    }

    const handleTabChange = (tab: ManagementTestSection) => {
        const nextTab =
            isClassScopedRoute && tab === "sessions" ? "sections" : tab;
        navigate(
            withCurrentSearch(
                getManagementTestRoute(decodedTestKey, {
                    classKey: classContextKey,
                    section: nextTab,
                }),
            ),
            navigationOptions,
        );
    };

    const handleAssessmentOpen = (assessmentId: string) => {
        const nextQuery = new URLSearchParams(location.search);
        nextQuery.set(
            "returnUrl",
            toDetailReturnUrl(
                getManagementTestRoute(decodedTestKey, {
                    classKey: classContextKey,
                    section: "assessments",
                }) + location.search,
            ),
        );

        navigate(
            getManagementTestRoute(decodedTestKey, {
                classKey: classContextKey,
                section: "assessments",
                assessmentId,
                assessmentSection: activeAssessmentTab,
            }) +
                "?" +
                nextQuery.toString(),
            navigationOptions,
        );
    };

    const handleAssessmentBack = () => {
        const rawReturnUrl = query.get("returnUrl");
        if (rawReturnUrl) {
            const normalized = normalizeRoutePath(rawReturnUrl);
            const testRoute = getManagementTestRoute(decodedTestKey, {
                classKey: classContextKey,
            });
            // If the returnUrl points to this test detail view, go back to it.
            // This un-nests the returnUrl.
            if (normalized.startsWith(testRoute)) {
                navigate(rawReturnUrl, navigationOptions);
                return;
            }
        }

        navigate(
            withCurrentSearch(
                getManagementTestRoute(decodedTestKey, {
                    classKey: classContextKey,
                    section: "assessments",
                }),
            ),
            navigationOptions,
        );
    };

    const handleAssessmentTabChange = (tab: ManagementAssessmentSection) => {
        if (!activeAssessmentId) {
            return;
        }

        navigate(
            withCurrentSearch(
                getManagementTestRoute(decodedTestKey, {
                    classKey: classContextKey,
                    section: "assessments",
                    assessmentId: activeAssessmentId,
                    assessmentSection: tab,
                }),
            ),
            navigationOptions,
        );
    };

    return (
        <ManagementTestDetails
            test={test}
            onBack={() => navigate(resolvedReturnToPath)}
            onBackToRoot={() =>
                navigate(
                    resolvedBackToRootPath ||
                        (resolvedRootLabel === "Classes"
                            ? MANAGEMENT_CLASSES_ROUTE
                            : MANAGEMENT_TESTS_ROUTE),
                )
            }
            onTestUpdated={setTest}
            onTestDeleted={() =>
                navigate(resolvedReturnToPath, { replace: true })
            }
            rootLabel={resolvedRootLabel}
            parentLabel={resolvedParentLabel}
            scopedClassKey={resolvedScopedClassKey}
            returnUrl={resolvedReturnToPath}
            activeTab={activeTab}
            activeAssessmentId={activeAssessmentId}
            activeAssessmentTab={activeAssessmentTab}
            onTabChange={handleTabChange}
            onAssessmentOpen={handleAssessmentOpen}
            onAssessmentBack={handleAssessmentBack}
            onAssessmentTabChange={handleAssessmentTabChange}
            loadingDetails={loading}
            detailsError={error}
        />
    );
}
