import { WorkspaceOverview } from "@/components/dashboard/settings/workspace-overview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings - Recura",
  description: "Manage your Recura account and business settings",
};

export default function SettingsPage() {
  return (
    <div className="h-full">
       <WorkspaceOverview />
    </div>
  );
}
