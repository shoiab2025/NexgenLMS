import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input,
  Label,
} from 'reactstrap';
import ReactStarRatings from 'react-star-ratings';
import { toast } from 'react-hot-toast';

const RatingCommentModal = ({ isOpen, toggle, courseId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    if (!comment) {
      toast.error('Please enter a comment before submitting.'); // Show error toast
      return;
    }
    if (!rating || rating < 1) {
      toast.error('Please rate the course before submitting.'); // Show error toast
      return;
    }
    onSubmit(courseId, rating, comment); // Call the submission function
    setComment(''); // Clear the comment input
    setRating(0); // Reset rating
    toggle(); // Close the modal
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Rate and Comment</ModalHeader>
      <ModalBody>
        <ReactStarRatings
          rating={rating}
          starRatedColor="gold"
          starEmptyColor="lightgray"
          changeRating={handleRatingChange}
          numberOfStars={5}
          name="rating"
          starDimension="25px" // Adjust star size
          starSpacing="3px" // Spacing between stars
        />
        <Form className="mt-3">
          <Label for={`comment-${courseId}`}>Leave a comment:</Label>
          <Input
            type="textarea"
            id={`comment-${courseId}`}
            value={comment}
            onChange={handleCommentChange}
            rows="3" // Set number of rows for textarea
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RatingCommentModal;
