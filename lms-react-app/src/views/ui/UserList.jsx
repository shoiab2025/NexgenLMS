import React, { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faBan,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserList = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedRoleTab, setSelectedRoleTab] = useState("all"); // NEW
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: "",
    isAdmin: "",
    isActive: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/");
        console.log("the response", response)
        setUsersData(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Error fetching courses. Please try again.";
        toast.error(errorMessage);
      }
    };

    fetchUserData();
  }, []);

  const blockUser = async (user) => {
    try {
      const updatedStatus = !user.isActive;
      await axios.put(`/api/users/update-userStatus/${user._id}`, { isActive: updatedStatus });
      setUsersData((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: updatedStatus } : u
        )
      );
      toast.success(`User has been ${updatedStatus ? "unblocked" : "blocked"} successfully.`);
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error updating user status. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    return usersData.reverse().filter((user) => {
      const matchesFilters =
        (!filters.username ||
          user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
        (!filters.email ||
          user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.role ||
          user.role.toLowerCase().includes(filters.role.toLowerCase())) &&
        (filters.isActive === "false" ? !user.isActive : user.isActive);
 
      const matchesTab =
        selectedRoleTab === "all" || user.role.toLowerCase() === selectedRoleTab || (selectedRoleTab === 'admin' ? user?.isAdmin : false);


      return matchesFilters && matchesTab;
    });
  }, [usersData, filters, selectedRoleTab]);

  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage]);

  const editUser = (user) => {
    window.location.href = `/instructor/users/edit/${user._id}`;
  };
  const deleteUser = (user) => console.log("Delete user:", user);

  const toggleBlockUser = (user) => {
    setUsersData((prev) =>
      prev.map((u) =>
        u._id === user._id ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const viewLeaderboard = (user) => {
    console.log("View leaderboard for:", user);
  };

  // 💡 Role tabs
  const roleTabs = ["all", "student", "teacher", "admin", "coordinator"];

  return (
    <div className="user-list-user">
      <h2 className="list-heading-user h4">Users List</h2>

      {/* Tabs */}
      <div className="tabs-user mb-3">
        {roleTabs.map((role) => (
          <button
            key={role}
            className={`tab-button-user ${
              selectedRoleTab === role ? "active-tab-user" : ""
            }`}
            onClick={() => {
              setSelectedRoleTab(role);
              setCurrentPage(1);
            }}
          >
            {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-container-user">
        <table className="user-table-user">
          <thead className="table-header-user">
            <tr>
              {["Username", "Email", "Role"].map((header, idx) => (
                <th key={idx} className="header-cell-user text-dark">
                  {header}
                  <input
                    type="text"
                    name={header.toLowerCase()}
                    value={filters[header.toLowerCase()]}
                    onChange={handleFilterChange}
                    placeholder={`Filter by ${header}`}
                    className="filter-input-user"
                  />
                </th>
              ))}
              <th className="header-cell-user">
                Admin
                <select
                  name="isAdmin"
                  value={filters.isAdmin}
                  onChange={handleFilterChange}
                  className="filter-select-user"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </th>
              <th className="header-cell-user">
                Status
                <select
                  name="isActive"
                  value={filters.isActive}
                  onChange={handleFilterChange}
                  className="filter-select-user"
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Blocked</option>
                </select>
              </th>
              <th className="header-cell-user">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body-user">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr key={user._id} className="row-user">
                  <td className="cell-user text-capitalize">{user.username}</td>
                  <td className="cell-user">{user.email}</td>
                  <td className="cell-user">
                    <span className={`role-badge-user role-${user.role}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="cell-user">
                    <div
                      className={`admin-indicator-user ${
                        user.isAdmin ? "is-admin" : "not-admin"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </div>
                  </td>
                  <td className="cell-user">
                    <span
                      className={`status-badge-user ${
                        user.isActive ? "active" : "blocked"
                      }`}
                    >
                      {user.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="cell-user actions-cell-user text-nowrap">
                    <button
                      onClick={() => editUser(user)}
                      className="action-button-user edit-user"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => blockUser(user)}
                      className={`action-button-user block-user ${
                        user.isActive ? "block" : "unblock"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={user.isActive ? faBan : faTrophy}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="row-user empty-row-user">
                <td className="cell-user empty-cell-user" colSpan="6">
                  No user data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="pagination-user my-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="pagination-button-user"
          >
            Previous
          </button>
          <span className="pagination-info-user">
            {currentPage} / {pageCount}
          </span>
          <button
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="pagination-button-user"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
