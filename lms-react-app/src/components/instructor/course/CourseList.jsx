import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import defaultImage from "../../../assets/images/default_images/images.jpg";
import { useAuthcontext } from "../../../contexts/Authcontext";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const { authUser } = useAuthcontext();
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Error fetching courses. Please try again.";
        toast.error(errorMessage);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`/api/courses/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error deleting course. Please try again.";
      toast.error(errorMessage);
    }
  };



  function isImageValid(url) {
    try {
      const parsed = new URL(url);
      const isHttp =
        parsed.protocol === "http:" || parsed.protocol === "https:";
      const imagePattern = /\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i;
      return (
        isHttp &&
        (imagePattern.test(parsed.pathname) ||
          parsed.hostname.includes("gstatic.com"))
      );
    } catch (e) {
      return false;
    }
  }

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-2 container-fluid p-0">
      <Row>
        <Col xs="12">
          <Card className="mx-0">
            <CardBody>
              <div className="d-lg-flex d-md-flex d-block flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-3 flex-wrap gap-2">
                <CardTitle tag="h5" className="mb-2 mb-md-0">
                  Courses
                </CardTitle>
                <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="form-control w-100"
                    style={{ maxWidth: "300px", width: "100%" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Link to="/instructor/create-course" className="">
                    <Button color="primary" className="w-100 w-sm-auto">Add New</Button>
                  </Link>
                </div>
              </div>

              {courses.length > 0 ? (
                <div className="table-responsive">
                  <Table borderless className="mb-0">
                    <thead className="approval-table">
                      <tr>
                        <th className="text-nowrap">Image</th>
                        <th className="text-nowrap">Name</th>
                        <th className="text-nowrap">JoinCode</th>
                        <th className="text-nowrap">Course Type</th>
                        <th className="text-nowrap">Duration</th>
                        <th className="text-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course) => (
                        <tr key={course._id}>
                          <td className="text-nowrap">
                            <img
                              src={
                                isImageValid(course.imageUrl)
                                  ? course.imageUrl
                                  : defaultImage
                              }
                              alt="Course Preview"
                              style={{
                                width: "60px",
                                height: "auto",
                                maxHeight: "60px",
                                objectFit: "contain",
                                backgroundColor: "#ededed",
                                padding: "5px",
                                borderRadius: "5px",
                              }}
                            />
                          </td>
                          <td className="text-nowrap text-capitalize">
                            {course.name}
                          </td>
                          <td className="text-wrap">{course?.join_code}</td>
                          <td className="text-nowrap text-capitalize">
                            {course.course_type}
                          </td>
                          <td className="text-nowrap">
                            {course.duration}
                          </td>
                          <td className="text-nowrap">
                            <Link to={`/instructor/edit-course/${course._id}`}>
                              <Button
                                color="warning"
                                className="me-2 mb-1 mb-md-0"
                                size="sm"
                              >
                                <i className="bi bi-pen-fill"></i>
                              </Button>
                            </Link>
                            <Button
                              color="danger"
                              onClick={() => handleDelete(course._id)}
                              size="sm"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center">No courses available</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseList;
