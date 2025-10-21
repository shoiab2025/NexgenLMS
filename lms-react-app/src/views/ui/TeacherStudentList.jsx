import React, { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faBan,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthcontext } from "../../contexts/Authcontext";

const UserList = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedRoleTab, setSelectedRoleTab] = useState("all");
  const { authUser } = useAuthcontext();
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
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses/");
        const courses = response.data.filter(
          (c) => c.created_by === authUser?.user?._id
        );

        const userMap = new Map();

        courses.forEach((course) => {
          (course.joinRequests || []).forEach((req) => {
            const user = req.user;
            if (!user) return;

            if (!userMap.has(user._id)) {
              userMap.set(user._id, {
                ...user,
                requestedCourses: [course.title],
              });
            } else {
              const existing = userMap.get(user._id);
              if (!existing.requestedCourses.includes(course.title)) {
                existing.requestedCourses.push(course.title);
              }
            }
          });
        });

        setUsersData(Array.from(userMap.values()));
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error(
          error.response?.data?.message ||
            "Error fetching courses. Please try again."
        );
      }
    };

    fetchCourses();
  }, [authUser]);

  const blockUser = async (user) => {
    try {
      const updatedStatus = !user.isActive;
      await axios.put(`/api/users/update-userStatus/${user._id}`, {
        isActive: updatedStatus,
      });
      setUsersData((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: updatedStatus } : u
        )
      );
      toast.success(
        `User has been ${updatedStatus ? "unblocked" : "blocked"} successfully.`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(
        error.response?.data?.message ||
          "Error updating user status. Please try again."
      );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    return usersData
      .reverse()
      .filter((user) => {
        const matchesFilters =
          (!filters.username ||
            user.username
              .toLowerCase()
              .includes(filters.username.toLowerCase())) &&
          (!filters.email ||
            user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
          (!filters.role ||
            user.role?.toLowerCase().includes(filters.role.toLowerCase())) &&
          (!filters.isAdmin ||
            (filters.isAdmin === "true" && user.isAdmin) ||
            (filters.isAdmin === "false" && !user.isAdmin)) &&
          (!filters.isActive ||
            (filters.isActive === "true" && user.isActive) ||
            (filters.isActive === "false" && !user.isActive));

        const matchesTab =
          selectedRoleTab === "all" ||
          user.role?.toLowerCase() === selectedRoleTab ||
          (selectedRoleTab === "admin" ? user?.isAdmin : false);

        return matchesFilters && matchesTab;
      });
  }, [usersData, filters, selectedRoleTab]);

  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage]);

  const editUser = (user) => {
    window.location.href = `/teacher/users/edit/${user._id}`;
  };

  return (
    <div className="user-list-user">
      <h2 className="list-heading-user">Students</h2>

      <div className="table-container-user">
        <table className="user-table-user">
          <thead className="table-header-user">
            <tr>
              {["Username", "Email", "Role"].map((header, idx) => (
                <th key={idx} className="header-cell-user text-dark">
                  {header} <br />
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
                <br />
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
                <br />
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
                  <td className="cell-user">
                    {user.username}
                    <br />
                  </td>
                  <td className="cell-user">{user.email}</td>
                  <td className="cell-user">
                    <span className={`role-badge-user role-${user.role}`}>
                      {user.role?.toUpperCase() || "N/A"}
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
                      className={`action-button-user ${
                        user.isActive ? "block" : "unblock"
                      }-user`}
                    >
                      <FontAwesomeIcon
                        icon={user.isActive ? faBan : faCheck}
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
