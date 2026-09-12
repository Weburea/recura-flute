"use client"

import React, { useState, useMemo } from "react"
import { 
  ShieldAlert, 
  Briefcase, 
  Trash2, 
  AlertTriangle, 
  User, 
  Mail, 
  Building2, 
  X, 
  Loader2
} from "lucide-react"
import { useUser } from "@/context/user-context"
import { useTranslation } from "@/context/language-context"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { useRouter } from "next/navigation"

export function AccountSettingsForm() {
  const { user, workspace, refreshUser, loading } = useUser()
  const { t } = useTranslation()
  const router = useRouter()

  const [showStatus, setShowStatus] = useState(false)
  const [statusType, setStatusType] = useState<StatusType>("success")
  const [statusTitle, setStatusTitle] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  // Transfer Ownership State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [transferEmail, setTransferEmail] = useState("")
  const [confirmWorkspaceInput, setConfirmWorkspaceInput] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const isWorkspaceOwner = true // Primary user context in this workspace

  const rawNiche = (workspace?.businessType || workspace?.niche || 'other').toLowerCase()
  const nicheLabel = useMemo(() => {
    if (rawNiche.includes('agenc')) return 'Agency & Retainers'
    if (rawNiche.includes('social')) return 'Social Media Marketing'
    if (rawNiche.includes('startup')) return 'High-Growth Startup'
    if (rawNiche.includes('market') || rawNiche.includes('commerce')) return 'E-Commerce'
    if (rawNiche.includes('saas') || rawNiche.includes('software')) return 'SaaS Business'
    return 'Custom Business'
  }, [rawNiche])

  // Handle Workspace Ownership Transfer
  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!transferEmail || !confirmWorkspaceInput) return

    setIsTransferring(true)
    try {
      const res = await fetch("/api/v1/workspaces/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: transferEmail,
          confirmWorkspaceName: confirmWorkspaceInput,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setIsTransferModalOpen(false)
        setTransferEmail("")
        setConfirmWorkspaceInput("")
        await refreshUser()
        setStatusType("success")
        setStatusTitle(t("settings.transferOwnership", "Ownership Transferred"))
        setStatusMessage(data.message || "Workspace ownership has been successfully transferred.")
      } else {
        setStatusType("error")
        setStatusTitle("Transfer Failed")
        setStatusMessage(data.error || "Could not transfer ownership.")
      }
    } catch (err) {
      console.error("Transfer error:", err)
      setStatusType("error")
      setStatusTitle("System Error")
      setStatusMessage("Failed to connect to transfer service.")
    } finally {
      setIsTransferring(false)
      setShowStatus(true)
    }
  }

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmInput !== "DELETE") return

    setIsDeleting(true)
    try {
      const res = await fetch("/api/v1/auth/profile", {
        method: "DELETE",
      })

      if (res.ok) {
        setIsDeleteModalOpen(false)
        setStatusType("success")
        setStatusTitle(t("settings.deleteAccount", "Account Deleted"))
        setStatusMessage("Your account and all personal data have been deleted. Redirecting...")
        setShowStatus(true)
        setTimeout(() => {
          router.push("/sign-in")
        }, 2000)
      } else {
        setStatusType("error")
        setStatusTitle("Deletion Failed")
        setStatusMessage("Unable to delete account at this time.")
        setShowStatus(true)
      }
    } catch (err) {
      console.error(err)
      setStatusType("error")
      setStatusTitle("System Error")
      setStatusMessage("Failed to delete account.")
      setShowStatus(true)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8 pb-10 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-white/5 rounded-xl w-48 mb-8" />
        <div className="space-y-6">
          <div className="h-44 bg-slate-200 dark:bg-white/5 rounded-2xl" />
          <div className="h-44 bg-slate-200 dark:bg-white/5 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10 max-w-4xl">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          {t("settings.accountSubtitle", "Account & Danger Zone")}
        </h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {t("settings.accountSubtitle", "Manage ownership transitions, authentication credentials, and critical account actions")}
        </p>
      </div>

      {/* Account Identity Card */}
      <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{t("settings.accountDetails", "Account Details")}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Registered profile credentials</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t("settings.primaryEmail", "Primary Email")}</span>
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              <span>{user?.email || "user@business.com"}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t("settings.activeWorkspace", "Active Workspace")}</span>
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>{workspace?.name || "Workspace"} ({nicheLabel})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Transfer Card */}
      <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{t("settings.transferOwnership", "Transfer Workspace Ownership")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {t("settings.transferSubtitle", "Transfer primary billing, workspace rights, and ownership to another user.")}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            disabled={!isWorkspaceOwner}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0 disabled:opacity-50"
          >
            {t("settings.transferOwnership", "Transfer Ownership")}
          </button>
        </div>
      </div>

      {/* Danger Zone / Delete Account Card */}
      <div className="bg-white dark:bg-[#150a2e] p-6 md:p-8 rounded-2xl border border-rose-200/80 dark:border-rose-900/40 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400 tracking-tight">
            {t("settings.deleteAccount", "Delete Account")}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300">{t("settings.deleteAccount", "Permanently Delete Account")}</h4>
            <p className="text-xs text-rose-700/80 dark:text-rose-400/80 leading-relaxed">
              {t("settings.deleteAccountSubtitle", "Permanently delete your profile credentials and personal access data.")}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            {t("common.delete", "Delete Account")}
          </button>
        </div>
      </div>

      {/* Transfer Ownership Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#150a2e] rounded-2xl max-w-md w-full p-6 border border-gray-100 dark:border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{t("settings.transferOwnership", "Transfer Workspace Ownership")}</h3>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{t("settings.transferWarning", "Ownership Transfer is Permanent")}</span>
              </p>
              <p>{t("settings.recipientGainControl", "The new owner will gain full control over billing, plan management, and admin access.")}</p>
            </div>

            <form onSubmit={handleTransferOwnership} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("settings.newOwnerEmail", "New Owner Email Address")}</label>
                <input 
                  type="email"
                  required
                  value={transferEmail}
                  onChange={(e) => setTransferEmail(e.target.value)}
                  placeholder="colleague@business.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Type <span className="font-black text-purple-600 select-all">{workspace?.name || "Workspace"}</span> to confirm:
                </label>
                <input 
                  type="text"
                  required
                  value={confirmWorkspaceInput}
                  onChange={(e) => setConfirmWorkspaceInput(e.target.value)}
                  placeholder={workspace?.name || "Workspace name"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-600/20 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  {t("common.cancel", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isTransferring || confirmWorkspaceInput.trim().toLowerCase() !== (workspace?.name || "").trim().toLowerCase() || !transferEmail}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isTransferring && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{t("settings.confirmTransfer", "Confirm & Transfer")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#150a2e] rounded-2xl max-w-md w-full p-6 border border-gray-100 dark:border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{t("settings.deleteAccount", "Delete Account")}</h3>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{t("settings.permanentAction", "Irreversible Action")}</span>
              </p>
              <p>{t("settings.deleteAccountSubtitle", "This will permanently delete your user account and all personal credentials.")}</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("settings.typeDeleteToConfirm", "Type DELETE to confirm:")}
                </label>
                <input 
                  type="text"
                  required
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-600/20 focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  {t("common.cancel", "Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmInput !== "DELETE"}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{t("settings.deleteAccount", "Delete My Account")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <StatusModal 
        isOpen={showStatus}
        onClose={() => setShowStatus(false)}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />
    </div>
  )
}
