import React, { useState, useMemo } from "react";
import {
  Eye,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  useGetAllNoticesQuery,
  useUpdateNoticeStatusMutation,
} from "../../features/api/noticesApi";
import { FaPlug, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LuFilePen } from "react-icons/lu";

const EmployeeDatabase = () => {
  const { data, isLoading ,refetch } = useGetAllNoticesQuery();
  const [updateNoticeStatus, { isLoading: isUpdating }] =
    useUpdateNoticeStatusMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    department: "",
    searchTerm: "",
    status: "",
    date: "",
  });
  const [selectedNotices, setSelectedNotices] = useState([]);
  const [editId, setEditId] = useState(null);

  const itemsPerPage = 8;

  const notices = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((notice) => ({
      id: notice._id,
      title: notice.noticeTitle,
      noticeType: notice.noticeType,
      department:
        notice.targetType === "individual"
          ? "Individual"
          : notice.department || "All Department",
      publishedOn: new Date(notice.publishDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status:
        notice.status === "published"
          ? "Published"
          : notice.status === "draft"
          ? "Draft"
          : "Unpublished",
      enabled: notice.status === "published",
      rawStatus: notice.status,
    }));
  }, [data]);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchesDepartment =
        !filters.department || notice.department === filters.department;

      const matchesSearch =
        !filters.searchTerm ||
        notice.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        notice.department
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesStatus = !filters.status || notice.status === filters.status;

      const matchesDate = !filters.date || notice.publishedOn === filters.date;

      return matchesDepartment && matchesSearch && matchesStatus && matchesDate;
    });
  }, [notices, filters]);

  // =============================================Calculate pagination=============================================
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // =====================Toggle notice status (published/draft)=====================
const toggleNotice = async (id, currentStatus) => {
  try {
    let newStatus = "published";

    if (currentStatus === "published") {
      newStatus = "unpublished";
    }

    await updateNoticeStatus({
      id,
      status: newStatus,
    }).unwrap();

    setEditId(null);
    refetch();
  } catch (error) {
    console.error("Failed to update notice status:", error);
  }
};


  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      department: "",
      searchTerm: "",
      status: "",
      date: "",
    });
  };

  const toggleSelectAll = () => {
    if (selectedNotices.length === currentNotices.length) {
      setSelectedNotices([]);
    } else {
      setSelectedNotices(currentNotices.map((n) => n.id));
    }
  };

  const toggleSelectNotice = (id) => {
    setSelectedNotices((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-emerald-100 text-emerald-700";
      case "Draft":
        return "bg-amber-100 text-amber-700";
      case "Unpublished":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor2 = (status) => {
    switch (status) {
      case "Published":
        return " text-emerald-700";
      case "Draft":
        return " text-black";
      case "Unpublished":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      "All Department": "text-blue-600",
      Finance: "text-teal-600",
      "Sales Team": "text-orange-600",
      "Web Team": "text-purple-600",
      "Database Team": "text-indigo-600",
      Admin: "text-pink-600",
      Individual: "text-cyan-600",
      HR: "text-red-600",
    };
    return colors[dept] || "text-gray-600";
  };

  const uniqueDepartments = [...new Set(notices.map((n) => n.department))];
  const uniqueStatuses = [...new Set(notices.map((n) => n.status))];

  const activeCount = notices.filter((n) => n.status === "Published").length;
  const draftCount = notices.filter((n) => n.status === "Draft").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading notices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto mt-16 ">
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-gray-900">
              Notice Management
            </h1>
            <div className="flex gap-4 text-sm">
              <span className="font-medium text-blue-600">
                Active Notices: {activeCount}
              </span>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-orange-500">
                Draft Notice: {String(draftCount).padStart(2, "0")}
              </span>
            </div>
          </div>
           {/*======================== Action Buttons ======================== */}
          <div className="flex gap-3 mb-6">
            <Link to={'/notice-board'} className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
              <FaPlus/> Create Notice
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 text-orange-500 transition-colors border border-orange-500 rounded-md hover:bg-orange-50">
              <LuFilePen size={20} /> <span> All Draft Notice</span>
            </button>
          </div>
        </div>

        {/*================================ Filters================================ */}
        <div className="p-4 mb-4 ">
          <div className="flex items-center justify-end gap-4">
            <span className="text-sm font-medium text-gray-600">
              Filter by:
            </span>

            <select
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Departments or individuals</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Employee Id or Name"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Published on (DD-MMM-YYYY)"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#3B82F6] border border-[#3B82F6] rounded-md hover:underline"
            >

              Reset Filters
            </button>
          </div>
        </div>

       
        <div className="mb-4 text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredNotices.length)}{" "}
          of {filteredNotices.length} notices
        </div>

      
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      currentNotices.length > 0 &&
                      selectedNotices.length === currentNotices.length
                    }
                    onChange={toggleSelectAll}
                    className="border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-700">
                  Title
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-700">
                  Notice Type
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-700">
                  Departments/Individual
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-700">
                  Published On
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-left text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentNotices.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No notices found matching your filters
                  </td>
                </tr>
              ) : (
                currentNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedNotices.includes(notice.id)}
                        onChange={() => toggleSelectNotice(notice.id)}
                        className="border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {notice.title}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">
                        {notice.noticeType}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className={`text-sm font-medium ${getDepartmentColor(
                          notice.department
                        )}`}
                      >
                        {notice.department}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">
                        {notice.publishedOn}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          notice.status
                        )}`}
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className="relative px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 transition-colors rounded hover:bg-gray-100">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1 transition-colors rounded hover:bg-gray-100"
                          onClick={() =>
                            setEditId(editId === notice.id ? null : notice.id)
                          }
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 transition-colors rounded hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* ======================== toggle button ==================== */}
                        {editId === notice.id && (
                          <div className="absolute z-30 px-4 py-2 bg-white rounded-md shadow-xl right-28 -bottom-8">
                            <div className="flex items-center ">
                              <span
                                className={`inline-flex px-3 py-1 text-xs font-medium  ${getStatusColor2(
                                  notice.status
                                )}`}
                              >
                                {notice.status}
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                    checked={notice.rawStatus === "published"}

                                  onChange={() =>
                                    toggleNotice(notice.id, notice.rawStatus)
                                  }
                                  disabled={isUpdating}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                              </label>
                            </div>
                          </div>
                        )}

                        {/* ======================== toggle button ==================== */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded ${
                      currentPage === page
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDatabase;
