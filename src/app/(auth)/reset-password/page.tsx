import { PasswordResetShell } from '@/components/authentication/password-reset-shell';
import { ResetPassword } from '@/components/authentication/reset-password';

export default function ResetPasswordPage() {
  return (
    <PasswordResetShell>
      <ResetPassword />
    </PasswordResetShell>
  );
}
