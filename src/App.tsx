import * as React from "react";
import SignIn from "@/views/SignIn";
import ResetPassword from "@/views/ResetPassword";

export type AuthViewMode = "sign-in" | "reset-password";

export interface AppProps {
  disableCustomTheme?: boolean;
  initialView?: AuthViewMode;
  authNotice?: string;
}

export default function App(props: AppProps) {
  const [view, setView] = React.useState<AuthViewMode>(
    props.initialView ?? "sign-in",
  );
  const [authNotice, setAuthNotice] = React.useState<string>(
    props.authNotice ?? "",
  );

  if (view === "reset-password") {
    return (
      <ResetPassword
        disableCustomTheme={props.disableCustomTheme}
        onNavigateToSignIn={(nextAuthNotice) => {
          setAuthNotice(nextAuthNotice ?? "");
          setView("sign-in");
        }}
      />
    );
  }

  return (
    <SignIn
      disableCustomTheme={props.disableCustomTheme}
      authNotice={authNotice}
    />
  );
}
