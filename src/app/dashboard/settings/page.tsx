import { AdminProfileForm } from "@/components/dashboard/settings/admin-profile-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile Settings - Recura",
  description: "Manage your personal profile and account credentials",
};

export default function SettingsPage() {
  return (
    <div className="h-full">
      <AdminProfileForm />
    </div>
  );
}
