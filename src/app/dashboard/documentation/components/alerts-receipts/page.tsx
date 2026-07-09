"use client"

import * as React from "react"
import { DocContent } from "@/modules/documentation/components/DocContent"
import { ComponentPreview } from "@/modules/documentation/components/ComponentPreview"
import { 
  BellRing, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  FileText,
  Download,
  CreditCard,
  Target,
  Users,
} from "lucide-react"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"
import { InvoiceModal } from "@/components/dashboard/shared/modals/invoice-modal"
import { ReceiptModal } from "@/components/dashboard/shared/modals/receipt-modal"
import { BillingSummaryModal } from "@/components/dashboard/shared/modals/billing-summary-modal"
import { CreateSubscriptionModal } from "@/components/dashboard/shared/modals/create-subscription-modal"
import { TeamModals } from "@/components/dashboard/settings/team-modals"
import { cn } from "@/lib/utils"
import * as htmlToImage from 'html-to-image'

// Mock data for previews
const mockInvoice = {
  id: "INV-1267",
  customer: "James Davis",
  email: "james.d@email.com",
  amount: "$49.99",
  status: "Paid",
  date: "2024-01-12",
  dueDate: "2024-01-12",
  plan: "Premium Plan",
  items: [
    { id: 1, description: "Premium Plan Subscription (Monthly)", quantity: 1, price: 49.99 }
  ],
  subtotal: 49.99,
  tax: 0.00,
  total: 49.99
}

const mockReceipt = {
  id: "TXN-7829",
  customer: "James Davis",
  email: "james.d@email.com",
  avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png",
  amount: "$49.99",
  date: "Jan 12, 2024",
  method: {
    type: "Visa",
    details: "•••• 4242"
  },
  status: "Approved",
  plan: "Premium"
} as const;

export default function AlertsReceiptsDoc() {
  const [activeModal, setActiveModal] = React.useState<string | null>(null)
  const [statusType, setStatusType] = React.useState<StatusType>("success")
  const [statusTitle, setStatusTitle] = React.useState("")
  const [statusMessage, setStatusMessage] = React.useState("")
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [downloadProgress, setDownloadProgress] = React.useState(0)

  const showStatus = (type: StatusType, title: string, message: string) => {
    setStatusType(type)
    setStatusTitle(title)
    setStatusMessage(message)
    setActiveModal("status")
  }

  const executeDownload = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    setIsDownloading(true);
    setDownloadProgress(30);

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0px',
          transform: 'scale(1)',
          boxShadow: 'none',
        },
        filter: (node: Node) => {
          if (node instanceof HTMLElement) {
            return !node.classList.contains('no-export');
          }
          return true;
        }
      });
      
      setDownloadProgress(70);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Recura-Billing-Summary.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadProgress(100);
      setTimeout(() => {
        setIsDownloading(false);
        showStatus("success", "Image Saved", "The billing summary has been saved as a high-quality PNG.");
      }, 500);
    } catch (error) {
      console.error("Export failed:", error);
      setIsDownloading(false);
      showStatus("error", "Export Failed", "Failed to generate the image snippet.");
    }
  };

  return (
    <DocContent 
      title="Alerts & Receipts" 
      description="Specialized high-fidelity modals for system feedback, user confirmations, and billing summaries."
    >
      {/* 1. Status Alerts */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
            <BellRing className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Status Alerts</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComponentPreview
            title="Success State"
            description="Celebratory feedback with branded gradients and checkmark animation."
            code={`<StatusModal 
  type="success"
  title="Action Successful"
  message="Your request has been processed."
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>`}
          >
            <div className="flex flex-col items-center gap-4 py-8">
              <button 
                onClick={() => showStatus("success", "Operation Successful", "The changes have been registered within the system.")}
                className="px-6 py-3 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-sm border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center gap-2 group"
              >
                <CheckCircle2 className="w-4 h-4" />
                Preview Success
              </button>
            </div>
          </ComponentPreview>

          <ComponentPreview
            title="Error State"
            description="High-contrast warning with rose gradients and orb animation."
            code={`<StatusModal 
  type="error"
  title="Access Denied"
  message="You do not have permission to perform this action."
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>`}
          >
            <div className="flex flex-col items-center gap-4 py-8">
              <button 
                onClick={() => showStatus("error", "Access Denied", "System was unable to synchronize the current request.")}
                className="px-6 py-3 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 hover:scale-[1.02] transition-transform flex items-center gap-2 group"
              >
                <AlertCircle className="w-4 h-4" />
                Preview Error
              </button>
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* 2. Confirmation & Forms */}
      <section className="space-y-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Confirmation & Forms</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComponentPreview
            title="Destructive Action"
            description="Modal pattern for critical actions like removing team members."
            code={`<TeamModals 
  activeModal="remove-confirm" 
  onClose={() => setModal(null)} 
/>`}
          >
            <div className="flex flex-col items-center gap-4 py-8">
               <button 
                onClick={() => setActiveModal("remove-confirm")}
                className="px-6 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-sm hover:translate-y-[-2px] transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Remove Member
              </button>
            </div>
          </ComponentPreview>

          <ComponentPreview
            title="Form Pattern"
            description="Complex multi-input form within a premium modal container."
            code={`<CreateSubscriptionModal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>`}
          >
             <div className="flex flex-col items-center gap-4 py-8">
               <button 
                onClick={() => setActiveModal("create-sub")}
                className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold text-sm shadow-xl shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Launch Form
              </button>
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* 3. Billing Documents */}
      <section className="space-y-6 pb-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Billing Documents</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">High-fidelity printable receipts and financial summaries.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'invoice',
              title: 'Full Invoice',
              desc: 'Professional PDF-style billing statement.',
              icon: FileText,
              color: 'purple',
              preview: '/media__1774530081048.png'
            },
            {
              id: 'receipt',
              title: 'Compact Receipt',
              desc: 'High-fidelity payment snippet for users.',
              icon: CreditCard,
              color: 'blue',
              preview: '/media__1774530513872.png'
            },
            {
              id: 'summary',
              title: 'Workspace Summary',
              desc: 'Comprehensive financial report for workspace.',
              icon: Download,
              color: 'emerald',
              preview: '/media__1774530462534.png'
            }
          ].map((doc) => (
            <div key={doc.id} className="group relative">
              {/* Subtle professional border glow - much more understated */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative flex flex-col bg-white dark:bg-[#0B0E14] border border-slate-100 dark:border-white/5 rounded-3xl overflow-hidden h-full shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/5 transition-all duration-500 group-hover:-translate-y-1">
                {/* Visual Preview Area */}
                <div className="relative h-44 bg-slate-50 dark:bg-white/[0.02] overflow-hidden group/preview">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 dark:via-black/5 dark:to-black/10 z-10" />
                  
                  {/* High-fidelity abstract preview */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-700 group-hover:scale-105">
                     <div className={cn(
                       "w-full h-full rounded-xl border border-dashed flex flex-col p-3 gap-2 opacity-40 group-hover:opacity-80 transition-opacity",
                       doc.color === 'purple' ? 'border-purple-200 dark:border-purple-900/30 bg-purple-50/30' : 
                       doc.color === 'blue' ? 'border-blue-200 dark:border-blue-900/30 bg-blue-50/30' : 
                       'border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/30'
                     )}>
                        <div className={cn("w-1/3 h-1.5 rounded-full", doc.color === 'purple' ? 'bg-purple-200' : doc.color === 'blue' ? 'bg-blue-200' : 'bg-emerald-200')} />
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="w-2/3 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-auto" />
                     </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <doc.icon className={cn("w-12 h-12", doc.color === 'purple' ? 'text-purple-600/30' : doc.color === 'blue' ? 'text-blue-600/30' : 'text-emerald-600/30')} />
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900/10 backdrop-blur-[1px]">
                    <button
                      onClick={() => setActiveModal(doc.id)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs tracking-tight shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      OPEN PREVIEW
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                         "w-6 h-6 rounded-lg flex items-center justify-center",
                         doc.color === 'purple' ? 'bg-purple-50 text-purple-600' : 
                         doc.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                         'bg-emerald-50 text-emerald-600'
                       )}>
                          <doc.icon className="w-3.5 h-3.5" />
                       </div>
                       <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">{doc.title}</h4>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documentation Modals */}
      <StatusModal
        isOpen={activeModal === "status"}
        onClose={() => setActiveModal(null)}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />

      <InvoiceModal 
        isOpen={activeModal === "invoice"}
        onClose={() => setActiveModal(null)}
        invoice={mockInvoice}
      />

      <ReceiptModal 
        isOpen={activeModal === "receipt"}
        onClose={() => setActiveModal(null)}
        transaction={mockReceipt}
      />

      <BillingSummaryModal 
        isOpen={activeModal === "summary"}
        onClose={() => setActiveModal(null)}
        activeProvider="Stripe"
        activeSessionsCount={3}
        isAutobillingEnabled={true}
        prorationRange={10}
        twoFactorEnabled={true}
        invoiceData={{
          id: "INV-1267",
          date: "Jan 12, 2024"
        }}
        companyDetails={{
          name: "Recura Platforms",
          industry: "SaaS & Software",
          members: "12 Members",
          phone: "+1 (555) 000-0000",
          website: "www.recura.tech",
          address: "123 Innovation Drive, Silicon Valley, CA"
        }}
        onDownload={executeDownload}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
      />

      <CreateSubscriptionModal 
        isOpen={activeModal === "create-sub"}
        onClose={() => setActiveModal(null)}
      />

      <TeamModals 
        type="remove-confirm"
        isOpen={activeModal === "remove-confirm"}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          setActiveModal(null)
          showStatus("success", "Member Removed", "The team member has been successfully removed from the workspace.")
        }}
      />
    </DocContent>
  )
}
