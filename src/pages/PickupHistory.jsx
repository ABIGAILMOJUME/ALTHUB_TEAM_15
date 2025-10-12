import React, { useState, useEffect } from 'react';
import Sidebar from '../components/navigation';
import apiFetch from '../lib/api';
import { Toaster, toast } from 'sonner';
import { Calendar, MapPin, Package, Repeat, Truck, CheckCircle, Clock, AlertCircle, Loader2, History } from 'lucide-react';

const PickupHistory = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPickupHistory = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('https://binit-1fpv.onrender.com/pickup');
        if (response.ok) {
          const data = await response.json();
          setPickups(Array.isArray(data) ? data : []);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch pickup history.');
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupHistory();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 pt-20 p-4 md:p-8 overflow-y-auto w-full h-screen">
        {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 dark:from-gray-100 dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Pickup History
              </h1>
            </div>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 ml-14">
              Track all your past and scheduled waste collection pickups
            </p>
          </div>
        {/* Summary Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pickups.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pickups.filter(p => p.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pickups</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pickups.length}</p>
                </div>
              </div>
            </div>
          </div>
        {/* Pickup History Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b dark:border-gray-600 font-medium bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4 text-gray-800 dark:text-gray-100">Scheduled Date</th>
                  <th scope="col" className="px-6 py-4 text-gray-800 dark:text-gray-100">Location</th>
                  <th scope="col" className="px-6 py-4 text-gray-800 dark:text-gray-100">Waste Type</th>
                  <th scope="col" className="px-6 py-4 text-gray-800 dark:text-gray-100">Frequency</th>
                  <th scope="col" className="px-6 py-4 text-gray-800 dark:text-gray-100">Service Provider</th>
                  <th scope="col" className="px-6 py-4 text-gray-800 dark:text-gray-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Loading pickups...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-red-500">
                      Error: {error}
                    </td>
                  </tr>
                ) : pickups.length > 0 ? (
                  pickups.map((pickup) => (
                    <tr key={pickup.id} className="border-b dark:border-gray-700 transition duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="whitespace-nowrap px-6 py-4 text-gray-800 dark:text-gray-100">{formatDate(pickup.scheduled_date)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-800 dark:text-gray-100">{pickup.location}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-800 dark:text-gray-100">{pickup.waste_type}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-800 dark:text-gray-100">{pickup.frequency}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-800 dark:text-gray-100">{pickup.service_provider}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`capitalize px-3 py-1.5 rounded-full text-xs font-medium ${
                            pickup.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                              : pickup.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                          }`}
                        >
                          {pickup.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No pickup history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default PickupHistory;
