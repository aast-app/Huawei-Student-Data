import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download, Search, ArrowUpDown, ChevronLeft, ChevronRight, LogOut, Database } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import NetworkBackground from '../components/NetworkBackground';
import CustomSelect from '../components/CustomSelect';
import Loader from '../components/Loader';

function Admin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  useEffect(() => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    if (!adminPassword) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    if (adminPassword) {
      fetchStudents();
    }
  }, [page, searchId, searchName, filterBranch, sortOrder, navigate]);

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
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">{t('admin_title')}</h1>
              <p className="text-gray-500 font-medium">{t('showing_page')} {page} {t('of')} {totalPages} <span className="text-[#3b82f6] font-bold">{t('total_students', { total: totalStudents })}</span></p>
            </div>
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <button 
                onClick={handleExportCSV}
                className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 px-6 rounded-[1rem] shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Download size={20} /> {t('export_csv')}
              </button>
              <button 
                onClick={() => { sessionStorage.removeItem('adminPassword'); navigate('/'); }}
                className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-[1rem] shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <LogOut size={20} /> {t('logout')}
              </button>
            </div>
          </div>

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
                <label className="user-label !start-12">{t('search_id')}</label>
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
                <label className="user-label !start-12">{t('search_name')}</label>
              </div>
            </div>

            <div className="w-full md:w-64">
              <CustomSelect 
                label={t('branch')}
                value={filterBranch}
                onChange={(val) => { setFilterBranch(val); setPage(1); }}
                options={[
                  { value: '', label: t('all_branches') },
                  { value: 'AASTMT-ALex', label: 'AASTMT-ALex' },
                  { value: 'AASTMT-Miami', label: 'AASTMT-Miami' },
                  { value: 'AASTMT-Dokki', label: 'AASTMT-Dokki' },
                  { value: 'AASTMT-Fouad', label: 'AASTMT-Fouad' },
                  { value: 'AASTMT-Alamein', label: 'AASTMT-Alamein' }
                ]}
              />
            </div>

            <button 
              onClick={toggleSort}
              className="w-full md:w-auto flex justify-center items-center gap-2 bg-gray-50 hover:bg-[#3b82f6] text-gray-600 hover:text-white font-bold py-[0.85rem] px-6 rounded-[1rem] border border-gray-200 hover:border-[#3b82f6] transition-colors duration-300"
            >
              <ArrowUpDown size={18} />
              {sortOrder === 'desc' ? t('sort_newest') : t('sort_oldest')}
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_name')}</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_id')}</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_email')}</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_phone')}</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_branch')}</th>
                    <th className="px-6 py-4 text-start text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_date')}</th>
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
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">{t('no_students')}</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student._id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[#e61d2b] font-semibold">{student.huaweiId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.phoneNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                            student.branch === 'AASTMT-ALex' ? 'bg-[#3b82f6]/10 text-[#1d4ed8]' : 'bg-[#10b981]/10 text-[#047857]'
                          }`}>
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
                <div className="px-6 py-12 text-center text-gray-500 font-medium">{t('no_students')}</div>
              ) : (
                students.map((student) => (
                  <div key={student._id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-bold text-gray-900 text-lg break-words">{student.name}</div>
                      <span className={`px-2.5 py-1 inline-flex text-[0.65rem] sm:text-xs font-bold rounded-full shrink-0 ${
                        student.branch === 'AASTMT-ALex' ? 'bg-[#3b82f6]/10 text-[#1d4ed8]' : 'bg-[#10b981]/10 text-[#047857]'
                      }`}>
                        {student.branch}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 w-16 shrink-0">{t('table_id')}:</span>
                        <span className="font-mono text-[#e61d2b] font-bold truncate">{student.huaweiId}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 w-16 shrink-0">{t('table_email')}:</span>
                        <span className="text-gray-700 font-medium break-all">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 w-16 shrink-0">{t('table_phone')}:</span>
                        <span className="text-gray-700 font-medium">{student.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[0.7rem] mt-2 text-gray-400 font-medium">
                        <span>{t('table_date')}: {new Date(student.createdAt).toLocaleDateString()} {new Date(student.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
                  {t('showing_page')} {page} {t('of')} {totalPages}
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
      </div>
    </div>
  );
}

export default Admin;
