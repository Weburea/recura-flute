import { AuthLayout } from '@/components/authentication/auth-layout';
import { SignIn } from '@/components/authentication/sign-in';

export default function SignInPage() {
  return (
    <AuthLayout 
      imageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571650/dashboard.png" 
      darkImageSrc="https://res.cloudinary.com/weburea/image/upload/v1783571660/dashboard_dark.png"
      imageAlt="Sign In to Recura"
    >
      <SignIn />
    </AuthLayout>
  );
}
