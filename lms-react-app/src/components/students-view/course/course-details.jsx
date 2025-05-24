import React, { useEffect, useState } from "react";
import { useStudentContext } from "../../../contexts/Student-context";
import { useParams } from "react-router-dom";
import { CourseService } from "../../../service/baseService";
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

const CourseDetails = () => {
  const {
    studentCourse,
    setStudentCourse,
    studentCourseId,
    setStudentCourseId,
  } = useStudentContext();
  const params = useParams();
  const { id } = params;

  const fetchCourseDetails = async (courseId) => {
    const res = await CourseService(courseId);
    const data = res.data;
    setStudentCourse(data);
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
  const covertTime = (time) => {
    const hours = parseFloat(time)

    const days = Math.floor(hours / 24);  // Calculate the number of full days
    const remainingHours = hours % 24;    // Calculate the remaining hours after days


    
    if (days >= 7){
        const weeks = days % 7 ;
        const week = Math.floor(days / 7);
        const remainingDays = days % 7;
        const cuntWeeks = (week > 1) ? 'weeks' : 'week'

        
        if (remainingDays == 0) {
            return `${week} ${cuntWeeks}`;
        }
        else {
            return `${week} ${cuntWeeks} and ${remainingDays} days`;
        }
    }
    else {
        if (days == 0) {
            return `${remainingHours} hours`;
        }
        else if (remainingHours == 0) {
            return `${days} days`;
        }
        else {
            return `${days} days and ${remainingHours} hours`;
        }
        
    }
}

  useEffect(() => {
    if (studentCourseId) fetchCourseDetails(id);
  }, [studentCourseId]);

  useEffect(() => {
    if (id) {
      setStudentCourseId(id);
    }
    return () => setStudentCourse(null);
  }, [id]);

  return (
    <div className="container mt-4">
      {studentCourse && (
        <>
          <h3 className="mt-4">Course Detail</h3>
          <Card className="mb-4">
            <CardBody className="p-4 d-flex justify-content-start">
              
              <div className="mx-4">
                <img
                  src={studentCourse.imageUrl}
                  alt={studentCourse.name}
                  className="card-img-top"
                  style={{
                    borderRadius: '8px',
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
                <CardText >
                  <strong>Duration:</strong> {covertTime(studentCourse.duration)} 
                </CardText>
                <CardText className="text-capitalize">
                  <strong>Status:</strong> {studentCourse.status}
                </CardText>
              </div>
            </CardBody>
          </Card>

          <h3 className="mt-5 mb-3">Subjects and Materials</h3>

          <ListGroup>
            <Row>
              {studentCourse.subjects.map((subject) => (
                <Col md="6">
                  <ListGroupItem
                    key={subject._id}
                    className="mb-3"
                    style={{ boxShadow: " 0px 1px 5px 2px rgba(0,0,0,0.27" }}
                  >
                    <Card style={{ boxShadow: "none" }}>
                      <CardBody>
                        <CardTitle tag="h5">{subject.name}</CardTitle>
                        <CardText>{subject.description}</CardText>
                        <h6>Materials:</h6>
                        <ListGroup>
                          {subject.materials.map((material) => (
                            <ListGroupItem key={material._id} className="">
                              <div className="flex-grow-1">
                                <strong>{material.name}</strong> -{" "}
                                {material.content_type}
                                <p className="material-description">
                                  {material.description}
                                </p>
                              </div>
                              <div>
                                {material.content_type === "PDF" && (
                                  <Button
                                    color="primary"
                                    size="sm"
                                    href={material.content_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View PDF
                                  </Button>
                                )}
                                {material.content_type === "Video" && (
                                  <div className="video-player-container">
                                    <ReactPlayer
                                      url={material.content_url}
                                      controls={true}
                                      width="100%"
                                      height="300px"
                                    />
                                  </div>
                                )}
                                {/* Add more conditions for other types if needed */}
                              </div>
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                      </CardBody>
                    </Card>
                  </ListGroupItem>
                </Col>
              ))}
            </Row>
          </ListGroup>
        </>
      )}
    </div>
  );
};

export default CourseDetails;
