import React, { useEffect, useState } from "react";
import { useStudentContext } from "../../../contexts/Student-context";
import { Link, useParams } from "react-router-dom";
import { CourseService, getUserById } from "../../../service/baseService";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardSubtitle,
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col,
} from "reactstrap";
import ReactPlayer from "react-player";
import ReactStarRatings from "react-star-ratings";
import { useAuthcontext } from "../../../contexts/Authcontext";

const Details = () => {
  const {
    studentCourse,
    setStudentCourse,
    studentCourseId,
    setStudentCourseId,
  } = useStudentContext();
  const params = useParams();
  const { id } = params;
  const [userData, setUserData] = useState({});
  const fetchCourseDetails = async (courseId) => {
    const res = await CourseService(courseId);
    const data = res.data;
    setStudentCourse(data);
  };

  const fetchUserById = async (userId) => {
    try {
      const user = await getUserById(userId); // Fetch user data by ID
      setUserData((prevData) => ({
        ...prevData,
        [userId]: user, // Store the user data with their ID as key
      }));
    } catch (error) {
      console.error("Error fetching user by ID:", error);
    }
  };

  const CalculateRating = (courseRating) => {
    if (!courseRating || courseRating.length === 0) {
      return 0;
    }

    const totalRating = courseRating.reduce(
      (sum, { rating }) => sum + rating,
      0
    );
    const averageRating = totalRating / courseRating.length; // Use the correct length for averaging
    return averageRating;
  };

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
        return `${week} ${cuntWeeks} and ${remainingDays} days`;
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
  useEffect(() => {
    if (studentCourseId) fetchCourseDetails(id);
  }, [studentCourseId]);

  useEffect(() => {
    if (id) {
      setStudentCourseId(id);
    }
    return () => setStudentCourse(null);
  }, [id]);

  useEffect(() => {
    // Fetch user data for each rating.user ID
    if (studentCourse && studentCourse.ratings) {
      studentCourse.ratings.forEach((rating) => {
        if (rating.user) {
          fetchUserById(rating.user); // Fetch user data by their ID
        }
      });
    }
  }, [studentCourse]);

  return (
    <div className="container mt-4">
      {studentCourse && (
        <>
          <h3 className="mt-5 mb-3">Subjects </h3>

          <ListGroup>
            <Row>
              {studentCourse.subjects.map((subject, index) => (
                <Col md="4">
                  <ListGroupItem key={subject._id} className="mb-3 py-3">
                    <Link className="sub_cards" to={`/course/units/${subject._id}`}>
                      <h5 className="mb-0">{index + 1}. {subject.name}</h5>
                    </Link>
                  </ListGroupItem>
                </Col>
              ))}
            </Row>
          </ListGroup>
          <h3 className="mt-4">Course Detail</h3>
          <Card className="mb-4">
            <CardBody className="p-4 d-flex justify-content-start">
              <div className="mx-4">
                <img
                  src={studentCourse.imageUrl}
                  alt={studentCourse.name}
                  className="card-img-top"
                  style={{
                    borderRadius: "8px",
                    height: 250,
                  }}
                />
              </div>
              <div className="">
                <CardTitle tag="h2" style={{ textDecoration: "none" }}>
                  {studentCourse.name} <span>{}</span>
                </CardTitle>
                <ReactStarRatings
                  rating={CalculateRating(studentCourse.ratings) || 0}
                  starRatedColor="gold"
                  numberOfStars={5}
                  name="rating"
                  starDimension="25px"
                  starSpacing="2px"
                />
                <CardSubtitle
                  className="mb-3 mt-4 text-muted custom-decaration "
                  tag="h5"
                >
                  Course Details
                </CardSubtitle>
                <CardText>{studentCourse.description}</CardText>
                <CardText>
                  <strong>Duration:</strong>{" "}
                  {covertTime(studentCourse.duration)}
                </CardText>
                <CardText className="text-capitalize">
                  <strong>Status:</strong> {studentCourse.status}
                </CardText>
              </div>
            </CardBody>
          </Card>

          <ListGroup>
            <Row>
              <Col md="12">
                <h3 className="mt-4 mb-3">Review and Commands</h3>
                <ListGroupItem className="mb-3">
                  {studentCourse.ratings.map((rating) => (
                    <div>
                      <div className=" p-3">
                        <div className="d-flex gap-2">
                          <div className="text-capitalize align-self-center">
                            {userData[rating.user]
                              ? userData[rating.user].data.username
                              : "Loading..."}
                          </div>
                          <div style={{ marginTop: "-2px" }}>
                            <ReactStarRatings
                              rating={
                                CalculateRating(studentCourse.ratings) || 0
                              }
                              starRatedColor="gold"
                              numberOfStars={5}
                              name="rating"
                              starDimension="20px"
                              starSpacing="2px"
                              className="align-self-center"
                            />
                          </div>
                          <div className="ms-auto">
                            {new Date(rating.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long", // 'short' or 'numeric'
                                day: "numeric",
                              }
                            )}
                          </div>
                        </div>
                        <div className="mt-1 mb-0">
                          <span style={{ fontSize: "14px" }}>Comments :</span>{" "}
                          <br /> <p className="px-4 ">{rating.comment}</p>
                        </div>
                        <hr />
                      </div>
                    </div>
                  ))}
                </ListGroupItem>
              </Col>
            </Row>
          </ListGroup>
        </>
      )}
    </div>
  );
};

export default Details;
