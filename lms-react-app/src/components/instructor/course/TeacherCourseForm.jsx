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
  console.log("The auth user", authUser);
  useEffect(() => {
    if (courseId) {
      axios
        .get(`/api/courses/${courseId}`)
        .then((response) => {
          const fetchedCourseData = response.data;
          if (!Array.isArray(fetchedCourseData.subjects)) {
            fetchedCourseData.subjects = [];
          }
          setCourseData({
            name: fetchedCourseData.name || "",
            description: fetchedCourseData.description || "",
            duration: fetchedCourseData.duration || "",
            course_type: fetchedCourseData.course_type || "general",
            imageUrl: fetchedCourseData.imageUrl || "",
            join_code: fetchedCourseData.join_code || "",
            subjects: fetchedCourseData.subjects.map((subject) => ({
              _id: subject._id || "",
              name: subject.name || "",
              description: subject.description || "",
              duration: subject.duration || "",
              materials:
                Array.isArray(subject.materials) && subject.materials.length > 0
                  ? subject.materials.map((material) => ({
                      name: material.name || "",
                      description: material.description || "",
                      content_type: material.content_type || "",
                      content_url: material.content_url || "",
                    }))
                  : [
                      {
                        name: "",
                        description: "",
                        content_type: "",
                        content_url: "",
                      },
                    ],
            })),
          });
        })
        .catch((error) => {
          toast.error("Failed to load course data. Please try again.");
        });
    }
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (courseId) {
        await axios.put(`/api/courses/update-course/${courseId}`, courseData);
        toast.success("Course updated successfully!");
      } else {
        await axios.post("/api/courses/create-course", courseData);
        toast.success("Course created successfully!");
      }
      navigate("/teacher/courses");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error submitting form. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...courseData.subjects];
    updatedSubjects[index][field] = value;
    setCourseData({ ...courseData, subjects: updatedSubjects });
  };

  const handleMaterialChange = (subjectIndex, materialIndex, field, value) => {
    const updatedSubjects = [...courseData.subjects];
    const updatedMaterials = [...updatedSubjects[subjectIndex].materials];
    updatedMaterials[materialIndex][field] = value;
    updatedSubjects[subjectIndex].materials = updatedMaterials;
    setCourseData({ ...courseData, subjects: updatedSubjects });
  };

  const addSubject = () => {
    setCourseData({
      ...courseData,
      subjects: [
        ...courseData.subjects,
        {
          name: "",
          description: "",
          duration: "",
          materials: [
            { name: "", description: "", content_type: "", content_url: "" },
          ],
        },
      ],
    });
  };

  const addMaterial = (subjectIndex) => {
    const updatedSubjects = [...courseData.subjects];
    updatedSubjects[subjectIndex].materials.push({
      name: "",
      description: "",
      content_type: "",
      content_url: "",
    });
    setCourseData({ ...courseData, subjects: updatedSubjects });
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3" style={{ textDecoration: "none" }}>
        {courseId ? "Edit Course" : "Create Course"}
      </h2>
      <Nav tabs className="flex-nowrap flex-md-wrap overflow-auto mb-3" style={{ WebkitOverflowScrolling: "touch" }}>
        <NavItem className="flex-fill text-center">
          <NavLink
            className={classnames({ active: activeTab === TABS.COURSE })}
            onClick={() => toggleTab(TABS.COURSE)}
            style={{ cursor: "pointer" }}
          >
            Course
          </NavLink>
        </NavItem>
        <NavItem className="flex-fill text-center">
          <NavLink
            className={classnames({ active: activeTab === TABS.SUBJECTS })}
            onClick={() => toggleTab(TABS.SUBJECTS)}
            style={{ cursor: "pointer" }}
          >
            Subjects
          </NavLink>
        </NavItem>
        <NavItem className="flex-fill text-center">
          <NavLink
            className={classnames({ active: activeTab === TABS.MATERIALS })}
            onClick={() => toggleTab(TABS.MATERIALS)}
            style={{ cursor: "pointer" }}
          >
            Materials
          </NavLink>
        </NavItem>
      </Nav>
      <Form onSubmit={handleSubmit}>
        <TabContent activeTab={activeTab}>
          {/* Course Tab */}
          <TabPane tabId={TABS.COURSE} className="p-2 p-md-4">
            <Row>
              <Col xs="12" md="6">
                <FormGroup>
                  <Label for="name">Course Name</Label>
                  <Input
                    type="text"
                    value={courseData.name}
                    placeholder="Enter course name"
                    className="form-control"
                    onChange={(e) => {
                      const name = e.target.value;
                      const sanitizedName = name
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      const uniqueSuffix = Date.now().toString(36).toUpperCase();
                      const join_code = `NCL1-${uniqueSuffix}`;
                      setCourseData({ ...courseData, name, join_code });
                    }}
                  />
                  <Input
                    type="hidden"
                    value={courseData.join_code}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
              <Col xs="12" md="6">
                <FormGroup>
                  <Label for="imageUrl">Image URL</Label>
                  <Input
                    type="text"
                    value={courseData.imageUrl}
                    className="form-control"
                    onChange={(e) =>
                      setCourseData({ ...courseData, imageUrl: e.target.value })
                    }
                  />
                </FormGroup>
                {courseData.imageUrl && (
                  <div className="image-preview mt-2">
                    <Label>Image Preview:</Label>
                    <div
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={courseData.imageUrl.toString()}
                        alt="Course Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <FormGroup>
              <Label for="description">Description</Label>
              <ReactQuill
                value={courseData.description || ""}
                onChange={(value) =>
                  setCourseData((prev) => ({ ...prev, description: value }))
                }
              />
            </FormGroup>
            <Row>
              <Col xs="12" md="6">
                <FormGroup>
                  <Label for="course_type">Course Type</Label>
                  <Input
                    type="select"
                    id={`material-content_type-${0}-${0}`}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        course_type: e.target.value,
                      })
                    }
                    value={courseData.course_type}
                  >
                    <option value="">Select Content Type</option>
                    <option value="general">General</option>
                    {authUser?.user?.isApproved && (
                      <>
                        {authUser.user.institution?.type?.toLowerCase() ===
                          "school" && <option value="school">School</option>}
                        {authUser.user.institution?.type?.toLowerCase() ===
                          "college" && <option value="college">College</option>}
                        {authUser.user.institution?.type?.toLowerCase() ===
                          "educational center" && (
                          <option value="academic">Academic</option>
                        )}
                      </>
                    )}
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="12" md="6">
                <FormGroup>
                  <Label for="duration">Duration (hours)</Label>
                  <Input
                    type="text"
                    value={courseData.duration}
                    placeholder="Enter course duration"
                    className="form-control"
                    onChange={(e) => {
                      setCourseData({ ...courseData, duration: e.target.value });
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
          </TabPane>

          {/* Subjects Tab */}
          <TabPane tabId={TABS.SUBJECTS} className="p-2 p-md-4">
            {courseData.subjects.map((subject, subjectIndex) => (
              <div key={subjectIndex} className="mb-3 border rounded p-2 p-md-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Subject {subjectIndex + 1}</h5>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() =>
                      setCourseData({
                        ...courseData,
                        subjects: courseData.subjects.filter(
                          (_, index) => index !== subjectIndex
                        ),
                      })
                    }
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </Button>
                </div>
                <FormGroup>
                  <Label for={`subject-name-${subjectIndex}`}>
                    Subject Name
                  </Label>
                  <Input
                    type="text"
                    id={`subject-name-${subjectIndex}`}
                    value={subject.name}
                    onChange={(e) =>
                      handleSubjectChange(
                        subjectIndex,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </FormGroup>
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
                <FormGroup>
                  <Label for={`subject-duration-${subjectIndex}`}>
                    Subject Duration (hours)
                  </Label>
                  <Input
                    type="number"
                    id={`subject-duration-${subjectIndex}`}
                    value={subject.duration}
                    onChange={(e) =>
                      handleSubjectChange(
                        subjectIndex,
                        "duration",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </FormGroup>
              </div>
            ))}
            <Button color="primary" block onClick={addSubject}>
              <i className="bi bi-plus-circle-fill"></i> Add
            </Button>
          </TabPane>

          {/* Materials Tab */}
          <TabPane tabId={TABS.MATERIALS} className="p-2 p-md-4">
            {courseData.subjects.map((subject, subjectIndex) => (
              <div key={subjectIndex} className="mb-4 border rounded p-2 p-md-3">
                <h5>{subject.name} Materials</h5>
                {subject.materials.map((material, materialIndex) => (
                  <div key={materialIndex} className="my-3 border-bottom pb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Material {materialIndex + 1}</span>
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
                      <Label for={`material-description-${subjectIndex}-${materialIndex}`}>
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
                      <Label for={`material-content_type-${subjectIndex}-${materialIndex}`}>
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
                      <Label for={`material-content_url-${subjectIndex}-${materialIndex}`}>
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
                ))}
                <Button
                  color="primary"
                  block
                  onClick={() => addMaterial(subjectIndex)}
                >
                  <i className="bi bi-plus-circle-fill"></i> Add
                </Button>
              </div>
            ))}
          </TabPane>
        </TabContent>
        <Button color="success" type="submit" block className="mt-3">
          {courseId ? "Update Course" : "Create Course"}
        </Button>
      </Form>
    </div>
  );
};

export default CourseForm;
