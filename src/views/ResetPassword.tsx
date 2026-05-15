import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppTheme from '@/theme/AppTheme';
import ColorModeSelect from '@/theme/ColorModeSelect';
import StatusBanner from '@/components/StatusBanner';
import { SitemarkIcon } from '@/components/CustomIcons';
import { resetPassword } from '@/api_calls/UserData';

export interface ResetPasswordViewProps {
  disableCustomTheme?: boolean;
  onNavigateToSignIn?: (authNotice?: string) => void;
  signInPath?: string;
}

export default function ResetPassword(props: ResetPasswordViewProps) {
  const [token, setToken] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token') || '';
    setToken(tokenFromUrl);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage('');

    if (!token.trim()) {
      setErrorMessage('Reset token is required.');
      return;
    }

    if (!username.trim()) {
      setErrorMessage('Username is required.');
      return;
    }

    if (!password) {
      setErrorMessage('New password is required.');
      return;
    }

    if (!confirmPassword) {
      setErrorMessage('Please confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token: token.trim(),
        username: username.trim(),
        password: password
      });

      props.onNavigateToSignIn?.('Password reset successful. You can now sign in.');
      if (!props.onNavigateToSignIn && props.signInPath) {
        window.location.assign(props.signInPath);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppTheme {...props}>
      <div className="relative flex min-h-screen flex-col overflow-hidden px-4 py-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(255,255,255,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_24%),linear-gradient(180deg,rgba(7,14,26,0.98),rgba(16,24,40,1))]" />
        <div className="pointer-events-none absolute bottom-[-8rem] right-[-3rem] -z-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
        <ColorModeSelect className="fixed right-4 top-4 z-20 sm:right-6 sm:top-6" />

        <div className="mx-auto flex w-full max-w-md flex-1 items-center">
          <Card className="w-full border-border/70 bg-card/90 py-0 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.55)] backdrop-blur">
            <CardHeader className="gap-5 px-6 pt-6 sm:px-8 sm:pt-8">
              <div className="flex justify-center sm:justify-start">
                <SitemarkIcon />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl tracking-tight">Reset password</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Set a new password for your account using the reset link you received.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              <form
                className="space-y-4"
                onSubmit={handleSubmit}
                noValidate
              >
                {errorMessage && (
                  <StatusBanner variant="error">{errorMessage}</StatusBanner>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">
                    <span className="inline-flex items-center gap-1">
                      <span>Username</span>
                      <span className="text-destructive" aria-hidden="true">*</span>
                    </span>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">
                    <span className="inline-flex items-center gap-1">
                      <span>New password</span>
                      <span className="text-destructive" aria-hidden="true">*</span>
                    </span>
                  </Label>
                  <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    <span className="inline-flex items-center gap-1">
                      <span>Confirm new password</span>
                      <span className="text-destructive" aria-hidden="true">*</span>
                    </span>
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Resetting password...' : 'Reset password'}
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    props.onNavigateToSignIn?.();
                    if (!props.onNavigateToSignIn && props.signInPath) {
                      window.location.assign(props.signInPath);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Back to sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppTheme>
  );
}
