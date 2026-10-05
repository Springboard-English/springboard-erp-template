import * as React from 'react';

import { Input } from '@/components/ui/input';
import { useI18n } from '@/context/I18nContext';
import { isValidPhoneNumber } from '../../utils/phone';

export type PhoneInputProps = Omit<React.ComponentProps<'input'>, 'type' | 'onChange' | 'value'> & {
  value: string;
  onChange: (value: string) => void;
  /** A blank value is invalid when set; otherwise blank means "no number". */
  required?: boolean;
};

/**
 * A phone field that says it is wrong once the person leaves it, not on every
 * keystroke. Gate submission with `isValidPhoneNumber` — this shows the error,
 * it does not block the form. The API normalises to E.164 on its own.
 */
export function PhoneInput({ value, onChange, required, onBlur, ...props }: PhoneInputProps) {
  const { t } = useI18n();
  const [touched, setTouched] = React.useState(false);
  const errorId = React.useId();
  const blank = !value.trim();
  const invalid = touched && (blank ? Boolean(required) : !isValidPhoneNumber(value));

  return (
    <div className="flex w-full flex-col gap-1">
      <Input
        {...props}
        type="tel"
        inputMode="tel"
        autoComplete={props.autoComplete ?? 'tel'}
        value={value}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : props['aria-describedby']}
        onChange={(event) => onChange(event.target.value)}
        onBlur={(event) => {
          setTouched(true);
          onBlur?.(event);
        }}
      />
      {invalid ? (
        <p id={errorId} className="text-xs text-destructive">
          {blank ? t('phone.required') : t('phone.invalid')}
        </p>
      ) : null}
    </div>
  );
}
