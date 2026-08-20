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
     * - `heroChildren` replaces the left panel's copy, whose three text props
     *   cannot express anything but a headline. Passing it also makes that panel
     *   **visible at every breakpoint** — it is desktop-only as decoration, and
     *   anything a visitor has to use must survive a phone.
     * - `children` sits below the form, after the Google button.
     * - `footerChildren` replaces the default guide link.
     *
     * All optional; omitting them leaves the screen exactly as it was.
     */
    children?: React.ReactNode;
    heroChildren?: React.ReactNode;
    footerChildren?: React.ReactNode;
}
export default function SignIn(props: SignInViewProps): import("react/jsx-runtime").JSX.Element;
