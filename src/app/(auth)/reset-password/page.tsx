import { AuthLayout } from '@/components/authentication/auth-layout';
import { ResetPassword } from '@/components/authentication/reset-password';

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      imageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571664/recovery_side.jpg" 
      darkImageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571667/recovery_side_dark.jpg"
      imageAlt="Reset your password"
      title="Set New Password"
      subtitle="Create a strong, unique password to complete the recovery process."
    >
      <ResetPassword />
    </AuthLayout>
  );
}
