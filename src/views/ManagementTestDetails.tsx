import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Eye,
    FileText,
    Plus,
    RefreshCw,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import SimpleDataTable, {
    type SimpleDataTableColumn,
} from "@/components/SimpleDataTable";
import {
    BackgroundDetailViewContext,
    DetailHeader,
    DetailBreadcrumbs,
    DetailClassHeaderLabel,
    DetailFieldsTable,
    DetailTabbedSection,
    DetailView,
} from "@/components/management/DetailLayout";
import CreateAssessmentDialog from "@/components/management/CreateAssessmentDialog";
import type { CreateAssessmentDialogValues } from "@/components/management/CreateAssessmentDialog";
import CreateAssessmentSectionDialog from "@/components/management/CreateAssessmentSectionDialog";
import CreateTestSectionDialog from "@/components/management/CreateTestSectionDialog";
import CreateTestSessionDialog from "@/components/management/CreateTestSessionDialog";
import OutdatedDataDialog from "@/components/management/OutdatedDataDialog";
import SearchField from "@/components/management/SearchField";
import PendingChangesBar from "@/components/PendingChangesBar";
import {
    createManagementAssessmentSection,
    createManagementTestAssessment,
    createManagementTestSection,
    createManagementTestSession,
    deleteManagementAssessment,
    deleteManagementTest,
    deleteManagementAssessmentSection,
    deleteManagementTestSection,
    deleteManagementTestSession,
    fetchManagementAssessmentDetails,
    fetchManagementAssessmentSections,
    fetchInlineSessionRegistrationOptions,
    fetchAllManagementTestSessions,
    fetchInlineClassOptions,
    fetchInlineSessionOptions,
    fetchManagementTestAssessments,
    fetchManagementTestSessionsPage,
    fetchManagementTestSections,
    generateManagementAssessmentPdf,
    patchManagementAssessment,
    patchManagementAssessmentSection,
    patchManagementTestSection,
    patchManagementTestSession,
    type AssessmentSection,
    type CreateAssessmentSectionRequest,
    type CreateTestSectionRequest,
    type CreateTestSessionRequest,
    type InlineOption,
    type ManagementTest,
    type PatchTestAssessmentRequest,
    type PatchTestSectionRequest,
    type PatchTestSessionRequest,
    type TestFeedback,
    type TestSection,
    type TestSessionLink,
} from "@/api_calls/UserData";
import { useAuth } from "@/context/AuthContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import { formatUserTimestamp, toBackendBoundary } from "@/utils/formatters";
import { isOutdatedEditedAtConflictError } from "@/utils/conflictErrors";
import { isPermissionDeniedError } from "@/utils/permissions";
import { getUserScopes, hasAnyUserScope } from "@/utils/userScopes";
import {
    toDetailReturnUrl,
    useResolvedDetailViewMode,
} from "@/utils/detailViewMode";
import {
    getManagementClassRoute,
    isManagementAssessmentSection,
    isManagementTestSection,
    type ManagementAssessmentSection,
    type ManagementTestSection,
} from "@/routing/navigation";
import { cn } from "@/lib/utils";

type TestSectionRow = TestSection & { id: string };
type TestSessionRow = TestSessionLink & { id: string };
type TestAssessmentRow = TestFeedback & { id: string };
type AssessmentSectionRow = AssessmentSection & { id: string };
type AssessmentEditableForm = {
    registrationKey: string;
    classKey: string;
    suggestions: string;
    projections: string;
};

const DETAIL_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function toAssessmentEditableForm(
    source: TestAssessmentRow | null,
): AssessmentEditableForm {
    const registrationKey = source?.registration_key?.trim() ?? "";
    const classKey = source?.class_key?.trim() ?? "";
    return {
        registrationKey,
        classKey,
        suggestions: source?.suggestions ?? "",
        projections: source?.projections ?? "",
    };
}

function buildAssessmentPatch(
    current: AssessmentEditableForm,
    original: AssessmentEditableForm,
): PatchTestAssessmentRequest {
    const payload: PatchTestAssessmentRequest = {};

    if (current.registrationKey.trim() !== original.registrationKey.trim()) {
        payload.registration_key = current.registrationKey.trim() || null;
    }

    if (current.classKey.trim() !== original.classKey.trim()) {
        payload.class_key = current.classKey.trim() || null;
    }

    if (current.suggestions.trim() !== original.suggestions.trim()) {
        payload.suggestions = current.suggestions.trim() || null;
    }

    if (current.projections.trim() !== original.projections.trim()) {
        payload.projections = current.projections.trim() || null;
    }

    return payload;
}

function formatScoreMap(value: Record<string, number> | null) {
    if (!value || Object.keys(value).length === 0) {
        return "-";
    }

    return Object.entries(value)
        .map(([key, entry]) => `${key}: ${entry}`)
        .join(", ");
}

function formatFeedbackMap(value: Record<string, string> | null) {
    if (!value || Object.keys(value).length === 0) {
        return "-";
    }

    return Object.entries(value)
        .map(([key, entry]) => `${key}: ${entry}`)
        .join(" | ");
}

function getAssessmentTimestamp(feedback: TestFeedback) {
    if (feedback.modified_at?.trim()) {
        return feedback.modified_at;
    }
    if (feedback.created_at?.trim()) {
        return feedback.created_at;
    }
    return undefined;
}

function formatAssessmentSessionOptionLabel(session: TestSessionLink) {
    const className =
        session.class_name?.trim() ||
        session.session_name?.trim() ||
        session.session_key ||
        "";
    const timestamp = session.timestamp
        ? formatUserTimestamp(session.timestamp)
        : "";
    return timestamp ? `${className} - ${timestamp}` : className;
}

function formatSessionNameKeyLabel(
    sessionName?: string | null,
    sessionKey?: string | null,
) {
    const normalizedName = sessionName?.trim() || "";
    const normalizedKey = sessionKey?.trim() || "";

    if (normalizedName && normalizedKey && normalizedName !== normalizedKey) {
        return `${normalizedName} (${normalizedKey})`;
    }

    return normalizedName || normalizedKey || "-";
}

function toScoreMap(sections: TestSection[]) {
    return sections.reduce<Record<string, number>>((acc, section) => {
        if (section.section && typeof section.score === "number") {
            acc[section.section] = section.score;
        }
        return acc;
    }, {});
}

function sectionsFilter(row: TestSectionRow, query: string) {
    return (
        (row.section || "").toLowerCase().includes(query) ||
        String(row.score ?? "")
            .toLowerCase()
            .includes(query) ||
        (row.session_key || "").toLowerCase().includes(query)
    );
}

function sessionsFilter(row: TestSessionRow, query: string) {
    return (
        (row.class_name || "").toLowerCase().includes(query) ||
        (row.session_name || row.session_key || "")
            .toLowerCase()
            .includes(query) ||
        (row.session_key || "").toLowerCase().includes(query) ||
        (row.class_key || "").toLowerCase().includes(query) ||
        (row.timestamp ? formatUserTimestamp(row.timestamp) : "")
            .toLowerCase()
            .includes(query)
    );
}

function assessmentsFilter(row: TestAssessmentRow, query: string) {
    return (
        (row.student_name || "").toLowerCase().includes(query) ||
        (row.class_name || "").toLowerCase().includes(query) ||
        (row.test_name || "").toLowerCase().includes(query) ||
        formatScoreMap(row.scores).toLowerCase().includes(query) ||
        formatFeedbackMap(row.feedbacks).toLowerCase().includes(query) ||
        (row.suggestions || "").toLowerCase().includes(query) ||
        (row.projections || "").toLowerCase().includes(query) ||
        formatUserTimestamp(getAssessmentTimestamp(row))
            .toLowerCase()
            .includes(query)
    );
}

function assessmentSectionsFilter(row: AssessmentSectionRow, query: string) {
    return (
        (row.section || "").toLowerCase().includes(query) ||
        String(row.score ?? "")
            .toLowerCase()
            .includes(query) ||
        (row.feedback || "").toLowerCase().includes(query)
    );
}

interface ManagementTestDetailsProps {
    test: ManagementTest;
    onBack: () => void;
    onTestUpdated: (test: ManagementTest) => void;
    onTestDeleted?: (testKey: string) => void;
    loadingDetails?: boolean;
    detailsError?: string | null;
    rootLabel?: string;
    parentLabel?: string | null;
    onBackToRoot?: () => void;
    scopedClassKey?: string | null;
    returnUrl?: string | null;
    activeTab: ManagementTestSection;
    activeAssessmentId?: string | null;
    activeAssessmentTab: ManagementAssessmentSection;
    onTabChange: (tab: ManagementTestSection) => void;
    onAssessmentOpen: (assessmentId: string) => void;
    onAssessmentBack: () => void;
    onAssessmentTabChange: (tab: ManagementAssessmentSection) => void;
}

export default function ManagementTestDetails({
    test,
    onBack,
    onTestUpdated,
    onTestDeleted,
    loadingDetails = false,
    detailsError = null,
    rootLabel = "Tests",
    parentLabel = null,
    onBackToRoot,
    scopedClassKey = null,
    returnUrl = null,
    activeTab,
    activeAssessmentId = null,
    activeAssessmentTab,
    onTabChange,
    onAssessmentOpen,
    onAssessmentBack,
    onAssessmentTabChange,
}: ManagementTestDetailsProps) {
    const isBackgroundDetailView = useContext(BackgroundDetailViewContext);
    const detailViewMode = useResolvedDetailViewMode();
    const alignTableOptionsToLeft = Boolean(
        isBackgroundDetailView &&
            detailViewMode.floating &&
            detailViewMode.collapsed === "1",
    );
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { setStatus, clearStatus } = useGlobalStatus();
    const userScopes = getUserScopes(user);
    const canEditTests = hasAnyUserScope(user, ["tests_patch", "tests_post"]);
    const canDeleteTests = userScopes.includes("tests_delete");
    const isClassScopedPresentation =
        Boolean(returnUrl?.includes("/management/classes/")) ||
        rootLabel === "Classes";
    const invalidateCachedScope = (scope: string) => {
        const keyMap: Record<string, readonly unknown[]> = {
            managementTests: ["managementTests"],
            managementClassTests: ["managementClassTests"],
            managementTestSections: ["managementTestSections"],
            managementTestSessions: ["managementTestSessions"],
            managementTestAssessments: ["managementTestAssessments"],
            managementAssessmentDetails: ["managementAssessmentDetails"],
            managementAssessmentSections: ["managementAssessmentSections"],
            managementInlineClassOptions: ["managementInlineClassOptions"],
        };
        const queryKey = keyMap[scope];
        if (!queryKey) {
            return;
        }
        void queryClient.invalidateQueries({ queryKey });
    };
    const [testSections, setTestSections] = useState<TestSectionRow[]>([]);
    const [testSectionsLoading, setTestSectionsLoading] = useState(false);
    const [testSectionsError, setTestSectionsError] = useState<string | null>(
        null,
    );
    const [testSectionsSearchQuery, setTestSectionsSearchQuery] = useState("");
    const [testSectionsDraft, setTestSectionsDraft] = useState("");
    const [testSessions, setTestSessions] = useState<TestSessionRow[]>([]);
    const [testSessionsLoading, setTestSessionsLoading] = useState(false);
    const [testSessionsError, setTestSessionsError] = useState<string | null>(
        null,
    );
    const [testSessionsSearchQuery, setTestSessionsSearchQuery] = useState("");
    const [testSessionsDraft, setTestSessionsDraft] = useState("");
    const [
        showTestSessionsAdvancedFilters,
        setShowTestSessionsAdvancedFilters,
    ] = useState(false);
    const [testSessionsClassFilter, setTestSessionsClassFilter] = useState("");
    const [testSessionsPage, setTestSessionsPage] = useState(0);
    const [testSessionsPageSize, setTestSessionsPageSize] = useState(10);
    const [testSessionsRowCount, setTestSessionsRowCount] = useState(11);
    const [assessments, setAssessments] = useState<TestAssessmentRow[]>([]);
    const [assessmentsLoading, setAssessmentsLoading] = useState(false);
    const [assessmentsError, setAssessmentsError] = useState<string | null>(
        null,
    );
    const [assessmentsSearchQuery, setAssessmentsSearchQuery] = useState("");
    const [assessmentsDraft, setAssessmentsDraft] = useState("");
    const [showAssessmentsAdvancedFilters, setShowAssessmentsAdvancedFilters] =
        useState(false);
    const [assessmentsClassFilter, setAssessmentsClassFilter] = useState("");
    const [assessmentClassOptions, setAssessmentClassOptions] = useState<
        InlineOption[]
    >([]);
    const [assessmentsBeginDate, setAssessmentsBeginDate] = useState("");
    const [assessmentsEndDate, setAssessmentsEndDate] = useState("");
    const [assessmentsPage, setAssessmentsPage] = useState(0);
    const [assessmentsPageSize, setAssessmentsPageSize] = useState(10);
    const [assessmentsRowCount, setAssessmentsRowCount] = useState(11);
    const [selectedAssessment, setSelectedAssessment] =
        useState<TestAssessmentRow | null>(null);
    const [selectedAssessmentLoading, setSelectedAssessmentLoading] =
        useState(false);
    const [selectedAssessmentError, setSelectedAssessmentError] = useState<
        string | null
    >(null);
    const [generatingAssessmentPdf, setGeneratingAssessmentPdf] =
        useState(false);
    const [assessmentForm, setAssessmentForm] =
        useState<AssessmentEditableForm>(() => toAssessmentEditableForm(null));
    const [assessmentFormOriginal, setAssessmentFormOriginal] =
        useState<AssessmentEditableForm>(() => toAssessmentEditableForm(null));
    const [assessmentFormError, setAssessmentFormError] = useState<
        string | null
    >(null);
    const [assessmentSections, setAssessmentSections] = useState<
        AssessmentSectionRow[]
    >([]);
    const [assessmentSectionOriginals, setAssessmentSectionOriginals] =
        useState<Record<string, AssessmentSectionRow>>({});
    const [
        pendingAssessmentSectionChanges,
        setPendingAssessmentSectionChanges,
    ] = useState<
        Record<
            string,
            {
                section?: string | null;
                score?: number | null;
                feedback?: string | null;
                edited_at?: string | null;
            }
        >
    >({});
    const [assessmentSectionsSearchQuery, setAssessmentSectionsSearchQuery] =
        useState("");
    const [assessmentSectionsDraft, setAssessmentSectionsDraft] = useState("");
    const [testSectionsPage, setTestSectionsPage] = useState(0);
    const [testSectionsPageSize, setTestSectionsPageSize] = useState(10);
    const [isCreateTestSectionOpen, setIsCreateTestSectionOpen] =
        useState(false);
    const [isCreateTestSessionOpen, setIsCreateTestSessionOpen] =
        useState(false);
    const [isCreateAssessmentOpen, setIsCreateAssessmentOpen] = useState(false);
    const [isCreateAssessmentSectionOpen, setIsCreateAssessmentSectionOpen] =
        useState(false);
    const [classOptions, setClassOptions] = useState<InlineOption[]>([]);
    const [classOptionsLoading, setClassOptionsLoading] = useState(false);
    const [selectedTestSessionClassKey, setSelectedTestSessionClassKey] =
        useState("");
    const [sessionOptions, setSessionOptions] = useState<InlineOption[]>([]);
    const [sessionOptionsLoading, setSessionOptionsLoading] = useState(false);
    const [sessionTableClassOptions, setSessionTableClassOptions] = useState<
        InlineOption[]
    >([]);
    const [sessionEditOptionsByClass, setSessionEditOptionsByClass] = useState<
        Record<string, InlineOption[]>
    >({});
    const [selectedTestSessionKey, setSelectedTestSessionKey] = useState("");
    const [assessmentSessionOptions, setAssessmentSessionOptions] = useState<
        TestSessionLink[]
    >([]);
    const [selectedAssessmentSessionKey, setSelectedAssessmentSessionKey] =
        useState("");
    const [registrationOptions, setRegistrationOptions] = useState<
        InlineOption[]
    >([]);
    const [registrationOptionsLoading, setRegistrationOptionsLoading] =
        useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [sectionOriginals, setSectionOriginals] = useState<
        Record<string, TestSectionRow>
    >({});
    const [pendingSectionChanges, setPendingSectionChanges] = useState<
        Record<string, PatchTestSectionRequest>
    >({});
    const [sessionOriginals, setSessionOriginals] = useState<
        Record<string, TestSessionRow>
    >({});
    const [pendingSessionChanges, setPendingSessionChanges] = useState<
        Record<string, PatchTestSessionRequest>
    >({});
    const [patchError, setPatchError] = useState<string | null>(null);
    const [showOutdatedDataDialog, setShowOutdatedDataDialog] = useState(false);

    const testKey = test.appsheet_key || "";
    const normalizedScopedClassKey = scopedClassKey?.trim() || "";
    const hideSessionsTab = Boolean(normalizedScopedClassKey);
    const createTestSectionMutation = useMutation({
        mutationFn: (values: CreateTestSectionRequest) =>
            createManagementTestSection(testKey, values),
    });
    const createTestSessionMutation = useMutation({
        mutationFn: (values: CreateTestSessionRequest) =>
            createManagementTestSession(testKey, values),
    });
    const createAssessmentMutation = useMutation({
        mutationFn: (payload: CreateAssessmentDialogValues & { test_key: string }) =>
            createManagementTestAssessment(payload),
    });
    const createAssessmentSectionMutation = useMutation({
        mutationFn: ({
            assessmentId,
            payload,
        }: {
            assessmentId: string;
            payload: CreateAssessmentSectionRequest;
        }) => createManagementAssessmentSection(assessmentId, payload),
    });
    const deleteTestSectionMutation = useMutation({
        mutationFn: (sectionId: string) =>
            deleteManagementTestSection(testKey, sectionId),
    });
    const deleteTestSessionMutation = useMutation({
        mutationFn: (testSessionId: string) =>
            deleteManagementTestSession(testKey, testSessionId),
    });
    const deleteAssessmentMutation = useMutation({
        mutationFn: (assessmentId: string) =>
            deleteManagementAssessment(assessmentId),
    });
    const deleteAssessmentSectionMutation = useMutation({
        mutationFn: ({
            assessmentId,
            sectionId,
        }: {
            assessmentId: string;
            sectionId: string;
        }) => deleteManagementAssessmentSection(assessmentId, sectionId),
    });
    const deleteTestMutation = useMutation({
        mutationFn: (key: string) => deleteManagementTest(key),
    });
    const patchTestSectionMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: PatchTestSectionRequest;
        }) => patchManagementTestSection(testKey, id, payload),
    });
    const patchTestSessionMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: PatchTestSessionRequest;
        }) => patchManagementTestSession(testKey, id, payload),
    });
    const patchAssessmentMutation = useMutation({
        mutationFn: ({
            assessmentId,
            payload,
        }: {
            assessmentId: string;
            payload: PatchTestAssessmentRequest;
        }) => patchManagementAssessment(assessmentId, payload),
    });
    const patchAssessmentSectionMutation = useMutation({
        mutationFn: ({
            assessmentId,
            id,
            payload,
        }: {
            assessmentId: string;
            id: string;
            payload: {
                section?: string | null;
                score?: number | null;
                feedback?: string | null;
                edited_at?: string | null;
            };
        }) => patchManagementAssessmentSection(assessmentId, id, payload),
    });
    const saving =
        createTestSectionMutation.isPending ||
        createTestSessionMutation.isPending ||
        createAssessmentMutation.isPending ||
        createAssessmentSectionMutation.isPending ||
        deleteTestSectionMutation.isPending ||
        deleteTestSessionMutation.isPending ||
        deleteAssessmentMutation.isPending ||
        deleteAssessmentSectionMutation.isPending ||
        deleteTestMutation.isPending ||
        patchTestSectionMutation.isPending ||
        patchTestSessionMutation.isPending ||
        patchAssessmentMutation.isPending ||
        patchAssessmentSectionMutation.isPending;
    const selectedAssessmentSession = useMemo(
        () =>
            assessmentSessionOptions.find(
                (session) =>
                    session.session_key === selectedAssessmentSessionKey,
            ) ?? null,
        [assessmentSessionOptions, selectedAssessmentSessionKey],
    );
    const assessmentSessionSelectOptions = useMemo(
        () =>
            assessmentSessionOptions.map((session) => ({
                value: session.session_key,
                name: formatAssessmentSessionOptionLabel(session),
            })),
        [assessmentSessionOptions],
    );
    const assessmentsClassSelectOptions = useMemo(() => {
        return [
            { value: "", label: "All classes" },
            ...assessmentClassOptions.map((option) => ({
                value: option.value,
                label: option.name,
            })),
        ];
    }, [assessmentClassOptions]);
    const sessionTableClassSelectOptions = useMemo(
        () =>
            sessionTableClassOptions.map((option) => ({
                value: option.value,
                label: option.name,
            })),
        [sessionTableClassOptions],
    );
    const assessmentClassEditOptions = useMemo(() => {
        const currentClassKey = assessmentForm.classKey.trim();
        const options = assessmentClassOptions.map((option) => ({
            value: option.value,
            label: option.name,
        }));

        if (
            currentClassKey &&
            !options.some((option) => option.value === currentClassKey)
        ) {
            options.unshift({
                value: currentClassKey,
                label:
                    selectedAssessment?.class_name?.trim() || currentClassKey,
            });
        }

        return [{ value: "", label: "-- Class --" }, ...options];
    }, [
        assessmentClassOptions,
        assessmentForm.classKey,
        selectedAssessment?.class_name,
    ]);
    const assessmentRegistrationEditOptions = useMemo(() => {
        const currentRegistrationKey = assessmentForm.registrationKey.trim();
        const options = registrationOptions.map((option) => ({
            value: option.value,
            label: option.name,
        }));

        if (
            currentRegistrationKey &&
            !options.some((option) => option.value === currentRegistrationKey)
        ) {
            options.unshift({
                value: currentRegistrationKey,
                label:
                    selectedAssessment?.student_name?.trim() ||
                    currentRegistrationKey,
            });
        }

        return [{ value: "", label: "-- Registration --" }, ...options];
    }, [
        registrationOptions,
        assessmentForm.registrationKey,
        selectedAssessment?.student_name,
    ]);
    const assessmentFormIsDirty = useMemo(
        () =>
            assessmentForm.registrationKey !==
                assessmentFormOriginal.registrationKey ||
            assessmentForm.classKey !== assessmentFormOriginal.classKey ||
            assessmentForm.suggestions !== assessmentFormOriginal.suggestions ||
            assessmentForm.projections !== assessmentFormOriginal.projections,
        [assessmentForm, assessmentFormOriginal],
    );
    const selectedAssessmentClassLabel = useMemo(() => {
        const classKey = assessmentForm.classKey.trim();
        if (classKey) {
            const matched = assessmentClassOptions.find(
                (option) => option.value === classKey,
            );
            if (matched) {
                return matched.name;
            }
            return classKey;
        }
        return selectedAssessment?.class_name || "-";
    }, [
        assessmentClassOptions,
        assessmentForm.classKey,
        selectedAssessment?.class_name,
    ]);
    const selectedAssessmentRegistrationLabel = useMemo(() => {
        const registrationKey = assessmentForm.registrationKey.trim();
        if (!registrationKey) {
            return "-";
        }
        const matched = registrationOptions.find(
            (option) => option.value === registrationKey,
        );
        return (
            matched?.name || selectedAssessment?.student_name || registrationKey
        );
    }, [
        registrationOptions,
        assessmentForm.registrationKey,
        selectedAssessment?.student_name,
    ]);
    const hasSectionFieldChanged = (
        id: string,
        key: keyof PatchTestSectionRequest,
    ) => {
        const payload = pendingSectionChanges[id];
        return (
            Boolean(payload) &&
            Object.prototype.hasOwnProperty.call(payload, key)
        );
    };

    const hasSessionFieldChanged = (
        id: string,
        key: keyof PatchTestSessionRequest,
    ) => {
        const payload = pendingSessionChanges[id];
        return (
            Boolean(payload) &&
            Object.prototype.hasOwnProperty.call(payload, key)
        );
    };

    const hasAssessmentFieldChanged = (field: keyof AssessmentEditableForm) =>
        assessmentForm[field] !== assessmentFormOriginal[field];
    const pendingSectionsCount = useMemo(
        () => Object.keys(pendingSectionChanges).length,
        [pendingSectionChanges],
    );
    const pendingSessionsCount = useMemo(
        () => Object.keys(pendingSessionChanges).length,
        [pendingSessionChanges],
    );
    const pendingAssessmentSectionsCount = useMemo(
        () => Object.keys(pendingAssessmentSectionChanges).length,
        [pendingAssessmentSectionChanges],
    );
    const pendingAssessmentDetailsCount = assessmentFormIsDirty ? 1 : 0;
    const sectionsTabLabel =
        pendingSectionsCount > 0
            ? `Sections (${pendingSectionsCount})`
            : "Sections";
    const sessionsTabLabel =
        pendingSessionsCount > 0
            ? `Sessions (${pendingSessionsCount})`
            : "Sessions";
    const assessmentDetailsTabLabel =
        pendingAssessmentDetailsCount > 0
            ? `Details (${pendingAssessmentDetailsCount})`
            : "Details";
    const assessmentPartsTabLabel =
        pendingAssessmentSectionsCount > 0
            ? `Assessment Parts (${pendingAssessmentSectionsCount})`
            : "Assessment Parts";

    const hasAssessmentSectionFieldChanged = (
        id: string,
        key: "section" | "score" | "feedback",
    ) => {
        const payload = pendingAssessmentSectionChanges[id];
        return (
            Boolean(payload) &&
            Object.prototype.hasOwnProperty.call(payload, key)
        );
    };

    const loadTestSections = async () => {
        if (!testKey.trim()) {
            setTestSections([]);
            setTestSectionsError("Missing test key for selected test");
            return;
        }
        setTestSectionsError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementTestSections", testKey],
        });
        await testSectionsQuery.refetch();
    };

    const loadTestSessions = async () => {
        if (!testKey.trim()) {
            setTestSessions([]);
            setTestSessionsError("Missing test key for selected test");
            return;
        }
        setTestSessionsError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementTestSessions", testKey],
        });
        await testSessionsQuery.refetch();
    };

    const loadClassOptions = async () => {
        if (!canEditTests) {
            setClassOptions([]);
            setSessionOptions([]);
            setClassOptionsLoading(false);
            return;
        }

        if (normalizedScopedClassKey) {
            setClassOptions([
                {
                    name:
                        parentLabel?.trim() ||
                        test.group_name?.trim() ||
                        "Current class",
                    value: normalizedScopedClassKey,
                },
            ]);
            await loadSessionOptions(normalizedScopedClassKey);
            return;
        }

        if (!test.group_key?.trim()) {
            setClassOptions([]);
            setSessionOptions([]);
            return;
        }
        const groupKey = test.group_key.trim();

        try {
            setClassOptionsLoading(true);
            const data = await queryClient.fetchQuery({
                queryKey: ["managementInlineClassOptions", groupKey],
                queryFn: () => fetchInlineClassOptions(groupKey, -1),
            });
            setClassOptions(data);
        } catch (err) {
            if (isPermissionDeniedError(err)) {
                setCreateError(null);
                setClassOptions([]);
                return;
            }
            setCreateError(
                err instanceof Error
                    ? err.message
                    : "Failed to load class options",
            );
        } finally {
            setClassOptionsLoading(false);
        }
    };

    const loadSessionOptions = async (classKey: string) => {
        if (!canEditTests) {
            setSessionOptions([]);
            setSessionOptionsLoading(false);
            return;
        }

        const normalizedClassKey = classKey.trim();
        if (!normalizedClassKey) {
            setSessionOptions([]);
            return;
        }

        try {
            setSessionOptionsLoading(true);
            const data = await queryClient.fetchQuery({
                queryKey: [
                    "managementInlineSessionOptions",
                    normalizedClassKey,
                ],
                queryFn: () => fetchInlineSessionOptions(normalizedClassKey),
            });
            setSessionOptions(data);
        } catch (err) {
            if (isPermissionDeniedError(err)) {
                setCreateError(null);
                setSessionOptions([]);
                return;
            }
            setCreateError(
                err instanceof Error
                    ? err.message
                    : "Failed to load session options",
            );
            setSessionOptions([]);
        } finally {
            setSessionOptionsLoading(false);
        }
    };

    const handleTestSessionClassChange = (classKey: string) => {
        setSelectedTestSessionClassKey(classKey);
        setSelectedTestSessionKey("");
        setSessionOptions([]);
        setCreateError(null);

        if (!classKey.trim()) {
            return;
        }

        void loadSessionOptions(classKey);
    };

    const loadAssessmentSessionOptions = async (
        classKeyForDefault?: string,
        preferredSessionKey?: string,
    ) => {
        if (!canEditTests) {
            setAssessmentSessionOptions([]);
            setRegistrationOptions([]);
            setSelectedAssessmentSessionKey("");
            return;
        }

        if (!testKey.trim()) {
            setAssessmentSessionOptions([]);
            setRegistrationOptions([]);
            setCreateError("Missing test key for selected test");
            return;
        }

        try {
            const sessions = await queryClient.fetchQuery({
                queryKey: [
                    "assessmentSessionOptions",
                    testKey,
                    normalizedScopedClassKey,
                    "create",
                ],
                queryFn: () =>
                    fetchAllManagementTestSessions(
                        testKey,
                        normalizedScopedClassKey || undefined,
                    ),
            });
            setAssessmentSessionOptions(sessions);
            setRegistrationOptions([]);

            const normalizedPreferredSessionKey =
                preferredSessionKey?.trim() || "";
            const normalizedDefaultClassKey =
                classKeyForDefault?.trim() || normalizedScopedClassKey;
            const preferredSession = normalizedPreferredSessionKey
                ? sessions.find(
                      (session) =>
                          session.session_key === normalizedPreferredSessionKey,
                  )
                : null;
            const classSession =
                !preferredSession && normalizedDefaultClassKey
                    ? sessions.find(
                          (session) =>
                              session.class_key?.trim() ===
                              normalizedDefaultClassKey,
                      )
                    : null;
            const resolvedSession = preferredSession ?? classSession ?? null;

            if (resolvedSession?.session_key) {
                setSelectedAssessmentSessionKey(resolvedSession.session_key);
                void loadAssessmentRegistrationOptionsBySession(
                    resolvedSession.session_key,
                );
            } else {
                setSelectedAssessmentSessionKey("");
                setRegistrationOptions([]);
            }
        } catch (err) {
            setAssessmentSessionOptions([]);
            setRegistrationOptions([]);
            if (isPermissionDeniedError(err)) {
                setCreateError(null);
                return;
            }
            setCreateError(
                err instanceof Error
                    ? err.message
                    : "Failed to load class options",
            );
        }
    };

    const loadAssessmentRegistrationOptionsBySession = async (
        sessionKey: string,
    ) => {
        if (!canEditTests) {
            setRegistrationOptions([]);
            setRegistrationOptionsLoading(false);
            return;
        }

        const normalizedSessionKey = sessionKey.trim();
        if (!normalizedSessionKey) {
            setRegistrationOptions([]);
            return;
        }

        try {
            setRegistrationOptionsLoading(true);
            const data = await queryClient.fetchQuery({
                queryKey: ["sessionRegistrationOptions", normalizedSessionKey],
                queryFn: () =>
                    fetchInlineSessionRegistrationOptions(normalizedSessionKey),
            });
            setRegistrationOptions(data);
        } catch (err) {
            setRegistrationOptions([]);
            if (isPermissionDeniedError(err)) {
                setCreateError(null);
                return;
            }
            setCreateError(
                err instanceof Error
                    ? err.message
                    : "Failed to load registration options",
            );
        } finally {
            setRegistrationOptionsLoading(false);
        }
    };

    const handleAssessmentSessionChange = (sessionKey: string) => {
        setSelectedAssessmentSessionKey(sessionKey);
        setRegistrationOptions([]);
        handleAssessmentFieldChange("registrationKey", "");
        setCreateError(null);
        if (!sessionKey.trim()) {
            return;
        }

        void loadAssessmentRegistrationOptionsBySession(sessionKey);
    };

    const loadAssessments = async () => {
        if (!testKey.trim()) {
            setAssessments([]);
            setAssessmentsError("Missing test key for selected test");
            return;
        }

        setAssessmentsError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementTestAssessments", testKey],
        });
        await assessmentsQuery.refetch();
    };

    const handleAssessmentRowOpen = (assessment: TestAssessmentRow) => {
        onAssessmentOpen(assessment.appsheet_key);
        setSelectedAssessment(assessment);
        setSelectedAssessmentError(null);
        setAssessmentSectionsSearchQuery("");
        setAssessmentSectionsDraft("");
    };

    const handleAssessmentDetailsBack = () => {
        onAssessmentBack();
        setSelectedAssessment(null);
        setSelectedAssessmentError(null);
        setAssessmentSections([]);
        setAssessmentSectionsSearchQuery("");
        setAssessmentSectionsDraft("");
    };

    const loadAssessmentDetails = async (assessmentId: string) => {
        setSelectedAssessmentError(null);
        await queryClient.invalidateQueries({
            queryKey: ["managementAssessmentDetails", assessmentId],
        });
        await assessmentDetailsQuery.refetch();
    };

    const sessionTableClassOptionsQuery = useQuery({
        queryKey: [
            "testSessionTableClassOptions",
            testKey,
            normalizedScopedClassKey,
            test.group_key,
            parentLabel,
            test.group_name,
        ],
        queryFn: async () => {
            if (normalizedScopedClassKey) {
                return [
                    {
                        name:
                            parentLabel?.trim() ||
                            test.group_name?.trim() ||
                            normalizedScopedClassKey,
                        value: normalizedScopedClassKey,
                    },
                ];
            }
            if (!test.group_key?.trim()) {
                return [] as InlineOption[];
            }
            return fetchInlineClassOptions(test.group_key, -1);
        },
        enabled: activeTab === "sessions",
    });

    const assessmentClassOptionsQuery = useQuery({
        queryKey: [
            "assessmentClassOptions",
            testKey,
            normalizedScopedClassKey,
            parentLabel,
            test.group_name,
        ],
        queryFn: async () => {
            if (normalizedScopedClassKey) {
                return [
                    {
                        name:
                            parentLabel?.trim() ||
                            test.group_name?.trim() ||
                            normalizedScopedClassKey,
                        value: normalizedScopedClassKey,
                    },
                ];
            }
            const data = await fetchManagementTestSessionsPage(testKey, -1, 0);
            const classMap = new Map<string, string>();
            data.items.forEach((session) => {
                const classKey = session.class_key?.trim();
                if (!classKey) {
                    return;
                }
                if (!classMap.has(classKey)) {
                    classMap.set(
                        classKey,
                        session.class_name?.trim() || classKey,
                    );
                }
            });
            return Array.from(classMap.entries()).map(([value, name]) => ({
                value,
                name,
            }));
        },
        enabled:
            Boolean(testKey.trim()) &&
            (activeTab === "assessments" || activeTab === "sessions"),
    });

    const testSectionsQuery = useQuery({
        queryKey: ["managementTestSections", testKey],
        queryFn: () => fetchManagementTestSections(testKey),
        enabled: Boolean(testKey.trim()),
    });

    const testSessionsQuery = useQuery({
        queryKey: [
            "managementTestSessions",
            testKey,
            testSessionsPage,
            testSessionsPageSize,
            testSessionsClassFilter,
            normalizedScopedClassKey,
        ],
        queryFn: () => {
            const scopedSessionClassKey =
                normalizedScopedClassKey || testSessionsClassFilter.trim();
            return fetchManagementTestSessionsPage(
                testKey,
                testSessionsPageSize,
                testSessionsPage * testSessionsPageSize,
                scopedSessionClassKey || undefined,
            );
        },
        enabled:
            Boolean(testKey.trim()) &&
            activeTab === "sessions" &&
            pendingSessionsCount === 0,
    });

    const assessmentsQuery = useQuery({
        queryKey: [
            "managementTestAssessments",
            testKey,
            assessmentsPage,
            assessmentsPageSize,
            assessmentsClassFilter,
            assessmentsBeginDate,
            assessmentsEndDate,
            normalizedScopedClassKey,
        ],
        queryFn: () => {
            const scopedAssessmentClassKey =
                normalizedScopedClassKey || assessmentsClassFilter.trim();
            const begin = toBackendBoundary(assessmentsBeginDate, "start");
            const end = toBackendBoundary(assessmentsEndDate, "end");
            return fetchManagementTestAssessments(
                testKey,
                assessmentsPageSize,
                assessmentsPage * assessmentsPageSize,
                scopedAssessmentClassKey || undefined,
                begin,
                end,
            );
        },
        enabled: Boolean(testKey.trim()) && activeTab === "assessments",
    });

    const assessmentDetailsQuery = useQuery({
        queryKey: ["managementAssessmentDetails", activeAssessmentId],
        queryFn: async () => {
            const assessmentId = activeAssessmentId as string;
            const [assessmentData, sectionData] = await Promise.all([
                fetchManagementAssessmentDetails(assessmentId),
                fetchManagementAssessmentSections(assessmentId),
            ]);
            return { assessmentData, sectionData };
        },
        enabled: Boolean(activeAssessmentId) && activeTab === "assessments",
    });

    const assessmentSessionOptionsQuery = useQuery({
        queryKey: [
            "assessmentSessionOptions",
            testKey,
            normalizedScopedClassKey,
            selectedAssessment?.appsheet_key,
        ],
        queryFn: () =>
            fetchAllManagementTestSessions(
                testKey,
                normalizedScopedClassKey || undefined,
            ),
        enabled:
            canEditTests &&
            Boolean(selectedAssessment) &&
            Boolean(testKey.trim()),
    });

    const registrationOptionsQuery = useQuery({
        queryKey: ["sessionRegistrationOptions", selectedAssessmentSessionKey],
        queryFn: () =>
            fetchInlineSessionRegistrationOptions(
                selectedAssessmentSessionKey.trim(),
            ),
        enabled: canEditTests && Boolean(selectedAssessmentSessionKey.trim()),
    });

    useEffect(() => {
        setTestSessionsPage(0);
    }, [testSessionsPageSize, testKey, normalizedScopedClassKey]);

    useEffect(() => {
        setTestSessionsPage(0);
    }, [testSessionsClassFilter]);

    useEffect(() => {
        setAssessmentsPage(0);
    }, [
        assessmentsPageSize,
        testKey,
        normalizedScopedClassKey,
        assessmentsClassFilter,
    ]);

    useEffect(() => {
        setSelectedTestSessionClassKey(normalizedScopedClassKey);
    }, [normalizedScopedClassKey]);

    useEffect(() => {
        setSessionEditOptionsByClass({});
        setSessionTableClassOptions([]);
    }, [testKey]);

    useEffect(() => {
        if (activeTab !== "sessions") {
            return;
        }
        if (sessionTableClassOptionsQuery.error) {
            setSessionTableClassOptions([]);
            return;
        }
        if (!sessionTableClassOptionsQuery.data) {
            return;
        }
        setSessionTableClassOptions(sessionTableClassOptionsQuery.data);
    }, [
        activeTab,
        sessionTableClassOptionsQuery.data,
        sessionTableClassOptionsQuery.error,
    ]);

    useEffect(() => {
        if (activeTab !== "assessments" && activeTab !== "sessions") {
            return;
        }
        if (assessmentClassOptionsQuery.error) {
            setAssessmentClassOptions([]);
            return;
        }
        if (!assessmentClassOptionsQuery.data) {
            return;
        }
        setAssessmentClassOptions(assessmentClassOptionsQuery.data);
    }, [
        activeTab,
        assessmentClassOptionsQuery.data,
        assessmentClassOptionsQuery.error,
    ]);

    // Always load test sections on component mount or when testKey changes
    // This ensures sections are available for assessment dialogs regardless of active tab
    useEffect(() => {
        setTestSectionsLoading(testSectionsQuery.isFetching);
        if (testSectionsQuery.error) {
            setTestSections([]);
            setTestSectionsError(
                testSectionsQuery.error instanceof Error
                    ? testSectionsQuery.error.message
                    : "Failed to load test sections",
            );
            return;
        }
        if (!testSectionsQuery.data) {
            return;
        }
        const data = testSectionsQuery.data;
        setTestSectionsError(null);
        const rows = data.map((item) => ({ ...item, id: item.appsheet_key }));
        setTestSections(rows);
        setSectionOriginals(
            rows.reduce<Record<string, TestSectionRow>>((acc, row) => {
                acc[row.id] = row;
                return acc;
            }, {}),
        );
        setPendingSectionChanges({});
        onTestUpdated({
            ...test,
            scores_max: toScoreMap(data),
        });
    }, [
        testSectionsQuery.data,
        testSectionsQuery.error,
        testSectionsQuery.isFetching,
        onTestUpdated,
        test,
    ]);

    useEffect(() => {
        if (activeTab === "sessions" && pendingSessionsCount === 0) {
            setTestSessionsLoading(testSessionsQuery.isFetching);
            if (testSessionsQuery.error) {
                setTestSessions([]);
                setTestSessionsError(
                    testSessionsQuery.error instanceof Error
                        ? testSessionsQuery.error.message
                        : "Failed to load test sessions",
                );
                return;
            }
            if (!testSessionsQuery.data) {
                return;
            }
            const pageData = testSessionsQuery.data;
            const data = pageData.items;
            setTestSessionsError(null);
            const rows = data.map((item) => ({
                ...item,
                id: item.appsheet_key,
            }));
            setTestSessions(rows);
            setSessionOriginals(
                rows.reduce<Record<string, TestSessionRow>>((acc, row) => {
                    acc[row.id] = row;
                    return acc;
                }, {}),
            );
            setPendingSessionChanges({});
            const limit = testSessionsPageSize;
            const offset = testSessionsPage * testSessionsPageSize;
            if (typeof pageData.total === "number") {
                setTestSessionsRowCount(pageData.total);
            } else if (data.length < limit) {
                setTestSessionsRowCount(offset + data.length);
            } else {
                setTestSessionsRowCount(offset + limit + 1);
            }
            return;
        }
        if (activeTab === "assessments") {
            setAssessmentsLoading(assessmentsQuery.isFetching);
            if (assessmentsQuery.error) {
                setAssessments([]);
                setAssessmentsError(
                    assessmentsQuery.error instanceof Error
                        ? assessmentsQuery.error.message
                        : "Failed to load assessments",
                );
                return;
            }
            if (!assessmentsQuery.data) {
                return;
            }
            const data = assessmentsQuery.data;
            setAssessmentsError(null);
            setAssessments(
                data.map((item) => ({ ...item, id: item.appsheet_key })),
            );
            const limit = assessmentsPageSize;
            const offset = assessmentsPage * assessmentsPageSize;
            if (data.length < limit) {
                setAssessmentsRowCount(offset + data.length);
            } else {
                setAssessmentsRowCount(offset + limit + 1);
            }
        }
    }, [
        activeTab,
        pendingSessionsCount,
        testSessionsQuery.data,
        testSessionsQuery.error,
        testSessionsQuery.isFetching,
        assessmentsQuery.data,
        assessmentsQuery.error,
        assessmentsQuery.isFetching,
        testSessionsPage,
        testSessionsPageSize,
        assessmentsPage,
        assessmentsPageSize,
    ]);

    useEffect(() => {
        if (!activeAssessmentId || activeTab !== "assessments") {
            return;
        }
        setSelectedAssessmentLoading(assessmentDetailsQuery.isFetching);
        if (assessmentDetailsQuery.error) {
            setSelectedAssessmentError(
                assessmentDetailsQuery.error instanceof Error
                    ? assessmentDetailsQuery.error.message
                    : "Failed to load assessment details",
            );
            return;
        }
        if (!assessmentDetailsQuery.data) {
            return;
        }
        const { assessmentData, sectionData } = assessmentDetailsQuery.data;
        const nextAssessment = {
            ...assessmentData,
            id: assessmentData.appsheet_key,
        };
        setSelectedAssessment(nextAssessment);
        const rows = sectionData.map((item) => ({
            ...item,
            id: item.appsheet_key,
        }));
        setAssessmentSections(rows);
        setAssessmentSectionOriginals(
            rows.reduce<Record<string, AssessmentSectionRow>>((acc, row) => {
                acc[row.id] = row;
                return acc;
            }, {}),
        );
        setPendingAssessmentSectionChanges({});
        setAssessments((prev) =>
            prev.map((row) =>
                row.appsheet_key === nextAssessment.appsheet_key
                    ? nextAssessment
                    : row,
            ),
        );
        setSelectedAssessmentError(null);
    }, [
        activeAssessmentId,
        activeTab,
        assessmentDetailsQuery.data,
        assessmentDetailsQuery.error,
        assessmentDetailsQuery.isFetching,
    ]);

    useEffect(() => {
        if (!canEditTests) {
            const emptyForm = toAssessmentEditableForm(null);
            setAssessmentForm(emptyForm);
            setAssessmentFormOriginal(emptyForm);
            setAssessmentFormError(null);
            setSelectedAssessmentSessionKey("");
            setRegistrationOptions([]);
            return;
        }

        if (!selectedAssessment) {
            const emptyForm = toAssessmentEditableForm(null);
            setAssessmentForm(emptyForm);
            setAssessmentFormOriginal(emptyForm);
            setAssessmentFormError(null);
            setSelectedAssessmentSessionKey("");
            setRegistrationOptions([]);
            return;
        }

        const nextForm = toAssessmentEditableForm(selectedAssessment);
        if (!nextForm.classKey && normalizedScopedClassKey) {
            nextForm.classKey = normalizedScopedClassKey;
        }
        setAssessmentForm(nextForm);
        setAssessmentFormOriginal(nextForm);
        setAssessmentFormError(null);

        if (assessmentSessionOptionsQuery.error) {
            setAssessmentSessionOptions([]);
            setRegistrationOptions([]);
            if (isPermissionDeniedError(assessmentSessionOptionsQuery.error)) {
                setCreateError(null);
            } else {
                setCreateError(
                    assessmentSessionOptionsQuery.error instanceof Error
                        ? assessmentSessionOptionsQuery.error.message
                        : "Failed to load class options",
                );
            }
            return;
        }
        if (!assessmentSessionOptionsQuery.data) {
            return;
        }
        const sessions = assessmentSessionOptionsQuery.data;
        setAssessmentSessionOptions(sessions);
        setRegistrationOptions([]);

        const preferredSessionKey =
            selectedAssessment.session_key?.trim() || "";
        const normalizedDefaultClassKey =
            nextForm.classKey.trim() || normalizedScopedClassKey;
        const preferredSession = preferredSessionKey
            ? sessions.find(
                  (session) => session.session_key === preferredSessionKey,
              )
            : null;
        const classSession =
            !preferredSession && normalizedDefaultClassKey
                ? sessions.find(
                      (session) =>
                          session.class_key?.trim() ===
                          normalizedDefaultClassKey,
                  )
                : null;
        const resolvedSession = preferredSession ?? classSession ?? null;
        setSelectedAssessmentSessionKey(resolvedSession?.session_key || "");
    }, [canEditTests, selectedAssessment, normalizedScopedClassKey]);

    useEffect(() => {
        if (!canEditTests) {
            return;
        }
        if (registrationOptionsQuery.error) {
            setRegistrationOptions([]);
            if (isPermissionDeniedError(registrationOptionsQuery.error)) {
                setCreateError(null);
                return;
            }
            setCreateError(
                registrationOptionsQuery.error instanceof Error
                    ? registrationOptionsQuery.error.message
                    : "Failed to load registration options",
            );
            return;
        }
        if (!registrationOptionsQuery.data) {
            return;
        }
        setRegistrationOptions(registrationOptionsQuery.data);
    }, [
        canEditTests,
        registrationOptionsQuery.data,
        registrationOptionsQuery.error,
    ]);

    useEffect(() => {
        if (!activeAssessmentId) {
            setSelectedAssessment(null);
            setSelectedAssessmentError(null);
            setAssessmentSections([]);
            setAssessmentSectionsSearchQuery("");
            setAssessmentSectionsDraft("");
        }
    }, [activeAssessmentId]);

    const filteredTestSections = useMemo(() => {
        if (!testSectionsSearchQuery.trim()) {
            return testSections;
        }

        const query = testSectionsSearchQuery.toLowerCase();
        return testSections.filter((row) => sectionsFilter(row, query));
    }, [testSections, testSectionsSearchQuery]);

    const filteredTestSessions = useMemo(() => {
        const query = testSessionsSearchQuery.trim().toLowerCase();
        return testSessions.filter((row) => {
            if (query && !sessionsFilter(row, query)) {
                return false;
            }
            return true;
        });
    }, [testSessions, testSessionsSearchQuery]);

    const assessmentSectionsColumns = useMemo<
        SimpleDataTableColumn<AssessmentSectionRow>[]
    >(() => {
        const baseColumns: SimpleDataTableColumn<AssessmentSectionRow>[] = [
            {
                id: "section",
                header: "Section",
                className: "min-w-[220px]",
                render: (row) =>
                    canEditTests ? (
                        <Input
                            value={row.section ?? ""}
                            onChange={(event) =>
                                handleAssessmentSectionFieldChange(
                                    row.id,
                                    "section",
                                    event.target.value,
                                )
                            }
                            className={`h-9 ${hasAssessmentSectionFieldChanged(row.id, "section") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                            placeholder="Section"
                            disabled={saving}
                        />
                    ) : (
                        <div className="font-medium">{row.section || "-"}</div>
                    ),
            },
            {
                id: "score",
                header: "Score",
                className: "min-w-[140px]",
                render: (row) =>
                    canEditTests ? (
                        <Input
                            value={row.score ?? ""}
                            type="number"
                            onChange={(event) => {
                                const nextValue = event.target.value.trim();
                                handleAssessmentSectionFieldChange(
                                    row.id,
                                    "score",
                                    nextValue === "" ? null : Number(nextValue),
                                );
                            }}
                            className={`h-9 ${hasAssessmentSectionFieldChanged(row.id, "score") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                            placeholder="Score"
                            disabled={saving}
                        />
                    ) : (
                        (row.score ?? "-")
                    ),
            },
            {
                id: "feedback",
                header: "Feedback",
                className: "min-w-[320px]",
                cellClassName: "whitespace-normal text-sm",
                render: (row) =>
                    canEditTests ? (
                        <Textarea
                            value={row.feedback ?? ""}
                            onChange={(event) =>
                                handleAssessmentSectionFieldChange(
                                    row.id,
                                    "feedback",
                                    event.target.value,
                                )
                            }
                            rows={2}
                            className={
                                hasAssessmentSectionFieldChanged(
                                    row.id,
                                    "feedback",
                                )
                                    ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                    : undefined
                            }
                            placeholder="Feedback"
                            disabled={saving}
                        />
                    ) : (
                        row.feedback || "-"
                    ),
            },
        ];

        if (!canEditTests) {
            return baseColumns;
        }

        return [
            ...baseColumns,
            {
                id: "actions",
                header: "Actions",
                className: "w-[160px] text-right",
                cellClassName: "text-right",
                render: (row) => (
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                void confirmDelete(
                                    `Delete assessment section "${row.section || row.appsheet_key}"?`,
                                    () =>
                                        deleteAssessmentSectionMutation.mutateAsync(
                                            {
                                                assessmentId:
                                                    activeAssessmentId as string,
                                                sectionId: row.appsheet_key,
                                            },
                                        ),
                                    async () => {
                                        invalidateAssessmentCaches();
                                        await loadAssessmentDetails(
                                            activeAssessmentId as string,
                                        );
                                    },
                                )
                            }
                            aria-label="Delete assessment section"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ),
            },
        ];
    }, [
        activeAssessmentId,
        canEditTests,
        saving,
        pendingAssessmentSectionChanges,
    ]);

    const testSectionsColumns = useMemo<
        SimpleDataTableColumn<TestSectionRow>[]
    >(() => {
        const baseColumns: SimpleDataTableColumn<TestSectionRow>[] = [
            {
                id: "section",
                header: "Section",
                className: "min-w-[240px]",
                render: (row) =>
                    canEditTests ? (
                        <Input
                            value={row.section ?? ""}
                            onChange={(event) =>
                                handleSectionFieldChange(
                                    row.id,
                                    "section",
                                    event.target.value,
                                )
                            }
                            className={`h-9 ${hasSectionFieldChanged(row.id, "section") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                            placeholder="Section"
                            disabled={saving}
                        />
                    ) : (
                        <div className="font-medium">{row.section || "-"}</div>
                    ),
            },
            {
                id: "score",
                header: "Score",
                className: "min-w-[140px]",
                render: (row) =>
                    canEditTests ? (
                        <Input
                            value={row.score ?? ""}
                            type="number"
                            onChange={(event) => {
                                const nextValue = event.target.value.trim();
                                handleSectionFieldChange(
                                    row.id,
                                    "score",
                                    nextValue === "" ? null : Number(nextValue),
                                );
                            }}
                            className={`h-9 ${hasSectionFieldChanged(row.id, "score") ? "font-semibold text-primary border-primary/60 bg-primary/5" : ""}`}
                            placeholder="Score"
                            disabled={saving}
                        />
                    ) : (
                        (row.score ?? "-")
                    ),
            },
        ];

        if (!canEditTests) {
            return baseColumns;
        }

        return [
            ...baseColumns,
            {
                id: "actions",
                header: "Actions",
                className: "w-[160px] text-right",
                cellClassName: "text-right",
                render: (row) => (
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                void confirmDelete(
                                    `Delete test section "${row.section || row.appsheet_key}"?`,
                                    () =>
                                        deleteTestSectionMutation.mutateAsync(
                                            row.appsheet_key,
                                        ),
                                    async () => {
                                        invalidateCachedScope(
                                            "managementTestSections",
                                        );
                                        await loadTestSections();
                                    },
                                )
                            }
                            aria-label="Delete section"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ),
            },
        ];
    }, [
        canEditTests,
        handleSectionFieldChange,
        testKey,
        user?.username,
        saving,
        pendingSectionChanges,
    ]);

    const testSessionColumns = useMemo<
        SimpleDataTableColumn<TestSessionRow>[]
    >(() => {
        const baseColumns: SimpleDataTableColumn<TestSessionRow>[] = [
            {
                id: "class_name",
                header: "Class",
                className: "min-w-[220px]",
                render: (row) =>
                    canEditTests ? (
                        <SearchableSelect
                            value={row.class_key || ""}
                            onValueChange={(value) =>
                                handleSessionClassFieldChange(row.id, value)
                            }
                            options={(() => {
                                const mappedOptions =
                                    sessionTableClassSelectOptions;
                                if (
                                    row.class_key &&
                                    !mappedOptions.some(
                                        (option) =>
                                            option.value === row.class_key,
                                    )
                                ) {
                                    return [
                                        {
                                            value: row.class_key,
                                            label:
                                                row.class_name || row.class_key,
                                        },
                                        ...mappedOptions,
                                    ];
                                }
                                return mappedOptions;
                            })()}
                            placeholder="Select class"
                            searchPlaceholder="Search classes..."
                            className={
                                hasSessionFieldChanged(row.id, "class_key")
                                    ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                    : undefined
                            }
                            disabled={saving}
                        />
                    ) : (
                        row.class_name || "-"
                    ),
            },
            {
                id: "session",
                header: "Session",
                className: "min-w-[260px]",
                cellClassName: "font-medium text-foreground",
                render: (row) =>
                    canEditTests ? (
                        <SearchableSelect
                            value={row.session_key || ""}
                            onValueChange={(value) => {
                                const classKey = row.class_key?.trim() || "";
                                const classOptions = classKey
                                    ? (sessionEditOptionsByClass[classKey] ??
                                      [])
                                    : [];
                                handleSessionFieldChange(
                                    row.id,
                                    value,
                                    classOptions,
                                );
                            }}
                            options={(() => {
                                const classKey = row.class_key?.trim() || "";
                                const classOptions = classKey
                                    ? (sessionEditOptionsByClass[classKey] ??
                                      [])
                                    : [];
                                const mappedOptions = classOptions.map(
                                    (option) => ({
                                        value: option.value,
                                        label: option.name,
                                    }),
                                );

                                if (
                                    row.session_key &&
                                    !mappedOptions.some(
                                        (option) =>
                                            option.value === row.session_key,
                                    )
                                ) {
                                    mappedOptions.unshift({
                                        value: row.session_key,
                                        label: row.session_name || " - ",
                                    });
                                }

                                return mappedOptions;
                            })()}
                            placeholder="Select session"
                            searchPlaceholder="Search sessions..."
                            className={
                                hasSessionFieldChanged(row.id, "session_key")
                                    ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                    : undefined
                            }
                            disabled={saving || !(row.class_key || "").trim()}
                        />
                    ) : (
                        formatSessionNameKeyLabel(
                            row.session_name,
                            row.session_key,
                        )
                    ),
            },
            {
                id: "timestamp",
                header: "Timestamp",
                className: "min-w-[220px]",
                render: (row) =>
                    formatUserTimestamp(row.timestamp ?? undefined),
            },
        ];

        if (!canEditTests) {
            return baseColumns;
        }

        return [
            ...baseColumns,
            {
                id: "actions",
                header: "Actions",
                className: "w-[160px] text-right",
                cellClassName: "text-right",
                render: (row) => (
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(event) => {
                                event.stopPropagation();
                                void confirmDelete(
                                    `Delete test session "${row.session_name || row.session_key}"?`,
                                    () =>
                                        deleteTestSessionMutation.mutateAsync(
                                            row.appsheet_key,
                                        ),
                                    async () => {
                                        invalidateCachedScope(
                                            "managementTestSessions",
                                        );
                                        invalidateCachedScope(
                                            "managementTestAssessments",
                                        );
                                        await loadTestSessions();
                                    },
                                );
                            }}
                            aria-label="Delete session"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ),
            },
        ];
    }, [
        canEditTests,
        testKey,
        user?.username,
        formatUserTimestamp,
        handleSessionFieldChange,
        handleSessionClassFieldChange,
        saving,
        pendingSessionChanges,
        sessionEditOptionsByClass,
        sessionTableClassSelectOptions,
    ]);

    const assessmentColumns = useMemo<
        SimpleDataTableColumn<TestAssessmentRow>[]
    >(
        () => [
            {
                id: "student_name",
                header: "Student",
                className: "min-w-[180px]",
                cellClassName: "font-medium text-foreground",
                render: (row) => row.student_name || "-",
            },
            {
                id: "class_name",
                header: "Class",
                className: "min-w-[180px]",
                render: (row) => row.class_name || "-",
            },
            {
                id: "total_score",
                header: "Total",
                className: "min-w-[120px]",
                render: (row) => row.total_score ?? "-",
            },
        ],
        [],
    );

    const filteredAssessments = useMemo(() => {
        const query = assessmentsSearchQuery.trim().toLowerCase();
        return assessments.filter((row) => {
            if (query && !assessmentsFilter(row, query)) {
                return false;
            }
            return true;
        });
    }, [assessments, assessmentsSearchQuery]);

    const filteredAssessmentSections = useMemo(() => {
        if (!assessmentSectionsSearchQuery.trim()) {
            return assessmentSections;
        }

        const query = assessmentSectionsSearchQuery.toLowerCase();
        return assessmentSections.filter((row) =>
            assessmentSectionsFilter(row, query),
        );
    }, [assessmentSections, assessmentSectionsSearchQuery]);

    const scoreParts = useMemo(
        () =>
            testSections
                .map((row) => row.section)
                .filter((value): value is string => Boolean(value?.trim())),
        [testSections],
    );

    const runMutation = async (action: () => Promise<void>) => {
        setCreateError(null);
        setPatchError(null);
        await action();
    };

    const invalidateAssessmentCaches = () => {
        invalidateCachedScope("managementTestAssessments");
        invalidateCachedScope("managementAssessmentDetails");
        invalidateCachedScope("managementAssessmentSections");
    };

    const handleCreateTestSection = async (
        values: CreateTestSectionRequest,
    ) => {
        await runMutation(async () => {
            try {
                await createTestSectionMutation.mutateAsync(values);
                invalidateCachedScope("managementTestSections");
                setIsCreateTestSectionOpen(false);
                await loadTestSections();
            } catch (err) {
                setCreateError(
                    err instanceof Error
                        ? err.message
                        : "Failed to create test section",
                );
            }
        });
    };

    const handleCreateTestSession = async (
        values: CreateTestSessionRequest,
    ) => {
        await runMutation(async () => {
            try {
                await createTestSessionMutation.mutateAsync(values);
                invalidateCachedScope("managementTestSessions");
                invalidateCachedScope("managementTestAssessments");
                setIsCreateTestSessionOpen(false);
                setSelectedTestSessionClassKey(normalizedScopedClassKey);
                setSelectedTestSessionKey("");
                setSessionOptions([]);
                setTestSessionsPage(0);
                await loadTestSessions();
            } catch (err) {
                setCreateError(
                    err instanceof Error
                        ? err.message
                        : "Failed to create test session",
                );
            }
        });
    };

    const handleCreateAssessment = async (
        values: CreateAssessmentDialogValues,
    ) => {
        await runMutation(async () => {
            try {
                const created = await createAssessmentMutation.mutateAsync({
                    ...values,
                    test_key: testKey,
                    class_key:
                        selectedAssessmentSession?.class_key ??
                        values.class_key ??
                        null,
                });
                invalidateAssessmentCaches();
                setIsCreateAssessmentOpen(false);
                setAssessmentsPage(0);
                await loadAssessments();
                onAssessmentOpen(created.appsheet_key);
            } catch (err) {
                setCreateError(
                    err instanceof Error
                        ? err.message
                        : "Failed to create assessment",
                );
            }
        });
    };

    const handleCreateAssessmentSection = async (
        values: CreateAssessmentSectionRequest,
    ) => {
        if (!activeAssessmentId) {
            return;
        }

        await runMutation(async () => {
            try {
                await createAssessmentSectionMutation.mutateAsync({
                    assessmentId: activeAssessmentId,
                    payload: values,
                });
                invalidateAssessmentCaches();
                setIsCreateAssessmentSectionOpen(false);
                await loadAssessmentDetails(activeAssessmentId);
            } catch (err) {
                setCreateError(
                    err instanceof Error
                        ? err.message
                        : "Failed to create assessment section",
                );
            }
        });
    };

    const handleGenerateAssessmentPdf = async () => {
        if (!activeAssessmentId || !testKey) {
            setPatchError("Missing test or assessment key for PDF generation");
            return;
        }

        try {
            setGeneratingAssessmentPdf(true);
            setPatchError(null);
            await generateManagementAssessmentPdf(testKey, activeAssessmentId);
            invalidateAssessmentCaches();
            await loadAssessmentDetails(activeAssessmentId);
        } catch (err) {
            setPatchError(
                err instanceof Error
                    ? err.message
                    : "Failed to generate assessment PDF",
            );
        } finally {
            setGeneratingAssessmentPdf(false);
        }
    };

    const buildSectionPatch = (
        current: TestSectionRow,
        original: TestSectionRow,
    ): PatchTestSectionRequest => {
        const payload: PatchTestSectionRequest = {};
        if ((current.section ?? null) !== (original.section ?? null)) {
            payload.section = current.section ?? null;
        }
        if ((current.score ?? null) !== (original.score ?? null)) {
            payload.score = current.score ?? null;
        }
        if ((current.session_key ?? null) !== (original.session_key ?? null)) {
            payload.session_key = current.session_key ?? null;
        }
        if (Object.keys(payload).length > 0) {
            payload.edited_at = original.edited_at ?? null;
        }
        return payload;
    };

    function handleSectionFieldChange<K extends keyof TestSectionRow>(
        id: string,
        field: K,
        value: TestSectionRow[K],
    ) {
        setPatchError(null);
        setTestSections((prev) => {
            const rows = prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row,
            );
            const updated = rows.find((row) => row.id === id);
            const original = sectionOriginals[id];
            if (updated && original) {
                const payload = buildSectionPatch(updated, original);
                setPendingSectionChanges((prevPending) => {
                    if (Object.keys(payload).length === 0) {
                        const { [id]: _removed, ...rest } = prevPending;
                        return rest;
                    }
                    return { ...prevPending, [id]: payload };
                });
            }
            return rows;
        });
    }

    function handleSessionFieldChange(
        id: string,
        sessionKey: string,
        options?: InlineOption[],
    ) {
        setPatchError(null);
        setTestSessions((prev) => {
            const selectedOption = options?.find(
                (option) => option.value === sessionKey,
            );
            const rows = prev.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          session_key: sessionKey,
                          session_name:
                              selectedOption?.name ?? row.session_name,
                      }
                    : row,
            );
            const updated = rows.find((row) => row.id === id);
            const original = sessionOriginals[id];
            if (updated && original) {
                const payload: PatchTestSessionRequest = {};
                if (
                    (updated.class_key ?? null) !== (original.class_key ?? null)
                ) {
                    payload.class_key = updated.class_key || null;
                }
                if (
                    (updated.session_key ?? null) !==
                    (original.session_key ?? null)
                ) {
                    payload.session_key = updated.session_key || null;
                }
                setPendingSessionChanges((prevPending) => {
                    if (Object.keys(payload).length === 0) {
                        const { [id]: _removed, ...rest } = prevPending;
                        return rest;
                    }
                    payload.edited_at = original.edited_at ?? null;
                    return { ...prevPending, [id]: payload };
                });
            }
            return rows;
        });
    }

    function handleSessionClassFieldChange(id: string, classKey: string) {
        setPatchError(null);
        const normalizedClassKey = classKey.trim();
        const selectedClass = sessionTableClassOptions.find(
            (option) => option.value === normalizedClassKey,
        );

        setTestSessions((prev) => {
            const rows = prev.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          class_key: normalizedClassKey || null,
                          class_name:
                              selectedClass?.name ??
                              (normalizedClassKey || row.class_name),
                          session_key: "",
                          session_name: null,
                      }
                    : row,
            );
            const updated = rows.find((row) => row.id === id);
            const original = sessionOriginals[id];
            if (updated && original) {
                const payload: PatchTestSessionRequest = {};
                if (
                    (updated.class_key ?? null) !== (original.class_key ?? null)
                ) {
                    payload.class_key = updated.class_key || null;
                }
                if (
                    (updated.session_key ?? null) !==
                    (original.session_key ?? null)
                ) {
                    payload.session_key = updated.session_key || null;
                }
                setPendingSessionChanges((prevPending) => {
                    if (Object.keys(payload).length === 0) {
                        const { [id]: _removed, ...rest } = prevPending;
                        return rest;
                    }
                    payload.edited_at = original.edited_at ?? null;
                    return { ...prevPending, [id]: payload };
                });
            }
            return rows;
        });
    }

    const cancelPendingSectionChanges = () => {
        setTestSections((prev) =>
            prev.map((row) => sectionOriginals[row.id] ?? row),
        );
        setPendingSectionChanges({});
        setPatchError(null);
    };

    const cancelPendingSessionChanges = () => {
        setTestSessions((prev) =>
            prev.map((row) => sessionOriginals[row.id] ?? row),
        );
        setPendingSessionChanges({});
        setPatchError(null);
    };

    const pendingCombinedCount = pendingSectionsCount + pendingSessionsCount;

    const savePendingTabChanges = async () => {
        const sectionEntries = Object.entries(pendingSectionChanges);
        const sessionEntries = Object.entries(pendingSessionChanges);
        if (sectionEntries.length === 0 && sessionEntries.length === 0) {
            return;
        }

        await runMutation(async () => {
            try {
                if (sectionEntries.length > 0) {
                    await Promise.all(
                        sectionEntries.map(([id, payload]) =>
                            patchTestSectionMutation.mutateAsync({
                                id,
                                payload,
                            }),
                        ),
                    );
                    invalidateCachedScope("managementTestSections");
                }

                if (sessionEntries.length > 0) {
                    await Promise.all(
                        sessionEntries.map(([id, payload]) =>
                            patchTestSessionMutation.mutateAsync({
                                id,
                                payload,
                            }),
                        ),
                    );
                    invalidateCachedScope("managementTestSessions");
                    invalidateCachedScope("managementTestAssessments");
                }

                if (sectionEntries.length > 0) {
                    await loadTestSections();
                }
                if (sessionEntries.length > 0) {
                    await loadTestSessions();
                }
            } catch (err) {
                if (isOutdatedEditedAtConflictError(err)) {
                    setShowOutdatedDataDialog(true);
                    return;
                }
                setPatchError(
                    err instanceof Error
                        ? err.message
                        : "Failed to save pending changes",
                );
            }
        });
    };

    const cancelPendingTabChanges = () => {
        if (pendingSectionsCount > 0) {
            cancelPendingSectionChanges();
        }
        if (pendingSessionsCount > 0) {
            cancelPendingSessionChanges();
        }
    };

    const handleAssessmentFieldChange = <
        K extends keyof AssessmentEditableForm,
    >(
        field: K,
        value: AssessmentEditableForm[K],
    ) => {
        setAssessmentForm((prev) => ({
            ...prev,
            [field]: value,
        }));
        setAssessmentFormError(null);
        setPatchError(null);
    };

    const handleAssessmentClassChange = (classKey: string) => {
        handleAssessmentFieldChange("classKey", classKey);
        handleAssessmentFieldChange("registrationKey", "");
        setRegistrationOptions([]);
        if (!classKey.trim()) {
            setSelectedAssessmentSessionKey("");
            return;
        }

        const matchingSession = assessmentSessionOptions.find(
            (session) => session.class_key?.trim() === classKey.trim(),
        );
        if (matchingSession?.session_key) {
            setSelectedAssessmentSessionKey(matchingSession.session_key);
            void loadAssessmentRegistrationOptionsBySession(
                matchingSession.session_key,
            );
            return;
        }

        void loadAssessmentSessionOptions(classKey);
    };

    const buildAssessmentSectionPatch = (
        current: AssessmentSectionRow,
        original: AssessmentSectionRow,
    ) => {
        const payload: {
            section?: string | null;
            score?: number | null;
            feedback?: string | null;
            edited_at?: string | null;
        } = {};
        if ((current.section ?? null) !== (original.section ?? null)) {
            payload.section = current.section ?? null;
        }
        if ((current.score ?? null) !== (original.score ?? null)) {
            payload.score = current.score ?? null;
        }
        if ((current.feedback ?? null) !== (original.feedback ?? null)) {
            payload.feedback = current.feedback ?? null;
        }
        if (Object.keys(payload).length > 0) {
            payload.edited_at = original.edited_at ?? null;
        }
        return payload;
    };

    function handleAssessmentSectionFieldChange<
        K extends keyof AssessmentSectionRow,
    >(id: string, field: K, value: AssessmentSectionRow[K]) {
        setPatchError(null);
        setAssessmentSections((prev) => {
            const rows = prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row,
            );
            const updated = rows.find((row) => row.id === id);
            const original = assessmentSectionOriginals[id];
            if (updated && original) {
                const payload = buildAssessmentSectionPatch(updated, original);
                setPendingAssessmentSectionChanges((prevPending) => {
                    if (Object.keys(payload).length === 0) {
                        const { [id]: _removed, ...rest } = prevPending;
                        return rest;
                    }
                    return { ...prevPending, [id]: payload };
                });
            }
            return rows;
        });
    }

    const handleSaveAssessmentPendingChanges = async () => {
        if (!activeAssessmentId) {
            return;
        }

        const sectionEntries = Object.entries(pendingAssessmentSectionChanges);
        const hasDetailsChanges = assessmentFormIsDirty;
        if (!hasDetailsChanges && sectionEntries.length === 0) {
            return;
        }

        let detailsPayload: PatchTestAssessmentRequest | null = null;
        if (hasDetailsChanges) {
            try {
                detailsPayload = buildAssessmentPatch(
                    assessmentForm,
                    assessmentFormOriginal,
                );
            } catch (err) {
                setAssessmentFormError(
                    err instanceof Error
                        ? err.message
                        : "Assessment payload is invalid",
                );
                return;
            }
        }

        await runMutation(async () => {
            try {
                if (detailsPayload && Object.keys(detailsPayload).length > 0) {
                    detailsPayload.edited_at =
                        selectedAssessment?.edited_at ?? null;
                    await patchAssessmentMutation.mutateAsync({
                        assessmentId: activeAssessmentId,
                        payload: detailsPayload,
                    });
                }

                if (sectionEntries.length > 0) {
                    await Promise.all(
                        sectionEntries.map(([id, payload]) =>
                            patchAssessmentSectionMutation.mutateAsync({
                                assessmentId: activeAssessmentId,
                                id,
                                payload,
                            }),
                        ),
                    );
                }

                invalidateAssessmentCaches();
                await loadAssessments();
                await loadAssessmentDetails(activeAssessmentId);
            } catch (err) {
                if (isOutdatedEditedAtConflictError(err)) {
                    setShowOutdatedDataDialog(true);
                    return;
                }
                setPatchError(
                    err instanceof Error
                        ? err.message
                        : "Failed to save assessment changes",
                );
            }
        });
    };

    const handleCancelAssessmentPendingChanges = () => {
        setAssessmentForm(assessmentFormOriginal);
        setAssessmentSections((prev) =>
            prev.map((row) => assessmentSectionOriginals[row.id] ?? row),
        );
        setPendingAssessmentSectionChanges({});
        setAssessmentFormError(null);
        setPatchError(null);
    };

    const refreshOutdatedTestData = async () => {
        setShowOutdatedDataDialog(false);
        setPatchError(null);
        setAssessmentFormError(null);
        cancelPendingTabChanges();
        handleCancelAssessmentPendingChanges();
        invalidateCachedScope("managementTestSections");
        invalidateCachedScope("managementTestSessions");
        invalidateAssessmentCaches();
        await Promise.all([loadTestSections(), loadTestSessions(), loadAssessments()]);
        if (activeAssessmentId) {
            await loadAssessmentDetails(activeAssessmentId);
        }
    };

    const confirmDelete = async (
        message: string,
        action: () => Promise<void>,
        onDone: () => Promise<void>,
    ) => {
        if (!window.confirm(message)) {
            return;
        }

        await runMutation(async () => {
            try {
                await action();
                await onDone();
            } catch (err) {
                setPatchError(
                    err instanceof Error ? err.message : "Delete failed",
                );
            }
        });
    };

    useEffect(() => {
        if (patchError) {
            setStatus(patchError, "error");
            return;
        }

        if (createError) {
            setStatus(createError, "error");
            return;
        }

        if (assessmentFormError) {
            setStatus(assessmentFormError, "error");
            return;
        }

        if (selectedAssessmentError) {
            setStatus(selectedAssessmentError, "error");
            return;
        }

        if (detailsError) {
            setStatus(detailsError, "error");
            return;
        }

        if (activeTab === "sections" && testSectionsError) {
            setStatus(testSectionsError, "error");
            return;
        }

        if (activeTab === "sessions" && testSessionsError) {
            setStatus(testSessionsError, "error");
            return;
        }

        if (activeTab === "assessments" && assessmentsError) {
            setStatus(assessmentsError, "error");
            return;
        }

        if (
            activeTab === "assessments" &&
            activeAssessmentId &&
            selectedAssessmentLoading
        ) {
            setStatus("Loading assessment details...");
            return;
        }

        if (activeTab === "details" && loadingDetails) {
            setStatus("Loading latest test details...");
            return;
        }

        if (activeTab === "sections" && testSectionsLoading) {
            setStatus("Loading sections...");
            return;
        }

        if (activeTab === "sessions" && testSessionsLoading) {
            setStatus("Loading sessions...");
            return;
        }

        if (activeTab === "assessments" && assessmentsLoading) {
            setStatus("Loading assessments...");
            return;
        }

        clearStatus();
    }, [
        assessmentFormError,
        assessmentsError,
        assessmentsLoading,
        clearStatus,
        createError,
        detailsError,
        activeTab,
        loadingDetails,
        patchError,
        selectedAssessmentError,
        activeAssessmentId,
        selectedAssessmentLoading,
        setStatus,
        testSectionsError,
        testSectionsLoading,
        testSessionsError,
        testSessionsLoading,
    ]);

    useEffect(
        () => () => {
            clearStatus();
        },
        [clearStatus],
    );

    if (activeTab === "assessments" && activeAssessmentId) {
        const assessmentTitle = selectedAssessment
            ? `${selectedAssessment.student_name || "-"} - ${formatUserTimestamp(getAssessmentTimestamp(selectedAssessment))}`
            : activeAssessmentId;
        const registrationValue = assessmentForm.registrationKey.trim();
        const classValue = assessmentForm.classKey.trim();
        const assessmentPendingCount = canEditTests
            ? (assessmentFormIsDirty ? 1 : 0) + pendingAssessmentSectionsCount
            : 0;
        const hasAssessmentDialogOpen = isCreateAssessmentSectionOpen;

        return (
            <DetailView className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-y-auto overflow-x-hidden pr-1">
                <DetailHeader
                    breadcrumbs={
                        <DetailBreadcrumbs
                            items={[
                                {
                                    label: rootLabel,
                                    onClick: onBackToRoot ?? onBack,
                                },
                                ...(isClassScopedPresentation && parentLabel
                                    ? [{ label: parentLabel, onClick: onBack }]
                                    : []),
                                {
                                    label: test.name || "-",
                                    onClick: handleAssessmentDetailsBack,
                                },
                            ]}
                            current={assessmentTitle}
                        />
                    }
                    actions={
                        <>
                            {canEditTests && selectedAssessment && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                        void handleGenerateAssessmentPdf()
                                    }
                                    disabled={
                                        selectedAssessmentLoading ||
                                        saving ||
                                        generatingAssessmentPdf
                                    }
                                >
                                    <FileText className="size-4 mr-2" />
                                    {generatingAssessmentPdf
                                        ? "Generating PDF..."
                                        : "Generate PDF"}
                                </Button>
                            )}
                            {selectedAssessment?.pdf_url?.trim() && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                        const pdfUrl =
                                            selectedAssessment.pdf_url?.trim();
                                        if (pdfUrl) {
                                            window.open(
                                                pdfUrl,
                                                "_blank",
                                                "noopener,noreferrer",
                                            );
                                        }
                                    }}
                                    disabled={
                                        selectedAssessmentLoading ||
                                        saving ||
                                        generatingAssessmentPdf
                                    }
                                >
                                    <Eye className="size-4 mr-2" />
                                    View PDF
                                </Button>
                            )}
                            {canEditTests && selectedAssessment && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        void confirmDelete(
                                            `Delete assessment "${selectedAssessment.appsheet_key}"?`,
                                            () =>
                                                deleteAssessmentMutation.mutateAsync(
                                                    selectedAssessment.appsheet_key,
                                                ),
                                            async () => {
                                                invalidateAssessmentCaches();
                                                handleAssessmentDetailsBack();
                                                await loadAssessments();
                                            },
                                        )
                                    }
                                    disabled={
                                        selectedAssessmentLoading || saving
                                    }
                                >
                                    <Trash2 className="size-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </>
                    }
                />
                <DetailTabbedSection
                    tabs={[
                        { value: "details", label: assessmentDetailsTabLabel },
                        { value: "parts", label: assessmentPartsTabLabel },
                    ]}
                    activeTab={activeAssessmentTab}
                    onChange={(value) => {
                        if (isManagementAssessmentSection(value)) {
                            onAssessmentTabChange(value);
                        }
                    }}
                    className="flex min-h-0 flex-1 flex-col"
                    contentClassName="min-h-0 overflow-y-auto overflow-x-hidden pr-1"
                >
                    {activeAssessmentTab === "details" && (
                        <div className="space-y-4">
                            <DetailFieldsTable
                                rows={[
                                    {
                                        label: "Total Score",
                                        value: String(
                                            selectedAssessment?.total_score ??
                                                "-",
                                        ),
                                    },
                                    {
                                        label: "Updated",
                                        value: selectedAssessment
                                            ? formatUserTimestamp(
                                                  getAssessmentTimestamp(
                                                      selectedAssessment,
                                                  ),
                                              )
                                            : "-",
                                    },
                                    {
                                        label: (
                                            <DetailClassHeaderLabel
                                                classKey={
                                                    assessmentForm.classKey
                                                }
                                                onOpenClass={() => {
                                                    const target =
                                                        getManagementClassRoute(
                                                            assessmentForm.classKey.trim(),
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
                                        value: canEditTests ? (
                                            <SearchableSelect
                                                value={classValue}
                                                onValueChange={
                                                    handleAssessmentClassChange
                                                }
                                                options={
                                                    assessmentClassEditOptions
                                                }
                                                placeholder="-- Class --"
                                                searchPlaceholder="Search classes..."
                                                className={
                                                    hasAssessmentFieldChanged(
                                                        "classKey",
                                                    )
                                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                        : undefined
                                                }
                                                disabled={
                                                    selectedAssessmentLoading ||
                                                    saving
                                                }
                                            />
                                        ) : (
                                            selectedAssessmentClassLabel
                                        ),
                                    },
                                    {
                                        label: "Registration",
                                        value: canEditTests ? (
                                            <SearchableSelect
                                                value={registrationValue}
                                                onValueChange={(value) =>
                                                    handleAssessmentFieldChange(
                                                        "registrationKey",
                                                        value,
                                                    )
                                                }
                                                options={
                                                    assessmentRegistrationEditOptions
                                                }
                                                placeholder="-- Registration --"
                                                searchPlaceholder="Search registrations..."
                                                className={
                                                    hasAssessmentFieldChanged(
                                                        "registrationKey",
                                                    )
                                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                        : undefined
                                                }
                                                disabled={
                                                    selectedAssessmentLoading ||
                                                    saving ||
                                                    registrationOptionsLoading
                                                }
                                            />
                                        ) : (
                                            selectedAssessmentRegistrationLabel
                                        ),
                                    },
                                    {
                                        label: "Suggestions",
                                        value: canEditTests ? (
                                            <Textarea
                                                value={
                                                    assessmentForm.suggestions
                                                }
                                                onChange={(event) =>
                                                    handleAssessmentFieldChange(
                                                        "suggestions",
                                                        event.target.value,
                                                    )
                                                }
                                                rows={4}
                                                placeholder="Suggestions"
                                                className={
                                                    hasAssessmentFieldChanged(
                                                        "suggestions",
                                                    )
                                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                        : undefined
                                                }
                                                disabled={
                                                    selectedAssessmentLoading ||
                                                    saving
                                                }
                                            />
                                        ) : (
                                            <div className="whitespace-pre-wrap break-words leading-6">
                                                {assessmentForm.suggestions.trim() ||
                                                    "-"}
                                            </div>
                                        ),
                                    },
                                    {
                                        label: "Recommendations",
                                        value: canEditTests ? (
                                            <Textarea
                                                value={
                                                    assessmentForm.projections
                                                }
                                                onChange={(event) =>
                                                    handleAssessmentFieldChange(
                                                        "projections",
                                                        event.target.value,
                                                    )
                                                }
                                                rows={4}
                                                placeholder="Recommendations"
                                                className={
                                                    hasAssessmentFieldChanged(
                                                        "projections",
                                                    )
                                                        ? "font-semibold text-primary border-primary/60 bg-primary/5"
                                                        : undefined
                                                }
                                                disabled={
                                                    selectedAssessmentLoading ||
                                                    saving
                                                }
                                            />
                                        ) : (
                                            <div className="whitespace-pre-wrap break-words leading-6">
                                                {assessmentForm.projections.trim() ||
                                                    "-"}
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    )}

                    {activeAssessmentTab === "parts" && (
                        <div className="space-y-4 rounded-3xl">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                                <SearchField
                                    value={assessmentSectionsDraft}
                                    onChange={(v) => {
                                        setAssessmentSectionsDraft(v);
                                        if (v === "")
                                            setAssessmentSectionsSearchQuery(
                                                "",
                                            );
                                    }}
                                    onSubmit={() =>
                                        setAssessmentSectionsSearchQuery(
                                            assessmentSectionsDraft.trim(),
                                        )
                                    }
                                    placeholder="Search assessment sections"
                                    className={cn(
                                        "relative w-full lg:max-w-sm",
                                        alignTableOptionsToLeft
                                            ? "lg:ml-0"
                                            : "lg:ml-auto",
                                    )}
                                />
                                {canEditTests && (
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setIsCreateAssessmentSectionOpen(
                                                true,
                                            )
                                        }
                                        disabled={selectedAssessmentLoading}
                                    >
                                        <Plus className="size-4" />
                                        Add Section
                                    </Button>
                                )}
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-border/70 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
                                <SimpleDataTable
                                    columns={assessmentSectionsColumns}
                                    rows={filteredAssessmentSections}
                                    rowKey={(row) => row.id}
                                    loading={selectedAssessmentLoading}
                                    loadingMessage="Loading assessment sections..."
                                    emptyMessage="No assessment sections found."
                                    page={0}
                                    pageSize={
                                        filteredAssessmentSections.length || 10
                                    }
                                    onPageChange={() => {}}
                                    onPageSizeChange={() => {}}
                                />
                            </div>
                        </div>
                    )}
                </DetailTabbedSection>

                <CreateAssessmentSectionDialog
                    open={isCreateAssessmentSectionOpen}
                    saving={saving}
                    error={createError}
                    sectionOptions={scoreParts}
                    onClose={() =>
                        !saving && setIsCreateAssessmentSectionOpen(false)
                    }
                    onSubmit={handleCreateAssessmentSection}
                />

                <PendingChangesBar
                    pendingCount={assessmentPendingCount}
                    saving={saving}
                    onSave={handleSaveAssessmentPendingChanges}
                    onCancel={handleCancelAssessmentPendingChanges}
                    saveLabel="Save pending changes"
                    dimmed={hasAssessmentDialogOpen}
                    disabled={!canEditTests || hasAssessmentDialogOpen}
                />

                <OutdatedDataDialog
                    open={showOutdatedDataDialog}
                    onRefreshData={() => void refreshOutdatedTestData()}
                    onCancelAction={() => setShowOutdatedDataDialog(false)}
                    loading={saving}
                />
            </DetailView>
        );
    }

    return (
        <DetailView className="flex h-[calc(100dvh-7rem)] min-h-0 w-full max-w-[1700px] flex-col space-y-4 overflow-hidden">
            <DetailHeader
                breadcrumbs={
                    <DetailBreadcrumbs
                        items={[
                            {
                                label: rootLabel,
                                onClick: onBackToRoot ?? onBack,
                            },
                            ...(isClassScopedPresentation && parentLabel
                                ? [{ label: parentLabel, onClick: onBack }]
                                : []),
                        ]}
                        current={test.name || "-"}
                    />
                }
                actions={
                    canDeleteTests ? (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                                void confirmDelete(
                                    `Delete test "${test.name || test.appsheet_key}"?`,
                                    () => deleteTestMutation.mutateAsync(testKey),
                                    async () => {
                                        invalidateCachedScope(
                                            "managementTests",
                                        );
                                        invalidateCachedScope(
                                            "managementClassTests",
                                        );
                                        invalidateCachedScope(
                                            "managementTestSections",
                                        );
                                        invalidateCachedScope(
                                            "managementTestSessions",
                                        );
                                        invalidateCachedScope(
                                            "managementTestAssessments",
                                        );
                                        onTestDeleted?.(testKey);
                                    },
                                )
                            }
                            disabled={
                                loadingDetails || saving || !testKey.trim()
                            }
                        >
                            <Trash2 className="size-4 mr-2" />
                            Delete Test
                        </Button>
                    ) : null
                }
            />

            <DetailTabbedSection
                tabs={[
                    { value: "details", label: "Details" },
                    { value: "sections", label: sectionsTabLabel },
                    ...(!hideSessionsTab
                        ? [
                              {
                                  value: "sessions",
                                  label: sessionsTabLabel,
                              } as const,
                          ]
                        : []),
                    { value: "assessments", label: "Assessments" },
                ]}
                activeTab={activeTab}
                onChange={(value) => {
                    if (isManagementTestSection(value)) {
                        onTabChange(value);
                    }
                }}
                className="flex min-h-0 flex-1 flex-col"
                contentClassName="min-h-0 overflow-y-auto overflow-x-hidden pr-1"
            >
                {activeTab === "details" && (
                    <div className="space-y-4">
                        <div className="grid gap-3">
                            <DetailFieldsTable
                                rows={[
                                    {
                                        label: "Test Name",
                                        value: test.name || "-",
                                    },
                                    {
                                        label: "Test Group",
                                        value: test.group_name || "-",
                                    },
                                    {
                                        label: "Timestamp",
                                        value: formatUserTimestamp(
                                            test.timestamp ?? undefined,
                                        ),
                                    },
                                    {
                                        label: "Sections",
                                        value: String(
                                            Object.keys(test.scores_max ?? {})
                                                .length,
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "sections" && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <div
                                className={cn(
                                    "flex flex-col gap-3 sm:flex-row sm:items-end lg:max-w-sm",
                                    alignTableOptionsToLeft
                                        ? "lg:ml-0"
                                        : "lg:ml-auto",
                                )}
                            >
                                <SearchField
                                    value={testSectionsDraft}
                                    onChange={(v) => {
                                        setTestSectionsDraft(v);
                                        if (v === "")
                                            setTestSectionsSearchQuery("");
                                    }}
                                    onSubmit={() =>
                                        setTestSectionsSearchQuery(
                                            testSectionsDraft.trim(),
                                        )
                                    }
                                    placeholder="Search sections"
                                    className="relative w-full"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        invalidateCachedScope(
                                            "managementTestSections",
                                        );
                                        void loadTestSections();
                                    }}
                                    disabled={testSectionsLoading}
                                >
                                    <RefreshCw className="size-4" />
                                    Refresh
                                </Button>
                                {canEditTests && (
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setIsCreateTestSectionOpen(true)
                                        }
                                        disabled={testSectionsLoading}
                                    >
                                        <Plus className="size-4" />
                                        Create
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
                            <SimpleDataTable
                                columns={testSectionsColumns}
                                rows={filteredTestSections}
                                rowKey={(row) => row.id}
                                loading={testSectionsLoading}
                                loadingMessage="Loading sections..."
                                emptyMessage="No sections found."
                                page={testSectionsPage}
                                pageSize={testSectionsPageSize}
                                onPageChange={setTestSectionsPage}
                                onPageSizeChange={setTestSectionsPageSize}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "sessions" && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <SearchField
                                value={testSessionsDraft}
                                onChange={(v) => {
                                    setTestSessionsDraft(v);
                                    if (v === "")
                                        setTestSessionsSearchQuery("");
                                }}
                                onSubmit={() =>
                                    setTestSessionsSearchQuery(
                                        testSessionsDraft.trim(),
                                    )
                                }
                                placeholder="Search sessions"
                                className={cn(
                                    "relative w-full lg:max-w-sm",
                                    alignTableOptionsToLeft
                                        ? "lg:ml-0"
                                        : "lg:ml-auto",
                                )}
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setShowTestSessionsAdvancedFilters(
                                            (prev) => !prev,
                                        )
                                    }
                                >
                                    <SlidersHorizontal className="size-4" />
                                    Advanced
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        invalidateCachedScope(
                                            "managementTestSessions",
                                        );
                                        void loadTestSessions();
                                    }}
                                    disabled={testSessionsLoading}
                                >
                                    <RefreshCw className="size-4" />
                                    Refresh
                                </Button>
                                {canEditTests && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setCreateError(null);
                                            setSelectedTestSessionClassKey(
                                                normalizedScopedClassKey,
                                            );
                                            setSelectedTestSessionKey("");
                                            setSessionOptions([]);
                                            void loadClassOptions();
                                            setIsCreateTestSessionOpen(true);
                                        }}
                                        disabled={testSessionsLoading}
                                    >
                                        <Plus className="size-4" />
                                        Create
                                    </Button>
                                )}
                            </div>
                        </div>

                        {showTestSessionsAdvancedFilters && (
                            <div className="grid gap-2 rounded-lg border border-border/70 bg-card/60 p-3 sm:grid-cols-2 lg:grid-cols-4">
                                <label className="grid gap-1 text-sm">
                                    <span className="text-muted-foreground">
                                        Class
                                    </span>
                                    <SearchableSelect
                                        value={testSessionsClassFilter}
                                        onValueChange={(value) => {
                                            setTestSessionsClassFilter(value);
                                            setTestSessionsPage(0);
                                        }}
                                        options={assessmentsClassSelectOptions}
                                        placeholder="All classes"
                                        searchPlaceholder="Search classes..."
                                        disabled={Boolean(
                                            normalizedScopedClassKey,
                                        )}
                                    />
                                </label>
                            </div>
                        )}
                        <SimpleDataTable
                            columns={testSessionColumns}
                            rows={filteredTestSessions}
                            rowKey={(row) => row.id}
                            loading={testSessionsLoading}
                            loadingMessage="Loading sessions..."
                            emptyMessage="No sessions found."
                            page={testSessionsPage}
                            pageSize={testSessionsPageSize}
                            pageSizeOptions={DETAIL_PAGE_SIZE_OPTIONS}
                            onPageChange={setTestSessionsPage}
                            onPageSizeChange={(nextPageSize) => {
                                setTestSessionsPageSize(nextPageSize);
                                setTestSessionsPage(0);
                            }}
                            paginationMode="server"
                            totalRowCount={testSessionsRowCount}
                        />
                    </div>
                )}

                {activeTab === "assessments" && (
                    <div className="flex min-h-0 flex-1 flex-col space-y-6">
                        <div className="flex min-h-0 flex-1 flex-col space-y-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                                <SearchField
                                    value={assessmentsDraft}
                                    onChange={(v) => {
                                        setAssessmentsDraft(v);
                                        if (v === "")
                                            setAssessmentsSearchQuery("");
                                    }}
                                    onSubmit={() =>
                                        setAssessmentsSearchQuery(
                                            assessmentsDraft.trim(),
                                        )
                                    }
                                    placeholder="Search assessments"
                                    className={cn(
                                        "relative w-full lg:max-w-sm",
                                        alignTableOptionsToLeft
                                            ? "lg:ml-0"
                                            : "lg:ml-auto",
                                    )}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setShowAssessmentsAdvancedFilters(
                                                (prev) => !prev,
                                            )
                                        }
                                    >
                                        <SlidersHorizontal className="size-4" />
                                        Advanced
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            invalidateAssessmentCaches();
                                            void loadAssessments();
                                        }}
                                        disabled={assessmentsLoading}
                                    >
                                        <RefreshCw className="size-4" />
                                        Refresh
                                    </Button>
                                    {canEditTests && (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setCreateError(null);
                                                setSelectedAssessmentSessionKey(
                                                    "",
                                                );
                                                setAssessmentSessionOptions([]);
                                                setRegistrationOptions([]);
                                                void loadAssessmentSessionOptions();
                                                setIsCreateAssessmentOpen(true);
                                            }}
                                            disabled={assessmentsLoading}
                                        >
                                            <Plus className="size-4" />
                                            Create
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {showAssessmentsAdvancedFilters && (
                                <div className="grid gap-2 rounded-lg border border-border/70 bg-card/60 p-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <label className="grid gap-1 text-sm">
                                        <span className="text-muted-foreground">
                                            Class
                                        </span>
                                        <SearchableSelect
                                            value={assessmentsClassFilter}
                                            onValueChange={(value) => {
                                                setAssessmentsClassFilter(
                                                    value,
                                                );
                                                setAssessmentsPage(0);
                                            }}
                                            options={
                                                assessmentsClassSelectOptions
                                            }
                                            placeholder="All classes"
                                            searchPlaceholder="Search classes..."
                                            disabled={Boolean(
                                                normalizedScopedClassKey,
                                            )}
                                        />
                                    </label>
                                    <label className="grid gap-1 text-sm">
                                        <span className="text-muted-foreground">
                                            Begin Date
                                        </span>
                                        <input
                                            type="date"
                                            value={assessmentsBeginDate}
                                            onChange={(event) => {
                                                setAssessmentsBeginDate(
                                                    event.target.value,
                                                );
                                                setAssessmentsPage(0);
                                            }}
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        />
                                    </label>
                                    <label className="grid gap-1 text-sm">
                                        <span className="text-muted-foreground">
                                            End Date
                                        </span>
                                        <input
                                            type="date"
                                            value={assessmentsEndDate}
                                            onChange={(event) => {
                                                setAssessmentsEndDate(
                                                    event.target.value,
                                                );
                                                setAssessmentsPage(0);
                                            }}
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                        />
                                    </label>
                                </div>
                            )}
                            <SimpleDataTable
                                columns={assessmentColumns}
                                rows={filteredAssessments}
                                rowKey={(row) => row.id}
                                loading={assessmentsLoading}
                                loadingMessage="Loading assessments..."
                                emptyMessage="No assessments found."
                                page={assessmentsPage}
                                pageSize={assessmentsPageSize}
                                pageSizeOptions={DETAIL_PAGE_SIZE_OPTIONS}
                                onPageChange={setAssessmentsPage}
                                onPageSizeChange={(nextPageSize) => {
                                    setAssessmentsPageSize(nextPageSize);
                                    setAssessmentsPage(0);
                                }}
                                onRowClick={handleAssessmentRowOpen}
                                paginationMode="server"
                                totalRowCount={assessmentsRowCount}
                            />
                        </div>
                    </div>
                )}
            </DetailTabbedSection>

            <CreateTestSectionDialog
                open={isCreateTestSectionOpen}
                saving={saving}
                error={createError}
                onClose={() => !saving && setIsCreateTestSectionOpen(false)}
                onSubmit={handleCreateTestSection}
            />

            <CreateTestSessionDialog
                open={isCreateTestSessionOpen}
                saving={saving}
                error={createError}
                classOptions={classOptions}
                sessionOptions={sessionOptions}
                selectedClassKey={selectedTestSessionClassKey}
                selectedSessionKey={selectedTestSessionKey}
                loadingClasses={classOptionsLoading}
                loadingSessions={sessionOptionsLoading}
                onClassKeyChange={handleTestSessionClassChange}
                onSessionKeyChange={setSelectedTestSessionKey}
                onClose={() => !saving && setIsCreateTestSessionOpen(false)}
                onSubmit={handleCreateTestSession}
            />

            <CreateAssessmentDialog
                open={isCreateAssessmentOpen}
                saving={saving}
                error={createError}
                scoreParts={scoreParts}
                sessionOptions={assessmentSessionSelectOptions}
                selectedSessionKey={selectedAssessmentSessionKey}
                showSessionSelector={!hideSessionsTab}
                onSessionKeyChange={handleAssessmentSessionChange}
                registrationOptions={registrationOptions}
                loadingRegistrations={registrationOptionsLoading}
                onClose={() => !saving && setIsCreateAssessmentOpen(false)}
                onSubmit={handleCreateAssessment}
            />

            <CreateAssessmentSectionDialog
                open={isCreateAssessmentSectionOpen}
                saving={saving}
                error={createError}
                sectionOptions={scoreParts}
                onClose={() =>
                    !saving && setIsCreateAssessmentSectionOpen(false)
                }
                onSubmit={handleCreateAssessmentSection}
            />

            <PendingChangesBar
                pendingCount={pendingCombinedCount}
                saving={saving}
                onSave={savePendingTabChanges}
                onCancel={cancelPendingTabChanges}
                saveLabel="Save pending changes"
                dimmed={isCreateTestSectionOpen || isCreateTestSessionOpen}
                disabled={
                    !canEditTests ||
                    isCreateTestSectionOpen ||
                    isCreateTestSessionOpen
                }
            />

            <OutdatedDataDialog
                open={showOutdatedDataDialog}
                onRefreshData={() => void refreshOutdatedTestData()}
                onCancelAction={() => setShowOutdatedDataDialog(false)}
                loading={saving}
            />
        </DetailView>
    );
}
