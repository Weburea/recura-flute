import { AuthLayout } from '@/components/authentication/auth-layout';
import { SignUp } from '@/components/authentication/sign-up';

export default function SignUpPage() {
  return (
    <AuthLayout 
      imageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571650/dashboard.png" 
      darkImageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571660/dashboard_dark.png"
      imageAlt="Sign Up to Recura"
    >
      <SignUp />
    </AuthLayout>
  );
}
