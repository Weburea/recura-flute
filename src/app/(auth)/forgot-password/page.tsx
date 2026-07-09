import { AuthLayout } from '@/components/authentication/auth-layout';
import { ForgotPassword } from '@/components/authentication/forgot-password';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      imageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571664/recovery_side.jpg" 
      darkImageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571667/recovery_side_dark.jpg"
      imageAlt="Recover your Recura account"
      title="Recovering Your Account"
      subtitle="Follow the high-security steps to securely regain access to your workspace."
    >
      <ForgotPassword />
    </AuthLayout>
  );
}
