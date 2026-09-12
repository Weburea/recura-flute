import { WorkspaceOverview } from "@/components/dashboard/settings/workspace-overview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Workspace Settings - Recura",
  description: "Manage your business and workspace settings",
};

export default function WorkspacePage() {
  return (
    <div className="h-full">
      <WorkspaceOverview />
    </div>
  );
}
