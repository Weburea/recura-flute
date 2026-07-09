import { AuthLayout } from '@/components/authentication/auth-layout';
import { VerifyCode } from '@/components/authentication/verify-code';

export default function VerifyCodePage() {
  return (
    <AuthLayout 
      imageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571671/verification_side.jpg" 
      darkImageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571681/verification_side_dark.jpg"
      imageAlt="Verify your identity"
      title="Verify Your Identity"
      subtitle="Confirm your ownership with the 6-digit cryptographic code sent to your email."
    >
      <VerifyCode />
    </AuthLayout>
  );
}
