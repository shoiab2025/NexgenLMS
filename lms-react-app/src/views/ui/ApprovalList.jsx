import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthcontext } from "../../contexts/Authcontext";

const ApprovalManagement = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usernameFilter, setUsernameFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { authUser } = useAuthcontext();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses/");
        const courses = response.data.filter(
          (e) => e.created_by === authUser?.user?._id
        );

        const requests = courses.flatMap((course) =>
          (course.joinRequests || []).map((req) => ({
            id: `${course._id}_${req.user?._id || "unknown"}`,
            user: req.user,
            status: req.status,
            course: course.name,
            courseId: course._id,
          }))
        );

        setAllRequests(requests);
        setFilteredRequests(requests);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error(
          error.response?.data?.message ||
            "Error fetching courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [authUser]);

  useEffect(() => {
    const filtered = allRequests.filter((req) => {
      const username = req.user?.username?.toLowerCase() || "";
      const course = req.course?.toLowerCase() || "";
      const status = req.status?.toLowerCase() || "";

      const usernameMatch = username.includes(usernameFilter.toLowerCase());
      const courseMatch = course.includes(courseFilter.toLowerCase());
      const statusMatch =
        !statusFilter || statusFilter.toLowerCase() === "all"
          ? true
          : status.includes(statusFilter.toLowerCase());

      return usernameMatch && courseMatch && statusMatch;
    });

    setFilteredRequests(filtered);
  }, [usernameFilter, courseFilter, statusFilter, allRequests]);

  const handleApprove = async (req) => {
    try {
      await SendRequest(req.courseId, req.user?._id, "approved");
      updateRequestStatus(req.id, "approved");
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (req) => {
    try {
      await SendRequest(req.courseId, req.user?._id, "rejected");
      updateRequestStatus(req.id, "rejected");
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  const updateRequestStatus = (id, status) => {
    setAllRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const SendRequest = async (courseId, userId, action) => {
    try {
      if (!courseId || !userId || !action) {
        throw new Error("Missing courseId, userId, or action");
      }

      const response = await axios.post(
        "/api/courses/handle-join-request",
        {
          courseId,
          userId,
          action,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Request processed successfully");
      return response.data;
    } catch (error) {
      console.error("SendRequest error:", error);
      toast.error(
        error.response?.data?.message || "Failed to process request."
      );
      throw error;
    }
  };

  return (
    <div className="approval-list">
      <h2 className="list-heading-approval h4">User Course Approvals</h2>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="table-container-approval">
          <table className="approval-table">
            <thead>
              <tr>
                <th>
                  Username
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by username"
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                  />
                </th>
                <th>
                  Course
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by course"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                  />
                </th>
                <th>
                  Status
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="4">No approval requests found.</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.user?.username || "Unknown"}</td>
                    <td>{req.course || "Unknown"}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          req.status === "pending"
                            ? "status-pending"
                            : req.status === "approved"
                            ? "status-approved"
                            : req.status === "rejected"
                            ? "status-rejected"
                            : "status-unknown"
                        }`}
                      >
                        {req.status
                          ? req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)
                          : "Unknown"}
                      </span>
                    </td>
                    <td>
                      {req.status === "pending" ? (
                        <div className="action-buttons">
                          <button
                            className="action-button-approve"
                            onClick={() => handleApprove(req)}
                          >
                            Approve
                          </button>
                          <button
                            className="action-button-reject"
                            onClick={() => handleReject(req)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <em>No actions</em>
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

export default ApprovalManagement;
