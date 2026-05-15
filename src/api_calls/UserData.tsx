import {
    getAssessmentsEndpoint,
    getAssessmentDetailsEndpoint,
    getAssessmentSectionDetailsEndpoint,
    getAssessmentSectionsEndpoint,
    getAttendancePatchEndpoint,
    getClassDetailsEndpoint,
    getClassPatchEndpoint,
    getClassSchedulesEndpoint,
    getClassSessionsEndpoint,
    getClassFeedbacksEndpoint,
    getClassTestsEndpoint,
    getFeedbackDetailsEndpoint,
    getClassRegistrationsEndpoint,
    getScheduleDetailsEndpoint,
    getSchedulePatchEndpoint,
    getTestDetailsEndpoint,
    getTestAssessmentsEndpoint,
    getTestAssessmentPdfEndpoint,
    getTestSectionDetailsEndpoint,
    getTestSectionsEndpoint,
    getTestSessionDetailsEndpoint,
    getTestSessionsEndpoint,
    getEndpoint,
    getInlineEndpoint,
    getRegistrationPatchEndpoint,
    getSessionActionEndpoint,
    getSessionAttendancesEndpoint,
    getSessionDetailsEndpoint,
} from "../config/api";
import {
    clearStoredUserInfo,
    setStoredUserInfo,
} from "../auth/userStorage";
import { toBackendTimeValue, toBackendTimestamp } from "../utils/formatters";
import { fetchWithRefresh, fetchWithRetryAfter } from "./fetchWithRefresh";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface GoogleLoginRequest {
    credential: string; // JWT from Google
}

export interface UserInfo {
    name: string;
    username: string;
    sub: string;
    account_type: string;
    [key: string]: unknown;
}

export interface LoginResponse extends UserInfo {
    // Extends UserInfo which has sub, name, and any additional fields
}

export interface ResetPasswordRequest {
    token: string;
    username: string;
    password: string;
}

function toUserInfo(raw: unknown): UserInfo | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const name = item.name;
    const username = item.username;
    const sub = item.sub;
    const accountType = item.account_type;

    if (
        typeof name !== "string" ||
        typeof username !== "string" ||
        typeof sub !== "string" ||
        typeof accountType !== "string"
    ) {
        return null;
    }

    return {
        ...item,
        name,
        username,
        sub,
        account_type: accountType,
    };
}

function getCurrentUserPayload(data: unknown): unknown {
    if (!data || typeof data !== "object") {
        return data;
    }

    const record = data as Record<string, unknown>;

    if (record.user) {
        return record.user;
    }

    if (record.data && typeof record.data === "object") {
        const nestedData = record.data as Record<string, unknown>;
        if (nestedData.user) {
            return nestedData.user;
        }
    }

    return data;
}

export interface Session {
    appsheet_key: string;
    class_name: string;
    class_key: string;
    timestamp: string;
    mentor_name: string;
    ta_name: string;
    mentor_key?: string | null;
    ta_key?: string | null;
    duration: number | null;
    account?: string | null;
    topic?: string | null;
    created_at?: string | null;
    edited_at?: string | null;
    remarks?: string | null;
    id_recording?: string;
    id_meeting?: string;
    password?: string;
    join_url?: string;
    start_url?: string;
}

export interface SessionAttendance {
    appsheet_key: string;
    student_name: string;
    status: string;
    camera: boolean;
    mic: boolean;
    remarks?: string | null;
    edited_at?: string | null;
}

export interface Recording {
    class_name: string;
    mentor_name: string;
    ta_name: string;
    duration: number;
    timestamp: string;
    id_recording: string;
    exp: string;
    iat: string;
}

export interface ManagementClass {
    appsheet_key: string;
    class_group: string;
    group_key?: string | null;
    name: string;
    status: string;
    date_start: string;
    date_end: string;
    expected?: boolean;
    total_sessions?: number | null;
    completed_sessions?: number | null;
    student_count?: number | null;
    student_max_count?: number | null;
    notes?: string | null;
    edited_at?: string | null;
}

export interface ManagementTest {
    appsheet_key: string;
    group_key: string | null;
    group_name: string | null;
    name: string;
    scores_max: Record<string, number>;
    timestamp: string | null;
    edited_at?: string | null;
}

export interface CreateManagementTestRequest {
    group_key: string;
    name: string;
}

export interface TestScoreSectionRequest {
    name: string;
    score: number;
}

export interface InlineOption {
    name: string;
    value: string;
}

export interface TestSessionLink {
    appsheet_key: string;
    test_key: string;
    session_key: string;
    class_key: string | null;
    class_name: string | null;
    session_name: string | null;
    timestamp: string | null;
    edited_at?: string | null;
}

export interface CreateTestSessionRequest {
    session_key: string;
}

export interface PatchTestSessionRequest {
    class_key?: string | null;
    session_key?: string | null;
    edited_at?: string | null;
}

export interface TestSection {
    appsheet_key: string;
    test_key: string;
    session_key: string | null;
    section: string | null;
    score: number | null;
    edited_at?: string | null;
}

export interface CreateTestSectionRequest {
    session_key?: string | null;
    section: string;
    score: number;
}

export interface PatchTestSectionRequest {
    session_key?: string | null;
    section?: string | null;
    score?: number | null;
    edited_at?: string | null;
}

export interface ManagementSchedule {
    appsheet_key: string;
    name: string;
    class_key?: string | null;
    type: string;
    day: string;
    dayblock_key?: string | null;
    dayblock_name?: string | null;
    dayblock?: string | null;
    time_start: string;
    time_end: string;
    date_start?: string | null;
    date_end?: string | null;
    mentor_key?: string | null;
    mentor_name: string;
    ta_key?: string | null;
    ta_name: string;
    account_key?: string | null;
    account: string;
    inactive: boolean;
    edited_at?: string | null;
}

export interface ManagementScheduleFilters {
    classKey?: string;
    mentorKey?: string;
    taKey?: string;
    accountKey?: string;
    active?: boolean;
    type?: string;
    day?: string;
    dayblock?: string;
}

export interface SchedulePatchRequest {
    class_key?: string | null;
    type?: string | null;
    day?: string | null;
    dayblock?: string | null;
    time_start?: string | null;
    time_end?: string | null;
    mentor_key?: string | null;
    ta_key?: string | null;
    account_key?: string | null;
    date_start?: string | null;
    date_end?: string | null;
    inactive?: boolean | null;
    edited_at?: string | null;
}

export interface ClassRegistration {
    appsheet_key: string;
    student_name: string;
    class_name: string;
    class_key?: string | null;
    sessions: number | null;
    target: string | null;
    target_detail: string | null;
    status: string | null;
    amount?: number | null;
    created_at?: string | null;
    edited_at?: string | null;
}

export interface ClassPatchRequest {
    group_key?: string | null;
    class_name?: string | null;
    status?: string | null;
    date_start?: string | null;
    date_end?: string | null;
    notes?: string | null;
    edited_at?: string | null;
}

export interface SessionPatchRequest {
    class_key?: string | null;
    timestamp?: string | null;
    duration?: number | null;
    mentor_key?: string | null;
    ta_key?: string | null;
    password?: string | null;
    remarks?: string | null;
    edited_at?: string | null;
}

export interface CreateManagementSessionRequest {
    class_key: string;
    timestamp: string;
    duration: number;
    account: string;
    mentor?: string | null;
    ta?: string | null;
    password?: string | null;
    attendees?: boolean | null;
}

export interface CreateManagementClassRequest {
    group_key: string;
    class_name: string;
    date_start?: string | null;
    date_end?: string | null;
    status?: string | null;
}

export interface CreateManagementScheduleRequest {
    class_key: string;
    dayblock: string;
    day: string;
    type: string;
    time_start: string;
    time_end: string;
    mentor_key?: string | null;
    ta_key?: string | null;
    account_key?: string | null;
    date_start?: string | null;
    date_end?: string | null;
}

export interface AttendancePatchRequest {
    status?: string | null;
    camera?: boolean | null;
    mic?: boolean | null;
    remarks?: string | null;
    edited_at?: string | null;
}

export interface RegistrationPatchRequest {
    class_key?: string | null;
    sessions?: number | null;
    target?: string | null;
    target_detail?: string | null;
    status?: string | null;
    amount?: number | null;
    edited_at?: string | null;
}

export interface WeeklyFeedbackMentor {
    mentor?: string | null;
    environment?: number | null;
    quality?: number | null;
    productivity?: number | null;
}

export interface WeeklyFeedbackTa {
    ta?: string | null;
    helpfulness?: number | null;
}

export interface AssessmentSection {
    appsheet_key: string;
    assessment_key: string;
    section: string | null;
    score: number | null;
    feedback: string | null;
    edited_at?: string | null;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number | null;
    limit: number;
    offset: number;
}

function toManagementClass(raw: unknown): ManagementClass | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const name = item.name ?? item.class_name ?? item.className;
    if (typeof name !== "string" || !name.trim()) {
        return null;
    }

    const appsheetKey = item.appsheet_key;
    const groupKey = item.group_key ?? item.groupKey;
    const classGroup =
        item.group_name ??
        item.groupName ??
        item.class_group_name ??
        item.class_group ??
        item.group ??
        item.group_key ??
        item.groupKey;
    const status = item.status ?? item.state;
    const dateStart = item.date_start ?? item.dateStart ?? item.start_date;
    const dateEnd = item.date_end ?? item.dateEnd ?? item.end_date;
    const expected = item.expected;
    const totalSessions = item.total_sessions ?? item.totalSessions;
    const completedSessions = item.completed_sessions ?? item.completedSessions;
    const studentCount = item.student_count ?? item.studentCount;
    const studentMaxCount = item.student_max_count ?? item.studentMaxCount;
    const notes = item.notes;

    return {
        appsheet_key: typeof appsheetKey === "string" ? appsheetKey : "",
        class_group: typeof classGroup === "string" ? classGroup : "",
        group_key: typeof groupKey === "string" ? groupKey : null,
        name,
        status: typeof status === "string" ? status : "",
        date_start: typeof dateStart === "string" ? dateStart : "",
        date_end: typeof dateEnd === "string" ? dateEnd : "",
        expected: typeof expected === "boolean" ? expected : undefined,
        total_sessions:
            typeof totalSessions === "number" ? totalSessions : null,
        completed_sessions:
            typeof completedSessions === "number" ? completedSessions : null,
        student_count:
            typeof studentCount === "number" ? studentCount : null,
        student_max_count:
            typeof studentMaxCount === "number" ? studentMaxCount : null,
        notes: typeof notes === "string" ? notes : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function toManagementTest(raw: unknown): ManagementTest | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    const groupKey = item.group_key ?? item.groupKey;
    const groupName = item.group_name ?? item.groupName ?? item.group;
    const name = item.name ?? item.test_name ?? item.testName;
    const timestamp = item.timestamp;
    const scoreMaxRaw = item.scores_max ?? item.scoresMax;

    if (
        typeof appsheetKey !== "string" ||
        typeof name !== "string" ||
        (timestamp !== null && typeof timestamp !== "string")
    ) {
        return null;
    }

    const scores_max: Record<string, number> = {};
    if (scoreMaxRaw && typeof scoreMaxRaw === "object") {
        Object.entries(scoreMaxRaw as Record<string, unknown>).forEach(
            ([key, value]) => {
                if (typeof value === "number") {
                    scores_max[key] = value;
                }
            },
        );
    }

    return {
        appsheet_key: appsheetKey,
        group_key: typeof groupKey === "string" ? groupKey : null,
        group_name: typeof groupName === "string" ? groupName : null,
        name,
        scores_max,
        timestamp: typeof timestamp === "string" ? timestamp : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function toTestSessionLink(raw: unknown): TestSessionLink | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    const testKey = item.test_key;
    const sessionKey = item.session_key;
    const classKey = item.class_key ?? item.classKey;
    const className = item.class_name ?? item.className;
    const sessionName = item.session_name;
    const timestamp = item.timestamp;

    if (
        typeof appsheetKey !== "string" ||
        typeof testKey !== "string" ||
        typeof sessionKey !== "string"
    ) {
        return null;
    }

    return {
        appsheet_key: appsheetKey,
        test_key: testKey,
        session_key: sessionKey,
        class_key: typeof classKey === "string" ? classKey : null,
        class_name: typeof className === "string" ? className : null,
        session_name: typeof sessionName === "string" ? sessionName : null,
        timestamp: typeof timestamp === "string" ? timestamp : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function toTestSection(raw: unknown): TestSection | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    const testKey = item.test_key;

    if (typeof appsheetKey !== "string" || typeof testKey !== "string") {
        return null;
    }

    return {
        appsheet_key: appsheetKey,
        test_key: testKey,
        session_key:
            typeof item.session_key === "string" ? item.session_key : null,
        section: typeof item.section === "string" ? item.section : null,
        score: typeof item.score === "number" ? item.score : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function toSession(raw: unknown, fallbackKey = ""): Session | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey =
        typeof item.appsheet_key === "string" ? item.appsheet_key : fallbackKey;
    const className = item.class_name;
    const classKey = item.class_key;
    const timestamp = item.timestamp;
    const mentorName = item.mentor_name ?? item.mentor;
    const taName = item.ta_name ?? item.ta;
    const duration = getNumericValue(item.duration);

    if (typeof timestamp !== "string") {
        return null;
    }

    const joinUrl = appsheetKey
        ? getSessionActionEndpoint(appsheetKey, "join")
        : typeof item.join_url === "string"
          ? item.join_url
          : undefined;
    const startUrl = appsheetKey
        ? getSessionActionEndpoint(appsheetKey, "start")
        : typeof item.start_url === "string"
          ? item.start_url
          : undefined;

    return {
        appsheet_key: appsheetKey,
        class_name: typeof className === "string" ? className : "",
        class_key: typeof classKey === "string" ? classKey : "",
        timestamp,
        mentor_name: typeof mentorName === "string" ? mentorName : "",
        ta_name: typeof taName === "string" ? taName : "",
        mentor_key:
            typeof item.mentor_key === "string" ? item.mentor_key : null,
        ta_key: typeof item.ta_key === "string" ? item.ta_key : null,
        duration,
        account: typeof item.account === "string" ? item.account : null,
        topic: typeof item.topic === "string" ? item.topic : null,
        created_at:
            typeof item.created_at === "string" ? item.created_at : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
        remarks: typeof item.remarks === "string" ? item.remarks : null,
        id_recording:
            typeof item.id_recording === "string"
                ? item.id_recording
                : undefined,
        id_meeting:
            typeof item.id_meeting === "string" ? item.id_meeting : undefined,
        password: typeof item.password === "string" ? item.password : undefined,
        join_url: joinUrl,
        start_url: startUrl,
    };
}

function toSessionAttendance(raw: unknown): SessionAttendance | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    const studentName = item.student_name ?? item.student;

    if (typeof appsheetKey !== "string" || typeof studentName !== "string") {
        return null;
    }

    return {
        appsheet_key: appsheetKey,
        student_name: studentName,
        status: typeof item.status === "string" ? item.status : "",
        camera: typeof item.camera === "boolean" ? item.camera : false,
        mic: typeof item.mic === "boolean" ? item.mic : false,
        remarks: typeof item.remarks === "string" ? item.remarks : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function getArrayPayload<T = unknown>(data: unknown, legacyKey?: string): T[] {
    if (Array.isArray(data)) {
        return data as T[];
    }

    if (
        legacyKey &&
        data &&
        typeof data === "object" &&
        Array.isArray((data as Record<string, unknown>)[legacyKey])
    ) {
        return (data as Record<string, T[]>)[legacyKey];
    }

    return [];
}

function getObjectPayload(data: unknown): Record<string, unknown> | null {
    return data && typeof data === "object"
        ? (data as Record<string, unknown>)
        : null;
}

function getNumericValue(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return null;
}

function getPaginatedArrayPayload<T = unknown>(
    data: unknown,
    legacyKey?: string,
): PaginatedResult<T> {
    const directArray = getArrayPayload<T>(data, legacyKey);
    if (Array.isArray(data) || directArray.length > 0) {
        return {
            items: directArray,
            total: null,
            limit: directArray.length,
            offset: 0,
        };
    }

    const payload = getObjectPayload(data);
    if (!payload) {
        return {
            items: [],
            total: null,
            limit: 0,
            offset: 0,
        };
    }

    const itemCandidates = [
        getArrayPayload<T>(payload.items),
        getArrayPayload<T>(payload.results),
        getArrayPayload<T>(payload.data),
        getArrayPayload<T>(payload.rows),
    ];
    const items =
        itemCandidates.find((candidate) => candidate.length > 0) ??
        (legacyKey ? getArrayPayload<T>(payload[legacyKey]) : []) ??
        [];

    const pagination = getObjectPayload(payload.pagination);
    const meta = getObjectPayload(payload.meta);

    return {
        items,
        total:
            getNumericValue(payload.total) ??
            getNumericValue(payload.count) ??
            getNumericValue(payload.total_count) ??
            getNumericValue(payload.totalCount) ??
            getNumericValue(pagination?.total) ??
            getNumericValue(pagination?.count) ??
            getNumericValue(meta?.total) ??
            getNumericValue(meta?.count),
        limit:
            getNumericValue(payload.limit) ??
            getNumericValue(pagination?.limit) ??
            items.length,
        offset:
            getNumericValue(payload.offset) ??
            getNumericValue(pagination?.offset) ??
            0,
    };
}

function toInlineOption(raw: unknown): InlineOption | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    if (typeof item.name !== "string" || typeof item.value !== "string") {
        return null;
    }

    return {
        name: item.name,
        value: item.value,
    };
}

function toWeeklyFeedbackMentor(raw: unknown): WeeklyFeedbackMentor | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    return {
        mentor: typeof item.mentor === "string" ? item.mentor : null,
        environment:
            typeof item.environment === "number" ? item.environment : null,
        quality: typeof item.quality === "number" ? item.quality : null,
        productivity:
            typeof item.productivity === "number" ? item.productivity : null,
    };
}

function toWeeklyFeedbackTa(raw: unknown): WeeklyFeedbackTa | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    return {
        ta: typeof item.ta === "string" ? item.ta : null,
        helpfulness:
            typeof item.helpfulness === "number" ? item.helpfulness : null,
    };
}

function toAssessmentSection(raw: unknown): AssessmentSection | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    const assessmentKey = item.assessment_key;

    if (typeof appsheetKey !== "string" || typeof assessmentKey !== "string") {
        return null;
    }

    return {
        appsheet_key: appsheetKey,
        assessment_key: assessmentKey,
        section: typeof item.section === "string" ? item.section : null,
        score: typeof item.score === "number" ? item.score : null,
        feedback: typeof item.feedback === "string" ? item.feedback : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function toManagementSchedule(raw: unknown): ManagementSchedule | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const name = item.name ?? item.class_name ?? item.className;
    const classKey = item.class_key ?? item.classKey;
    const appsheetKey = item.appsheet_key;
    const type = item.type ?? item.schedule_type ?? item.kind;
    const day = item.day ?? item.weekday ?? item.date;
    const dayblockKey = item.dayblock_key ?? item.dayblockKey ?? item.dayblock;
    const dayblockName = item.dayblock_name ?? item.dayblockName;
    const timeStart =
        item.time_start ?? item.timeStart ?? item.start_time ?? item.timestamp;
    const timeEnd = item.time_end ?? item.timeEnd ?? item.end_time;
    const dateStart = item.date_start ?? item.dateStart ?? item.start_date;
    const dateEnd = item.date_end ?? item.dateEnd ?? item.end_date;
    const mentorKey = item.mentor_key ?? item.mentorKey;
    const mentor_name = item.mentor ?? item.mentor_name;
    const taKey = item.ta_key ?? item.taKey;
    const ta_name = item.ta ?? item.ta_name;
    const accountKey = item.account_key ?? item.accountKey;
    const account =
        item.account ?? item.account_email ?? item.accountEmail ?? item.email;
    const inactiveRaw = item.inactive;

    return {
        appsheet_key: typeof appsheetKey === "string" ? appsheetKey : "",
        name: typeof name === "string" ? name : "",
        class_key: typeof classKey === "string" ? classKey : null,
        type: typeof type === "string" ? type : "",
        dayblock_key: typeof dayblockKey === "string" ? dayblockKey : null,
        dayblock_name: typeof dayblockName === "string" ? dayblockName : null,
        dayblock:
            typeof dayblockKey === "string"
                ? dayblockKey
                : typeof dayblockName === "string"
                  ? dayblockName
                  : null,
        time_start: typeof timeStart === "string" ? timeStart : "",
        time_end: typeof timeEnd === "string" ? timeEnd : "",
        date_start: typeof dateStart === "string" ? dateStart : "",
        date_end: typeof dateEnd === "string" ? dateEnd : "",
        mentor_key: typeof mentorKey === "string" ? mentorKey : null,
        mentor_name: typeof mentor_name === "string" ? mentor_name : "",
        ta_key: typeof taKey === "string" ? taKey : null,
        ta_name: typeof ta_name === "string" ? ta_name : "",
        account_key: typeof accountKey === "string" ? accountKey : null,
        account: typeof account === "string" ? account : "",
        day: typeof day === "string" ? day : "",
        inactive: Boolean(inactiveRaw),
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function toClassRegistration(raw: unknown): ClassRegistration | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    const studentName = item.student_name ?? item.student;
    const className = item.class_name;
    const sessions = item.sessions;
    const status = item.status;

    if (typeof appsheetKey !== "string" || typeof studentName !== "string") {
        return null;
    }

    return {
        appsheet_key: appsheetKey,
        student_name: studentName,
        class_name: typeof className === "string" ? className : "",
        class_key: typeof item.class_key === "string" ? item.class_key : null,
        sessions: typeof sessions === "number" ? sessions : null,
        target: typeof item.target === "string" ? item.target : null,
        target_detail:
            typeof item.target_detail === "string" ? item.target_detail : null,
        status: typeof status === "string" ? status : null,
        amount: typeof item.amount === "number" ? item.amount : null,
        created_at:
            typeof item.created_at === "string" ? item.created_at : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

export async function login(
    credentials: LoginCredentials,
): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetchWithRetryAfter(getEndpoint("login"), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        credentials: "include",
        body: formData.toString(),
    });

    if (!response.ok) {
        throw new Error(
            `Login failed: ${response.status} ${response.statusText}`,
        );
    }

    return fetchCurrentUser();
}

export async function loginWithGoogle(
    credential: string,
): Promise<LoginResponse> {
    // Send Google JWT credential to backend as query parameter
    // Backend will verify the token and set cookies
    const params = new URLSearchParams();
    params.append("credential", credential);

    const response = await fetchWithRefresh(
        `${getEndpoint("authenticateGoogle")}?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(
            `Google login failed: ${response.status} ${response.statusText}`,
        );
    }

    return fetchCurrentUser();
}

export async function logout(): Promise<void> {
    const response = await fetchWithRefresh(getEndpoint("logout"), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Logout failed: ${response.status} ${response.statusText}`,
        );
    }

    clearStoredUserInfo();
}

export async function fetchCurrentUser(): Promise<UserInfo> {
    const response = await fetchWithRefresh(getEndpoint("currentUser"), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch current user: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const userInfo = toUserInfo(getCurrentUserPayload(data));

    if (!userInfo) {
        throw new Error("Current user response did not contain a valid user");
    }

    setStoredUserInfo(userInfo);
    return userInfo;
}
export async function fetchSessions(filters?: {
    timestamp?: string;
    begin?: string;
    end?: string;
    mentorKey?: string;
    taKey?: string;
    limit?: number;
    offset?: number;
    order?: "asc" | "desc";
}): Promise<Session[]> {
    const url = new URL(getEndpoint("sessions"));
    if (filters?.timestamp) {
        url.searchParams.append("timestamp", filters.timestamp);
    }
    if (filters?.begin) {
        url.searchParams.append("begin", filters.begin);
    }
    if (filters?.end) {
        url.searchParams.append("end", filters.end);
    }
    if (filters?.mentorKey?.trim()) {
        url.searchParams.append("mentor_key", filters.mentorKey.trim());
    }
    if (filters?.taKey?.trim()) {
        url.searchParams.append("ta_key", filters.taKey.trim());
    }
    if (typeof filters?.limit === "number") {
        url.searchParams.append("limit", String(filters.limit));
    }
    if (typeof filters?.offset === "number") {
        url.searchParams.append("offset", String(filters.offset));
    }
    if (filters?.order) {
        url.searchParams.append("order", filters.order);
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch sessions: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "sessions")
        .map((item) => toSession(item))
        .filter((item): item is Session => item !== null);
}

export async function fetchOwnRegistrations(
    limit = 25,
    offset = 0,
): Promise<ClassRegistration[]> {
    const result = await fetchOwnRegistrationsPage(limit, offset);
    return result.items;
}

export async function fetchOwnRegistrationsPage(
    limit = 25,
    offset = 0,
): Promise<PaginatedResult<ClassRegistration>> {
    const url = new URL(getEndpoint("ownRegistrations"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch registrations: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const parsed = getPaginatedArrayPayload(data, "registrations");
    const totalFromHeader = getNumericValue(
        response.headers.get("x-total-count"),
    );

    return {
        items: parsed.items
            .map((item) => toClassRegistration(item))
            .filter((item): item is ClassRegistration => item !== null),
        total: totalFromHeader ?? parsed.total,
        limit,
        offset,
    };
}

export async function fetchOwnAssessments(): Promise<TestFeedback[]> {
    const response = await fetchWithRefresh(getEndpoint("ownAssessments"), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch assessments: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "assessments")
        .map((item) => toTestFeedback(item))
        .filter((item): item is TestFeedback => item !== null);
}

export async function fetchManagementSessions(
    limit = 100,
    offset = 0,
    filters?: {
        begin?: string;
        end?: string;
        groupKey?: string;
        classKey?: string;
        mentorKey?: string;
        taKey?: string;
        order?: "asc" | "desc";
    },
): Promise<Session[]> {
    const url = new URL(getEndpoint("managementSessions"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (filters?.begin) {
        url.searchParams.append("begin", filters.begin);
    }
    if (filters?.end) {
        url.searchParams.append("end", filters.end);
    }
    if (filters?.groupKey?.trim()) {
        url.searchParams.append("group_key", filters.groupKey.trim());
    }
    if (filters?.classKey?.trim()) {
        url.searchParams.append("class_key", filters.classKey.trim());
    }
    if (filters?.mentorKey?.trim()) {
        url.searchParams.append("mentor_key", filters.mentorKey.trim());
    }
    if (filters?.taKey?.trim()) {
        url.searchParams.append("ta_key", filters.taKey.trim());
    }
    if (filters?.order) {
        url.searchParams.append("order", filters.order);
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch management sessions: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "sessions")
        .map((item) => toSession(item))
        .filter((item): item is Session => item !== null);
}

export async function fetchInlineSessionOptions(
    classKey: string,
    limit = -1,
): Promise<InlineOption[]> {
    const url = new URL(getInlineEndpoint("managementSessions"));
    url.searchParams.append("class_key", classKey);
    url.searchParams.append("limit", String(limit));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch inline session options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "sessions")
        .map((item) => toInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchInlineClassOptions(
    groupKey: string,
    limit = -1,
): Promise<InlineOption[]> {
    const url = new URL(getInlineEndpoint("managementClasses"));
    url.searchParams.append("group_key", groupKey);
    url.searchParams.append("group", groupKey);
    url.searchParams.append("limit", String(limit));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch inline class options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "classes")
        .map((item) => toInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchInlineSessionClassOptions(
    limit = -1,
): Promise<InlineOption[]> {
    const url = new URL(getInlineEndpoint("managementClasses"));
    url.searchParams.append("limit", String(limit));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch inline session class options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "classes")
        .map((item) => toInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchInlineGroupOptions(
    limit = -1,
): Promise<InlineOption[]> {
    const url = new URL(getInlineEndpoint("managementGroups"));
    url.searchParams.append("limit", String(limit));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch inline group options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "groups")
        .map((item) => toInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchInlineEmployeeOptions(
    limit = -1,
): Promise<InlineOption[]> {
    const url = new URL(getInlineEndpoint("managementUsers"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("account_type", "employee");
    url.searchParams.append("active", "True");

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch inline employee options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "users")
        .map((item) => toInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchAccountOptions(
    limit = -1,
    offset = 0,
    q?: string,
    filters?: {
        classKey?: string;
        day?: string;
        dayblock?: string;
    },
): Promise<InlineOption[]> {
    const url = new URL(getEndpoint("managementAccounts"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (q?.trim()) {
        url.searchParams.append("q", q.trim());
    }
    if (filters?.classKey?.trim()) {
        url.searchParams.append("class_key", filters.classKey.trim());
    }
    if (filters?.day?.trim()) {
        url.searchParams.append("day", filters.day.trim());
    }
    if (filters?.dayblock?.trim()) {
        url.searchParams.append("dayblock", filters.dayblock.trim());
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch account options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "accounts")
        .map((item) => toInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchDayblockOptions(
    limit = -1,
): Promise<InlineOption[]> {
    const url = new URL(getEndpoint("managementDayblocks"));
    if (limit >= -1) {
        url.searchParams.append("limit", String(limit));
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch dayblock options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const payload = getArrayPayload(data, "dayblocks");

    return payload
        .map((item) => {
            const direct = toInlineOption(item);
            if (direct) {
                return direct;
            }

            if (!item || typeof item !== "object") {
                return null;
            }

            const record = item as Record<string, unknown>;
            const value =
                record.value ??
                record.appsheet_key ??
                record.dayblock_key ??
                record.id ??
                record.key;
            const name =
                record.name ??
                record.dayblock ??
                record.dayblock_name ??
                record.label ??
                record.title;

            if (typeof value !== "string" || typeof name !== "string") {
                return null;
            }

            return {
                value,
                name,
            } as InlineOption;
        })
        .filter((item): item is InlineOption => item !== null);
}

export async function createManagementSession(
    payload: CreateManagementSessionRequest,
): Promise<Session> {
    const normalizedTimestamp = toBackendTimestamp(payload.timestamp);
    if (!normalizedTimestamp) {
        throw new Error("Invalid session timestamp");
    }

    const response = await fetchWithRefresh(getEndpoint("managementSessions"), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            ...payload,
            timestamp: normalizedTimestamp,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create session: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toSession(data?.session ?? data);
    if (!normalized) {
        throw new Error("Invalid session create response");
    }
    return normalized;
}

export async function createManagementClass(
    payload: CreateManagementClassRequest,
): Promise<ManagementClass> {
    const requestPayload: Record<string, unknown> = {
        group_key: payload.group_key.trim(),
        class_name: payload.class_name.trim(),
    };

    if (payload.date_start?.trim()) {
        requestPayload.date_start = payload.date_start.trim();
    }
    if (payload.date_end?.trim()) {
        requestPayload.date_end = payload.date_end.trim();
    }
    if (payload.status?.trim()) {
        requestPayload.status = payload.status.trim();
    }

    const response = await fetchWithRefresh(getEndpoint("managementClasses"), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create class: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toManagementClass(data?.class ?? data);
    if (!normalized) {
        throw new Error("Invalid class create response");
    }
    return normalized;
}

export async function createManagementSchedule(
    payload: CreateManagementScheduleRequest,
): Promise<ManagementSchedule> {
    const normalizedTimeStart = toBackendTimeValue(payload.time_start);
    const normalizedTimeEnd = toBackendTimeValue(payload.time_end);
    if (!normalizedTimeStart || !normalizedTimeEnd) {
        throw new Error("Invalid schedule time");
    }

    const requestPayload: Record<string, unknown> = {
        class_key: payload.class_key.trim(),
        dayblock: payload.dayblock.trim(),
        day: payload.day.trim(),
        type: payload.type.trim(),
        time_start: normalizedTimeStart,
        time_end: normalizedTimeEnd,
    };

    if (payload.mentor_key?.trim()) {
        requestPayload.mentor_key = payload.mentor_key.trim();
    }
    if (payload.ta_key?.trim()) {
        requestPayload.ta_key = payload.ta_key.trim();
    }
    if (payload.account_key?.trim()) {
        requestPayload.account_key = payload.account_key.trim();
    }
    if (payload.date_start?.trim()) {
        requestPayload.date_start = payload.date_start.trim();
    }
    if (payload.date_end?.trim()) {
        requestPayload.date_end = payload.date_end.trim();
    }

    const response = await fetchWithRefresh(
        getEndpoint("managementSchedules"),
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestPayload),
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create schedule: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toManagementSchedule(data?.schedule ?? data);
    if (!normalized) {
        throw new Error("Invalid schedule create response");
    }
    return normalized;
}

export async function fetchManagementTests(
    limit = 100,
    offset = 0,
    groupKey?: string,
): Promise<ManagementTest[]> {
    const url = new URL(getEndpoint("managementTests"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (groupKey?.trim()) {
        url.searchParams.append("group_key", groupKey.trim());
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch tests: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "tests")
        .map((item) => toManagementTest(item))
        .filter((item): item is ManagementTest => item !== null);
}

export async function fetchManagementClassTests(
    classKey: string,
    limit = 100,
    offset = 0,
): Promise<ManagementTest[]> {
    const url = new URL(getClassTestsEndpoint(classKey));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch class tests: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "tests")
        .map((item) => toManagementTest(item))
        .filter((item): item is ManagementTest => item !== null);
}

export async function fetchManagementTestDetails(
    testKey: string,
): Promise<ManagementTest> {
    const response = await fetchWithRefresh(getTestDetailsEndpoint(testKey), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch test details: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const arrayPayload = getArrayPayload(data, "tests")
        .map((item) => toManagementTest(item))
        .filter((item): item is ManagementTest => item !== null);

    if (arrayPayload.length > 0) {
        return arrayPayload[0];
    }

    const normalized = toManagementTest(
        data &&
            typeof data === "object" &&
            "test" in (data as Record<string, unknown>)
            ? (data as Record<string, unknown>).test
            : data,
    );
    if (!normalized) {
        throw new Error("Invalid test details response");
    }

    return normalized;
}

export async function createManagementTest(
    payload: CreateManagementTestRequest,
): Promise<void> {
    const response = await fetchWithRefresh(getEndpoint("managementTests"), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create test: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function deleteManagementTest(testKey: string): Promise<void> {
    const response = await fetchWithRefresh(getTestDetailsEndpoint(testKey), {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete test: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function fetchManagementTestSessions(
    testKey: string,
    limit = 100,
    offset = 0,
    classKey?: string,
): Promise<TestSessionLink[]> {
    const result = await fetchManagementTestSessionsPage(
        testKey,
        limit,
        offset,
        classKey,
    );
    return result.items;
}

export async function fetchManagementTestSessionsPage(
    testKey: string,
    limit = 100,
    offset = 0,
    classKey?: string,
    begin?: string,
    end?: string,
): Promise<PaginatedResult<TestSessionLink>> {
    const url = new URL(getTestSessionsEndpoint(testKey));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (classKey) {
        url.searchParams.append("class_key", classKey);
    }
    if (begin) {
        url.searchParams.append("begin", begin);
    }
    if (end) {
        url.searchParams.append("end", end);
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch test sessions: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const parsed = getPaginatedArrayPayload(data, "sessions");
    const totalFromHeader = getNumericValue(
        response.headers.get("x-total-count"),
    );

    return {
        items: parsed.items
            .map((item) => toTestSessionLink(item))
            .filter((item): item is TestSessionLink => item !== null),
        total: totalFromHeader ?? parsed.total,
        limit,
        offset,
    };
}

export async function fetchAllManagementTestSessions(
    testKey: string,
    classKey?: string,
): Promise<TestSessionLink[]> {
    const pageSize = 100;
    let offset = 0;
    let total: number | null = null;
    const items: TestSessionLink[] = [];

    while (total === null || offset < total) {
        const page = await fetchManagementTestSessionsPage(
            testKey,
            pageSize,
            offset,
            classKey,
        );
        items.push(...page.items);

        if (page.total !== null) {
            total = page.total;
        }

        if (page.items.length < pageSize) {
            break;
        }

        offset += pageSize;
    }

    return items;
}

export async function createManagementTestSession(
    testKey: string,
    payload: CreateTestSessionRequest,
): Promise<TestSessionLink> {
    const response = await fetchWithRefresh(getTestSessionsEndpoint(testKey), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create test session: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toTestSessionLink(data);
    if (!normalized) {
        throw new Error("Invalid test session response");
    }

    return normalized;
}

export async function patchManagementTestSession(
    testKey: string,
    testSessionId: string,
    payload: PatchTestSessionRequest,
): Promise<TestSessionLink> {
    const response = await fetchWithRefresh(
        getTestSessionDetailsEndpoint(testKey, testSessionId),
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update test session: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toTestSessionLink(data);
    if (!normalized) {
        throw new Error("Invalid test session update response");
    }

    return normalized;
}

export async function deleteManagementTestSession(
    testKey: string,
    testSessionId: string,
): Promise<void> {
    const response = await fetchWithRefresh(
        getTestSessionDetailsEndpoint(testKey, testSessionId),
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete test session: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function fetchManagementTestSections(
    testKey: string,
): Promise<TestSection[]> {
    const response = await fetchWithRefresh(getTestSectionsEndpoint(testKey), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch test sections: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "sections")
        .map((item) => toTestSection(item))
        .filter((item): item is TestSection => item !== null);
}

export async function createManagementTestSection(
    testKey: string,
    payload: CreateTestSectionRequest,
): Promise<TestSection> {
    const response = await fetchWithRefresh(getTestSectionsEndpoint(testKey), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create test section: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toTestSection(data);
    if (!normalized) {
        throw new Error("Invalid test section response");
    }

    return normalized;
}

export async function patchManagementTestSection(
    testKey: string,
    sectionId: string,
    payload: PatchTestSectionRequest,
): Promise<TestSection> {
    const response = await fetchWithRefresh(
        getTestSectionDetailsEndpoint(testKey, sectionId),
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update test section: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toTestSection(data);
    if (!normalized) {
        throw new Error("Invalid test section update response");
    }

    return normalized;
}

export async function deleteManagementTestSection(
    testKey: string,
    sectionId: string,
): Promise<void> {
    const response = await fetchWithRefresh(
        getTestSectionDetailsEndpoint(testKey, sectionId),
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete test section: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export interface TestFeedback {
    appsheet_key: string;
    registration_key?: string | null;
    class_key?: string | null;
    session_key?: string | null;
    student_name: string | null;
    class_name: string | null;
    test_name: string | null;
    scores: Record<string, number> | null;
    total_score: number | null;
    feedbacks: Record<string, string> | null;
    suggestions: string | null;
    projections: string | null;
    created_at: string | null;
    modified_at: string | null;
    pdf_url?: string | null;
    edited_at?: string | null;
}

export interface CreateTestAssessmentRequest {
    test_key: string;
    registration_key: string;
    class_key?: string | null;
    scores?: Record<string, number> | null;
    feedbacks?: Record<string, string> | null;
    suggestions?: string | null;
    projections?: string | null;
}

export interface PatchTestAssessmentRequest {
    registration_key?: string | null;
    class_key?: string | null;
    scores?: Record<string, number> | null;
    feedbacks?: Record<string, string> | null;
    suggestions?: string | null;
    projections?: string | null;
    edited_at?: string | null;
}

export interface CreateAssessmentSectionRequest {
    section: string;
    score: number;
    feedback?: string | null;
}

export interface PatchAssessmentSectionRequest {
    section?: string | null;
    score?: number | null;
    feedback?: string | null;
    edited_at?: string | null;
}

function toTestFeedback(raw: unknown): TestFeedback | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    if (typeof appsheetKey !== "string") {
        return null;
    }

    const toNumberRecord = (value: unknown): Record<string, number> | null => {
        if (!value || typeof value !== "object") {
            return null;
        }

        const output: Record<string, number> = {};
        Object.entries(value as Record<string, unknown>).forEach(
            ([key, entry]) => {
                if (typeof entry === "number") {
                    output[key] = entry;
                }
            },
        );
        return Object.keys(output).length > 0 ? output : null;
    };

    const toStringRecord = (value: unknown): Record<string, string> | null => {
        if (!value || typeof value !== "object") {
            return null;
        }

        const output: Record<string, string> = {};
        Object.entries(value as Record<string, unknown>).forEach(
            ([key, entry]) => {
                if (typeof entry === "string" && entry.trim()) {
                    output[key] = entry;
                }
            },
        );
        return Object.keys(output).length > 0 ? output : null;
    };

    return {
        appsheet_key: appsheetKey,
        registration_key:
            typeof item.registration_key === "string"
                ? item.registration_key
                : null,
        class_key: typeof item.class_key === "string" ? item.class_key : null,
        session_key:
            typeof item.session_key === "string" ? item.session_key : null,
        student_name:
            typeof item.student_name === "string" ? item.student_name : null,
        class_name:
            typeof item.class_name === "string" ? item.class_name : null,
        test_name: typeof item.test_name === "string" ? item.test_name : null,
        scores: toNumberRecord(item.scores),
        total_score:
            typeof item.total_score === "number" ? item.total_score : null,
        feedbacks: toStringRecord(item.feedbacks),
        suggestions:
            typeof item.suggestions === "string" ? item.suggestions : null,
        projections:
            typeof item.projections === "string" ? item.projections : null,
        created_at:
            typeof item.created_at === "string" ? item.created_at : null,
        modified_at:
            typeof item.modified_at === "string" ? item.modified_at : null,
        pdf_url: typeof item.pdf_url === "string" ? item.pdf_url : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

function toRegistrationInlineOption(raw: unknown): InlineOption | null {
    const direct = toInlineOption(raw);
    if (direct) {
        return direct;
    }

    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const value = item.value ?? item.appsheet_key ?? item.registration_key;
    const name = item.name ?? item.student_name ?? item.student;

    if (
        typeof value !== "string" ||
        !value.trim() ||
        typeof name !== "string" ||
        !name.trim()
    ) {
        return null;
    }

    return {
        value,
        name,
    };
}

export async function fetchManagementTestAssessments(
    testKey: string,
    limit = 100,
    offset = 0,
    classKey?: string,
    begin?: string,
    end?: string,
): Promise<TestFeedback[]> {
    const url = new URL(getTestAssessmentsEndpoint(testKey));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (classKey) {
        url.searchParams.append("class_key", classKey);
    }
    if (begin) {
        url.searchParams.append("begin", begin);
    }
    if (end) {
        url.searchParams.append("end", end);
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch test assessments: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "assessments")
        .map((item) => toTestFeedback(item))
        .filter((item): item is TestFeedback => item !== null);
}

export async function createManagementTestAssessment(
    payload: CreateTestAssessmentRequest,
): Promise<TestFeedback> {
    const response = await fetchWithRefresh(getAssessmentsEndpoint(), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create assessment: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toTestFeedback(data);
    if (!normalized) {
        throw new Error("Invalid assessment response");
    }

    return normalized;
}

export async function fetchManagementAssessmentDetails(
    assessmentId: string,
): Promise<TestFeedback> {
    const response = await fetchWithRefresh(
        getAssessmentDetailsEndpoint(assessmentId),
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch assessment details: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toTestFeedback(data);
    if (!normalized) {
        throw new Error("Invalid assessment details response");
    }

    return normalized;
}

export async function generateManagementAssessmentPdf(
    testKey: string,
    assessmentId: string,
): Promise<void> {
    const response = await fetchWithRefresh(
        getTestAssessmentPdfEndpoint(testKey, assessmentId),
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to generate assessment PDF: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function patchManagementAssessment(
    assessmentId: string,
    payload: PatchTestAssessmentRequest,
): Promise<TestFeedback> {
    const response = await fetchWithRefresh(
        getAssessmentDetailsEndpoint(assessmentId),
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update assessment: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toTestFeedback(data);
    if (!normalized) {
        throw new Error("Invalid assessment update response");
    }

    return normalized;
}

export async function deleteManagementAssessment(
    assessmentId: string,
): Promise<void> {
    const response = await fetchWithRefresh(
        getAssessmentDetailsEndpoint(assessmentId),
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete assessment: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function fetchManagementAssessmentSections(
    assessmentId: string,
): Promise<AssessmentSection[]> {
    const response = await fetchWithRefresh(
        getAssessmentSectionsEndpoint(assessmentId),
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch assessment sections: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "sections")
        .map((item) => toAssessmentSection(item))
        .filter((item): item is AssessmentSection => item !== null);
}

export async function createManagementAssessmentSection(
    assessmentId: string,
    payload: CreateAssessmentSectionRequest,
): Promise<AssessmentSection> {
    const response = await fetchWithRefresh(
        getAssessmentSectionsEndpoint(assessmentId),
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to create assessment section: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toAssessmentSection(data);
    if (!normalized) {
        throw new Error("Invalid assessment section response");
    }

    return normalized;
}

export async function patchManagementAssessmentSection(
    assessmentId: string,
    sectionId: string,
    payload: PatchAssessmentSectionRequest,
): Promise<AssessmentSection> {
    const response = await fetchWithRefresh(
        getAssessmentSectionDetailsEndpoint(assessmentId, sectionId),
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to update assessment section: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toAssessmentSection(data);
    if (!normalized) {
        throw new Error("Invalid assessment section update response");
    }

    return normalized;
}

export async function deleteManagementAssessmentSection(
    assessmentId: string,
    sectionId: string,
): Promise<void> {
    const response = await fetchWithRefresh(
        getAssessmentSectionDetailsEndpoint(assessmentId, sectionId),
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete assessment section: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function fetchManagementTestFeedbacks(
    testKey: string,
): Promise<TestFeedback[]> {
    return fetchManagementTestAssessments(testKey);
}

export async function fetchInlineAvailableRegistrationOptions(
    classKey: string,
    limit = -1,
): Promise<InlineOption[]> {
    const url = new URL(getInlineEndpoint("managementRegistrations"));
    url.searchParams.append("class_key", classKey);
    url.searchParams.append("limit", String(limit));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch available registration options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "registrations")
        .map((item) => toRegistrationInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchInlineSessionRegistrationOptions(
    sessionKey: string,
    limit = -1,
): Promise<InlineOption[]> {
    const normalizedSessionKey = sessionKey.trim();
    if (!normalizedSessionKey) {
        return [];
    }

    const url = new URL(getInlineEndpoint("managementRegistrations"));
    url.searchParams.append("session_key", normalizedSessionKey);
    url.searchParams.append("limit", String(limit));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch session registration options: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "registrations")
        .map((item) => toRegistrationInlineOption(item))
        .filter((item): item is InlineOption => item !== null);
}

export async function fetchManagementClasses(
    limit = 100,
    offset = 0,
    q?: string,
    groupKey?: string,
    status?: string,
): Promise<ManagementClass[]> {
    const url = new URL(getEndpoint("managementClasses"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (q?.trim()) {
        url.searchParams.append("q", q.trim());
    }
    if (groupKey?.trim()) {
        url.searchParams.append("group_key", groupKey.trim());
    }
    if (status?.trim()) {
        url.searchParams.append("status", status.trim());
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch management classes: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const payload = getArrayPayload(data, "classes");

    const normalizedClasses: Array<ManagementClass | null> =
        payload.map(toManagementClass);
    return normalizedClasses.filter(
        (item: ManagementClass | null): item is ManagementClass =>
            item !== null,
    );
}

export async function fetchManagementClassDetails(
    classKey: string,
): Promise<ManagementClass> {
    const url = new URL(getClassDetailsEndpoint(classKey));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch class details: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toManagementClass(
        data &&
            typeof data === "object" &&
            "class" in (data as Record<string, unknown>)
            ? (data as Record<string, unknown>).class
            : data,
    );
    if (!normalized) {
        throw new Error("Invalid class details response");
    }

    return normalized;
}

export async function fetchManagementFeedbacks(
    limit = 100,
    offset = 0,
    classKey?: string,
    begin?: string,
    end?: string,
): Promise<ClassFeedback[]> {
    const url = new URL(getEndpoint("managementFeedbacks"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (classKey?.trim()) {
        url.searchParams.append("class_key", classKey.trim());
    }
    if (begin) {
        url.searchParams.append("begin", begin);
    }
    if (end) {
        url.searchParams.append("end", end);
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        throw new Error(
            `Failed to fetch feedbacks: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "feedbacks")
        .map((item) => toWeeklyFeedback(item))
        .filter((item): item is ClassFeedback => item !== null);
}

export async function fetchManagementClassSchedules(
    appsheetKey: string,
    limit = 100,
    offset = 0,
    filters?: Omit<ManagementScheduleFilters, "classKey">,
): Promise<ManagementSchedule[]> {
    const url = new URL(getClassSchedulesEndpoint(appsheetKey));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (filters?.mentorKey?.trim()) {
        url.searchParams.append("mentor_key", filters.mentorKey.trim());
    }
    if (filters?.taKey?.trim()) {
        url.searchParams.append("ta_key", filters.taKey.trim());
    }
    if (filters?.accountKey?.trim()) {
        url.searchParams.append("account_key", filters.accountKey.trim());
    }
    if (typeof filters?.active === "boolean") {
        url.searchParams.append("active", String(filters.active));
    }
    if (filters?.type?.trim()) {
        url.searchParams.append("type", filters.type.trim());
    }
    if (filters?.day?.trim()) {
        url.searchParams.append("day", filters.day.trim());
    }
    if (filters?.dayblock?.trim()) {
        url.searchParams.append("dayblock", filters.dayblock.trim());
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch management schedules: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const payload = getArrayPayload(data, "schedules");

    const normalizedSchedules: Array<ManagementSchedule | null> =
        payload.map(toManagementSchedule);
    return normalizedSchedules.filter(
        (item: ManagementSchedule | null): item is ManagementSchedule =>
            item !== null,
    );
}

export async function fetchManagementSchedules(
    limit = 100,
    offset = 0,
    filters?: ManagementScheduleFilters,
): Promise<ManagementSchedule[]> {
    const url = new URL(getEndpoint("managementSchedules"));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));
    if (filters?.classKey?.trim()) {
        url.searchParams.append("class_key", filters.classKey.trim());
    }
    if (filters?.mentorKey?.trim()) {
        url.searchParams.append("mentor_key", filters.mentorKey.trim());
    }
    if (filters?.taKey?.trim()) {
        url.searchParams.append("ta_key", filters.taKey.trim());
    }
    if (filters?.accountKey?.trim()) {
        url.searchParams.append("account_key", filters.accountKey.trim());
    }
    if (typeof filters?.active === "boolean") {
        url.searchParams.append("active", String(filters.active));
    }
    if (filters?.type?.trim()) {
        url.searchParams.append("type", filters.type.trim());
    }
    if (filters?.day?.trim()) {
        url.searchParams.append("day", filters.day.trim());
    }
    if (filters?.dayblock?.trim()) {
        url.searchParams.append("dayblock", filters.dayblock.trim());
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch management schedules: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const payload = getArrayPayload(data, "schedules");

    const normalizedSchedules: Array<ManagementSchedule | null> =
        payload.map(toManagementSchedule);
    return normalizedSchedules.filter(
        (item: ManagementSchedule | null): item is ManagementSchedule =>
            item !== null,
    );
}

export async function fetchManagementScheduleDetails(
    scheduleKey: string,
): Promise<ManagementSchedule> {
    const response = await fetchWithRefresh(
        getScheduleDetailsEndpoint(scheduleKey),
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch schedule details: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toManagementSchedule(
        data &&
            typeof data === "object" &&
            "schedule" in (data as Record<string, unknown>)
            ? (data as Record<string, unknown>).schedule
            : data,
    );
    if (!normalized) {
        throw new Error("Invalid schedule details response");
    }

    return normalized;
}

export async function fetchManagementClassSessions(
    appsheetKey: string,
    limit = 100,
    offset = 0,
    options?: {
        timestamp?: string;
        begin?: string;
        end?: string;
        mentorKey?: string;
        taKey?: string;
        order?: "asc" | "desc";
    },
): Promise<Session[]> {
    const url = new URL(getClassSessionsEndpoint(appsheetKey));
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());
    if (options?.timestamp) {
        url.searchParams.append("timestamp", options.timestamp);
    }
    if (options?.begin) {
        url.searchParams.append("begin", options.begin);
    }
    if (options?.end) {
        url.searchParams.append("end", options.end);
    }
    if (options?.mentorKey?.trim()) {
        url.searchParams.append("mentor_key", options.mentorKey.trim());
    }
    if (options?.taKey?.trim()) {
        url.searchParams.append("ta_key", options.taKey.trim());
    }
    if (options?.order) {
        url.searchParams.append("order", options.order);
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch class sessions: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "sessions")
        .map((item) => toSession(item))
        .filter((item): item is Session => item !== null);
}

export async function fetchManagementClassRegistrations(
    appsheetKey: string,
    limit: number,
    offset: number,
): Promise<ClassRegistration[]> {
    const url = new URL(getClassRegistrationsEndpoint(appsheetKey));
    url.searchParams.append("limit", String(limit));
    url.searchParams.append("offset", String(offset));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch class registrations: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const payload = getArrayPayload(data, "registrations");

    const normalizedRegistrations: Array<ClassRegistration | null> =
        payload.map(toClassRegistration);

    return normalizedRegistrations.filter(
        (item: ClassRegistration | null): item is ClassRegistration =>
            item !== null,
    );
}

export async function fetchManagementSessionAttendances(
    sessionKey: string,
): Promise<SessionAttendance[]> {
    const url = new URL(getSessionAttendancesEndpoint(sessionKey));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch session attendances: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "attendees")
        .map((item) => toSessionAttendance(item))
        .filter((item): item is SessionAttendance => item !== null);
}

export async function fetchManagementSessionDetails(
    sessionKey: string,
): Promise<Session> {
    const url = new URL(getSessionDetailsEndpoint(sessionKey));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch session details: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toSession(data?.session ?? data, sessionKey);
    if (!normalized) {
        throw new Error("Invalid session details response");
    }
    return normalized;
}

export async function patchManagementClass(
    classKey: string,
    payload: ClassPatchRequest,
): Promise<ManagementClass> {
    const response = await fetchWithRefresh(getClassPatchEndpoint(classKey), {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(
            `Failed to patch class: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toManagementClass(data);
    if (!normalized) {
        throw new Error("Invalid class patch response");
    }
    return normalized;
}

export async function patchManagementSession(
    sessionKey: string,
    payload: SessionPatchRequest,
): Promise<Session> {
    const requestPayload: SessionPatchRequest = { ...payload };
    if (typeof requestPayload.timestamp === "string") {
        const normalizedTimestamp = toBackendTimestamp(requestPayload.timestamp);
        if (!normalizedTimestamp) {
            throw new Error("Invalid session timestamp");
        }
        requestPayload.timestamp = normalizedTimestamp;
    }

    const response = await fetchWithRefresh(
        getSessionDetailsEndpoint(sessionKey),
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestPayload),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to patch session: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toSession(data, sessionKey);
    if (!normalized) {
        throw new Error("Invalid session patch response");
    }
    return normalized;
}

export async function patchManagementSchedule(
    scheduleKey: string,
    payload: SchedulePatchRequest,
): Promise<ManagementSchedule> {
    const requestPayload: SchedulePatchRequest = { ...payload };
    if (typeof requestPayload.time_start === "string") {
        const normalizedTimeStart = toBackendTimeValue(requestPayload.time_start);
        if (!normalizedTimeStart) {
            throw new Error("Invalid schedule start time");
        }
        requestPayload.time_start = normalizedTimeStart;
    }
    if (typeof requestPayload.time_end === "string") {
        const normalizedTimeEnd = toBackendTimeValue(requestPayload.time_end);
        if (!normalizedTimeEnd) {
            throw new Error("Invalid schedule end time");
        }
        requestPayload.time_end = normalizedTimeEnd;
    }

    const response = await fetchWithRefresh(
        getSchedulePatchEndpoint(scheduleKey),
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestPayload),
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to patch schedule: ${response.status} ${errorText || response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toManagementSchedule(
        data &&
            typeof data === "object" &&
            "schedule" in (data as Record<string, unknown>)
            ? (data as Record<string, unknown>).schedule
            : data,
    );
    if (!normalized) {
        throw new Error("Invalid patched schedule response");
    }

    return normalized;
}

export async function deleteManagementSchedule(
    scheduleKey: string,
): Promise<void> {
    const response = await fetchWithRefresh(
        getScheduleDetailsEndpoint(scheduleKey),
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete schedule: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function deleteManagementSession(
    sessionKey: string,
): Promise<void> {
    const response = await fetchWithRefresh(
        getSessionDetailsEndpoint(sessionKey),
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete session: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function deleteManagementClass(classKey: string): Promise<void> {
    const response = await fetchWithRefresh(getClassDetailsEndpoint(classKey), {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to delete class: ${response.status} ${errorText || response.statusText}`,
        );
    }
}

export async function patchSessionAttendance(
    attendanceId: string,
    payload: AttendancePatchRequest,
): Promise<SessionAttendance> {
    const response = await fetchWithRefresh(
        getAttendancePatchEndpoint(attendanceId),
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to patch attendance: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toSessionAttendance(data);
    if (!normalized) {
        throw new Error("Invalid attendance patch response");
    }
    return normalized;
}

export async function patchRegistration(
    registrationId: string,
    payload: RegistrationPatchRequest,
): Promise<ClassRegistration> {
    const response = await fetchWithRefresh(
        getRegistrationPatchEndpoint(registrationId),
        {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to patch registration: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    const normalized = toClassRegistration(data);
    if (!normalized) {
        throw new Error("Invalid registration patch response");
    }
    return normalized;
}

export async function fetchRecordings(): Promise<Recording[]> {
    const url = new URL(getEndpoint("recordings"));

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch recordings: ${response.status} ${response.statusText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload<Recording>(data, "recordings");
}

export async function resetPassword(
    request: ResetPasswordRequest,
): Promise<void> {
    const formData = new URLSearchParams();
    formData.append("token", request.token);
    formData.append("username", request.username);
    formData.append("password", request.password);

    const response = await fetchWithRefresh(
        getEndpoint("resetPasswordAuthorised"),
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            credentials: "include",
            body: formData.toString(),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Password reset failed: ${response.status} ${response.statusText}`,
        );
    }
}

export interface ClassFeedback {
    id?: string;
    appsheet_key: string;
    student_name?: string | null;
    class_name?: string | null;
    mentor_feedbacks?: WeeklyFeedbackMentor[] | null;
    ta_feedbacks?: WeeklyFeedbackTa[] | null;
    request?: string | null;
    feedback_extra?: string | null;
    created_at?: string | null;
    timestamp?: string | null;
    edited_at?: string | null;
}

function toWeeklyFeedback(raw: unknown): ClassFeedback | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }

    const item = raw as Record<string, unknown>;
    const appsheetKey = item.appsheet_key;
    if (typeof appsheetKey !== "string") {
        return null;
    }

    const mentorFeedbacks = Array.isArray(item.mentor_feedbacks)
        ? item.mentor_feedbacks
              .map((entry) => toWeeklyFeedbackMentor(entry))
              .filter((entry): entry is WeeklyFeedbackMentor => entry !== null)
        : null;
    const taFeedbacks = Array.isArray(item.ta_feedbacks)
        ? item.ta_feedbacks
              .map((entry) => toWeeklyFeedbackTa(entry))
              .filter((entry): entry is WeeklyFeedbackTa => entry !== null)
        : null;

    return {
        appsheet_key: appsheetKey,
        student_name:
            typeof item.student_name === "string" ? item.student_name : null,
        class_name:
            typeof item.class_name === "string" ? item.class_name : null,
        mentor_feedbacks: mentorFeedbacks,
        ta_feedbacks: taFeedbacks,
        request: typeof item.request === "string" ? item.request : null,
        feedback_extra:
            typeof item.feedback_extra === "string"
                ? item.feedback_extra
                : null,
        created_at:
            typeof item.created_at === "string" ? item.created_at : null,
        timestamp: typeof item.timestamp === "string" ? item.timestamp : null,
        edited_at:
            typeof item.edited_at === "string" ? item.edited_at : null,
    };
}

export async function fetchManagementClassFeedbacks(
    appsheetKey: string,
    limit = 100,
    offset = 0,
    begin?: string,
    end?: string,
): Promise<ClassFeedback[]> {
    const url = new URL(getClassFeedbacksEndpoint(appsheetKey));
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());
    if (begin) {
        url.searchParams.append("begin", begin);
    }
    if (end) {
        url.searchParams.append("end", end);
    }

    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        if (response.status === 404) {
            return [];
        }
        const errorText = await response.text();
        throw new Error(
            `Failed to fetch feedbacks: ${response.status} ${errorText}`,
        );
    }

    const data = await response.json();
    return getArrayPayload(data, "feedbacks")
        .map((item) => toWeeklyFeedback(item))
        .filter((item): item is ClassFeedback => item !== null);
}

export async function fetchManagementClassFeedbackDetails(
    appsheetKey: string,
): Promise<ClassFeedback> {
    const response = await fetchWithRefresh(
        getFeedbackDetailsEndpoint(appsheetKey),
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Failed to fetch feedback details: ${response.status} ${errorText}`,
        );
    }

    const data = await response.json();
    const normalized = toWeeklyFeedback(data);
    if (!normalized) {
        console.error("Expected feedback object, got:", data);
        throw new Error("Invalid feedback details response");
    }

    return normalized;
}
