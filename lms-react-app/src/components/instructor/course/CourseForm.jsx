import React, { useState, useEffect } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CourseForm = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    duration: 0,
    subjects: [],
    materials: [],
  });

  const { courseId } = useParams();
  const navigate = useNavigate();

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await axios.get(
            `/api/courses/get-course/${courseId}`
          );
          setCourseData(response.data);
        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    const computedDuration = duration(courseData.subjects);
    setCourseData((prev) => ({ ...prev, duration: computedDuration }));
  }, [courseData.subjects]);

  const duration = (subjects) => {
    return subjects.reduce(
      (acc, subj) => acc + parseFloat(subj.duration || 0),
      0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleQuillChange = (value) => {
    setCourseData({ ...courseData, description: value });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...courseData.subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setCourseData({ ...courseData, subjects: newSubjects });
  };

  const addSubject = () => {
    setCourseData({
      ...courseData,
      subjects: [...courseData.subjects, { name: "", duration: "" }],
    });
  };

  const removeSubject = (index) => {
    const newSubjects = [...courseData.subjects];
    newSubjects.splice(index, 1);
    setCourseData({ ...courseData, subjects: newSubjects });
  };

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...courseData.materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    setCourseData({ ...courseData, materials: newMaterials });
  };

  const addMaterial = () => {
    setCourseData({
      ...courseData,
      materials: [...courseData.materials, { name: "", type: "" }],
    });
  };

  const removeMaterial = (index) => {
    const newMaterials = [...courseData.materials];
    newMaterials.splice(index, 1);
    setCourseData({ ...courseData, materials: newMaterials });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const computedDuration = duration(courseData.subjects);
      const finalCourseData = {
        ...courseData,
        duration: computedDuration,
      };

      if (courseId) {
        await axios.put(
          `/api/courses/update-course/${courseId}`,
          finalCourseData
        );
        toast.success("Course updated successfully!");
      } else {
        await axios.post("/api/courses/create-course", finalCourseData);
        toast.success("Course created successfully!");
      }
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error submitting form. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Card>
            <CardBody>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => toggleTab("1")}
                  >
                    Course Details
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => toggleTab("2")}
                  >
                    Subjects
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => toggleTab("3")}
                  >
                    Materials
                  </NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={activeTab} className="mt-3">
                <TabPane tabId="1">
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label for="title">Title</Label>
                      <Input
                        type="text"
                        name="title"
                        id="title"
                        value={courseData.title}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <ReactQuill
                        value={courseData.description}
                        onChange={handleQuillChange}
                      />
                    </FormGroup>
                    <Input
                      type="number"
                      name="duration"
                      value={courseData.duration}
                      onChange={handleInputChange}
                    />

                    <Button type="submit" color="primary">
                      {courseId ? "Update Course" : "Create Course"}
                    </Button>
                  </Form>
                </TabPane>

                <TabPane tabId="2">
                  <FormGroup>
                    {courseData.subjects.map((subject, index) => (
                      <Row key={index} className="align-items-center mb-2">
                        <Col md={5}>
                          <Input
                            type="text"
                            placeholder="Subject Name"
                            value={subject.name}
                            onChange={(e) =>
                              handleSubjectChange(index, "name", e.target.value)
                            }
                          />
                        </Col>
                        <Col md={5}>
                          <Input
                            type="number"
                            placeholder="Duration (in hours)"
                            value={subject.duration}
                            onChange={(e) =>
                              handleSubjectChange(
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                          />
                        </Col>
                        <Col md={2}>
                          <Button
                            color="danger"
                            onClick={() => removeSubject(index)}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button color="secondary" onClick={addSubject}>
                      Add Subject
                    </Button>
                  </FormGroup>
                </TabPane>

                <TabPane tabId="3">
                  <FormGroup>
                    {courseData.materials.map((material, index) => (
                      <Row key={index} className="align-items-center mb-2">
                        <Col md={5}>
                          <Input
                            type="text"
                            placeholder="Material Name"
                            value={material.name}
                            onChange={(e) =>
                              handleMaterialChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </Col>
                        <Col md={5}>
                          <Input
                            type="text"
                            placeholder="Type (e.g., PDF, Video)"
                            value={material.type}
                            onChange={(e) =>
                              handleMaterialChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                          />
                        </Col>
                        <Col md={2}>
                          <Button
                            color="danger"
                            onClick={() => removeMaterial(index)}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button color="secondary" onClick={addMaterial}>
                      Add Material
                    </Button>
                  </FormGroup>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseForm;
