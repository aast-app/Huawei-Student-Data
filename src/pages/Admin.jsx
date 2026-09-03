import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, Search, ArrowUpDown, ChevronLeft, ChevronRight, LogOut, Database, Users, BookOpen, ExternalLink, Key, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import * as LucideIcons from 'lucide-react';
import NetworkBackground from '../components/NetworkBackground';
import CustomSelect from '../components/CustomSelect';
import Loader from '../components/Loader';

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Delete User Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSearchQuery, setDeleteSearchQuery] = useState('');
  const [deleteSearchResults, setDeleteSearchResults] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (deleteSearchQuery.length >= 3) {
      const delayDebounceFn = setTimeout(() => {
        searchForDelete(deleteSearchQuery);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setDeleteSearchResults([]);
    }
  }, [deleteSearchQuery]);

  const searchForDelete = async (query) => {
    try {
      const password = sessionStorage.getItem('adminPassword');
      const [resId, resName, resEmail] = await Promise.all([
        axios.get(`/api/students?searchId=${query}&limit=5`, { headers: { 'x-admin-password': password } }),
        axios.get(`/api/students?searchName=${query}&limit=5`, { headers: { 'x-admin-password': password } }),
        axios.get(`/api/students?searchEmail=${query}&limit=5`, { headers: { 'x-admin-password': password } })
      ]);
      const combined = [...resId.data.students, ...resName.data.students, ...resEmail.data.students];
      const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
      setDeleteSearchResults(unique);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      setIsDeleting(true);
      const password = sessionStorage.getItem('adminPassword');
      await axios.delete(`/api/students/${id}`, {
        headers: { 'x-admin-password': password }
      });
      toast.success("User deleted successfully");
      setDeleteSearchResults(prev => prev.filter(u => u._id !== id));
      fetchStudents();
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  const getBranchBadgeColor = (branchName) => {
    switch (branchName) {
      case 'AASTMT-Alex (AbuQir)': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'AASTMT-Miami': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'AASTMT-Dokki': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'AASTMT-Fouad': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'AASTMT-Alamein': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'AASTMT-Smart Village': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'AASTMT-Aswan': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'AASTMT-ENG (Sheraton)': return 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200';
      case 'AAST-PORTSAID': return 'bg-lime-100 text-lime-700 border-lime-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const [branchesData, setBranchesData] = useState([]);
  const [selectedClassesBranch, setSelectedClassesBranch] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    if (!adminPassword) {
      navigate('/');
    } else {
      fetchBranches();
    }
  }, [navigate]);

  useEffect(() => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    if (adminPassword) {
      fetchStudents();
    }
  }, [page, searchId, searchName, filterBranch, sortOrder, navigate]);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/students/branches');
      setBranchesData(response.data);
      if (response.data.length > 0) {
        setSelectedClassesBranch(response.data[0].name);
      }
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  const saveCourseLink = async (branchName, courseId) => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    const toastId = toast.loading('Saving link...');
    try {
      const response = await axios.put(`/api/students/branches/${branchName}/courses/${courseId}`, 
        { url: newUrl }, 
        { headers: { 'x-admin-password': adminPassword } }
      );
      setBranchesData(response.data.branches);
      setEditingLink(null);
      toast.success('Link saved!', { id: toastId });
    } catch (err) {
      toast.error('Failed to save link', { id: toastId });
    }
  };

  const fetchStudents = async () => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    setLoading(true);
    try {
      const response = await axios.get('/api/students', {
        headers: { 'x-admin-password': adminPassword },
        params: {
          page,
          limit: 50,
          searchId,
          searchName,
          branch: filterBranch,
          sortOrder: sortOrder
        }
      });
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setTotalStudents(response.data.totalStudents);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        sessionStorage.removeItem('adminPassword');
        navigate('/');
      } else {
        toast.error('Failed to fetch students');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    const toastId = toast.loading('Exporting CSV...');
    try {
      const response = await axios.get('/api/students', {
        headers: { 'x-admin-password': adminPassword },
        params: {
          searchId,
          searchName,
          branch: filterBranch,
          sortOrder: sortOrder,
          exportAll: 'true'
        }
      });
      
      const allStudents = Array.isArray(response.data) ? response.data : response.data.students;
      
      const headers = ["Name", "Huawei ID", "Email", "Phone", "Branch", "Registration Date"];
      let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

      allStudents.forEach(student => {
        const date = new Date(student.createdAt).toLocaleString();
        const row = `"${student.name}","${student.huaweiId}","${student.email}","${student.phoneNumber}","${student.branch}","${date}"`;
        csvContent += row + "\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "huawei_students_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV Downloaded!', { id: toastId });
    } catch (error) {
      toast.error('Failed to export CSV', { id: toastId });
    }
  };

  const handleBackupDB = async () => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    const toastId = toast.loading('Creating Backup...');
    try {
      const response = await axios.get('/api/students/backup', {
        headers: { 'x-admin-password': adminPassword }
      });
      
      const backupData = JSON.stringify(response.data, null, 2);
      const blob = new Blob([backupData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      const dateString = new Date().toISOString().split('T')[0];
      link.download = `mongodb_backup_${dateString}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Database Backup Downloaded!', { id: toastId });
    } catch (error) {
      toast.error('Failed to create backup', { id: toastId });
      console.error(error);
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setPage(1);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0f172a]">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <NetworkBackground />
      </div>

      {/* Scrollable Content Layer */}
      <div className="relative z-10 h-full overflow-y-auto pb-32 px-4 lg:px-10 pt-10 lg:pt-16 scrollbar-hide">
        <div className="max-w-[90rem] mx-auto glass-panel p-6 lg:p-10">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">Admin Dashboard</h1>
              <p className="text-gray-500 font-medium">Showing page {page} of {totalPages} <span className="text-[#3b82f6] font-bold">({totalStudents} total students)</span></p>
            </div>
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-[1rem] shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Trash2 size={20} /> Delete User
              </button>
              <button 
                onClick={handleBackupDB}
                className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 px-6 rounded-[1rem] shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Database size={20} /> Backup DB
              </button>
              <button 
                onClick={handleExportCSV}
                className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 px-6 rounded-[1rem] shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Download size={20} /> Export CSV
              </button>
              <button 
                onClick={() => { sessionStorage.removeItem('adminPassword'); navigate('/'); }}
                className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-[1rem] shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>

          {/* Tabs UI */}
          <div className="flex gap-2 mb-8 bg-gray-100/50 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('users')}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors z-10 ${
                activeTab === 'users' ? 'text-[#3b82f6]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {activeTab === 'users' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Users size={18} />
              Users
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors z-10 ${
                activeTab === 'classes' ? 'text-[#3b82f6]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {activeTab === 'classes' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <BookOpen size={18} />
              Classes
            </button>
          </div>

          {activeTab === 'users' && (
            <div className="space-y-8">
              {/* Filters Toolbar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
            
            <div className="w-full md:flex-1">
              <div className="input-group">
                <input 
                  type="text" 
                  className="input !ps-12" 
                  required
                  value={searchId}
                  onChange={(e) => { setSearchId(e.target.value); setPage(1); }}
                />
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <label className="user-label !start-12">Search by ID...</label>
              </div>
            </div>

            <div className="w-full md:flex-1">
              <div className="input-group">
                <input 
                  type="text" 
                  className="input !ps-12" 
                  required
                  value={searchName}
                  onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
                />
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                <label className="user-label !start-12">Search by Name...</label>
              </div>
            </div>

            <div className="w-full md:w-64">
              <CustomSelect 
                label="Branch"
                value={filterBranch}
                onChange={(val) => { setFilterBranch(val); setPage(1); }}
                options={[
                  { value: '', label: 'All Branches' },
                  { value: 'AASTMT-Alex (AbuQir)', label: 'AASTMT-Alex (AbuQir)' },
                  { value: 'AASTMT-Miami', label: 'AASTMT-Miami' },
                  { value: 'AASTMT-Dokki', label: 'AASTMT-Dokki' },
                  { value: 'AASTMT-Fouad', label: 'AASTMT-Fouad' },
                  { value: 'AASTMT-Alamein', label: 'AASTMT-Alamein' },
                  { value: 'AASTMT-Smart Village', label: 'AASTMT-Smart Village' },
                  { value: 'AASTMT-Aswan', label: 'AASTMT-Aswan' },
                  { value: 'AASTMT-ENG (Sheraton)', label: 'AASTMT-ENG (Sheraton)' },
                  { value: 'AAST-PORTSAID', label: 'AAST-PORTSAID' }
                ]}
              />
            </div>

            <button 
              onClick={toggleSort}
              className="w-full md:w-auto flex justify-center items-center gap-2 bg-gray-50 hover:bg-[#3b82f6] text-gray-600 hover:text-white font-bold py-[0.85rem] px-6 rounded-[1rem] border border-gray-200 hover:border-[#3b82f6] transition-colors duration-300"
            >
              <ArrowUpDown size={18} />
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">HUAWEI ID</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">EMAIL</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">PHONE</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">BRANCH</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">REGISTRATION DATE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 relative">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">No students found matching your criteria.</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student._id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#e61d2b] font-semibold">{student.huaweiId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.phoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${getBranchBadgeColor(student.branch)}`}>
                            {student.branch}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {new Date(student.createdAt).toLocaleDateString()} <span className="text-gray-400 ms-1">{new Date(student.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {loading ? (
                <div className="py-20 flex justify-center"><Loader /></div>
              ) : students.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500 font-medium">No students found matching your criteria.</div>
              ) : (
                students.map((student) => (
                  <div key={student._id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-bold text-gray-900 text-lg break-words">{student.name}</div>
                      <span className={`px-2.5 py-1 inline-flex text-[0.65rem] sm:text-xs font-bold rounded-full shrink-0 border ${getBranchBadgeColor(student.branch)}`}>
                        {student.branch}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 w-16 shrink-0">HUAWEI ID:</span>
                        <span className="font-mono text-[#e61d2b] font-bold truncate">{student.huaweiId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 w-16 shrink-0">EMAIL:</span>
                        <span className="text-gray-700 font-medium break-all">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 w-16 shrink-0">PHONE:</span>
                        <span className="text-gray-700 font-medium">{student.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[0.7rem] mt-2 text-gray-400 font-medium">
                        <span>REGISTRATION DATE: {new Date(student.createdAt).toLocaleDateString()} {new Date(student.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 text-sm font-bold text-[#3b82f6] hover:text-[#1d4ed8] disabled:text-gray-400 transition-colors"
                >
                  <ChevronLeft size={18} /> Previous Page
                </button>
                <span className="text-sm font-semibold text-gray-600 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-200">
                  Showing page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 text-sm font-bold text-[#3b82f6] hover:text-[#1d4ed8] disabled:text-gray-400 transition-colors"
                >
                  Next Page <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">Manage Course Links</h2>
                <div className="w-full sm:w-72">
                  <CustomSelect 
                    label="Select Branch"
                    value={selectedClassesBranch}
                    onChange={(val) => setSelectedClassesBranch(val)}
                    options={branchesData.map(b => ({ value: b.name, label: b.name }))}
                  />
                </div>
              </div>

              {selectedClassesBranch && branchesData.find(b => b.name === selectedClassesBranch) && (() => {
                const branch = branchesData.find(b => b.name === selectedClassesBranch);
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {branch.courses.map((course) => {
                      const Icon = LucideIcons[course.icon] || LucideIcons.BookOpen;
                      const currentUrl = course.url;
                      const isEditing = editingLink?.branchName === branch.name && editingLink?.shortName === course.shortName;

                      const enhancedBg = course.bg.replace('50', '100');
                      const ringColor = course.bg.replace('bg-', 'ring-').replace('50', '200');

                      return (
                      <div key={course._id} className="flex flex-col p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 min-h-[14rem]">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`p-4 rounded-xl ${enhancedBg} ${course.color} ring-1 ring-inset ${ringColor}`}>
                            <Icon size={28} />
                          </div>
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <button 
                                  onClick={() => saveCourseLink(branch.name, course._id)}
                                  className="p-2 text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 transition-colors"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingLink(null)}
                                  className="p-2 text-gray-500 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => {
                                    setEditingLink({ branchName: branch.name, shortName: course.shortName });
                                    setNewUrl(currentUrl || '');
                                  }}
                                  className="px-3 py-2 text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors text-xs font-bold"
                                >
                                  Edit Link
                                </button>
                                {currentUrl ? (
                                  <a 
                                    href={currentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-[#3b82f6] bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 transition-colors"
                                  >
                                    <ExternalLink size={16} />
                                  </a>
                                ) : (
                                  <div className="p-2 text-gray-300 bg-gray-50 rounded-lg border border-gray-200 cursor-not-allowed opacity-60" title="Link not available">
                                    <ExternalLink size={16} />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        {isEditing ? (
                          <input 
                            type="text"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="Enter course URL..."
                            className="w-full text-sm p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            autoFocus
                          />
                        ) : null}
                        
                        <h4 className="text-xl font-black text-gray-900 mt-auto">{course.shortName}</h4>
                      </div>
                    )})}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trash2 className="text-red-500" /> Delete User
              </h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Search User by ID, Name, or Email</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Type at least 3 characters..."
                    value={deleteSearchQuery}
                    onChange={(e) => setDeleteSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                  />
                </div>
              </div>

              {deleteSearchResults.length > 0 ? (
                <div className="space-y-3">
                  {deleteSearchResults.map(user => (
                    <div key={user._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-100 rounded-xl hover:bg-red-50/50 transition-colors gap-4">
                      <div>
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.huaweiId} • {user.branch}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={isDeleting}
                        className="w-full sm:w-auto px-4 py-2 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  ))}
                </div>
              ) : deleteSearchQuery.length >= 3 ? (
                <div className="text-center py-8 text-gray-500">No users found matching "{deleteSearchQuery}"</div>
              ) : (
                <div className="text-center py-8 text-gray-400">Start typing to search for a user</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Admin;
