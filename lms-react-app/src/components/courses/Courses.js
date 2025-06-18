import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Modal,
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import { useCourse } from '../../hooks/Courses/useCourses';
import { useAuthcontext } from '../../contexts/Authcontext';

const Courses = () => {
    const { course } = useCourse();
    const { authUser } = useAuthcontext();
    const [yourCourses, setYourCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (course && authUser?.user?._id) {
            const userCourses = course.filter(c => c.created_by === authUser.user._id);
            setYourCourses(userCourses);
        }
    }, [course, authUser]);

    const openModal = (courseItem) => {
        setSelectedCourse(courseItem);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setIsModalOpen(false);
    };

    const filteredCourses = yourCourses?.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Card className='bg-transparent shadow-none'>
                <CardBody className='bg-transparent'>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <CardTitle tag="h5">Courses</CardTitle>
                        <div className="w-50">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        {filteredCourses && filteredCourses.length > 0 ? (
                            filteredCourses.map((item, index) => (
                                <div
                                    className="col-sm-6 col-md-4 col-lg-3 mb-4"
                                    key={index}
                                    onClick={() => openModal(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="shadow rounded bg-white h-100"
                                        style={{
                                            border: item.status === 'active' ? '3px solid green' : '3px solid red',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                objectFit: 'contain',
                                                borderBottom: '1px solid #ddd',
                                                borderTopLeftRadius: '5px',
                                                borderTopRightRadius: '5px',
                                                backgroundColor: 'rgb(146, 146, 199)',
                                            }}
                                        />
                                        <div className="p-3">
                                            <h5 className="text-primary mb-2">{item.name}</h5>
                                            <p className="mb-1"><strong>Join Code:</strong> {item.join_code}</p>
                                            <p className="mb-1"><strong>Duration:</strong> {item.duration} Months</p>
                                            <p className="mb-0"><strong>Subjects:</strong> {item.subjects?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No courses found.</p>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* XXL Modal to display Subjects and Materials */}
            <Modal isOpen={isModalOpen} toggle={closeModal} size="xl">
                <ModalHeader toggle={closeModal}>
                    {selectedCourse?.name} - Subjects
                </ModalHeader>
                <ModalBody>
                    {selectedCourse?.subjects?.length > 0 ? (
                        <div className="row">
                            {selectedCourse.subjects.map((subject, index) => (
                                <div key={index} className="col-md-6 col-lg-4 mb-4 d-flex">
                                    <div className="subject-card border p-3 rounded shadow-sm bg-light w-100 d-flex flex-column">
                                        <h5 className="text-success">{subject.name}</h5>
                                        <div className="flex-grow-1">
                                            {subject.materials && subject.materials.length > 0 ? (
                                                <ol className="ps-3">
                                                    {subject.materials.map((mat, idx) => (
                                                        <li key={idx}>
                                                            <a href={`/course/materials/${mat._id}`} rel="noopener noreferrer">
                                                                {mat.name.toUpperCase()} - {mat.content_type.toUpperCase()}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ol>
                                            ) : (
                                                <p className="text-muted">No materials available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No subjects available.</p>
                    )}
                </ModalBody>
            </Modal>
        </div>
    );
};

export default Courses;
