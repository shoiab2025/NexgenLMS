import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthcontext } from "../../contexts/Authcontext";
import { Alert } from "reactstrap";

const TeacherApprovals = () => {
  const [approvalList, setApprovalList] = useState([]);
  const [institution, setInstitution] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthcontext();
  const [usersData, setUsersData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // all | approved | pending

  // Fetch institutions
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const url =
          authUser?.user?.role === "coordinator"
            ? `/api/institution/managment/${authUser.user._id}/`
            : `/api/institution`;
        const res = await axios.get(url);
        setInstitution(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching institutions:", err);
        toast.error("Error loading Institutions");
      }
    };

    fetchInstitutions();
  }, [authUser]);

  // Fetch users for each institution
  useEffect(() => {
    const fetchApprovalsForInstitutions = async () => {
      if (!institution || institution.length === 0) return;

      try {
        const approvalPromises = institution.map((item) =>
          axios.get(`/api/users/institution/${item?._id}`).then((res) =>
            res.data.map((user) => ({
              ...user,
              institutionName: item?.name || "Unknown",
            }))
          )
        );

        const results = await Promise.all(approvalPromises);
        setApprovalList(results.flat());
      } catch (err) {
        toast.error("Error fetching teacher approvals");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalsForInstitutions();
  }, [institution]);

   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/");
        console.log("the response", response);
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

  // Filter users based on global search query
  const filteredList = usersData?.filter((req) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      req.username?.toLowerCase().includes(query) ||
      req.email?.toLowerCase().includes(query) ||
      req.phoneNumber?.toString().toLowerCase().includes(query) ||
      req.institutionName?.toLowerCase().includes(query) ||
      req.status?.toLowerCase().includes(query) ||
      req.isApproved?.toString().toLowerCase().includes(query) ||
      req.isActive?.toString().toLowerCase().includes(query) ||
      req.isAdmin?.toString().toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && req.isApproved === true) ||
      (filterStatus === "pending" &&
        (req.isApproved === false || req.isApproved === null));

    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (req) => {
    try {
      await SendRequest(authUser?.user?._id, req._id, true);
      updateRequestStatus(req._id, true);
    } catch (err) {
      toast.error("Error approving request");
    }
  };

  const handleReject = async (req) => {
    try {
      await SendRequest(authUser?.user?._id, req._id, false);
      updateRequestStatus(req._id, false);
    } catch (err) {
      toast.error("Error rejecting request");
    }
  };

  const updateRequestStatus = (id, status) => {
    setApprovalList((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isApproved: status } : r))
    );
  };

  const SendRequest = async (approveID, userId, status) => {
    try {
      const response = await axios.put(`/api/users/approve-teacher/${userId}`, {
        approver_id: approveID,
        status,
      });
      toast.success("Approved Teacher successfully");
      return response.data;
      window.location.reload();
    } catch (error) {
      console.log("the approving error", error);
      toast.error(
        error.response?.data?.message || "Failed to Approve Teacher."
      );
      throw error;
    }
  };
  console.log("the response", approvalList);
  return (
    <div className="approval-list">
      <div className="d-lg-flex d-md-flex d-block justify-content-between align-item-center">
        <div className="header-container">
          <h2 className="list-heading-approval h4  mb-0">
            Teacher Approval
          </h2>
        </div>

        <div className="global-search-box align-self-center">
          <input
            type="text"
            placeholder="Search Here ...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input-global w-100"
          />
        </div>
      </div>
      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="table-container-approval">
          <div className="filter-buttons-approval d-flex gap-2 align-items-center my-2">
            <button
              className={`btn btn-sm ${
                filterStatus === "all" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setFilterStatus("all")}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${
                filterStatus === "approved"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => setFilterStatus("approved")}
            >
              Approved
            </button>
            <button
              className={`btn btn-sm ${
                filterStatus === "pending"
                  ? "btn-warning"
                  : "btn-outline-warning"
              }`}
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </button>
          </div>

          <table className="approval-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th className="text-nowrap">Phone Number</th>
                <th>Institution</th>
                <th className="text-nowrap">Registered At</th>
                <th>IsActive</th>
                <th>IsApproved</th>
                <th>Approved By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="9">No approval requests found.</td>
                </tr>
              ) : (
                filteredList.map((req) => (
                  <tr key={req._id}>
                    <td className="text-capitalize">
                      {req.username || "Unknown"}
                    </td>
                    <td>{req.email || "Unknown"}</td>
                    <td>{req.phoneNumber || "Unknown"}</td>
                    <td className="text-nowrap">
                      {req.institutionName || "Unknown"}
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>{req.isActive ? "Yes" : "No"}</td>
                    <td>{req.isApproved ? "Yes" : "No"}</td>

                    <td className="text-nowrap text-capitalize">
                      {req?.approved_by
                        ? `${req?.approved_by?.username} (${
                            req?.approved_by.isAdmin
                              ? "Admin"
                              : req?.approved_by?.role
                          })`
                        : "Not Yet Approved"}
                    </td>
                    <td>
                      {!req.isApproved ? (
                        <div className="action-buttons">
                          <button
                            className="action-button-approve"
                            onClick={() => handleApprove(req)}
                          >
                            Approve
                          </button>
                          {/* <button
                            className="action-button-reject"
                            onClick={() => handleReject(req)}
                          >
                            Reject
                          </button> */}
                        </div>
                      ) : (
                        <em>Approved</em>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherApprovals;
