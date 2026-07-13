/// <reference types="vite/client" />

let _baseURL: string = (() => {
    if (typeof import.meta !== "undefined" && import.meta.env) {
        if (import.meta.env.VITE_BASE_URL) {
            return import.meta.env.VITE_BASE_URL;
        }
        if (import.meta.env.DEV) {
            return "https://api.springboard.vn/dev";
        }
    }
    return "https://api.springboard.vn";
})();

export function configureApi(options: { baseUrl: string }): void {
    _baseURL = options.baseUrl;
}

export const API_CONFIG = {
    get baseURL() {
        return _baseURL;
    },
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
        ownNotifications: "/users/me/notifications",
        recordings: "/users/me/recordings",
    },
} as const;

const UNVERSIONED_ENDPOINTS: ReadonlySet<keyof typeof API_CONFIG.endpoints> = new Set([
    "login",
    "authenticateGoogle",
    "refresh",
    "logout",
    "resetPassword",
    "resetPasswordAuthorised",
]);

function v2(path: string): string {
    return `${API_CONFIG.baseURL}/v2${path}`;
}

export function getEndpoint(
    endpoint: keyof typeof API_CONFIG.endpoints,
): string {
    const path = API_CONFIG.endpoints[endpoint];
    if (UNVERSIONED_ENDPOINTS.has(endpoint)) {
        return `${API_CONFIG.baseURL}${path}`;
    }
    return `${API_CONFIG.baseURL}/v2${path}`;
}

export function getInlineEndpoint(
    endpoint: keyof typeof API_CONFIG.endpoints,
): string {
    return `${getEndpoint(endpoint)}/inline`;
}

export function getClassSchedulesEndpoint(appsheetKey: string): string {
    return v2(`/classes/${encodeURIComponent(appsheetKey)}/schedules`);
}

export function getScheduleDetailsEndpoint(scheduleKey: string): string {
    return v2(`/schedules/${encodeURIComponent(scheduleKey)}`);
}

export function getSchedulePatchEndpoint(scheduleKey: string): string {
    return getScheduleDetailsEndpoint(scheduleKey);
}

export function getClassDetailsEndpoint(classKey: string): string {
    return v2(`/classes/${encodeURIComponent(classKey)}`);
}

export function getClassPatchEndpoint(classKey: string): string {
    return getClassDetailsEndpoint(classKey);
}

export function getClassSessionsEndpoint(appsheetKey: string): string {
    return v2(`/classes/${encodeURIComponent(appsheetKey)}/sessions`);
}

export function getClassFeedbacksEndpoint(appsheetKey: string): string {
    return v2(`/classes/${encodeURIComponent(appsheetKey)}/feedbacks`);
}

export function getClassTestsEndpoint(appsheetKey: string): string {
    return v2(`/classes/${encodeURIComponent(appsheetKey)}/tests`);
}

export function getTestDetailsEndpoint(testKey: string): string {
    return v2(`/tests/${encodeURIComponent(testKey)}`);
}

export function getTestAssessmentsEndpoint(testKey: string): string {
    return v2(`/tests/${encodeURIComponent(testKey)}/assessments`);
}

export function getTestAssessmentPdfEndpoint(
    testKey: string,
    assessmentId: string,
): string {
    return v2(`/tests/${encodeURIComponent(testKey)}/assessments/${encodeURIComponent(assessmentId)}/pdf`);
}

export function getTestSessionsEndpoint(testKey: string): string {
    return v2(`/tests/${encodeURIComponent(testKey)}/sessions`);
}

export function getTestSessionDetailsEndpoint(
    testKey: string,
    testSessionId: string,
): string {
    return v2(`/tests/${encodeURIComponent(testKey)}/sessions/${encodeURIComponent(testSessionId)}`);
}

export function getTestSectionsEndpoint(testKey: string): string {
    return v2(`/tests/${encodeURIComponent(testKey)}/sections`);
}

export function getTestSectionDetailsEndpoint(
    testKey: string,
    sectionId: string,
): string {
    return v2(`/tests/${encodeURIComponent(testKey)}/sections/${encodeURIComponent(sectionId)}`);
}

export function getAssessmentsEndpoint(): string {
    return v2(`/assessments`);
}

export function getAssessmentDetailsEndpoint(assessmentId: string): string {
    return v2(`/assessments/${encodeURIComponent(assessmentId)}`);
}

export function getAssessmentSectionsEndpoint(assessmentId: string): string {
    return v2(`/assessments/${encodeURIComponent(assessmentId)}/sections`);
}

export function getAssessmentSectionDetailsEndpoint(
    assessmentId: string,
    sectionId: string,
): string {
    return v2(`/assessments/${encodeURIComponent(assessmentId)}/sections/${encodeURIComponent(sectionId)}`);
}

export function getFeedbackDetailsEndpoint(appsheetKey: string): string {
    return v2(`/feedbacks/${encodeURIComponent(appsheetKey)}`);
}

export function getClassRegistrationsEndpoint(appsheetKey: string): string {
    return v2(`/classes/${encodeURIComponent(appsheetKey)}/registrations`);
}

export function getSessionAttendancesEndpoint(sessionKey: string): string {
    return v2(`/sessions/${encodeURIComponent(sessionKey)}/attendances`);
}

export function getAttendancePatchEndpoint(attendanceId: string): string {
    return v2(`/attendances/${encodeURIComponent(attendanceId)}`);
}

export function getSessionDetailsEndpoint(sessionKey: string): string {
    return v2(`/sessions/${encodeURIComponent(sessionKey)}`);
}

export function getRegistrationPatchEndpoint(registrationId: string): string {
    return v2(`/registrations/${encodeURIComponent(registrationId)}`);
}

export function getNotificationEndpoint(notificationKey: string): string {
    return v2(`/notifications/${encodeURIComponent(notificationKey)}`);
}

export function getSessionActionEndpoint(
    sessionKey: string,
    action: "join" | "start",
): string {
    return v2(`/sessions/${encodeURIComponent(sessionKey)}/${action}`);
}
