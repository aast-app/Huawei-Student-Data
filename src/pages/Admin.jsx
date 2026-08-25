import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Download, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

function Admin() {
  const navigate = useNavigate();
  
  // Data States
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  
  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first

  const fetchStudents = useCallback(async () => {
    const pwd = sessionStorage.getItem('adminPassword');
    if (!pwd) {
      toast.error('Unauthorized');
      navigate('/');
      return;
    }
    setPassword(pwd);
    setLoading(true);

    try {
      const response = await axios.get('/api/students', {
        headers: { 'x-admin-password': pwd },
        params: {
          page,
          limit: 50,
          searchId,
          searchName,
          branch: filterBranch,
          sortOrder
        }
      });
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setTotalStudents(response.data.totalStudents);
    } catch (error) {
      toast.error('Invalid password or server error');
      sessionStorage.removeItem('adminPassword');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate, page, searchId, searchName, filterBranch, sortOrder]);

  // Fetch when any dependency changes
  useEffect(() => {
    // Small debounce for typing in search fields so we don't spam the server
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchStudents]);

  const handleExportCSV = async () => {
    try {
      const toastId = toast.loading('Generating CSV...');
      const response = await axios.get('/api/students', {
        headers: { 'x-admin-password': password },
        params: { exportAll: true } // Tells backend to ignore pagination and send everything
      });
      
      const allStudents = response.data;
      if (allStudents.length === 0) {
        toast.error('No data to export', { id: toastId });
        return;
      }
      
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Name,Huawei ID,Email,Phone,Branch,Registered At\n";
      
      allStudents.forEach(student => {
        const date = new Date(student.createdAt).toLocaleString();
        const row = `"${student.name}","${student.huaweiId}","${student.email}","${student.phoneNumber}","${student.branch}","${date}"`;
        csvContent += row + "\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "huawei_all_students.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV Downloaded!', { id: toastId });
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setPage(1); // reset to page 1 on sort change
  };

  if (loading && students.length === 0) {
    return <div className="flex min-h-screen items-center justify-center">Loading Data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Showing page {page} of {totalPages} ({totalStudents} total students)</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition font-medium"
            >
              <Download size={18} /> Export ALL to CSV
            </button>
            <button 
              onClick={() => { sessionStorage.removeItem('adminPassword'); navigate('/'); }}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded shadow transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center border border-gray-200">
          
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Huawei ID..." 
              value={searchId}
              onChange={(e) => { setSearchId(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name..." 
              value={searchName}
              onChange={(e) => { setSearchName(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="w-48">
            <select 
              value={filterBranch}
              onChange={(e) => { setFilterBranch(e.target.value); setPage(1); }}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            >
              <option value="">All Branches</option>
              <option value="AASTMT-ALex">AASTMT-ALex</option>
              <option value="AASTMT-Miami">AASTMT-Miami</option>
            </select>
          </div>

          <button 
            onClick={toggleSort}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300 transition"
          >
            <ArrowUpDown size={16} />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Huawei ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No students match your filters.</td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50">{student.huaweiId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {student.branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString()} {new Date(student.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Previous Page
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Next Page <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Admin;
