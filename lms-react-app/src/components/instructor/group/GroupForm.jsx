import React, { useEffect, useState } from "react";
import {
  createGroup,
  updateGroup,
  fetchGroupById,
} from "../../../service/groupService";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  courseListService,
  fetchAllUsersService,
} from "../../../service/baseService";

const GroupForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    duration: "",
    status: "active",
    users: [],
    courses: [],
  });

  const [allUsers, setAllUsers] = useState([]);
  const [allCourses, setAllCourses] = useState([]);

  const fetchGroup = async () => {
    try {
      const res = await fetchGroupById(id);
      setGroupData({
        name: res.data.name,
        description: res.data.description,
        duration: res.data.duration,
        status: res.data.status,
        users: res.data.users || [],
        courses: res.data.courses || [],
      });
      toast.success("Group fetched successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.details ||
          "Failed to fetch group data. Please try again."
      );
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetchAllUsersService();
      setAllUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await courseListService();
      setAllCourses(res.data);
    } catch (error) {
      toast.error("Failed to fetch courses.");
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllCourses();
    if (id) {
      fetchGroup();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setGroupData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await updateGroup(id, groupData);
        toast.success("Group updated successfully!");
      } else {
        await createGroup(groupData);
        toast.success("Group created successfully!");
      }

      navigate("/instructor/groups");
    } catch (error) {
      toast.error(
        error.response?.data?.details || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", padding: "30px" }}>
        <h3>{id ? "Update Group" : "Create Group"}</h3>
      <Form onSubmit={handleSubmit} className="mb-4">
        <div style={{display: "flex"}}>
          <div style={{flex: 1, padding: '15px'}}>
            <FormGroup>
              <Label for="groupName">Group Name</Label>
              <Input
                type="text"
                name="name"
                id="groupName"
                value={groupData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="groupDescription">Description</Label>
              <Input
                type="text"
                name="description"
                id="groupDescription"
                value={groupData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="groupDuration">Duration (months)</Label>
              <Input
                type="number"
                name="duration"
                id="groupDuration"
                value={groupData.duration}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="groupStatus">Status</Label>
              <Input
                type="select"
                name="status"
                id="groupStatus"
                value={groupData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Input>
            </FormGroup>
          </div>
          <div style={{flex: 1, padding: '15px'}}>
            <FormGroup>
              <Label for="groupUsers">Assign to</Label>
              <Input
                type="select"
                name="users"
                id="groupUsers"
                multiple
                value={groupData.users}
                onChange={handleMultiSelectChange}
              >
                {allUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="groupCourses">Courses</Label>
              <Input
                type="select"
                name="courses"
                id="groupCourses"
                multiple
                value={groupData.courses}
                onChange={handleMultiSelectChange}
              >
                {allCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </Input> 
            </FormGroup>
          </div>
        </div>
        <Button color="primary" type="submit" style={{float: "right", marginInline: '15px'}}>
          {id ? "Update Group" : "Create Group"}
        </Button>
      </Form>
    </div>
  );
};

export default GroupForm;
