export interface LoginCredentials {
    username: string;
    password: string;
    account_type?: string;
}
export interface GoogleLoginRequest {
    credential: string;
    account_type?: string;
}
export interface UserInfo {
    name: string;
    username: string;
    sub: string;
    account_type: string;
    [key: string]: unknown;
}
export interface LoginResponse extends UserInfo {
}
export interface ResetPasswordRequest {
    token: string;
    username: string;
    password: string;
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
export declare function login(credentials: LoginCredentials): Promise<LoginResponse>;
export declare function loginWithGoogle(credential: string, accountType?: string): Promise<LoginResponse>;
export declare function logout(): Promise<void>;
export declare function fetchCurrentUser(): Promise<UserInfo>;
export declare function fetchSessions(filters?: {
    timestamp?: string;
    begin?: string;
    end?: string;
    mentorKey?: string;
    taKey?: string;
    limit?: number;
    offset?: number;
    order?: "asc" | "desc";
}): Promise<Session[]>;
export declare function fetchOwnRegistrations(limit?: number, offset?: number): Promise<ClassRegistration[]>;
export declare function fetchOwnRegistrationsPage(limit?: number, offset?: number): Promise<PaginatedResult<ClassRegistration>>;
export declare function fetchOwnAssessments(): Promise<TestFeedback[]>;
export declare function fetchManagementSessions(limit?: number, offset?: number, filters?: {
    begin?: string;
    end?: string;
    groupKey?: string;
    classKey?: string;
    mentorKey?: string;
    taKey?: string;
    order?: "asc" | "desc";
}): Promise<Session[]>;
export declare function fetchInlineSessionOptions(classKey: string, limit?: number): Promise<InlineOption[]>;
export declare function fetchInlineClassOptions(groupKey: string, limit?: number): Promise<InlineOption[]>;
export declare function fetchInlineSessionClassOptions(limit?: number): Promise<InlineOption[]>;
export declare function fetchInlineGroupOptions(limit?: number): Promise<InlineOption[]>;
export declare function fetchInlineEmployeeOptions(limit?: number): Promise<InlineOption[]>;
export declare function fetchAccountOptions(limit?: number, offset?: number, q?: string, filters?: {
    classKey?: string;
    day?: string;
    dayblock?: string;
}): Promise<InlineOption[]>;
export declare function fetchDayblockOptions(limit?: number): Promise<InlineOption[]>;
export declare function createManagementSession(payload: CreateManagementSessionRequest): Promise<Session>;
export declare function createManagementClass(payload: CreateManagementClassRequest): Promise<ManagementClass>;
export declare function createManagementSchedule(payload: CreateManagementScheduleRequest): Promise<ManagementSchedule>;
export declare function fetchManagementTests(limit?: number, offset?: number, groupKey?: string): Promise<ManagementTest[]>;
export declare function fetchManagementClassTests(classKey: string, limit?: number, offset?: number): Promise<ManagementTest[]>;
export declare function fetchManagementTestDetails(testKey: string): Promise<ManagementTest>;
export declare function createManagementTest(payload: CreateManagementTestRequest): Promise<void>;
export declare function deleteManagementTest(testKey: string): Promise<void>;
export declare function fetchManagementTestSessions(testKey: string, limit?: number, offset?: number, classKey?: string): Promise<TestSessionLink[]>;
export declare function fetchManagementTestSessionsPage(testKey: string, limit?: number, offset?: number, classKey?: string, begin?: string, end?: string): Promise<PaginatedResult<TestSessionLink>>;
export declare function fetchAllManagementTestSessions(testKey: string, classKey?: string): Promise<TestSessionLink[]>;
export declare function createManagementTestSession(testKey: string, payload: CreateTestSessionRequest): Promise<TestSessionLink>;
export declare function patchManagementTestSession(testKey: string, testSessionId: string, payload: PatchTestSessionRequest): Promise<TestSessionLink>;
export declare function deleteManagementTestSession(testKey: string, testSessionId: string): Promise<void>;
export declare function fetchManagementTestSections(testKey: string): Promise<TestSection[]>;
export declare function createManagementTestSection(testKey: string, payload: CreateTestSectionRequest): Promise<TestSection>;
export declare function patchManagementTestSection(testKey: string, sectionId: string, payload: PatchTestSectionRequest): Promise<TestSection>;
export declare function deleteManagementTestSection(testKey: string, sectionId: string): Promise<void>;
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
export declare function fetchManagementTestAssessments(testKey: string, limit?: number, offset?: number, classKey?: string, begin?: string, end?: string): Promise<TestFeedback[]>;
export declare function createManagementTestAssessment(payload: CreateTestAssessmentRequest): Promise<TestFeedback>;
export declare function fetchManagementAssessmentDetails(assessmentId: string): Promise<TestFeedback>;
export declare function generateManagementAssessmentPdf(testKey: string, assessmentId: string): Promise<void>;
export declare function patchManagementAssessment(assessmentId: string, payload: PatchTestAssessmentRequest): Promise<TestFeedback>;
export declare function deleteManagementAssessment(assessmentId: string): Promise<void>;
export declare function fetchManagementAssessmentSections(assessmentId: string): Promise<AssessmentSection[]>;
export declare function createManagementAssessmentSection(assessmentId: string, payload: CreateAssessmentSectionRequest): Promise<AssessmentSection>;
export declare function patchManagementAssessmentSection(assessmentId: string, sectionId: string, payload: PatchAssessmentSectionRequest): Promise<AssessmentSection>;
export declare function deleteManagementAssessmentSection(assessmentId: string, sectionId: string): Promise<void>;
export declare function fetchManagementTestFeedbacks(testKey: string): Promise<TestFeedback[]>;
export declare function fetchInlineAvailableRegistrationOptions(classKey: string, limit?: number): Promise<InlineOption[]>;
export declare function fetchInlineSessionRegistrationOptions(sessionKey: string, limit?: number): Promise<InlineOption[]>;
export declare function fetchManagementClasses(limit?: number, offset?: number, q?: string, groupKey?: string, status?: string): Promise<ManagementClass[]>;
export declare function fetchManagementClassDetails(classKey: string): Promise<ManagementClass>;
export declare function fetchManagementFeedbacks(limit?: number, offset?: number, classKey?: string, begin?: string, end?: string): Promise<ClassFeedback[]>;
export declare function fetchManagementClassSchedules(appsheetKey: string, limit?: number, offset?: number, filters?: Omit<ManagementScheduleFilters, "classKey">): Promise<ManagementSchedule[]>;
export declare function fetchManagementSchedules(limit?: number, offset?: number, filters?: ManagementScheduleFilters): Promise<ManagementSchedule[]>;
export declare function fetchManagementScheduleDetails(scheduleKey: string): Promise<ManagementSchedule>;
export declare function fetchManagementClassSessions(appsheetKey: string, limit?: number, offset?: number, options?: {
    timestamp?: string;
    begin?: string;
    end?: string;
    mentorKey?: string;
    taKey?: string;
    order?: "asc" | "desc";
}): Promise<Session[]>;
export declare function fetchManagementClassRegistrations(appsheetKey: string, limit: number, offset: number): Promise<ClassRegistration[]>;
export declare function fetchManagementSessionAttendances(sessionKey: string): Promise<SessionAttendance[]>;
export declare function fetchManagementSessionDetails(sessionKey: string): Promise<Session>;
export declare function patchManagementClass(classKey: string, payload: ClassPatchRequest): Promise<ManagementClass>;
export declare function patchManagementSession(sessionKey: string, payload: SessionPatchRequest): Promise<Session>;
export declare function patchManagementSchedule(scheduleKey: string, payload: SchedulePatchRequest): Promise<ManagementSchedule>;
export declare function deleteManagementSchedule(scheduleKey: string): Promise<void>;
export declare function deleteManagementSession(sessionKey: string): Promise<void>;
export declare function deleteManagementClass(classKey: string): Promise<void>;
export declare function patchSessionAttendance(attendanceId: string, payload: AttendancePatchRequest): Promise<SessionAttendance>;
export declare function patchRegistration(registrationId: string, payload: RegistrationPatchRequest): Promise<ClassRegistration>;
export declare function fetchRecordings(): Promise<Recording[]>;
export declare function resetPassword(request: ResetPasswordRequest): Promise<void>;
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
export declare function fetchManagementClassFeedbacks(appsheetKey: string, limit?: number, offset?: number, begin?: string, end?: string): Promise<ClassFeedback[]>;
export declare function fetchManagementClassFeedbackDetails(appsheetKey: string): Promise<ClassFeedback>;
