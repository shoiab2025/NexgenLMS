import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from "reactstrap";
import StarRatings from 'react-star-ratings'; // For star ratings

const Course = ({ course }) => {
  const { name, description, duration, status, subjects, ratings, createdAt, updatedAt, _id: id } = course;
  const navigate = useNavigate();

  // Calculate average rating
  const averageRating = ratings.length
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  return (
    <Card className="course-card my-3">
      <CardBody>
        <CardTitle tag="h2">{name}</CardTitle>
        <CardSubtitle className="mb-2 text-muted">
          Duration: {duration} weeks | Status: {status}
        </CardSubtitle>

        <CardText className="course-description">{description}</CardText>

        {/* Ratings section */}
        <div className="course-rating mb-3">
          <h5>Average Rating:</h5>
          <StarRatings
            rating={averageRating}
            starRatedColor="gold"
            numberOfStars={5}
            starDimension="25px"
            starSpacing="2px"
            name="courseRating"
          />
          <span> ({ratings.length} reviews)</span>
        </div>

        {/* Display subjects */}
        {subjects && subjects.length > 0 && (
          <div className="course-subjects mb-3">
            <h5>Subjects:</h5>
            <ul>
              {subjects.map((subject, index) => (
                <li key={index}>{subject.name} - {subject.description}</li>
              ))}
            </ul>
          </div>
        )}

        <Button color="primary" onClick={() => navigate(`/course/details/${id}`)}>
          View Course Details
        </Button>
      </CardBody>
    </Card>
  );
};

export default Course;
