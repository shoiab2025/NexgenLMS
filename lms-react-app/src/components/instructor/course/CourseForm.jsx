import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import classnames from "classnames";
import { useAuthcontext } from "../../../contexts/Authcontext";

const TABS = {
  COURSE: "course",
  SUBJECTS: "subjects",
  MATERIALS: "materials",
};

const CourseForm = () => {
  const [activeTab, setActiveTab] = useState(TABS.COURSE);
  const { authUser } = useAuthcontext();
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    duration: "",
    imageUrl: "",
    course_type: "",
    join_code: "",
    subjects: [
      {
        name: "",
        description: "",
        duration: "",
        materials: [
          { name: "", description: "", content_type: "", content_url: "" },
        ],
      },
    ],
    created_by: authUser?.user,
  });

  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) {
      axios
        .get(`/api/courses/${courseId}`)
        .then((response) => {
          const fetchedCourseData = response.data;
          const normalizedSubjects = Array.isArray(fetchedCourseData.subjects)
            ? fetchedCourseData.subjects.map((subject) => ({
              _id: subject?._id || "",
              name: subject?.name || "",
              description: subject?.description || "",
              duration: subject?.duration || "",
              materials: Array.isArray(subject?.materials)
                ? subject?.materials?.map((material) => ({
                  _id: material?._id || "",
                  name: material?.name || "",
                  description: material?.description || "",
                  content_type: material?.content_type || "",
                  content_url: material?.content_url || "",
                }))
                : [
                  {
                    name: "",
                    description: "",
                    content_type: "",
                    content_url: "",
                  },
                ],
            }))
            : [];

          setCourseData((prev) => ({
            ...prev,
            name: fetchedCourseData.name || "",
            description: fetchedCourseData.description || "",
            duration: fetchedCourseData.duration || "",
            imageUrl: fetchedCourseData.imageUrl || "",
            course_type: fetchedCourseData.course_type || "public",
            join_code: fetchedCourseData.join_code || "",
            subjects: normalizedSubjects,
            created_by: fetchedCourseData.created_by || authUser?.user,
          }));
        })
        .catch((error) => {
          console.error("Error fetching course data:", error);
          toast.error("Failed to load course data. Please try again.");
        });
    }
  }, [courseId, authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...courseData, created_by: authUser?.user };
      if (courseId) {
        await axios.put(`/api/courses/update-course/${courseId}`, dataToSend);
        toast.success("Course updated successfully!");
      } else {
        await axios.post("/api/courses/create-course", dataToSend);
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

  const handleSubjectChange = (index, field, value) => {
    setCourseData((prev) => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[index][field] = value;
      return { ...prev, subjects: updatedSubjects };
    });
  };

  const handleMaterialChange = (subjectIndex, materialIndex, field, value) => {
    setCourseData((prev) => {
      const updatedSubjects = [...prev.subjects];
      const updatedMaterials = [...updatedSubjects[subjectIndex].materials];
      updatedMaterials[materialIndex][field] = value;
      updatedSubjects[subjectIndex].materials = updatedMaterials;
      return { ...prev, subjects: updatedSubjects };
    });
  };

  const addSubject = () => {
    setCourseData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          name: "",
          description: "",
          duration: "",
          materials: [
            { name: "", description: "", content_type: "", content_url: "" },
          ],
        },
      ],
    }));
  };

  const addMaterial = (subjectIndex) => {
    setCourseData((prev) => {
      const updatedSubjects = [...prev.subjects];
      updatedSubjects[subjectIndex].materials.push({
        name: "",
        description: "",
        content_type: "",
        content_url: "",
      });
      return { ...prev, subjects: updatedSubjects };
    });
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="container mt-2">
      <h2 style={{ textDecoration: "none", marginBottom: "0.5rem" }}>
        {courseId ? "Edit Course" : "Create Course"}
      </h2>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === TABS.COURSE })}
            onClick={() => toggleTab(TABS.COURSE)}
          >
            Course
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === TABS.SUBJECTS })}
            onClick={() => toggleTab(TABS.SUBJECTS)}
          >
            Subjects
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === TABS.MATERIALS })}
            onClick={() => toggleTab(TABS.MATERIALS)}
          >
            Materials
          </NavLink>
        </NavItem>
      </Nav>
      <Form onSubmit={handleSubmit}>
        <div className="tab-container">
          <TabContent activeTab={activeTab}>
            {/* Course Tab */}
            <TabPane
              tabId={TABS.COURSE}
              style={{ cursor: "pointer", padding: "0px" }}
            >

              {/* Image Preview */}
              {courseData.imageUrl && (
                <div className="image-preview mt-2">
                  <Label className="mb-1">Image Preview:</Label>
                  <div className="course-image-wrapper">
                    <img
                      src={courseData.imageUrl.toString()}
                      alt="Course Preview"
                      className="course-image-preview my-3"
                      style={{width: '250px', height: '250px', objectFit: 'contain'}}
                    />
                  </div>
                </div>
              )}

              {/* Image URL */}
              <FormGroup>
                <Label for="imageUrl">Image URL</Label>
                <Input
                  type="text"
                  value={courseData.imageUrl}
                  className="form-control"
                  placeholder="Enter image URL"
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                />
              </FormGroup>

              {/* Course Name */}
              <FormGroup>
                <Label for="name">Course Name</Label>
                <Input
                  type="text"
                  value={courseData.name}
                  placeholder="Enter course name"
                  className="form-control"
                  onChange={(e) => {
                    const name = e.target.value;
                    const sanitizedName = name.toUpperCase().replace(/[^A-Z0-9]/g, "");
                    const uniqueSuffix = Date.now().toString(36).toUpperCase();
                    const join_code = `${sanitizedName}-${uniqueSuffix}`;
                    setCourseData((prev) => ({
                      ...prev,
                      name,
                      join_code,
                    }));
                  }}
                />
                <Input
                  type="hidden"
                  value={courseData.join_code}
                  className="form-control"
                />
              </FormGroup>

              {/* Description */}
              <FormGroup>
                <Label for="description">Description</Label>
                <ReactQuill
                  value={courseData.description || ""}
                  onChange={(value) =>
                    setCourseData((prev) => ({ ...prev, description: value }))
                  }
                />
              </FormGroup>

              {/* Course Type */}
              <FormGroup>
                <Label for="course_type">Course Type</Label>
                <Input
                  type="select"
                  id="course-type"
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      course_type: e.target.value,
                    }))
                  }
                  value={courseData.course_type}
                >
                  <option value="">Select Content Type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Input>
              </FormGroup>

              {/* Duration */}
              <FormGroup>
                <Label for="duration">Duration (Months)</Label>
                <Input
                  type="number"
                  value={courseData.duration}
                  placeholder="Enter course duration"
                  className="form-control"
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                />
              </FormGroup>



            </TabPane>

            {/* Subjects Tab */}
            <TabPane tabId={TABS.SUBJECTS} style={{ padding: "0px" }}>
              <Row>
                {courseData.subjects.map((subject, subjectIndex) => (
                  <Col md={6} sm={12} key={subjectIndex} className="mb-4">
                    <div className="p-3 border rounded shadow-sm bg-light h-100">
                      {/* Header with delete button */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Subject {subjectIndex + 1}</h5>
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() =>
                            setCourseData((prev) => ({
                              ...prev,
                              subjects: prev.subjects.filter(
                                (_, index) => index !== subjectIndex
                              ),
                            }))
                          }
                        >
                          <i className="bi bi-x-circle-fill"></i>
                        </Button>
                      </div>

                      {/* Subject Name */}
                      <FormGroup>
                        <Label for={`subject-name-${subjectIndex}`}>Subject Name</Label>
                        <Input
                          type="text"
                          id={`subject-name-${subjectIndex}`}
                          value={subject.name}
                          onChange={(e) =>
                            handleSubjectChange(subjectIndex, "name", e.target.value)
                          }
                          placeholder="Enter subject name"
                        />
                      </FormGroup>

                      {/* Subject Description */}
                      <FormGroup>
                        <Label for={`subject-description-${subjectIndex}`}>
                          Subject Description
                        </Label>
                        <ReactQuill
                          value={subject.description || ""}
                          onChange={(value) =>
                            handleSubjectChange(subjectIndex, "description", value)
                          }
                        />
                      </FormGroup>

                      {/* Subject Duration */}
                      <FormGroup>
                        <Label for={`subject-duration-${subjectIndex}`}>
                          Subject Duration (Months)
                        </Label>
                        <Input
                          type="number"
                          id={`subject-duration-${subjectIndex}`}
                          value={subject.duration}
                          onChange={(e) =>
                            handleSubjectChange(subjectIndex, "duration", e.target.value)
                          }
                          placeholder="e.g., 6"
                        />
                      </FormGroup>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Add Subject Button */}
              <div className="text-center mt-3">
                <Button color="primary" onClick={addSubject}>
                  <i className="bi bi-plus-circle-fill"></i> Add Subject
                </Button>
              </div>
            </TabPane>

            {/* Materials Tab */}
            <TabPane tabId={TABS.MATERIALS} style={{ padding: "0px" }}>
              <Row>
                {courseData.subjects.map((subject, subjectIndex) => (
                  <Col md={12} key={subjectIndex}>
                    <div className="mb-4 p-3 border rounded">
                      <div className="bg-primary py-2 d-flex flex-column justify-content-center align-items-center rounded">
                        <h4 className="mb-0">{subject.name} Materials</h4>
                      </div>

                      <Row>
                        {subject.materials.map((material, materialIndex) => (
                          <Col md={12} lg={6} key={materialIndex} className="mb-1">
                            <div className="my-3 p-3 border rounded">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <h5 className="mb-0">Material {materialIndex + 1}</h5>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={() => {
                                    const updatedMaterials = subject.materials.filter(
                                      (_, index) => index !== materialIndex
                                    );
                                    handleSubjectChange(
                                      subjectIndex,
                                      "materials",
                                      updatedMaterials
                                    );
                                  }}
                                >
                                  <i className="bi bi-x-circle-fill"></i>
                                </Button>
                              </div>

                              <FormGroup>
                                <Label for={`material-name-${subjectIndex}-${materialIndex}`}>
                                  Material Name
                                </Label>
                                <Input
                                  type="text"
                                  id={`material-name-${subjectIndex}-${materialIndex}`}
                                  value={material.name}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      subjectIndex,
                                      materialIndex,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormGroup>

                              <FormGroup>
                                <Label
                                  for={`material-description-${subjectIndex}-${materialIndex}`}
                                >
                                  Material Description
                                </Label>
                                <Input
                                  type="text"
                                  id={`material-description-${subjectIndex}-${materialIndex}`}
                                  value={material.description}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      subjectIndex,
                                      materialIndex,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormGroup>

                              <FormGroup>
                                <Label
                                  for={`material-content_type-${subjectIndex}-${materialIndex}`}
                                >
                                  Content Type
                                </Label>
                                <Input
                                  type="select"
                                  id={`material-content_type-${subjectIndex}-${materialIndex}`}
                                  value={material.content_type}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      subjectIndex,
                                      materialIndex,
                                      "content_type",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Content Type</option>
                                  <option value="PDF">PDF</option>
                                  <option value="Video">Video</option>
                                  <option value="Document">Document</option>
                                  <option value="Image">Image</option>
                                </Input>
                              </FormGroup>

                              <FormGroup>
                                <Label
                                  for={`material-content_url-${subjectIndex}-${materialIndex}`}
                                >
                                  Content URL
                                </Label>
                                <Input
                                  type="text"
                                  id={`material-content_url-${subjectIndex}-${materialIndex}`}
                                  value={material.content_url}
                                  onChange={(e) =>
                                    handleMaterialChange(
                                      subjectIndex,
                                      materialIndex,
                                      "content_url",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormGroup>
                            </div>
                          </Col>
                        ))}
                      </Row>

                      <Button
                        color="primary"
                        className="mt-2 mr-auto"
                        onClick={() => addMaterial(subjectIndex)}
                      >
                        <i className="bi bi-plus-circle-fill"></i> Add Material
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </TabPane>

          </TabContent>
          <Button color="success" type="submit">
            {courseId ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CourseForm;
