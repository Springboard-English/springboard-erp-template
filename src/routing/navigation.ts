export type PermissionLevel = 'management' | 'normal_user';

type AppTab = 'dashboard' | 'classes' | 'sessions' | 'schedules' | 'tests' | 'feedbacks' | 'recordings';
export type ManagementDetailRouteType = 'classes' | 'sessions' | 'schedules' | 'tests' | 'feedbacks';
export type ManagementClassSection =
  | 'details'
  | 'schedules'
  | 'sessions'
  | 'tests'
  | 'registrations'
  | 'feedbacks';
export type ManagementSessionSection = 'details' | 'attendances';
export type ManagementFeedbackSection = 'details' | 'mentors' | 'tas';
export type ManagementTestSection = 'details' | 'sections' | 'sessions' | 'assessments';
export type ManagementAssessmentSection = 'details' | 'parts';

export const PERMISSION_LEVEL_STORAGE_KEY = 'ui.permissionLevel';

export const SIGN_IN_ROUTE = '/sign-in';
export const RESET_PASSWORD_ROUTE = '/reset_password';
export const DASHBOARD_ROUTE = '/dashboard';
export const SESSIONS_ROUTE = '/sessions';
export const RECORDINGS_ROUTE = '/recordings';
export const MANAGEMENT_CLASSES_ROUTE = '/management/classes';
export const MANAGEMENT_SESSIONS_ROUTE = '/management/sessions';
export const MANAGEMENT_SCHEDULES_ROUTE = '/management/schedules';
export const MANAGEMENT_TESTS_ROUTE = '/management/tests';
export const MANAGEMENT_FEEDBACKS_ROUTE = '/management/feedbacks';

const MANAGEMENT_TAB_ROUTES: Record<'classes' | 'sessions' | 'schedules' | 'tests' | 'feedbacks', string> = {
  classes: MANAGEMENT_CLASSES_ROUTE,
  sessions: MANAGEMENT_SESSIONS_ROUTE,
  schedules: MANAGEMENT_SCHEDULES_ROUTE,
  tests: MANAGEMENT_TESTS_ROUTE,
  feedbacks: MANAGEMENT_FEEDBACKS_ROUTE,
};

const MANAGEMENT_CLASS_SECTIONS = new Set<ManagementClassSection>([
  'details',
  'schedules',
  'sessions',
  'tests',
  'registrations',
  'feedbacks',
]);
const MANAGEMENT_SESSION_SECTIONS = new Set<ManagementSessionSection>([
  'details',
  'attendances',
]);
const MANAGEMENT_FEEDBACK_SECTIONS = new Set<ManagementFeedbackSection>([
  'details',
  'mentors',
  'tas',
]);
const MANAGEMENT_TEST_SECTIONS = new Set<ManagementTestSection>([
  'details',
  'sections',
  'sessions',
  'assessments',
]);
const MANAGEMENT_ASSESSMENT_SECTIONS = new Set<ManagementAssessmentSection>([
  'details',
  'parts',
]);

export function getManagementDetailRoute(type: ManagementDetailRouteType, id: string): string {
  return `${MANAGEMENT_TAB_ROUTES[type]}/${encodeURIComponent(id)}`;
}

export function isManagementClassSection(value: string): value is ManagementClassSection {
  return MANAGEMENT_CLASS_SECTIONS.has(value as ManagementClassSection);
}

export function isManagementSessionSection(value: string): value is ManagementSessionSection {
  return MANAGEMENT_SESSION_SECTIONS.has(value as ManagementSessionSection);
}

export function isManagementFeedbackSection(value: string): value is ManagementFeedbackSection {
  return MANAGEMENT_FEEDBACK_SECTIONS.has(value as ManagementFeedbackSection);
}

export function isManagementTestSection(value: string): value is ManagementTestSection {
  return MANAGEMENT_TEST_SECTIONS.has(value as ManagementTestSection);
}

export function isManagementAssessmentSection(value: string): value is ManagementAssessmentSection {
  return MANAGEMENT_ASSESSMENT_SECTIONS.has(value as ManagementAssessmentSection);
}

export function getManagementClassRoute(
  classKey: string,
  section: ManagementClassSection = 'details',
): string {
  const baseRoute = getManagementDetailRoute('classes', classKey);
  return section === 'details' ? baseRoute : `${baseRoute}/${section}`;
}

export function getManagementClassChildDetailRoute(
  classKey: string,
  type: Exclude<ManagementDetailRouteType, 'classes'>,
  id: string,
): string {
  return `${getManagementClassRoute(classKey, type)}/${encodeURIComponent(id)}`;
}

export function getManagementSessionRoute(
  sessionKey: string,
  options?: {
    classKey?: string | null;
    section?: ManagementSessionSection;
  },
): string {
  const baseRoute = options?.classKey?.trim()
    ? getManagementClassChildDetailRoute(options.classKey, 'sessions', sessionKey)
    : getManagementDetailRoute('sessions', sessionKey);
  const section = options?.section ?? 'details';
  return section === 'details' ? baseRoute : `${baseRoute}/${section}`;
}

export function getManagementFeedbackRoute(
  feedbackKey: string,
  options?: {
    classKey?: string | null;
    section?: ManagementFeedbackSection;
  },
): string {
  const baseRoute = options?.classKey?.trim()
    ? getManagementClassChildDetailRoute(options.classKey, 'feedbacks', feedbackKey)
    : getManagementDetailRoute('feedbacks', feedbackKey);
  const section = options?.section ?? 'details';
  return section === 'details' ? baseRoute : `${baseRoute}/${section}`;
}

export function getManagementTestRoute(
  testKey: string,
  options?: {
    classKey?: string | null;
    section?: ManagementTestSection;
    assessmentId?: string | null;
    assessmentSection?: ManagementAssessmentSection;
  },
): string {
  const baseRoute = options?.classKey?.trim()
    ? getManagementClassChildDetailRoute(options.classKey, 'tests', testKey)
    : getManagementDetailRoute('tests', testKey);
  const section = options?.section ?? 'details';

  if (section !== 'assessments') {
    return section === 'details' ? baseRoute : `${baseRoute}/${section}`;
  }

  const assessmentsRoute = `${baseRoute}/assessments`;
  if (!options?.assessmentId?.trim()) {
    return assessmentsRoute;
  }

  const assessmentRoute = `${assessmentsRoute}/${encodeURIComponent(options.assessmentId)}`;
  const assessmentSection = options.assessmentSection ?? 'details';
  return assessmentSection === 'details'
    ? assessmentRoute
    : `${assessmentRoute}/${assessmentSection}`;
}

function normalizePathname(pathname: string): string {
  if (!pathname) {
    return '/';
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function normalizeRoutePath(pathname: string): string {
  return normalizePathname(pathname);
}

export function getManagementClassContextFromPath(pathname: string): {
  classKey: string;
  section: ManagementClassSection;
} | null {
  const normalizedPathname = normalizePathname(pathname);
  const match = normalizedPathname.match(/^\/management\/classes\/([^/]+)(?:\/([^/]+))?$/);

  if (!match) {
    return null;
  }

  const [, encodedClassKey, rawSection] = match;
  const section = rawSection && isManagementClassSection(rawSection)
    ? rawSection
    : 'details';

  return {
    classKey: decodeURIComponent(encodedClassKey),
    section,
  };
}

function isManagementTab(tab: string): tab is keyof typeof MANAGEMENT_TAB_ROUTES {
  return tab === 'classes'
    || tab === 'sessions'
    || tab === 'schedules'
    || tab === 'tests'
    || tab === 'feedbacks';
}

export function getInitialPermissionLevel(): PermissionLevel {
  const storedLevel = localStorage.getItem(PERMISSION_LEVEL_STORAGE_KEY);
  return storedLevel === 'management' || storedLevel === 'normal_user'
    ? storedLevel
    : 'normal_user';
}

export function getActiveTabFromPath(pathname: string): AppTab {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === DASHBOARD_ROUTE) {
    return 'dashboard';
  }

  if (normalizedPathname === RECORDINGS_ROUTE) {
    return 'recordings';
  }

  if (normalizedPathname.startsWith(MANAGEMENT_CLASSES_ROUTE)) {
    return 'classes';
  }

  if (normalizedPathname.startsWith(MANAGEMENT_SCHEDULES_ROUTE)) {
    return 'schedules';
  }

  if (normalizedPathname.startsWith(MANAGEMENT_FEEDBACKS_ROUTE)) {
    return 'feedbacks';
  }

  if (normalizedPathname.startsWith(MANAGEMENT_TESTS_ROUTE)) {
    return 'tests';
  }

  return 'sessions';
}

export function isManagementPath(pathname: string): boolean {
  return normalizePathname(pathname).startsWith('/management');
}

export function isKnownProtectedPath(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname);

  return normalizedPathname === SESSIONS_ROUTE
    || normalizedPathname === DASHBOARD_ROUTE
    || normalizedPathname === RECORDINGS_ROUTE
    || normalizedPathname.startsWith(MANAGEMENT_CLASSES_ROUTE)
    || normalizedPathname.startsWith(MANAGEMENT_SESSIONS_ROUTE)
    || normalizedPathname.startsWith(MANAGEMENT_SCHEDULES_ROUTE)
    || normalizedPathname.startsWith(MANAGEMENT_TESTS_ROUTE)
    || normalizedPathname.startsWith(MANAGEMENT_FEEDBACKS_ROUTE);
}

function sanitizeTab(
  tab: string | null | undefined,
  permissionLevel: PermissionLevel,
  accountType?: string,
): AppTab {
  const normalizedTab = tab ?? '';

  if (permissionLevel === 'management') {
    return isManagementTab(normalizedTab) ? normalizedTab : 'classes';
  }

  if (normalizedTab === 'dashboard') {
    return 'dashboard';
  }

  if (normalizedTab === 'recordings' && accountType === 'student') {
    return 'recordings';
  }

  if (normalizedTab === 'sessions') {
    return 'sessions';
  }

  return 'dashboard';
}

export function getPathForTab(
  tab: string,
  permissionLevel: PermissionLevel,
  accountType?: string,
): string {
  const sanitizedTab = sanitizeTab(tab, permissionLevel, accountType);

  if (permissionLevel === 'management') {
    return MANAGEMENT_TAB_ROUTES[sanitizedTab as keyof typeof MANAGEMENT_TAB_ROUTES]
      ?? MANAGEMENT_CLASSES_ROUTE;
  }

  if (sanitizedTab === 'recordings' && accountType === 'student') {
    return RECORDINGS_ROUTE;
  }

  if (sanitizedTab === 'dashboard') {
    return DASHBOARD_ROUTE;
  }

  return SESSIONS_ROUTE;
}

export function getDefaultAuthenticatedPath(
  permissionLevel: PermissionLevel,
  accountType?: string,
  fallbackTab?: string | null,
): string {
  return getPathForTab(
    fallbackTab ?? (permissionLevel === 'management' ? 'classes' : 'dashboard'),
    permissionLevel,
    accountType,
  );
}

export function getPathForPermissionLevel(
  _pathname: string,
  nextPermissionLevel: PermissionLevel,
  _accountType?: string,
): string {
  if (nextPermissionLevel === 'management') {
    return MANAGEMENT_CLASSES_ROUTE;
  }

  return DASHBOARD_ROUTE;
}

export function isPathAllowed(
  pathname: string,
  permissionLevel: PermissionLevel,
  accountType?: string,
): boolean {
  const normalizedPathname = normalizePathname(pathname);

  if (!isKnownProtectedPath(normalizedPathname)) {
    return false;
  }

  if (normalizedPathname === RECORDINGS_ROUTE) {
    return accountType === 'student';
  }

  if (isManagementPath(normalizedPathname)) {
    return permissionLevel === 'management';
  }

  return true;
}

export function getPostSignInPath(
  fromPathname: string | null | undefined,
  permissionLevel: PermissionLevel,
  accountType?: string,
): string {
  if (fromPathname && isPathAllowed(fromPathname, permissionLevel, accountType)) {
    return normalizePathname(fromPathname);
  }

  return getDefaultAuthenticatedPath(permissionLevel, accountType);
}
