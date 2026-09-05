/**
 * Auth, and only auth.
 *
 * This file used to be 3,426 lines: the whole LMS/HRM resource surface —
 * classes, sessions, schedules, assessments, feedbacks, achievements — sitting
 * in a UI package that exported none of it. `exports.ts` never listed it, so no
 * consumer could import it, and lms and erp-hrm kept their own 5,618- and
 * 3,682-line copies with roughly 2,600 lines byte-identical to what was here.
 *
 * A shared component library has no business owning an app's resource calls:
 * the endpoints, their shapes and their pagination belong to the app that
 * serves them. What DOES belong here is the credential exchange the package's
 * own SignIn, ResetPassword and AuthContext perform — sign in, sign out, and
 * read back who is signed in. That is what is left.
 *
 * If you are about to add a resource call here, add it to the app instead.
 */
export interface LoginCredentials {
    username: string;
    password: string;
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
export declare function login(credentials: LoginCredentials): Promise<LoginResponse>;
export declare function loginWithGoogle(credential: string, accountType?: string): Promise<LoginResponse>;
export declare function logout(): Promise<void>;
export declare function fetchCurrentUser(): Promise<UserInfo>;
export declare function resetPassword(request: ResetPasswordRequest): Promise<void>;
