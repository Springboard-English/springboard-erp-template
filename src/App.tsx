import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import {
    Navigate,
    Outlet,
    Route,
    Routes,
    useLocation,
    type Location,
} from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import LazyViewFallback from "./components/LazyViewFallback";
import AppTheme from "./theme/AppTheme";
import { GlobalStatusProvider } from "./context/GlobalStatusContext";
import { BackgroundDetailViewContext } from "./components/management/DetailLayout";
import { useAuth } from "./context/AuthContext";
import {
    getDetailReturnLocation,
    useResolvedDetailViewMode,
} from "./utils/detailViewMode";
import { canAccessManagement } from "./utils/userScopes";
import {
    DASHBOARD_ROUTE,
    getDefaultAuthenticatedPath,
    getInitialPermissionLevel,
    getPostSignInPath,
    type PermissionLevel,
    PERMISSION_LEVEL_STORAGE_KEY,
    RECORDINGS_ROUTE,
    RESET_PASSWORD_ROUTE,
    SESSIONS_ROUTE,
    SIGN_IN_ROUTE,
} from "./routing/navigation";

const SignIn = lazy(() => import("./views/SignIn"));
const ResetPassword = lazy(() => import("./views/ResetPassword"));
const Dashboard = lazy(() => import("./views/Dashboard"));
const SessionTable = lazy(() => import("./views/SessionTable"));
const ManagementClassesTable = lazy(
    () => import("./views/ManagementClassesTable"),
);
const ManagementClassDetails = lazy(
    () => import("./views/ManagementClassDetails"),
);
const ManagementSessionTable = lazy(
    () => import("./views/ManagementSessionTable"),
);
const ManagementSchedulesTable = lazy(
    () => import("./views/ManagementSchedulesTable"),
);
const ManagementScheduleDetails = lazy(
    () => import("./views/ManagementScheduleDetails"),
);
const ManagementSessionDetails = lazy(
    () => import("./views/ManagementSessionDetails"),
);
const ManagementTestsTable = lazy(() => import("./views/ManagementTestsTable"));
const ManagementFeedbacksTable = lazy(
    () => import("./views/ManagementFeedbacksTable"),
);
const ManagementTestDetailsRoute = lazy(
    () => import("./views/ManagementTestDetailsRoute"),
);
const ManagementFeedbackDetailsRoute = lazy(
    () => import("./views/ManagementFeedbackDetailsRoute"),
);
const Recordings = lazy(() => import("@/views/Recordings"));

function getFromPathname(state: unknown): string | null {
    if (!state || typeof state !== "object") {
        return null;
    }

    const from = (state as { from?: { pathname?: unknown } }).from;
    return from && typeof from.pathname === "string" ? from.pathname : null;
}

interface AuthRouteProps {
    disableCustomTheme?: boolean;
    permissionLevel: PermissionLevel;
}

function SignInRoute({ disableCustomTheme, permissionLevel }: AuthRouteProps) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        return (
            <Navigate
                to={getPostSignInPath(
                    getFromPathname(location.state),
                    permissionLevel,
                    user?.account_type,
                )}
                replace
            />
        );
    }

    return (
        <Suspense fallback={<LazyViewFallback />}>
            <SignIn disableCustomTheme={disableCustomTheme} />
        </Suspense>
    );
}

function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Navigate
                to={SIGN_IN_ROUTE}
                replace
                state={{ from: { pathname: location.pathname } }}
            />
        );
    }

    return <Outlet />;
}

function DefaultRouteRedirect({
    permissionLevel,
}: Pick<AuthRouteProps, "permissionLevel">) {
    const { user } = useAuth();

    return (
        <Navigate
            to={getDefaultAuthenticatedPath(
                permissionLevel,
                user?.account_type,
            )}
            replace
        />
    );
}

function ManagementOnlyRoute({
    permissionLevel,
}: Pick<AuthRouteProps, "permissionLevel">) {
    const { user } = useAuth();

    if (permissionLevel !== "management") {
        return (
            <Navigate
                to={getDefaultAuthenticatedPath(
                    permissionLevel,
                    user?.account_type,
                )}
                replace
            />
        );
    }

    return <Outlet />;
}

function StudentOnlyRoute({
    permissionLevel,
}: Pick<AuthRouteProps, "permissionLevel">) {
    const { user } = useAuth();

    if (user?.account_type !== "student") {
        return (
            <Navigate
                to={getDefaultAuthenticatedPath(
                    permissionLevel,
                    user?.account_type,
                )}
                replace
            />
        );
    }

    return <Outlet />;
}

function AppLoadingScreen(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props}>
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <div className="text-sm text-muted-foreground">Loading...</div>
            </div>
        </AppTheme>
    );
}

export default function App(props: { disableCustomTheme?: boolean }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    const detailViewMode = useResolvedDetailViewMode();
    const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>(
        getInitialPermissionLevel,
    );
    const previousUsernameRef = useRef<string | null>(null);
    const canManage = canAccessManagement(user);
    const effectivePermissionLevel = canManage
        ? permissionLevel
        : "normal_user";
    const backgroundLocationFromUrl = useMemo<Partial<Location> | null>(() => {
        const query = new URLSearchParams(location.search);
        const rawReturnUrl = query.get("returnUrl")?.trim();
        if (!rawReturnUrl) {
            return null;
        }

        const returnLocation = getDetailReturnLocation(rawReturnUrl);
        if (!returnLocation) {
            return null;
        }

        if (!detailViewMode.floating) {
            return null;
        }

        return {
            pathname: returnLocation.pathname,
            search: returnLocation.search,
            hash: returnLocation.hash,
            state: null,
            key: "url-background-location",
        };
    }, [detailViewMode.floating, location.search]);
    const backgroundLocation: Location | Partial<Location> | null =
        backgroundLocationFromUrl;

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            localStorage.removeItem(PERMISSION_LEVEL_STORAGE_KEY);
            return;
        }

        localStorage.setItem(
            PERMISSION_LEVEL_STORAGE_KEY,
            effectivePermissionLevel,
        );
    }, [effectivePermissionLevel, isAuthenticated, isLoading]);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            previousUsernameRef.current = null;
            setPermissionLevel("normal_user");
            return;
        }

        const currentUsername =
            typeof user?.username === "string" ? user.username : null;
        if (
            previousUsernameRef.current &&
            currentUsername &&
            previousUsernameRef.current !== currentUsername
        ) {
            setPermissionLevel("normal_user");
        }

        previousUsernameRef.current = currentUsername;
    }, [isAuthenticated, user?.username, isLoading]);

    useEffect(() => {
        if (isLoading) return;

        if (!canManage && permissionLevel !== "normal_user") {
            setPermissionLevel("normal_user");
        }
    }, [canManage, permissionLevel, isLoading]);

    if (isLoading) {
        return <AppLoadingScreen {...props} />;
    }

    const managementRoutes = (
        <Route
            path="management"
            element={
                <ManagementOnlyRoute
                    permissionLevel={effectivePermissionLevel}
                />
            }
        >
            <Route index element={<Navigate to="classes" replace />} />
            <Route path="classes" element={<ManagementClassesTable />} />
            <Route
                path="classes/:classKey"
                element={<ManagementClassDetails />}
            />
            <Route
                path="classes/:classKey/:classSection"
                element={<ManagementClassDetails />}
            />
            <Route
                path="classes/:classKey/schedules/:scheduleKey"
                element={<ManagementScheduleDetails />}
            />
            <Route
                path="classes/:classKey/sessions/:sessionKey/:sessionSection?"
                element={<ManagementSessionDetails />}
            />
            <Route
                path="classes/:classKey/tests/:testKey/:testSection?/:assessmentId?/:assessmentSection?"
                element={<ManagementTestDetailsRoute />}
            />
            <Route
                path="classes/:classKey/feedbacks/:feedbackKey/:feedbackSection?"
                element={<ManagementFeedbackDetailsRoute />}
            />
            <Route
                path="sessions"
                element={<ManagementSessionTable title="Sessions" />}
            />
            <Route
                path="sessions/:sessionKey/:sessionSection?"
                element={<ManagementSessionDetails />}
            />
            <Route path="schedules" element={<ManagementSchedulesTable />} />
            <Route
                path="schedules/:scheduleKey"
                element={<ManagementScheduleDetails />}
            />
            <Route path="tests" element={<ManagementTestsTable />} />
            <Route
                path="tests/:testKey/:testSection?/:assessmentId?/:assessmentSection?"
                element={<ManagementTestDetailsRoute />}
            />
            <Route path="feedbacks" element={<ManagementFeedbacksTable />} />
            <Route
                path="feedbacks/:feedbackKey/:feedbackSection?"
                element={<ManagementFeedbackDetailsRoute />}
            />
            <Route
                path="*"
                element={
                    <DefaultRouteRedirect
                        permissionLevel={effectivePermissionLevel}
                    />
                }
            />
        </Route>
    );

    return (
        <>
            <Routes location={backgroundLocation ?? location}>
                <Route
                    path={SIGN_IN_ROUTE}
                    element={
                        <SignInRoute
                            disableCustomTheme={props.disableCustomTheme}
                            permissionLevel={effectivePermissionLevel}
                        />
                    }
                />
                <Route
                    path={RESET_PASSWORD_ROUTE}
                    element={
                        <Suspense fallback={<LazyViewFallback />}>
                            <ResetPassword {...props} />
                        </Suspense>
                    }
                />
                <Route element={<RequireAuth />}>
                    <Route
                        element={
                            <DashboardLayout
                                disableCustomTheme={props.disableCustomTheme}
                                permissionLevel={effectivePermissionLevel}
                                setPermissionLevel={setPermissionLevel}
                            />
                        }
                    >
                        <Route
                            index
                            element={
                                <DefaultRouteRedirect
                                    permissionLevel={effectivePermissionLevel}
                                />
                            }
                        />
                        <Route
                            path={DASHBOARD_ROUTE.slice(1)}
                            element={<Dashboard />}
                        />
                        <Route
                            path={SESSIONS_ROUTE.slice(1)}
                            element={<SessionTable />}
                        />
                        <Route
                            element={
                                <StudentOnlyRoute
                                    permissionLevel={effectivePermissionLevel}
                                />
                            }
                        >
                            <Route
                                path={RECORDINGS_ROUTE.slice(1)}
                                element={<Recordings />}
                            />
                        </Route>
                        <Route
                            element={
                                <BackgroundDetailViewContext.Provider
                                    value={Boolean(backgroundLocation)}
                                >
                                    <Outlet />
                                </BackgroundDetailViewContext.Provider>
                            }
                        >
                            {managementRoutes}
                        </Route>
                        <Route
                            path="*"
                            element={
                                <DefaultRouteRedirect
                                    permissionLevel={effectivePermissionLevel}
                                />
                            }
                        />
                    </Route>
                </Route>
                <Route
                    path="*"
                    element={
                        isAuthenticated ? (
                            <DefaultRouteRedirect
                                permissionLevel={effectivePermissionLevel}
                            />
                        ) : (
                            <Navigate to={SIGN_IN_ROUTE} replace />
                        )
                    }
                />
            </Routes>
            {backgroundLocation ? (
                <Routes>
                    <Route element={<RequireAuth />}>
                        <Route
                            element={
                                <AppTheme
                                    disableCustomTheme={
                                        props.disableCustomTheme
                                    }
                                >
                                    <GlobalStatusProvider>
                                        <BackgroundDetailViewContext.Provider
                                            value={false}
                                        >
                                            <Suspense
                                                fallback={<LazyViewFallback />}
                                            >
                                                <Outlet />
                                            </Suspense>
                                        </BackgroundDetailViewContext.Provider>
                                    </GlobalStatusProvider>
                                </AppTheme>
                            }
                        >
                            {managementRoutes}
                        </Route>
                    </Route>
                </Routes>
            ) : null}
        </>
    );
}
