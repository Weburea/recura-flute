import { PasswordResetShell } from '@/components/authentication/password-reset-shell';
import { VerifyCode } from '@/components/authentication/verify-code';

export default function VerifyCodePage() {
  return (
    <PasswordResetShell>
      <VerifyCode />
    </PasswordResetShell>
  );
}
