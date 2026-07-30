import { PasswordResetShell } from '@/components/authentication/password-reset-shell';
import { ForgotPassword } from '@/components/authentication/forgot-password';

export default function ForgotPasswordPage() {
  return (
    <PasswordResetShell>
      <ForgotPassword />
    </PasswordResetShell>
  );
}
