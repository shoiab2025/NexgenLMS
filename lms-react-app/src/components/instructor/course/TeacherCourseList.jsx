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
  const [days, setDays] = useState(0);
  const [weeks, setWeeks] = useState(0);
  const [months, setMonths] = useState(0);
  const { authUser } = useAuthcontext();
  const covertTime = (time) => {
    const hours = parseFloat(time);

    const days = Math.floor(hours / 24); // Calculate the number of full days
    const remainingHours = hours % 24; // Calculate the remaining hours after days

    if (days >= 7) {
      const weeks = days % 7;
      const week = Math.floor(days / 7);
      const remainingDays = days % 7;
      const cuntWeeks = week > 1 ? "weeks" : "week";

      if (remainingDays == 0) {
        return `${week} ${cuntWeeks}`;
      } else {
        return `${week} ${week} and ${remainingDays} days`;
      }
    } else {
      if (days == 0) {
        return `${remainingHours} hours`;
      } else if (remainingHours == 0) {
        return `${days} days`;
      } else {
        return `${days} days and ${remainingHours} hours`;
      }
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        if (authUser?.user?.role === "teacher") {
          const respondedCourse = response.data;
          const teacherCourse = respondedCourse.filter(
            (course) => course.created_by === authUser?.user?._id
          );
          setCourses(teacherCourse);
        }
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
      setCourses(courses.filter((course) => course._id !== courseId)); // Remove the course from state
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error deleting course. Please try again.";
      toast.error(errorMessage);
    }
  };

  const duration = (courseSubjects) => {
    let timeOfCourse = 0;
    if (courseSubjects.length > 0) {
      courseSubjects.forEach((subject) => {
        timeOfCourse += subject.duration;
      });
    }
    console.log(timeOfCourse);

    return timeOfCourse;
  };

  function isImageValid(url) {
    try {
      const parsed = new URL(url);
      const isHttp =
        parsed.protocol === "http:" || parsed.protocol === "https:";

      // Optional: Check if the URL seems to be pointing to an image
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

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <CardTitle tag="h5">Courses</CardTitle>
                <Link to="/teacher/create-course">
                  <Button color="primary">Add New</Button>
                </Link>
              </div>
              {courses.length > 0 ? (
                <div className="table-responsive">
                  <Table borderless>
                    <thead>
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
                      {courses.map((course) => (
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
                                width: "100px",
                                height: "auto",
                                maxHeight: "100px",
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
                            {covertTime(duration(course.subjects))}{" "}
                            {console.log(covertTime(duration(course.subjects)))}
                          </td>
                          <td className="text-nowrap">
                            <Link to={`/teacher/edit-course/${course._id}`}>
                              <Button
                                color="warning"
                                className="me-2"
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
