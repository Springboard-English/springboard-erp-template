import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleDataTable, {
    type SimpleDataTableColumn,
} from "@/components/SimpleDataTable";
import {
    DetailHeader,
    DetailBreadcrumbs,
    DetailClassHeaderLabel,
    DetailFieldsTable,
    DetailTabbedSection,
    DetailView,
} from "@/components/management/DetailLayout";
import {
    ClassFeedback,
    fetchManagementClassFeedbackDetails,
} from "@/api_calls/UserData";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import { formatUserTimestamp } from "@/utils/formatters";
import { toDetailReturnUrl } from "@/utils/detailViewMode";
import {
    getManagementClassRoute,
    isManagementFeedbackSection,
    type ManagementFeedbackSection,
} from "@/routing/navigation";

type MentorFeedbackRow = {
    id: string;
    mentor?: string;
    environment?: number;
    quality?: number;
    productivity?: number;
};

type TaFeedbackRow = {
    id: string;
    ta?: string | null;
    helpfulness?: number;
};

interface ManagementClassFeedbackDetailsProps {
    feedback: ClassFeedback;
    className?: string;
    classKey?: string;
    onBack: () => void;
    onBackToClassesList: () => void;
    rootLabel?: string;
    returnUrl?: string | null;
    activeTab: ManagementFeedbackSection;
    onTabChange: (tab: ManagementFeedbackSection) => void;
}
export default function ManagementClassFeedbackDetails({
    feedback,
    className,
    classKey,
    onBack,
    onBackToClassesList,
    rootLabel = "Classes",
    returnUrl = null,
    activeTab,
    onTabChange,
}: ManagementClassFeedbackDetailsProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setStatus, clearStatus } = useGlobalStatus();
    const [feedbackDetails, setFeedbackDetails] =
        useState<ClassFeedback>(feedback);
    const [error, setError] = useState<string | null>(null);
    const feedbackDetailsQuery = useQuery({
        queryKey: ["managementClassFeedbackDetails", feedback.appsheet_key],
        queryFn: () =>
            fetchManagementClassFeedbackDetails(
                feedback.appsheet_key as string,
            ),
        enabled: Boolean(feedback.appsheet_key?.trim()),
    });
    const loading = feedbackDetailsQuery.isFetching;

    useEffect(() => {
        if (error) {
            setStatus(error, "error");
            return;
        }

        if (loading) {
            setStatus("Loading feedback details...");
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
        setFeedbackDetails(feedback);
        setError(null);

        if (!feedback.appsheet_key?.trim()) {
            return;
        }
        if (feedbackDetailsQuery.error) {
            setError(
                feedbackDetailsQuery.error instanceof Error
                    ? feedbackDetailsQuery.error.message
                    : "Failed to load feedback details",
            );
            return;
        }
        if (!feedbackDetailsQuery.data) {
            return;
        }

        setFeedbackDetails((prev) => ({
            ...prev,
            ...feedbackDetailsQuery.data,
        }));
    }, [feedback, feedbackDetailsQuery.data, feedbackDetailsQuery.error]);

    if (error) {
        return null;
    }

    const displayFeedback = feedbackDetails;
    const mentorFeedbackRows: MentorFeedbackRow[] = (
        displayFeedback.mentor_feedbacks ?? []
    ).map((item, index) => ({
        id: `${displayFeedback.appsheet_key || displayFeedback.created_at || "mentor"}-${index}`,
        mentor: item.mentor ?? undefined,
        environment: item.environment ?? undefined,
        quality: item.quality ?? undefined,
        productivity: item.productivity ?? undefined,
    }));
    const taFeedbackRows: TaFeedbackRow[] = (
        displayFeedback.ta_feedbacks ?? []
    ).map((item, index) => ({
        id: `${displayFeedback.appsheet_key || displayFeedback.created_at || "ta"}-${index}`,
        ta: item.ta ?? undefined,
        helpfulness: item.helpfulness ?? undefined,
    }));

    const displayClassName = className || displayFeedback.class_name || "-";
    const isStandaloneFeedbackView =
        rootLabel === "Feedbacks" &&
        !returnUrl?.includes("/management/classes/");
    const feedbackTitle = isStandaloneFeedbackView
        ? `${displayFeedback.student_name || "-"} - ${formatUserTimestamp(displayFeedback.created_at ?? undefined)} - ${displayClassName}`
        : `${displayFeedback.student_name || "-"} - ${formatUserTimestamp(displayFeedback.created_at ?? undefined)}`;

    const mentorFeedbackColumns = useMemo<
        SimpleDataTableColumn<MentorFeedbackRow>[]
    >(
        () => [
            {
                id: "mentor",
                header: "Mentor",
                className: "min-w-[180px]",
                render: (row) => row.mentor || "-",
            },
            {
                id: "environment",
                header: "Environment",
                className: "min-w-[140px]",
                render: (row) => row.environment ?? "-",
            },
            {
                id: "quality",
                header: "Quality",
                className: "min-w-[140px]",
                render: (row) => row.quality ?? "-",
            },
            {
                id: "productivity",
                header: "Productivity",
                className: "min-w-[140px]",
                render: (row) => row.productivity ?? "-",
            },
        ],
        [],
    );

    const taFeedbackColumns = useMemo<SimpleDataTableColumn<TaFeedbackRow>[]>(
        () => [
            {
                id: "ta",
                header: "TA",
                className: "min-w-[180px]",
                render: (row) => row.ta || "-",
            },
            {
                id: "helpfulness",
                header: "Helpfulness",
                className: "min-w-[140px]",
                render: (row) => row.helpfulness ?? "-",
            },
        ],
        [],
    );

    return (
        <DetailView className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
            <DetailHeader
                breadcrumbs={
                    <DetailBreadcrumbs
                        items={[
                            { label: rootLabel, onClick: onBackToClassesList },
                            ...(!isStandaloneFeedbackView
                                ? [{ label: displayClassName, onClick: onBack }]
                                : []),
                        ]}
                        current={feedbackTitle}
                    />
                }
            />

            <DetailTabbedSection
                tabs={[
                    { value: "details", label: "Details" },
                    { value: "mentors", label: "Mentor Feedbacks" },
                    { value: "tas", label: "TA Feedbacks" },
                ]}
                activeTab={activeTab}
                onChange={(value) => {
                    if (isManagementFeedbackSection(value)) {
                        onTabChange(value);
                    }
                }}
                className="flex min-h-0 flex-1 flex-col"
                contentClassName="min-h-0 overflow-y-auto overflow-x-hidden pr-1"
            >
                {activeTab === "details" && (
                    <div className="space-y-4">
                        <DetailFieldsTable
                            rows={[
                                {
                                    label: "Student",
                                    value: displayFeedback.student_name || "-",
                                },
                                {
                                    label: (
                                        <DetailClassHeaderLabel
                                            classKey={classKey}
                                            onOpenClass={() => {
                                                const target =
                                                    getManagementClassRoute(
                                                        classKey?.trim() || "",
                                                    );
                                                const query =
                                                    new URLSearchParams();
                                                query.set(
                                                    "returnUrl",
                                                    toDetailReturnUrl(
                                                        `${location.pathname}${location.search}`,
                                                    ),
                                                );
                                                navigate(
                                                    `${target}?${query.toString()}`,
                                                );
                                            }}
                                        />
                                    ),
                                    value: displayClassName,
                                },
                                {
                                    label: "Timestamp",
                                    value: formatUserTimestamp(
                                        displayFeedback.created_at ?? undefined,
                                    ),
                                },
                                {
                                    label: "Request",
                                    value: (
                                        <div className="whitespace-pre-wrap break-words leading-6">
                                            {displayFeedback.request?.trim() ||
                                                "-"}
                                        </div>
                                    ),
                                },
                                {
                                    label: "Additional Feedback",
                                    value: (
                                        <div className="whitespace-pre-wrap break-words leading-6">
                                            {displayFeedback.feedback_extra?.trim() ||
                                                "-"}
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                )}

                {activeTab === "mentors" && (
                    <section className="flex min-h-0 h-full flex-col space-y-2">
                        <div
                            data-table-viewport
                            className="min-h-0 flex-1 overflow-hidden rounded-2xl"
                        >
                            <SimpleDataTable
                                columns={mentorFeedbackColumns}
                                rows={mentorFeedbackRows}
                                rowKey={(row) => row.id}
                                emptyMessage="No mentor feedback provided."
                                page={0}
                                pageSize={mentorFeedbackRows.length || 10}
                                onPageChange={() => {}}
                                onPageSizeChange={() => {}}
                            />
                        </div>
                    </section>
                )}

                {activeTab === "tas" && (
                    <section className="flex min-h-0 h-full flex-col space-y-2">
                        <div
                            data-table-viewport
                            className="min-h-0 flex-1 overflow-hidden rounded-2xl"
                        >
                            <SimpleDataTable
                                columns={taFeedbackColumns}
                                rows={taFeedbackRows}
                                rowKey={(row) => row.id}
                                emptyMessage="No TA feedback provided."
                                page={0}
                                pageSize={taFeedbackRows.length || 10}
                                onPageChange={() => {}}
                                onPageSizeChange={() => {}}
                            />
                        </div>
                    </section>
                )}
            </DetailTabbedSection>
        </DetailView>
    );
}
