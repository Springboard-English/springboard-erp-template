import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ForgotPassword from "@/components/ForgotPassword";
import StatusBanner from "@/components/StatusBanner";
import AppTheme from "@/theme/AppTheme";
import ColorModeSelect from "@/theme/ColorModeSelect";
import LocaleSelect from "@/theme/LocaleSelect";
import { SitemarkIcon } from "@/components/CustomIcons";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { loginWithGoogle } from "@/api_calls/UserData";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";

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
}

export default function SignIn(props: SignInViewProps) {
  const { t } = useI18n();
  const { login, setAuthenticatedUser } = useAuth();
  const defaultAccountTypeOptions = React.useMemo<SearchableSelectOption[]>(
    () => [
      { value: "employee", label: t("signIn.accountType.employee") },
      { value: "student", label: t("signIn.accountType.student") },
    ],
    [t],
  );
  const accountTypeOptions = React.useMemo(
    () => (props.accountTypeOptions && props.accountTypeOptions.length > 0
      ? props.accountTypeOptions
      : defaultAccountTypeOptions),
    [defaultAccountTypeOptions, props.accountTypeOptions],
  );
  const accountTypeOptionsKey = React.useMemo(
    () => accountTypeOptions.map((option) => `${option.value}:${option.label}`).join("|"),
    [accountTypeOptions],
  );
  const resolvedAccountTypeOverride = props.accountTypeOverride?.trim() || "";
  const shouldShowAccountTypeSelector = !resolvedAccountTypeOverride;
  const heroEyebrowText = props.heroEyebrowText?.trim() || t("signIn.learningPortal");
  const heroTitleText = props.heroTitleText?.trim() || t("signIn.heroTitle");
  const heroTitleAccentText = props.heroTitleAccentText?.trim() || t("signIn.heroAccent");
  const formTitle = props.formTitle?.trim() || t("signIn.formTitle");
  const formDescription = props.formDescription?.trim() || t("signIn.formDescription");
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
  const selectedAccountTypeRef = React.useRef(accountType);

  React.useEffect(() => {
    if (!props.authNotice) {
      return;
    }

    setLoginSuccessMessage(props.authNotice);
  }, [props.authNotice]);

  React.useEffect(() => {
    if (resolvedAccountTypeOverride) {
      setAccountType(resolvedAccountTypeOverride);
      setAccountTypeErrorMessage("");
      return;
    }

    setAccountType((currentAccountType) => {
      if (
        currentAccountType &&
        accountTypeOptions.some((option) => option.value === currentAccountType)
      ) {
        return currentAccountType;
      }

      return accountTypeOptions[0]?.value || "";
    });
    setAccountTypeErrorMessage("");
  }, [accountTypeOptions, accountTypeOptionsKey, resolvedAccountTypeOverride]);

  React.useEffect(() => {
    selectedAccountTypeRef.current = resolvedAccountTypeOverride || accountType;
  }, [accountType, resolvedAccountTypeOverride]);

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

  const getSelectedAccountType = () => selectedAccountTypeRef.current;
  const selectedAccountTypeLabel = accountTypeOptions.find((option) => option.value === getSelectedAccountType())?.label;

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
          : t("signIn.googleError"),
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
        setLoginError(t("signIn.invalidCredentials"));
        return;
      }

      setLoginError(
        error instanceof Error
          ? error.message
          : t("signIn.loginFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateInputs = ({ includeCredentials = true }: { includeCredentials?: boolean } = {}) => {
    let isValid = true;

    if (shouldShowAccountTypeSelector && !accountType) {
      setAccountTypeErrorMessage(t("signIn.selectAccountTypeError"));
      isValid = false;
    } else {
      setAccountTypeErrorMessage("");
    }

    if (includeCredentials) {
      if (!username.trim()) {
        setUsernameErrorMessage(t("signIn.enterUsername"));
        isValid = false;
      } else {
        setUsernameErrorMessage("");
      }

      if (!password) {
        setPasswordErrorMessage(t("signIn.passwordRequired"));
        isValid = false;
      } else {
        setPasswordErrorMessage("");
      }
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <div className="relative flex min-h-screen overflow-hidden bg-background">
        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/4 blur-[100px]" />
          <div className="absolute left-1/3 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-sky-500/4 blur-[80px] dark:bg-sky-400/4" />
        </div>

        {/* Left branding panel — desktop only */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border/30 bg-card/20 p-12 backdrop-blur-sm lg:flex lg:w-[42%] xl:w-[38%]">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/6 blur-3xl" />
          </div>

          <SitemarkIcon />

          <div className="space-y-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              {heroEyebrowText}
            </p>
            <p className="text-[2.75rem] font-bold leading-[1.15] tracking-tight text-foreground">
              {heroTitleText}<br />
              <span className="text-primary">{heroTitleAccentText}</span>
            </p>
          </div>
        </div>

        {/* Right form section */}
        <div className="relative flex flex-1 flex-col">
          {/* Top-right controls */}
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
            {props.headerChildren ?? (
              <>
                <LocaleSelect />
                <ColorModeSelect />
              </>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-10">
            {/* Mobile logo */}
            <div className="mb-10 lg:hidden">
              <SitemarkIcon />
            </div>

            <div className="w-full max-w-[360px]">
              {/* Heading */}
              <div className="mb-8 space-y-1.5">
                <h1 className="text-3xl font-bold tracking-tight">{formTitle}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-medium text-primary">
                  <span>{t("signIn.as")}</span>
                  {shouldShowAccountTypeSelector ? (
                    <SearchableSelect
                      id="account-type"
                      value={accountType}
                      options={accountTypeOptions}
                      placeholder={t("signIn.selectAccountType")}
                      disabled={isSubmitting}
                      className="h-11 w-auto min-w-[11rem] max-w-full rounded-xl border-primary/25 bg-primary/5 px-4 text-base font-semibold text-primary"
                      contentClassName="w-[14rem]"
                      onValueChange={(value) => {
                        setAccountType(value);
                        if (accountTypeErrorMessage) {
                          setAccountTypeErrorMessage("");
                        }
                      }}
                    />
                  ) : selectedAccountTypeLabel ? (
                    <span>{selectedAccountTypeLabel}</span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formDescription}
                </p>
                {accountTypeErrorMessage && (
                  <p className="text-sm text-destructive">{accountTypeErrorMessage}</p>
                )}
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {loginError && (
                  <StatusBanner variant="error">{loginError}</StatusBanner>
                )}
                {loginSuccessMessage && (
                  <StatusBanner variant="success">{loginSuccessMessage}</StatusBanner>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span>{t("signIn.username")}</span>
                      <span className="text-destructive" aria-hidden="true">*</span>
                    </span>
                  </Label>
                  <Input
                    aria-invalid={Boolean(usernameErrorMessage)}
                    id="username"
                    type="text"
                    name="username"
                    placeholder={t("signIn.usernamePlaceholder")}
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span>{t("signIn.password")}</span>
                        <span className="text-destructive" aria-hidden="true">*</span>
                      </span>
                    </Label>
                    <button
                      type="button"
                      onClick={handleClickOpen}
                      className="text-xs font-medium text-primary transition hover:text-primary/75"
                    >
                      {t("signIn.forgotPassword")}
                    </button>
                  </div>
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

                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-[0_14px_30px_-14px_color-mix(in_oklab,var(--primary)_65%,transparent)] transition-all hover:scale-[1.01] hover:bg-primary/92 hover:shadow-[0_18px_36px_-16px_color-mix(in_oklab,var(--primary)_72%,transparent)] disabled:scale-100 disabled:bg-primary disabled:shadow-none"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("signIn.signingIn") : t("signIn.passwordSubmit")}
                </Button>

                {props.googleClientId && (
                  <>
                    <div className="relative py-1">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {t("signIn.or")}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/35 p-4">
                      <div id="google-btn" className="flex min-h-10 justify-center" />
                    </div>
                  </>
                )}
              </form>

              {/* Footer */}
              <div className="mt-8 space-y-2 text-center">
                <a
                  href="https://docs.google.com/document/d/1vueS_dzdvDkBex5BLe_F03GEFLzjtoiFbNi0VJa2_gE/edit?tab=t.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-xs font-medium text-muted-foreground/70 transition hover:text-muted-foreground"
                >
                  {t("signIn.guideLink")}
                </a>
              </div>
            </div>
          </div>
        </div>

        <ForgotPassword
          open={isForgotPasswordOpen}
          handleClose={handleClose}
        />
      </div>
    </AppTheme>
  );
}
