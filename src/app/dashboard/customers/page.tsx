"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CustomerTable } from "@/components/dashboard/customers/customer-table"
import { AddCustomerModal } from "@/components/dashboard/shared/modals/add-customer-modal"
import { ViewProfileModal } from "@/components/dashboard/shared/modals/view-profile-modal"
import { StatusModal } from "@/components/dashboard/shared/modals/status-modal"
import { ConfirmationModal } from "@/components/dashboard/shared/modals/confirmation-modal"
import { useUser } from "@/context/user-context"
import { NICHE_REGISTRY, getNormalizedNiche } from "@/config/niche-registry"
import { Plus } from "lucide-react"

export default function CustomersPage() {
  const { workspace, loading } = useUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customers, setCustomers] = React.useState<any[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = React.useState(true)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editCustomer, setEditCustomer] = React.useState<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProfile, setSelectedProfile] = React.useState<any | null>(null)
  
  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    isOpen: boolean
    customerId: string | number | null
  }>({
    isOpen: false,
    customerId: null
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

  const fetchCustomers = React.useCallback(async () => {
    setIsLoadingCustomers(true)
    try {
      const res = await fetch('/api/v1/customers')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setCustomers(json.data)
        }
      }
    } catch (err) {
      console.error('[FETCH CUSTOMERS ERROR]', err)
    } finally {
      setIsLoadingCustomers(false)
    }
  }, [])

  React.useEffect(() => {
    if (!loading && workspace) {
      fetchCustomers()
    }
  }, [loading, workspace, fetchCustomers])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (customer: any) => {
    setEditCustomer(customer)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string | number) => {
    try {
      const res = await fetch(`/api/v1/customers/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Delete Successful",
          message: "The customer profile has been deleted successfully."
        })
        fetchCustomers()
      } else {
        const json = await res.json()
        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Delete Failed",
          message: json.error || "Failed to delete customer."
        })
      }
    } catch (err) {
      console.error(err)
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Delete Failed",
        message: "An internal server error occurred."
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewProfile = (customer: any) => {
    setSelectedProfile(customer)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStatusChange = async (customer: any, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Status Updated",
          message: `The client has been successfully ${newStatus === "Active" ? "activated" : "deactivated"}.`
        })
        fetchCustomers()
      } else {
        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Action Failed",
          message: "Failed to update client status."
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] mx-auto space-y-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-8 w-56 bg-slate-200 dark:bg-white/5 rounded-lg" />
              <div className="h-4 w-80 bg-slate-100 dark:bg-white/5 rounded-lg" />
            </div>
            <div className="h-10 w-36 bg-slate-200 dark:bg-white/5 rounded-xl" />
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
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
              {config.pageTitle}
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold">
              {config.pageSubtitle}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm tracking-wide transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            {config.ctaLabel}
          </button>
        </div>

        <CustomerTable
          customers={customers}
          isLoading={isLoadingCustomers}
          entityLabel={config.entityLabel}
          col3Header={config.col3Header}
          col4Header={config.col4Header}
          tabs={config.tabs}
          statusStyles={config.statusBadgeStyles}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirm({ isOpen: true, customerId: id })}
          onViewProfile={handleViewProfile}
          onStatusChange={handleStatusChange}
          refreshData={fetchCustomers}
        />
      </div>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditCustomer(null)
        }}
        onSuccess={() => {
          setStatusModal({
            isOpen: true,
            type: "success",
            title: editCustomer ? "Update Successful" : "Creation Successful",
            message: `The customer record has been ${editCustomer ? 'updated' : 'created'} successfully.`
          })
          fetchCustomers()
        }}
        businessType={normalizedNiche}
        nicheConfig={config}
        editData={editCustomer}
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
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, customerId: null })}
        onConfirm={async () => {
          const id = deleteConfirm.customerId
          if (id) {
            setDeleteConfirm({ isOpen: false, customerId: null })
            await handleDelete(id)
          }
        }}
        title={`Delete ${config.entityLabel}?`}
        message={`Are you sure you want to permanently delete this ${config.entityLabel.toLowerCase()}? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        type="danger"
      />
    </DashboardLayout>
  )
}
