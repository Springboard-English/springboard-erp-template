import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ForgotPassword from "@/components/ForgotPassword";
import StatusBanner from "@/components/StatusBanner";
import AppTheme from "@/theme/AppTheme";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { SitemarkIcon } from "@/components/CustomIcons";
import { useAuth } from "@/context/AuthContext";
import { loginWithGoogle } from "@/api_calls/UserData";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";

const DEFAULT_ACCOUNT_TYPE_OPTIONS: SearchableSelectOption[] = [
  { value: "employee", label: "Employee" },
  { value: "student", label: "Student" },
];

export interface SignInViewProps {
  disableCustomTheme?: boolean;
  authNotice?: string;
  googleClientId?: string;
  accountTypeOverride?: string;
  accountTypeOptions?: SearchableSelectOption[];
  accountTypeLabel?: string;
}

export default function SignIn(props: SignInViewProps) {
  const { login, setAuthenticatedUser } = useAuth();
  const accountTypeOptions = React.useMemo(
    () => (props.accountTypeOptions && props.accountTypeOptions.length > 0
      ? props.accountTypeOptions
      : DEFAULT_ACCOUNT_TYPE_OPTIONS),
    [props.accountTypeOptions],
  );
  const resolvedAccountTypeOverride = props.accountTypeOverride?.trim() || "";
  const shouldShowAccountTypeSelector = !resolvedAccountTypeOverride;
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [accountType, setAccountType] = React.useState(
    resolvedAccountTypeOverride || accountTypeOptions[0]?.value || "",
  );
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [accountTypeErrorMessage, setAccountTypeErrorMessage] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);

  // Initialize Google Sign-In on mount
  React.useEffect(() => {
    if (!props.authNotice) {
      return;
    }

    setLoginSuccessMessage(props.authNotice);
  }, [props.authNotice]);

  React.useEffect(() => {
    setAccountType(resolvedAccountTypeOverride || accountTypeOptions[0]?.value || "");
    setAccountTypeErrorMessage("");
  }, [accountTypeOptions, resolvedAccountTypeOverride]);

  React.useEffect(() => {
    const clientId = props.googleClientId || (typeof import.meta !== "undefined" ? import.meta.env?.VITE_GOOGLE_CLIENT_ID : undefined) || "";
    if (!clientId) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSuccess,
          use_fedcm_for_prompt: true,
          auto_select: false,
          context: 'signin',
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          {
            theme: "outline",
            size: "large",
            text: "continue_with",
          },
        );
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("Google prompt status:", notification.getNotDisplayedReason());
          }
        });
      }
    };
  }, [props.googleClientId]);

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsForgotPasswordOpen(true);
  };

  const handleClose = () => {
    setIsForgotPasswordOpen(false);
  };

  const getSelectedAccountType = () => resolvedAccountTypeOverride || accountType;

  const handleGoogleSuccess = async (response: any) => {
    if (!validateInputs({ includeCredentials: false })) {
      return;
    }

    setIsSubmitting(true);
    setLoginError("");
    setLoginSuccessMessage("");

    try {
      const userInfo = await loginWithGoogle(response.credential, getSelectedAccountType());
      setAuthenticatedUser(userInfo);
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Google sign-in failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);
    setLoginError("");

    try {
      await login({
        username: username.trim(),
        password,
        account_type: getSelectedAccountType(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("401") || message.includes("400")) {
        setLoginError("Invalid username or password.");
        return;
      }

      setLoginError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateInputs = ({ includeCredentials = true }: { includeCredentials?: boolean } = {}) => {
    let isValid = true;

    if (shouldShowAccountTypeSelector && !accountType) {
      setAccountTypeErrorMessage("Please select an account type.");
      isValid = false;
    } else {
      setAccountTypeErrorMessage("");
    }

    if (includeCredentials) {
      if (!username.trim()) {
        setUsernameErrorMessage("Please enter your username.");
        isValid = false;
      } else {
        setUsernameErrorMessage("");
      }

      if (!password) {
        setPasswordErrorMessage("Password is required.");
        isValid = false;
      } else {
        setPasswordErrorMessage("");
      }
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <div className="relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),transparent_32%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.2),transparent_28%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" />
        <div className="pointer-events-none absolute inset-x-0 top-[-10rem] -z-10 mx-auto h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10" />
        <ColorModeSelect className="fixed right-4 top-4 z-20 sm:right-6 sm:top-6" />

        <div className="mx-auto flex w-full max-w-md flex-1 items-center">
          <Card className="w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur">
            <CardHeader className="gap-5 px-6 pt-6 sm:px-8 sm:pt-8">
              <div className="flex justify-center sm:justify-start">
                <SitemarkIcon />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl tracking-tight">Sign in</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
              <form
                className="space-y-4"
                onSubmit={handleSubmit}
                noValidate
              >
                {loginError && (
                  <StatusBanner variant="error">{loginError}</StatusBanner>
                )}
                {loginSuccessMessage && (
                  <StatusBanner variant="success">{loginSuccessMessage}</StatusBanner>
                )}

                {shouldShowAccountTypeSelector && (
                  <div className="space-y-2">
                    <Label htmlFor="account-type">
                      <span className="inline-flex items-center gap-1">
                        <span>{props.accountTypeLabel || "Account type"}</span>
                        <span className="text-destructive" aria-hidden="true">*</span>
                      </span>
                    </Label>
                    <SearchableSelect
                      id="account-type"
                      value={accountType}
                      options={accountTypeOptions}
                      placeholder="Select account type"
                      disabled={isSubmitting}
                      onValueChange={(value) => {
                        setAccountType(value);
                        if (accountTypeErrorMessage) {
                          setAccountTypeErrorMessage("");
                        }
                      }}
                    />
                    {accountTypeErrorMessage && (
                      <p className="text-sm text-destructive">{accountTypeErrorMessage}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">
                    <span className="inline-flex items-center gap-1">
                      <span>Username</span>
                      <span className="text-destructive" aria-hidden="true">*</span>
                    </span>
                  </Label>
                  <Input
                    aria-invalid={Boolean(usernameErrorMessage)}
                    id="username"
                    type="text"
                    name="username"
                    placeholder="username"
                    autoComplete="username"
                    autoFocus
                    required
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      if (usernameErrorMessage) {
                        setUsernameErrorMessage("");
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  {usernameErrorMessage && (
                    <p className="text-sm text-destructive">{usernameErrorMessage}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    <span className="inline-flex items-center gap-1">
                      <span>Password</span>
                      <span className="text-destructive" aria-hidden="true">*</span>
                    </span>
                  </Label>
                  <Input
                    aria-invalid={Boolean(passwordErrorMessage)}
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (passwordErrorMessage) {
                        setPasswordErrorMessage("");
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  {passwordErrorMessage && (
                    <p className="text-sm text-destructive">{passwordErrorMessage}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>

                <button
                  type="button"
                  onClick={handleClickOpen}
                  className="mx-auto block text-sm font-medium text-primary transition hover:text-primary/80"
                >
                  Forgot your password?
                </button>

                {props.googleClientId && (
                  <>
                    <div className="relative py-1">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        or continue with
                      </span>
                    </div>

                    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/35 p-4">
                      <div
                        id="google-btn"
                        className="flex min-h-10 justify-center"
                      />
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <ForgotPassword
          open={isForgotPasswordOpen}
          handleClose={handleClose}
        />

        <div className="space-y-3 pt-6 text-center">
          <a
            href="https://docs.google.com/document/d/1vueS_dzdvDkBex5BLe_F03GEFLzjtoiFbNi0VJa2_gE/edit?tab=t.0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Hướng dẫn sử dụng / User Guide
          </a>
          <p className="text-sm text-muted-foreground">© 2026 Springboard English</p>
        </div>
      </div>
    </AppTheme>
  );
}
