import React, { useEffect, useState } from 'react';
import { useStudentContext } from '../../../contexts/Student-context';
import { courseListService } from '../../../service/baseService';
import defaultIMG from "../../../assets/images/default_images/Skill Pointer.png"
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Col,
    Row,
    Container,
    Spinner,
    Button,
} from 'reactstrap';
import ReactStarRatings from 'react-star-ratings';

const CourseList = () => {
    const { studentCoursesList, setStudentCoursesList } = useStudentContext();
    
    const fetchCourseList = async () => {
        const res = await courseListService();
        const sortedCourses = res?.data?.sort((a, b) => {
            const avgRatingA = CalculateRating(a.ratings);
            const avgRatingB = CalculateRating(b.ratings);
            return avgRatingB - avgRatingA; // Sort in descending order
        });
        setStudentCoursesList(sortedCourses);
    };

    useEffect(() => {
        fetchCourseList();
        return () => setStudentCoursesList([]);
    }, []);

    const CalculateRating = (courseRating) => {
        if (!courseRating || courseRating.length === 0) {
            return 0; 
        }

        const totalRating = courseRating.reduce((sum, { rating }) => sum + rating, 0);
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
    return (
        <Container className="mt-4">
            <h2 className="mb-4">Course List</h2>
            {studentCoursesList ? (
                studentCoursesList.length > 0 ? (
                    <Row>
                        {studentCoursesList.map((course) => (
                            <Col key={course.id || course.name} sm="12" md="6" lg="4" className="mb-4">
                                <Card className="course-card h-100">
                                    <img
                                        src={course.imageUrl ? course.imageUrl : defaultIMG}
                                        alt={course.name}
                                        className="card-img-top"
                                        style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', height: 250 }}
                                    />
                                    <CardBody>
                                        <CardTitle tag="h5">{course.name}</CardTitle>
                                        
                                        <CardText className='mt-2'>{course.description}</CardText>
                                        <CardText>
                                            <strong>Duration:</strong> {covertTime(course.duration)} 
                                        </CardText>
                                        <CardText >
                                        <strong>Rating : </strong><ReactStarRatings
                                            rating={CalculateRating(course.ratings) || 0}
                                            starRatedColor="gold"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension="20px"
                                            starSpacing="2px"
                                        />
                                        </CardText>
                                        <CardText className='text-capitalize'>
                                            <strong>Status:</strong> {course.status}
                                        </CardText>
                                        <Button color="primary" className="mb-3" href={`/course/explore-details/${course._id}`} style={{position: 'absolute', bottom: '0%'}}>
                                            View Course
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p className="text-center">No courses available</p>
                )
            ) : (
                <div className="text-center">
                    <Spinner color="primary" />
                </div>
            )}
        </Container>
    );
};

export default CourseList;
