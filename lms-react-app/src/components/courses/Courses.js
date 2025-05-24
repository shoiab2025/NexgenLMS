import React, { useState } from 'react';
import { Table, Button, Card, CardBody, CardTitle, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";
import { useCourse } from '../../hooks/Courses/useCourses';
import { useCreateCourse } from '../../hooks/Courses/useAddCourses';
import { useSubject } from '../../hooks/Subjects/useSubjects';

const initialGroupsData = [
    {
        avatar: user1,
        name: "Frontend Developers",
        description: "Responsible for UI/UX",
        duration: "6 months",
        status: "Active",
    },
    {
        avatar: user2,
        name: "Backend Engineers",
        description: "Handles server-side logic",
        duration: "12 months",
        status: "Active",
    },
    {
        avatar: user3,
        name: "QA Team",
        description: "Testing and Quality Assurance",
        duration: "3 months",
        status: "Inactive",
    },
    {
        avatar: user4,
        name: "DevOps",
        description: "Infrastructure automation",
        duration: "9 months",
        status: "Active",
    },
    {
        avatar: user5,
        name: "Design Team",
        description: "Handles product design",
        duration: "8 months",
        status: "Active",
    },
];

const Courses = () => {
    const [groups, setGroups] = useState(initialGroupsData);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', duration: '', subject_ids: [], status: 'Active' });
    const [editIndex, setEditIndex] = useState(null);  // To track editing group index
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createCourse } = useCreateCourse();

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGroup((prevGroup) => ({ ...prevGroup, [name]: value }));
    };

    // Add or edit group
    const saveGroup = () => {
        if (newGroup.name && newGroup.description && newGroup.duration && newGroup.subject_ids && newGroup.status) {
            if (editIndex !== null) {
                // Update existing group
                const updatedGroups = [...groups];
                updatedGroups[editIndex] = newGroup;
                setGroups(updatedGroups);
                // UpdateGroup(newGroup.name, newGroup.description, newGroup.duration, newGroup.status.toLowerCase(), newGroup._id);
            } else {
                setGroups((prevGroups) => [...prevGroups, newGroup]);
                const duration = Number(newGroup.duration);
                debugger;
                createCourse(newGroup.name, newGroup.description, duration, newGroup.subject_ids, newGroup.status.toLowerCase());
            }
            setNewGroup({ name: '', description: '', duration: '', subject_ids: [], status: 'Active' });
            setEditIndex(null);  // Reset edit index
            toggleModal();
        } else {
            alert('Please fill all fields');
        }
    };

    const handleSubjectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const selectedValues = selectedOptions.map(option => option.value);
        setNewGroup((prevGroup) => ({ ...prevGroup, subject_ids: selectedValues }));
    };

    // Open modal for editing an existing group
    const editGroup = (index) => {
        setEditIndex(index);
        setNewGroup(groups[index]);
        toggleModal();
    };

    const { course, loading } = useCourse();
    const { subject } = useSubject();

    return (
        <div>
            <Card>
                <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <CardTitle tag="h5">Courses </CardTitle>
                        </div>
                        <Button
                            color="primary"
                            className="ms-auto"
                            onClick={() => {
                                setEditIndex(null);
                                toggleModal();
                            }}
                        >
                            Add Group
                        </Button>
                    </div>
                    <Table className="no-wrap mt-3 align-middle course-Table" responsive borderless>
                        <thead>
                            <tr className="bg-primary text-white">
                                <th>Course</th>
                                <th>Duration</th>
                                <th>Subjects</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {course.length > 0 ? (
                                course.map((course, index) => (
                                    <tr key={index} className="border-top">
                                        <td>
                                            <div className="py-2">
                                                {/* 
              <img
                src={group.avatar}
                className="rounded-circle"
                alt="avatar"
                width="45"
                height="45"
              /> 
            */}
                                                <div>
                                                    <h6 className="mb-0">{course.name}</h6>
                                                    <span className="text-muted">{course.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {
                                                course.subject_ids && course.subject_ids.length > 0 ? (
                                                    course.subject_ids.map((sub, index) => (
                                                        <p key={index}>
                                                            {sub.name}
                                                            {index !== (course.subject_ids.length - 1) ? `,` : ``}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>Subjects Not assigned</p>
                                                )
                                            }

                                        </td>
                                        <td>{course.duration} months</td>

                                        <td>
                                            {course.status === "active" ? (
                                                <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                                            ) : (
                                                <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                                            )}
                                        </td>
                                        <td>
                                            <Button color="warning" size="sm" className="me-2" onClick={() => editGroup(index)}>
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No record found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </Table>
                </CardBody>
            </Card>

            {/* Modal for adding/editing a group */}
            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>{editIndex !== null ? 'Edit Course' : 'Add New Course'}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Course Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={newGroup.name}
                            onChange={handleInputChange}
                            placeholder="Enter course name"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={newGroup.description}
                            onChange={handleInputChange}
                            placeholder="Enter course description"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="duration">Duration</Label>
                        <Input
                            type="text"
                            name="duration"
                            value={newGroup.duration}
                            onChange={handleInputChange}
                            placeholder="Enter duration"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="subjects">Subjects</Label>
                        <Input
                            type="select"
                            name="subject_ids"
                            value={newGroup.subject_ids}
                            onChange={handleSubjectChange}
                            multiple
                        >
                            {subject && subject.length > 0 && subject.map((subject, index) => (
                                <option key={index} value={subject._id}>
                                    {subject.name}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="status">Status</Label>
                        <Input
                            type="select"
                            name="status"
                            value={newGroup.status}
                            onChange={handleInputChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Input>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={saveGroup}>
                        {editIndex !== null ? 'Update Course' : 'Add Course'}
                    </Button>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default Courses;
