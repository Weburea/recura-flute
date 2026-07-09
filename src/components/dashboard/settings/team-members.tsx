"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Plus, 
  ShieldCheck, 
  Mail, 
  ChevronRight,
  ListFilter,
  CheckCircle2,
  Power,
  Trash2,
  ChevronDown,
  Check
} from "lucide-react"
import NextImage from "next/image"
import { TeamModals } from "./team-modals"
import { StatusModal, StatusType } from "@/components/dashboard/shared/modals/status-modal"

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Support';
  status: 'Active' | 'Pending Invite' | 'Inactive';
  lastActive: string;
  avatar: string;
}

const members: TeamMember[] = [
  { id: 1, name: "Admin User", email: "admin@business.com", role: "Owner", status: "Active", lastActive: "Online", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png" },
  { id: 2, name: "Sarah Johnson", email: "sarah@business.com", role: "Admin", status: "Active", lastActive: "5 min ago", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png" },
  { id: 3, name: "Michael Brown", email: "michael@business.com", role: "Manager", status: "Active", lastActive: "2 hours ago", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png" },
  { id: 4, name: "Emma Wilson", email: "emma@business.com", role: "Support", status: "Pending Invite", lastActive: "Pending", avatar: "https://res.cloudinary.com/weburea/image/upload/v1783571691/59%201.png" },
]

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  icon: Icon 
}: { 
  options: string[]; 
  value: string; 
  onChange: (val: string) => void;
  icon?: React.ElementType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-white dark:bg-[#150a2e]/5 text-sm font-bold text-slate-900 dark:text-white transition-all min-w-[140px] justify-between group border border-transparent hover:border-slate-200 dark:border-white/20",
          isOpen && "ring-2 ring-purple-600/10 border-purple-200"
        )}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 group-hover:text-purple-600" />}
          <span>{value}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-300 transition-transform duration-200", isOpen ? "rotate-180" : "group-hover:text-slate-600 dark:text-slate-300")} />
      </button>

      <div className={cn(
        "absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl z-[100] py-2 transition-all duration-200 origin-top",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              onChange(opt);
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-white/5 dark:hover:bg-white dark:bg-[#150a2e]/5 dark:bg-white dark:bg-[#150a2e]/5",
              value === opt ? "text-purple-600 bg-purple-50/50" : "text-slate-600 dark:text-slate-300"
            )}
          >
            {opt}
            {value === opt && <Check className="w-4 h-4 text-purple-600" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export function TeamMembers() {
  const [activeModal, setActiveModal] = useState<'invite' | 'create-role' | 'edit-member' | 'save-confirm' | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState<StatusType>("success");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [openActionsId, setOpenActionsId] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");

  const handleSave = () => {
    setStatusType("success");
    setStatusTitle("Saved Successfully");
    setStatusMessage("Team members and role permissions have been updated.");
    setShowStatus(true);
    setActiveModal(null);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All Roles" || member.role === selectedRole;
    const matchesStatus = selectedStatus === "All Statuses" || 
                          (selectedStatus === "Active" && member.status === "Active") ||
                          (selectedStatus === "Pending" && member.status === "Pending Invite") ||
                          (selectedStatus === "Inactive" && member.status === "Inactive");
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * parseInt(rowsPerPage),
    currentPage * parseInt(rowsPerPage)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Team Members & Permissions</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium mt-1">Manage access, roles, and workspace members</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Members", value: "14", color: "bg-purple-600" },
          { icon: ShieldCheck, label: "Admins", value: "2", color: "bg-blue-400" },
          { icon: Users, label: "Managers", value: "4", color: "bg-emerald-400" },
          { icon: Mail, label: "Pending Invites", value: "2", color: "bg-slate-100 dark:bg-white/10 dark:bg-white dark:bg-[#150a2e]/10", textColor: "text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-5 flex items-center justify-between group hover:border-purple-100 transition-all hover:shadow-xl hover:shadow-slate-900/[0.02]">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", stat.color, stat.textColor)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 tracking-tight">{stat.label}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">{stat.value}</p>
              </div>
            </div>
            <div className={cn("px-2 py-1 rounded-lg text-[10px] font-black", stat.color === "bg-slate-100 dark:bg-white/10 dark:bg-white dark:bg-[#150a2e]/10" ? "bg-slate-50 dark:bg-white/5 dark:bg-white dark:bg-[#150a2e]/5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" : stat.color + "/10 " + (stat.textColor || stat.color.replace('bg-', 'text-')))}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Table Section */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setActiveModal('invite')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              Invite Member
            </button>
            <button 
              onClick={() => setActiveModal('create-role')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#150a2e] text-slate-900 dark:text-white font-bold text-sm tracking-tight hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-white/5 dark:hover:bg-white dark:bg-[#150a2e]/5 dark:bg-white dark:bg-[#150a2e]/5 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
              Create New Role
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#150a2e] text-slate-600 dark:text-slate-300 font-bold text-sm tracking-tight hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-white/5 dark:hover:bg-white dark:bg-[#150a2e]/5 dark:bg-white dark:bg-[#150a2e]/5 transition-colors ml-auto">
              Export Members
            </button>
          </div>

          <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm relative z-20">
            {/* Table Filters */}
            <div className="p-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search members..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-purple-200 focus:ring-4 focus:ring-purple-600/5 transition-all text-sm font-medium focus:bg-white dark:focus:bg-[#150a2e]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <CustomDropdown 
                  options={["All Roles", "Owner", "Admin", "Manager", "Support"]}
                  value={selectedRole}
                  onChange={setSelectedRole}
                  icon={Users}
                />
                <CustomDropdown 
                  options={["All Statuses", "Active", "Pending", "Inactive"]}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  icon={ListFilter}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5 dark:bg-white dark:bg-[#150a2e]/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-50">Member</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-50 text-center">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-50 text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-50 text-center">Last Active</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-gray-50 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-white/5 dark:hover:bg-white dark:bg-[#150a2e]/5 dark:bg-white dark:bg-[#150a2e]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <NextImage src={member.avatar} width={40} height={40} className="w-10 h-10 rounded-full object-cover" alt={member.name} />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{member.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 tracking-tight">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight",
                          member.role === 'Owner' ? "bg-purple-600 text-white" :
                          member.role === 'Admin' ? "bg-blue-50 text-blue-600" :
                          member.role === 'Manager' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 dark:bg-white/10 dark:bg-white dark:bg-[#150a2e]/10 text-slate-600 dark:text-slate-300"
                        )}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            member.status === 'Active' ? "bg-emerald-500 animate-pulse" :
                            member.status === 'Pending Invite' ? "bg-amber-400" : "bg-slate-300"
                          )} />
                          <span className={cn(
                            "text-[10px] font-bold",
                            member.status === 'Active' ? "text-emerald-600" :
                            member.status === 'Pending Invite' ? "text-amber-600" : "text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500"
                          )}>
                            {member.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">{member.lastActive}</span>
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <button 
                          onClick={() => setOpenActionsId(openActionsId === member.id ? null : member.id)}
                          className="p-2 hover:bg-white dark:bg-[#150a2e] hover:shadow-sm rounded-xl transition-all"
                        >
                          <MoreHorizontal className="w-5 h-5 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                        </button>
                        {openActionsId === member.id && (
                          <div className="absolute right-6 top-16 w-48 bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {[
                              { label: 'Change Role', icon: Users, color: 'text-slate-600 dark:text-slate-300', action: () => setActiveModal('invite') },
                              { label: 'Edit Member', icon: ShieldCheck, color: 'text-slate-600 dark:text-slate-300', action: () => setActiveModal('edit-member') },
                              { label: 'Deactivate', icon: Power, color: 'text-slate-600 dark:text-slate-300', action: () => {
                                setStatusType("success");
                                setStatusTitle("Member Deactivated");
                                setStatusMessage("The team member's access has been suspended.");
                                setShowStatus(true);
                              } },
                              { label: 'Remove', icon: Trash2, color: 'text-red-500', action: () => {
                                setStatusType("error");
                                setStatusTitle("Member Removed");
                                setStatusMessage("The team member has been permanently removed from the workspace.");
                                setShowStatus(true);
                              } },
                            ].map((item, i) => (
                              <button 
                                key={i}
                                onClick={() => {
                                  item.action?.();
                                  setOpenActionsId(null);
                                }}
                                className={cn(
                                  "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-white/5 dark:hover:bg-white dark:bg-[#150a2e]/5 dark:bg-white dark:bg-[#150a2e]/5 transition-colors",
                                  item.color
                                )}
                              >
                                <item.icon className="w-4 h-4 opacity-50" />
                                {member.status === 'Pending Invite' && item.label === 'Deactivate' ? 'Revoke Invite' : item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-50 bg-slate-50 dark:bg-white/5 dark:bg-white dark:bg-[#150a2e]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Rows per page:</span>
                <div className="w-20">
                  <CustomDropdown 
                    options={["10", "20", "50"]}
                    value={rowsPerPage}
                    onChange={setRowsPerPage}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {filteredMembers.length > 0 ? (currentPage - 1) * parseInt(rowsPerPage) + 1 : 0}-{Math.min(currentPage * parseInt(rowsPerPage), filteredMembers.length)} of {filteredMembers.length}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      "p-1.5 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-[#150a2e] transition-all shadow-sm",
                      currentPage === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-white/5 dark:hover:bg-white dark:bg-[#150a2e]/5 dark:bg-white dark:bg-[#150a2e]/5 hover:border-purple-200"
                    )}
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * parseInt(rowsPerPage) >= filteredMembers.length}
                    className={cn(
                      "p-1.5 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-[#150a2e] transition-all shadow-sm",
                      currentPage * parseInt(rowsPerPage) >= filteredMembers.length ? "text-slate-300 cursor-not-allowed" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 dark:bg-white/5 dark:hover:bg-white dark:bg-[#150a2e]/5 dark:bg-white dark:bg-[#150a2e]/5 hover:border-purple-200"
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Roles & Permissions Card */}
          <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Roles & Permissions</h3>
            <div className="space-y-4">
              {[
                { label: 'Owner', active: true },
                { label: 'Admin', active: true },
                { label: 'Manager', active: true },
                { label: 'Support', active: true }
              ].map((role, i) => (
                <div key={i} className="flex items-center justify-between py-2 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-purple-600 transition-colors" />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:text-white">{role.label}</span>
                  </div>
                  <CheckCircle2 className={cn("w-4 h-4", role.active ? "text-emerald-500" : "text-slate-200")} />
                </div>
              ))}
            </div>
            <div className="pt-6 mt-6 border-t border-gray-50 flex flex-col gap-3">
              <button 
                onClick={() => setActiveModal('create-role')}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-50 text-xs font-black text-purple-600 hover:bg-purple-100 uppercase tracking-widest transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Role
              </button>
              <button className="w-full py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 uppercase tracking-widest underline underline-offset-4 decoration-slate-200 transition-colors">
                Manage Roles
              </button>
            </div>
          </div>

          {/* Invitations & Activity Card */}
          <div className="bg-white dark:bg-[#150a2e] rounded-2xl border border-gray-100 dark:border-white/10 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Invitations & Activities</h3>
              <button className="text-[10px] font-black text-purple-600 hover:underline uppercase tracking-widest mt-2 block">View All Activity</button>
            </div>

            <div className="space-y-8">
              {/* Pending Invitations */}
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Pending Invitations</p>
                <div className="space-y-4">
                  {[
                    { email: 'ben@example.com', resend: true },
                    { email: 'tanya@example.com', resend: false }
                  ].map((invite, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 dark:bg-white dark:bg-[#150a2e]/50 border border-slate-50 dark:border-white/5 group hover:border-gray-100 dark:border-white/10 transition-all">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{invite.email}</span>
                      {invite.resend && (
                        <button className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tight hover:bg-blue-100 transition-colors">
                          Resend
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Recent Activity</p>
                <div className="space-y-6">
                  {[
                    { user: 'Sarah Johnson', action: 'invited ben@example.com', time: '59 min ago', avatar: 'https://res.cloudinary.com/weburea/image/upload/v1783571687/11%201.png' },
                    { user: 'Admin User', action: 'logged in', time: '132.103.1.8', time_label: '4 hours ago', avatar: 'https://res.cloudinary.com/weburea/image/upload/v1783571700/9%201.png' },
                    { user: 'Michael Brown', action: 'reset account password', time: '172.24.144.143', time_label: '1223.4.48.143', avatar: 'https://res.cloudinary.com/weburea/image/upload/v1783571691/24%201.png' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <NextImage src={activity.avatar} width={24} height={24} className="w-6 h-6 rounded-full object-cover" alt={activity.user} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {activity.user} <span className="font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">{activity.action}</span>
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{activity.time_label || activity.time}</p>
                          {activity.time_label && <p className="text-[10px] font-medium text-slate-300 tracking-tighter">{activity.time}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#150a2e] border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-xl shadow-slate-900/[0.02]">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4" />
          Saved
        </div>
        <button 
          onClick={() => setActiveModal('save-confirm')}
          className="px-10 py-3 rounded-xl bg-purple-600 text-white font-black text-sm tracking-tight hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/30"
        >
          Save Changes
        </button>
      </div>

      <TeamModals 
        type={activeModal} 
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        onSave={handleSave}
      />

      <StatusModal 
        isOpen={showStatus}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
        onClose={() => setShowStatus(false)}
      />
    </div>
  )
}
