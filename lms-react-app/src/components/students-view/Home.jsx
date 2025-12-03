import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import { useCourse } from "../../hooks/Courses/useCourses";
import TestimonialSlider from "./TestimonialSlider";
import AboutUs from "./About-us";
import ContactUs from "./Contact-us";
import ReactStarRatings from "react-star-ratings";

const Home = () => {
  const name = "LMS Platform";
  const website = "lmsplatform.com";

  const navigate = useNavigate();

  const { course, loading } = useCourse();

  const firstFourCourses = course.filter((c) => c.course_type === 'public');
  const handleNavigation = (route) => {
    navigate(route);
  };

  const student_name_array = [
    "James Gosling",
    "Bjarne Stroustrup",
    "Guido van Rossum",
  ];


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

  return (
    <>
      {/* Featured Courses Section */}
      <Container className="mt-4">
        <h2 className="text-center mb-4">Public Courses</h2>
        <Row className="">
          {firstFourCourses.map((crs) => (
            <Col
              sm="6"
              md="3"
              key={crs._id}
              id=""
              className="rounded"
            >
              <Link to={`/course/explore-details/${crs._id}`}>
                <Card className="mb-4">
                  <CardBody className="align-items-center justify-content-between" style={{border: "2px solid #583c23bd", borderRadius: "10px"}}>
                    {/* Name on the left */}

                    {/* Image on the right */}
                    <div className="d-flex justify-content-center mb-3">
                      <img
                        src={crs.imageUrl}
                        alt={crs.name}
                        style={{ width: '120px', height: 'auto', objectFit: 'cover', borderRadius: '8px' }}
                        className="mx-auto"
                      />
                    </div>
                    <div className="tittle-home py-2">
                      <CardTitle tag="h5" className="mb-0 fw-bold">
                        {crs.name}
                      </CardTitle>
                      <ReactStarRatings
                        rating={CalculateRating(crs.ratings) || 3.5}
                        starRatedColor="gold"
                        numberOfStars={5}
                        name="rating"
                        starDimension="20px"
                        starSpacing="2px"
                      />
                    </div>
                    <div className="mt-2">

                      <CardText className="mb-1">
                        <strong>Duration:</strong>{" "}
                        {covertTime(crs.duration)}
                      </CardText>
                      <CardText className="text-capitalize">
                        <strong>Subjects:</strong> {crs.subjects.length}
                      </CardText>
                    </div>
                  </CardBody>
                </Card>
              </Link>

            </Col>
          ))}
        </Row>

        {/* Call to Action Section */}
      </Container>
    </>
  );
};

export default Home;
