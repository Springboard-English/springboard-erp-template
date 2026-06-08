import { type SearchableSelectOption } from "@/components/ui/searchable-select";
export interface SignInViewProps {
    disableCustomTheme?: boolean;
    authNotice?: string;
    googleClientId?: string;
    accountTypeOverride?: string;
    accountTypeOptions?: SearchableSelectOption[];
    accountTypeLabel?: string;
    heroEyebrowText?: string;
    heroTitleText?: string;
    heroTitleAccentText?: string;
    formTitle?: string;
    formDescription?: string;
}
export default function SignIn(props: SignInViewProps): import("react/jsx-runtime").JSX.Element;
