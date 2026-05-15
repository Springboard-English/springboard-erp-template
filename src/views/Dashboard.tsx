import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChevronRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    fetchOwnAssessments,
    fetchOwnRegistrationsPage,
    fetchSessions,
    type ClassRegistration,
    type TestFeedback,
} from "@/api_calls/UserData";
import { useAuth } from "@/context/AuthContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import { SESSIONS_ROUTE } from "@/routing/navigation";
import { formatUserTimestamp, toBackendBoundary } from "@/utils/formatters";
import { toSessionRows, type SessionRow } from "@/utils/sessionRows";
import { openSessionLink } from "@/utils/openSessionLink";
import { hasUserScope } from "@/utils/userScopes";

const DASHBOARD_PAGE_SIZE = 3;

function formatScore(value: number | null) {
    if (value === null || Number.isNaN(value)) {
        return "-";
    }

    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
            {message}
        </div>
    );
}

function getPageCount(totalItems: number) {
    return Math.max(1, Math.ceil(totalItems / DASHBOARD_PAGE_SIZE));
}

function getPageItems<T>(items: T[], page: number) {
    const startIndex = page * DASHBOARD_PAGE_SIZE;
    return items.slice(startIndex, startIndex + DASHBOARD_PAGE_SIZE);
}

function getOpportunisticPageLabel(
    page: number,
    pageSize: number,
    rowCount: number,
) {
    const canGoNext = rowCount === pageSize;
    return canGoNext ? `Page ${page + 1}` : `Page ${page + 1} of ${page + 1}`;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const displayName = user?.name?.trim() || user?.username?.trim() || "there";
    const { setStatus, clearStatus } = useGlobalStatus();
    const canStartSessions = hasUserScope(user, "sessions_start");
    const canJoinSessions = hasUserScope(user, "sessions_join");
    const [registrations, setRegistrations] = useState<ClassRegistration[]>([]);
    const [assessments, setAssessments] = useState<TestFeedback[]>([]);
    const [todaySessions, setTodaySessions] = useState<SessionRow[]>([]);
    const [registrationError, setRegistrationError] = useState<string | null>(
        null,
    );
    const [assessmentError, setAssessmentError] = useState<string | null>(null);
    const [sessionError, setSessionError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [sessionPage, setSessionPage] = useState(0);
    const [registrationPage, setRegistrationPage] = useState(0);
    const [assessmentPage, setAssessmentPage] = useState(0);

    const dashboardQuery = useQuery({
        queryKey: ["dashboard", user?.username],
        queryFn: async () => {
            const today = dayjs().format("YYYY-MM-DD");
            const begin = toBackendBoundary(today, "start");
            const end = toBackendBoundary(today, "end");
            const [assessmentResult, sessionResult] = await Promise.allSettled([
                fetchOwnAssessments(),
                fetchSessions({ begin, end }),
            ]);
            return { assessmentResult, sessionResult };
        },
    });
    const registrationsQuery = useQuery({
        queryKey: ["dashboardRegistrations", user?.username, registrationPage],
        queryFn: () => {
            const offset = registrationPage * DASHBOARD_PAGE_SIZE;
            return fetchOwnRegistrationsPage(DASHBOARD_PAGE_SIZE, offset);
        },
    });
    const loading = dashboardQuery.isFetching;
    const registrationLoading = registrationsQuery.isFetching;

    useEffect(() => {
        const data = dashboardQuery.data;
        if (!data) {
            return;
        }

        const { assessmentResult, sessionResult } = data;
        if (assessmentResult.status === "fulfilled") {
            setAssessments(
                [...assessmentResult.value].sort((left, right) => {
                    const leftTime = new Date(
                        left.modified_at ?? left.created_at ?? 0,
                    ).getTime();
                    const rightTime = new Date(
                        right.modified_at ?? right.created_at ?? 0,
                    ).getTime();
                    return rightTime - leftTime;
                }),
            );
            setAssessmentError(null);
        } else {
            setAssessments([]);
            setAssessmentError(
                assessmentResult.reason instanceof Error
                    ? assessmentResult.reason.message
                    : "Failed to load assessments",
            );
        }

        if (sessionResult.status === "fulfilled") {
            setTodaySessions(
                toSessionRows(sessionResult.value).sort(
                    (left, right) =>
                        new Date(left.timestamp).getTime() -
                        new Date(right.timestamp).getTime(),
                ),
            );
            setSessionError(null);
        } else {
            setTodaySessions([]);
            setSessionError(
                sessionResult.reason instanceof Error
                    ? sessionResult.reason.message
                    : "Failed to load sessions",
            );
        }

        const allRejected =
            assessmentResult.status === "rejected" &&
            sessionResult.status === "rejected";
        setError(allRejected ? "Failed to load dashboard." : null);
    }, [dashboardQuery.data]);

    useEffect(() => {
        if (!registrationsQuery.data) {
            return;
        }

        const result = registrationsQuery.data;
        setRegistrations(
            [...result.items].sort((left, right) => {
                const leftTime = left.created_at
                    ? new Date(left.created_at).getTime()
                    : 0;
                const rightTime = right.created_at
                    ? new Date(right.created_at).getTime()
                    : 0;
                return rightTime - leftTime;
            }),
        );
        setRegistrationError(null);
    }, [registrationsQuery.data]);

    useEffect(() => {
        if (!registrationsQuery.error) {
            return;
        }
        setRegistrations([]);
        setRegistrationError(
            registrationsQuery.error instanceof Error
                ? registrationsQuery.error.message
                : "Failed to load registrations",
        );
    }, [registrationsQuery.error]);

    useEffect(() => {
        if (error) {
            setStatus(error, "error");
            return;
        }

        if (loading) {
            setStatus("Loading dashboard...");
            return;
        }

        clearStatus();
    }, [clearStatus, error, loading, setStatus]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    useEffect(() => {
        setSessionPage((current) =>
            Math.min(current, getPageCount(todaySessions.length) - 1),
        );
    }, [todaySessions]);

    useEffect(() => {
        setAssessmentPage((current) =>
            Math.min(current, getPageCount(assessments.length) - 1),
        );
    }, [assessments]);

    const sessionPageCount = getPageCount(todaySessions.length);
    const assessmentPageCount = getPageCount(assessments.length);
    const registrationCanGoPrevious = registrationPage > 0;
    const registrationCanGoNext = registrations.length === DASHBOARD_PAGE_SIZE;
    const registrationPageLabel = getOpportunisticPageLabel(
        registrationPage,
        DASHBOARD_PAGE_SIZE,
        registrations.length,
    );

    const sessionPageItems = useMemo(
        () => getPageItems(todaySessions, sessionPage),
        [todaySessions, sessionPage],
    );
    const assessmentPageItems = useMemo(
        () => getPageItems(assessments, assessmentPage),
        [assessments, assessmentPage],
    );

    const highlightedSession = sessionPageItems[0] ?? null;
    const remainingSessions = highlightedSession
        ? sessionPageItems.slice(1)
        : sessionPageItems;

    return (
        <section className="w-full max-w-[1700px] space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                        Hello, {displayName}
                    </p>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Dashboard
                    </h2>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        void dashboardQuery.refetch();
                        void registrationsQuery.refetch();
                    }}
                    disabled={loading}
                >
                    <RefreshCw className="size-4" />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4">
                <Card className="gap-0 rounded-3xl border-border/70 bg-card/95 py-0 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
                    <CardHeader className="flex h-16 flex-row !items-center !justify-between">
                        <div className="flex min-h-8 items-center">
                            <CardTitle>Today&apos;s Sessions</CardTitle>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(SESSIONS_ROUTE)}
                        >
                            Sessions
                            <ChevronRight className="size-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2 pb-4">
                        {loading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={`session-skeleton-${index}`}
                                        className="h-16 animate-pulse rounded-2xl bg-muted/50"
                                    />
                                ))}
                            </div>
                        ) : sessionError ? (
                            <EmptyState message={sessionError} />
                        ) : todaySessions.length === 0 ? (
                            <EmptyState message="No sessions scheduled for today." />
                        ) : (
                            <>
                                {highlightedSession && (
                                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground">
                                                    {highlightedSession.class_name ||
                                                        "-"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatUserTimestamp(
                                                        highlightedSession.timestamp,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">
                                                <p>
                                                    {highlightedSession.duration ??
                                                        "-"}{" "}
                                                    mins
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {canStartSessions && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        !highlightedSession.start_url
                                                    }
                                                    onClick={() =>
                                                        highlightedSession.start_url &&
                                                        void openSessionLink(
                                                            highlightedSession.start_url,
                                                        )
                                                    }
                                                >
                                                    Start
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                size="sm"
                                                disabled={
                                                    !canJoinSessions ||
                                                    !highlightedSession.join_url
                                                }
                                                onClick={() =>
                                                    highlightedSession.join_url &&
                                                    void openSessionLink(
                                                        highlightedSession.join_url,
                                                    )
                                                }
                                            >
                                                Join
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {remainingSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="rounded-2xl border border-border/70 bg-background/40 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground">
                                                    {session.class_name || "-"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatUserTimestamp(
                                                        session.timestamp,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {canStartSessions && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={
                                                            !session.start_url
                                                        }
                                                        onClick={() =>
                                                            session.start_url &&
                                                            void openSessionLink(
                                                                session.start_url,
                                                            )
                                                        }
                                                    >
                                                        Start
                                                    </Button>
                                                )}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        !canJoinSessions ||
                                                        !session.join_url
                                                    }
                                                    onClick={() =>
                                                        session.join_url &&
                                                        void openSessionLink(
                                                            session.join_url,
                                                        )
                                                    }
                                                >
                                                    Join
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center justify-between border-t border-border/60 pt-3">
                                    <p className="text-sm text-muted-foreground">
                                        Page {sessionPage + 1} of{" "}
                                        {sessionPageCount}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            disabled={sessionPage === 0}
                                            onClick={() =>
                                                setSessionPage((current) =>
                                                    Math.max(0, current - 1),
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            disabled={
                                                sessionPage >=
                                                sessionPageCount - 1
                                            }
                                            onClick={() =>
                                                setSessionPage((current) =>
                                                    Math.min(
                                                        sessionPageCount - 1,
                                                        current + 1,
                                                    ),
                                                )
                                            }
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {user?.account_type === "student" && (
                    <Card className="gap-0 rounded-3xl border-border/70 bg-card/95 py-0 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
                        <CardHeader className="flex h-16 flex-row !items-center !justify-between">
                            <div className="flex min-h-8 items-center">
                                <CardTitle>Registrations</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2 pb-4">
                            {registrationLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map(
                                        (_, index) => (
                                            <div
                                                key={`registration-skeleton-${index}`}
                                                className="h-16 animate-pulse rounded-2xl bg-muted/50"
                                            />
                                        ),
                                    )}
                                </div>
                            ) : registrationError ? (
                                <EmptyState message={registrationError} />
                            ) : registrations.length === 0 ? (
                                <EmptyState message="No registrations found." />
                            ) : (
                                <>
                                    {registrations.map((registration) => (
                                        <div
                                            key={registration.appsheet_key}
                                            className="rounded-2xl border border-border/70 bg-background/40 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-foreground">
                                                        {registration.student_name ||
                                                            "-"}
                                                    </p>
                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {registration.class_name ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <div className="rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground">
                                                    {registration.status || "-"}
                                                </div>
                                            </div>
                                            <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                                                <p>
                                                    Sessions:{" "}
                                                    {registration.sessions ??
                                                        "-"}
                                                </p>
                                                <p>
                                                    Target:{" "}
                                                    {registration.target || "-"}
                                                </p>
                                                <p>
                                                    Created:{" "}
                                                    {formatUserTimestamp(
                                                        registration.created_at ??
                                                            undefined,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                                        <p className="text-sm text-muted-foreground">
                                            {registrationPageLabel}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={
                                                    !registrationCanGoPrevious
                                                }
                                                onClick={() =>
                                                    setRegistrationPage(
                                                        (current) =>
                                                            Math.max(
                                                                0,
                                                                current - 1,
                                                            ),
                                                    )
                                                }
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={
                                                    !registrationCanGoNext
                                                }
                                                onClick={() =>
                                                    setRegistrationPage(
                                                        (current) =>
                                                            current + 1,
                                                    )
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {user?.account_type === "student" && (
                    <Card className="gap-0 rounded-3xl border-border/70 bg-card/95 py-0 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
                        <CardHeader className="flex h-16 flex-row !items-center !justify-between">
                            <div className="flex min-h-8 items-center">
                                <CardTitle>Recent Assessments</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2 pb-4">
                            {loading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 4 }).map(
                                        (_, index) => (
                                            <div
                                                key={`assessment-skeleton-${index}`}
                                                className="h-16 animate-pulse rounded-2xl bg-muted/50"
                                            />
                                        ),
                                    )}
                                </div>
                            ) : assessmentError ? (
                                <EmptyState message={assessmentError} />
                            ) : assessmentPageItems.length === 0 ? (
                                <EmptyState message="No assessments found." />
                            ) : (
                                <>
                                    {assessmentPageItems.map((assessment) => (
                                        <div
                                            key={assessment.appsheet_key}
                                            className="rounded-2xl border border-border/70 bg-background/40 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-foreground">
                                                        {assessment.test_name ||
                                                            "-"}
                                                    </p>
                                                    <p className="truncate text-sm text-muted-foreground">
                                                        {assessment.class_name ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <div className="rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground">
                                                    Score:{" "}
                                                    {formatScore(
                                                        assessment.total_score,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                                                <p>
                                                    Student:{" "}
                                                    {assessment.student_name ||
                                                        "-"}
                                                </p>
                                                <p>
                                                    Updated:{" "}
                                                    {formatUserTimestamp(
                                                        assessment.modified_at ??
                                                            assessment.created_at ??
                                                            undefined,
                                                    )}
                                                </p>
                                                <p className="line-clamp-2">
                                                    Suggestions:{" "}
                                                    {assessment.suggestions ||
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                                        <p className="text-sm text-muted-foreground">
                                            Page {assessmentPage + 1} of{" "}
                                            {assessmentPageCount}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={assessmentPage === 0}
                                                onClick={() =>
                                                    setAssessmentPage(
                                                        (current) =>
                                                            Math.max(
                                                                0,
                                                                current - 1,
                                                            ),
                                                    )
                                                }
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={
                                                    assessmentPage >=
                                                    assessmentPageCount - 1
                                                }
                                                onClick={() =>
                                                    setAssessmentPage(
                                                        (current) =>
                                                            Math.min(
                                                                assessmentPageCount -
                                                                    1,
                                                                current + 1,
                                                            ),
                                                    )
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}
