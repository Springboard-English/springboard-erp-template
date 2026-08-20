import * as React from "react";
import { type SearchableSelectOption } from "@/components/ui/searchable-select";
export interface SignInViewProps {
    disableCustomTheme?: boolean;
    authNotice?: string;
    googleClientId?: string;
    headerChildren?: React.ReactNode;
    accountTypeOverride?: string;
    accountTypeOptions?: SearchableSelectOption[];
    accountTypeLabel?: string;
    heroEyebrowText?: string;
    heroTitleText?: string;
    heroTitleAccentText?: string;
    formTitle?: string;
    formDescription?: string;
    /**
     * Slots for content only the consuming app can supply.
     *
     * Every other customisation here is a **string**, which is enough to rename
     * things and no help at all when an app needs a second way in. Leap has one:
     * a public self-paced test is taken without an account, so a visitor bounced
     * here from such a link needs a "continue as guest" path that this package
     * cannot own — it needs that app's join code, its API route and its routing.
     * A slot keeps the knowledge where it belongs instead of teaching a package
     * shared by five apps about a concept that exists in one.
     *
     * - `children` sits **below the form**, after the Google button, which is
     *   where an alternative sign-in belongs: past the primary path, before the
     *   footer.
     * - `heroChildren` replaces the left panel's copy, whose three text props
     *   cannot express anything but a headline.
     * - `footerChildren` replaces the default guide link.
     *
     * All optional; omitting them leaves the screen exactly as it was.
     */
    children?: React.ReactNode;
    heroChildren?: React.ReactNode;
    footerChildren?: React.ReactNode;
}
export default function SignIn(props: SignInViewProps): import("react/jsx-runtime").JSX.Element;
