"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { MetricsOverview } from "@/components/dashboard/subscriptions/metrics-overview"
import { SubscriptionTable } from "@/components/dashboard/subscriptions/subscription-table"

import { CreateSubscriptionModal } from "@/components/dashboard/shared/modals/create-subscription-modal"
import { ViewProfileModal } from "@/components/dashboard/shared/modals/view-profile-modal"
import { StatusModal } from "@/components/dashboard/shared/modals/status-modal"
import { ConfirmationModal } from "@/components/dashboard/shared/modals/confirmation-modal"
import { useUser } from "@/context/user-context"
import { NICHE_REGISTRY, getNormalizedNiche } from "@/config/niche-registry"
import { Plus } from "lucide-react"

export default function SubscriptionsPage() {
  const { workspace, loading } = useUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscriptions, setSubscriptions] = React.useState<any[]>([])
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editSubscription, setEditSubscription] = React.useState<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProfile, setSelectedProfile] = React.useState<any | null>(null)

  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean
    type: "danger" | "warning"
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
    onConfirm: () => {},
  })

  const [statusModal, setStatusModal] = React.useState<{
    isOpen: boolean
    type: "success" | "error"
    title: string
    message: string
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  })

  const fetchSubscriptions = React.useCallback(async () => {
    setIsLoadingSubscriptions(true)
    try {
      const res = await fetch('/api/v1/subscriptions')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setSubscriptions(json.data)
        }
      }
    } catch (err) {
      console.error('[FETCH SUBSCRIPTIONS ERROR]', err)
    } finally {
      setIsLoadingSubscriptions(false)
    }
  }, [])

  React.useEffect(() => {
    if (!loading && workspace) {
      fetchSubscriptions()
    }
  }, [loading, workspace, fetchSubscriptions])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewDetails = (sub: any) => {
    setSelectedProfile({
      id: sub.id,
      name: sub.customer?.name || sub.name || "N/A",
      email: sub.customer?.email || "N/A",
      status: sub.status || "Active",
      plan: sub.plan || "N/A",
      spent: sub.price, // Cent representation maps correctly in ViewProfileModal
      createdAt: sub.createdAt || sub.lastPaymentAt,
      avatarUrl: sub.customer?.avatarUrl || sub.avatar || ""
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (sub: any) => {
    setEditSubscription(sub)
    setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePause = (sub: any) => {
    setConfirmModal({
      isOpen: true,
      type: "warning",
      title: "Pause Subscription?",
      message: `Are you sure you want to pause billing for ${sub.customer?.name || sub.name}? This will suspend automatic invoice generation.`,
      onConfirm: () => handleStatusChange(sub.id, "Paused")
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCancel = (sub: any) => {
    setConfirmModal({
      isOpen: true,
      type: "warning",
      title: "Cancel Contract?",
      message: `Are you sure you want to cancel the contract for ${sub.customer?.name || sub.name}? This cannot be undone.`,
      onConfirm: () => handleStatusChange(sub.id, "Canceled")
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDelete = (sub: any) => {
    setConfirmModal({
      isOpen: true,
      type: "danger",
      title: "Delete Contract?",
      message: `Are you sure you want to permanently delete the contract for ${sub.customer?.name || sub.name}? This action cannot be undone.`,
      onConfirm: () => handleDeleteSubscription(sub.id)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleActivate = (sub: any) => {
    setConfirmModal({
      isOpen: true,
      type: "warning",
      title: "Activate Subscription?",
      message: `Are you sure you want to activate billing for ${sub.customer?.name || sub.name}? This will resume automatic invoice generations.`,
      onConfirm: () => handleStatusChange(sub.id, "Active")
    })
  }

  const handleStatusChange = async (id: string, status: string) => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
    try {
      const res = await fetch(`/api/v1/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setStatusModal({
          isOpen: true,
          type: "success",
          title: `Contract ${status}`,
          message: `The billing contract has been successfully ${status.toLowerCase()}.`
        })
        fetchSubscriptions()
      } else {
        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Action Failed",
          message: "Failed to update subscription status."
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteSubscription = async (id: string) => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
    try {
      const res = await fetch(`/api/v1/subscriptions/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Contract Deleted",
          message: "The billing contract has been permanently removed."
        })
        fetchSubscriptions()
      } else {
        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Delete Failed",
          message: "Failed to delete billing contract."
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-slate-200 dark:bg-white/5 rounded-lg" />
              <div className="h-4 w-96 bg-slate-100 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="h-10 w-40 bg-slate-200 dark:bg-white/5 rounded-xl" />
          </div>
          <div className="h-[600px] bg-white dark:bg-[#0D0518]/25 border border-slate-100 dark:border-white/5 rounded-3xl" />
        </div>
      </DashboardLayout>
    )
  }

  const normalizedNiche = getNormalizedNiche(workspace?.businessType ?? null)
  const config = NICHE_REGISTRY[normalizedNiche] || NICHE_REGISTRY.other

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="dashboard-title text-3xl font-black tracking-tight">{config.subPageTitle}</h1>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-2">{config.subPageSubtitle}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm tracking-wide hover:bg-purple-700 transition-colors shadow-sm cursor-pointer shrink-0 w-full md:w-auto"
          >
            <Plus className="w-4 h-4" />
            {config.subCtaLabel}
          </button>
        </div>

        {/* Metrics Grid */}
        <MetricsOverview subscriptions={subscriptions} businessType={normalizedNiche} />

        {/* Main Table */}
        <SubscriptionTable
          subscriptions={subscriptions}
          isLoading={isLoadingSubscriptions}
          tableTitle={config.subTableTitle}
          planColHeader={config.subPlanColHeader}
          billingColHeader={config.subBillingColHeader}
          tabs={config.subTabs}
          entityLabel={config.subEntityLabel}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onPause={handlePause}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onActivate={handleActivate}
          refreshData={fetchSubscriptions}
        />



        {/* Modal */}
        <CreateSubscriptionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditSubscription(null)
          }}
          onSuccess={() => {
            setStatusModal({
              isOpen: true,
              type: "success",
              title: editSubscription ? "Contract Updated" : "Contract Active",
              message: `The billing contract has been successfully ${editSubscription ? 'updated' : 'persisted'}.`
            })
            fetchSubscriptions()
          }}
          businessType={normalizedNiche}
          editData={editSubscription}
        />

        <ViewProfileModal
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          customer={selectedProfile}
        />

        <StatusModal
          isOpen={statusModal.isOpen}
          onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
          type={statusModal.type}
          title={statusModal.title}
          message={statusModal.message}
        />

        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText="Yes, Proceed"
          cancelText="Cancel"
          type={confirmModal.type}
        />
      </div>
    </DashboardLayout>
  )
}
