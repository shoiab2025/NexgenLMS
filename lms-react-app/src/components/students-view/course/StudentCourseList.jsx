import React, { useEffect, useState } from 'react';
import { useAuthcontext } from '../../../contexts/Authcontext';
import { useStudentContext } from '../../../contexts/Student-context';
import {
  studentCourseListService,
  submitCommentService,
  submitRatingService,
} from '../../../service/baseService';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Spinner,
  Button,
  CardImg,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import RatingCommentModal from './RatingCommentModal';

const StudentCourseList = () => {
  const { authUser } = useAuthcontext();
  const { studentCoursesList, setStudentCoursesList } = useStudentContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  const fetchCourseList = async (id) => {
    try {
      setLoading(true);
      const res = await studentCourseListService(id);
      setStudentCoursesList(res?.data.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleRatingSubmit = async (courseId, rating, comment) => {
    try {
      console.log(courseId, rating, comment)
      await submitRatingService(courseId, rating, comment);
      toast.success('Rating and comment submitted successfully!');
      fetchCourseList(authUser.user._id);
    } catch (error) {
      toast.error('Failed to submit rating or comment.');
      console.error('Failed to submit rating or comment:', error);
    }
  };

  useEffect(() => {
    fetchCourseList(authUser.user._id);
  }, [authUser.user._id]);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">My Courses</h2>
      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <Row>
          {studentCoursesList && studentCoursesList.length > 0 ? (
            studentCoursesList.map((course) => (
              <Col md="4" key={course._id || course.name} className="mb-4">
                <Card className="shadow-sm">
                  <CardBody>
                    <CardImg top src={course.imageUrl} alt={course.title} id="course-home-card-img" className='mb-3' />
                    <CardTitle tag="h5">{course.name}</CardTitle>
                    <CardText>{course.description || 'No description available.'}</CardText>

                    <Button
                      color="info"
                      className="mt-3"
                      onClick={() => navigate(`/course/details/${course._id}`)}
                    >
                      View Course
                    </Button>
                    
                    {/* Submit Rating Button */}
                    <Button
                      color="success"
                      className="mt-3 ms-2"
                      onClick={() => {
                        setCurrentCourseId(course._id);
                        toggleModal();
                      }}
                    >
                      Rate Course
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">No courses available</p>
            </Col>
          )}
        </Row>
      )}

      <RatingCommentModal
        isOpen={modalOpen}
        toggle={toggleModal}
        courseId={currentCourseId}
        onSubmit={handleRatingSubmit}
      />
    </Container>
  );
};

export default StudentCourseList;
