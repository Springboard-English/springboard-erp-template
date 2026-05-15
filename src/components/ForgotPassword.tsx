import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getEndpoint } from '../config/api';
import { fetchWithRefresh } from '../api_calls/fetchWithRefresh';
import StatusBanner from './StatusBanner';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const closeDialog = () => {
    setErrorMessage('');
    handleClose();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeDialog();
    }
  };

  const submitForgotPassword = async (formElement: HTMLFormElement) => {
    setErrorMessage('');

    const data = new FormData(formElement);
    const username = data.get('username');

    if (!username || typeof username !== 'string') {
      setErrorMessage('Username is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);

      const response = await fetchWithRefresh(getEndpoint('resetPassword'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Reset password failed: ${response.status} ${response.statusText}`);
      }

      closeDialog();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to request password reset. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[min(97vw,38rem)] max-w-none flex-col overflow-hidden border-border/70 bg-card/95 p-0">
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            event.stopPropagation();
            void submitForgotPassword(event.currentTarget);
          }}
        >
          <DialogHeader className="border-b border-border/70 px-6 py-4 text-left">
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Enter your account&apos;s username, and we&apos;ll send you a link to
              reset your password.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-4">
              {errorMessage && (
                <StatusBanner variant="error">{errorMessage}</StatusBanner>
              )}

              <div className="space-y-2">
                <Label htmlFor="forgot-password-username">
                  <span className="inline-flex items-center gap-1">
                    <span>Username</span>
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </span>
                </Label>
                <Input
                  autoFocus
                  required
                  id="forgot-password-username"
                  name="username"
                  placeholder="username"
                  type="text"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border/70 px-6 py-4 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
