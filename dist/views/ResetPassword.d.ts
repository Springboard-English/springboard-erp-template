export interface ResetPasswordViewProps {
    disableCustomTheme?: boolean;
    onNavigateToSignIn?: (authNotice?: string) => void;
    signInPath?: string;
}
export default function ResetPassword(props: ResetPasswordViewProps): import("react/jsx-runtime").JSX.Element;
