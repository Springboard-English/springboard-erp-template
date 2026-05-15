/// <reference types="vite/client" />

// API Configuration based on environment
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL =
    import.meta.env.VITE_BASE_URL ||
    (isDevelopment
        ? "https://api.springboard.vn/dev"
        : "https://api.springboard.vn");

export const API_CONFIG = {
    baseURL: API_BASE_URL,
    endpoints: {
        login: "/login/password",
        authenticateGoogle: "/authenticate/google",
        currentUser: "/users/me",
        refresh: "/refresh",
        logout: "/logout",
        resetPassword: "/reset/password",
        resetPasswordAuthorised: "/authenticate/reset",
        sessions: "/users/me/sessions",
        managementSessions: "/sessions",
        managementTests: "/tests",
        managementClasses: "/classes",
        managementGroups: "/groups",
        managementUsers: "/users",
        managementAccounts: "/accounts",
        managementDayblocks: "/dayblocks",
        managementSchedules: "/schedules",
        managementFeedbacks: "/feedbacks",
        managementRegistrations: "/registrations",
        ownRegistrations: "/users/me/registrations",
        ownAssessments: "/users/me/assessments",
        recordings: "/users/me/recordings",
    },
} as const;

export function getEndpoint(
    endpoint: keyof typeof API_CONFIG.endpoints,
): string {
    return `${API_CONFIG.baseURL}${API_CONFIG.endpoints[endpoint]}`;
}

export function getInlineEndpoint(
    endpoint: keyof typeof API_CONFIG.endpoints,
): string {
    return `${getEndpoint(endpoint)}/inline`;
}

export function getClassSchedulesEndpoint(appsheetKey: string): string {
    return `${API_CONFIG.baseURL}/classes/${encodeURIComponent(appsheetKey)}/schedules`;
}

export function getScheduleDetailsEndpoint(scheduleKey: string): string {
    return `${API_CONFIG.baseURL}/schedules/${encodeURIComponent(scheduleKey)}`;
}

export function getSchedulePatchEndpoint(scheduleKey: string): string {
    return getScheduleDetailsEndpoint(scheduleKey);
}

export function getClassDetailsEndpoint(classKey: string): string {
    return `${API_CONFIG.baseURL}/classes/${encodeURIComponent(classKey)}`;
}

export function getClassPatchEndpoint(classKey: string): string {
    return getClassDetailsEndpoint(classKey);
}

export function getClassSessionsEndpoint(appsheetKey: string): string {
    return `${API_CONFIG.baseURL}/classes/${encodeURIComponent(appsheetKey)}/sessions`;
}

export function getClassFeedbacksEndpoint(appsheetKey: string): string {
    return `${API_CONFIG.baseURL}/classes/${encodeURIComponent(appsheetKey)}/feedbacks`;
}

export function getClassTestsEndpoint(appsheetKey: string): string {
    return `${API_CONFIG.baseURL}/classes/${encodeURIComponent(appsheetKey)}/tests`;
}

export function getTestDetailsEndpoint(testKey: string): string {
    return `${API_CONFIG.baseURL}/tests/${encodeURIComponent(testKey)}`;
}

export function getTestAssessmentsEndpoint(testKey: string): string {
    return `${API_CONFIG.baseURL}/tests/${encodeURIComponent(testKey)}/assessments`;
}

export function getTestAssessmentPdfEndpoint(
    testKey: string,
    assessmentId: string,
): string {
    return `${API_CONFIG.baseURL}/tests/${encodeURIComponent(testKey)}/assessments/${encodeURIComponent(assessmentId)}/pdf`;
}

export function getTestSessionsEndpoint(testKey: string): string {
    return `${API_CONFIG.baseURL}/tests/${encodeURIComponent(testKey)}/sessions`;
}

export function getTestSessionDetailsEndpoint(
    testKey: string,
    testSessionId: string,
): string {
    return `${API_CONFIG.baseURL}/tests/${encodeURIComponent(testKey)}/sessions/${encodeURIComponent(testSessionId)}`;
}

export function getTestSectionsEndpoint(testKey: string): string {
    return `${API_CONFIG.baseURL}/tests/${encodeURIComponent(testKey)}/sections`;
}

export function getTestSectionDetailsEndpoint(
    testKey: string,
    sectionId: string,
): string {
    return `${API_CONFIG.baseURL}/tests/${encodeURIComponent(testKey)}/sections/${encodeURIComponent(sectionId)}`;
}

export function getAssessmentsEndpoint(): string {
    return `${API_CONFIG.baseURL}/assessments`;
}

export function getAssessmentDetailsEndpoint(assessmentId: string): string {
    return `${API_CONFIG.baseURL}/assessments/${encodeURIComponent(assessmentId)}`;
}

export function getAssessmentSectionsEndpoint(assessmentId: string): string {
    return `${API_CONFIG.baseURL}/assessments/${encodeURIComponent(assessmentId)}/sections`;
}

export function getAssessmentSectionDetailsEndpoint(
    assessmentId: string,
    sectionId: string,
): string {
    return `${API_CONFIG.baseURL}/assessments/${encodeURIComponent(assessmentId)}/sections/${encodeURIComponent(sectionId)}`;
}

export function getFeedbackDetailsEndpoint(appsheetKey: string): string {
    return `${API_CONFIG.baseURL}/feedbacks/${encodeURIComponent(appsheetKey)}`;
}

export function getClassRegistrationsEndpoint(appsheetKey: string): string {
    return `${API_CONFIG.baseURL}/classes/${encodeURIComponent(appsheetKey)}/registrations`;
}

export function getSessionAttendancesEndpoint(sessionKey: string): string {
    return `${API_CONFIG.baseURL}/sessions/${encodeURIComponent(sessionKey)}/attendances`;
}

export function getAttendancePatchEndpoint(attendanceId: string): string {
    return `${API_CONFIG.baseURL}/attendances/${encodeURIComponent(attendanceId)}`;
}

export function getSessionDetailsEndpoint(sessionKey: string): string {
    return `${API_CONFIG.baseURL}/sessions/${encodeURIComponent(sessionKey)}`;
}

export function getRegistrationPatchEndpoint(registrationId: string): string {
    return `${API_CONFIG.baseURL}/registrations/${encodeURIComponent(registrationId)}`;
}

export function getSessionActionEndpoint(
    sessionKey: string,
    action: "join" | "start",
): string {
    return `${API_CONFIG.baseURL}/sessions/${encodeURIComponent(sessionKey)}/${action}`;
}
