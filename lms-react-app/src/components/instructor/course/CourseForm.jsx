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
  Spinner,
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

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Get tab order for navigation
  const tabOrder = [TABS.COURSE, TABS.SUBJECTS, TABS.MATERIALS];

  useEffect(() => {
    if (courseId) {
      setLoading(true);
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [courseId, authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation before submit
    if (!validateCurrentTab()) {
      return;
    }

    setSubmitting(true);
    try {
      // Generate join code for new courses
      if (!courseId) {
        // Generate 2-letter unique suffix
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const letter1 = letters[Math.floor(Math.random() * letters.length)];
        const letter2 = letters[Math.floor(Math.random() * letters.length)];
        const uniqueSuffix = `${letter1}${letter2}`;
        const generatedJoinCode = `NCL1-${uniqueSuffix}`;
        
        courseData.join_code = generatedJoinCode;
      }

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
    } finally {
      setSubmitting(false);
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
    setSaving(true);
    setTimeout(() => {
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
      setSaving(false);
    }, 300);
  };

  const addMaterial = (subjectIndex) => {
    setSaving(true);
    setTimeout(() => {
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
      setSaving(false);
    }, 300);
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const goToNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const validateCurrentTab = () => {
    switch (activeTab) {
      case TABS.COURSE:
        if (!courseData.name.trim()) {
          toast.error("Course name is required");
          return false;
        }
        if (!courseData.description || courseData.description === "<p><br></p>") {
          toast.error("Course description is required");
          return false;
        }
        if (!courseData.duration) {
          toast.error("Course duration is required");
          return false;
        }
        if (!courseData.course_type) {
          toast.error("Course type is required");
          return false;
        }
        return true;

      case TABS.SUBJECTS:
        if (courseData.subjects.length === 0) {
          toast.error("At least one subject is required");
          return false;
        }
        for (let i = 0; i < courseData.subjects.length; i++) {
          const subject = courseData.subjects[i];
          if (!subject.name.trim()) {
            toast.error(`Subject ${i + 1} name is required`);
            return false;
          }
          if (!subject.description || subject.description === "<p><br></p>") {
            toast.error(`Subject ${i + 1} description is required`);
            return false;
          }
          if (!subject.duration) {
            toast.error(`Subject ${i + 1} duration is required`);
            return false;
          }
        }
        return true;

      case TABS.MATERIALS:
        for (let i = 0; i < courseData.subjects.length; i++) {
          const subject = courseData.subjects[i];
          for (let j = 0; j < subject.materials.length; j++) {
            const material = subject.materials[j];
            if (!material.name.trim()) {
              toast.error(`Material ${j + 1} in Subject ${i + 1} name is required`);
              return false;
            }
            if (!material.content_type) {
              toast.error(`Material ${j + 1} in Subject ${i + 1} content type is required`);
              return false;
            }
          }
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      goToNextTab();
    }
  };

  const handlePrevious = () => {
    goToPreviousTab();
  };

  // Loading overlay component
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <Spinner color="primary" className="me-2" />
          <span>Loading course data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-2">
      {submitting && (
        <div className="overlay-loader">
          <div className="spinner-container">
            <Spinner color="primary" size="lg" />
            <p className="mt-3">Saving course data...</p>
          </div>
        </div>
      )}

      <h2 style={{ textDecoration: "none", marginBottom: "0.5rem" }}>
        {courseId ? "Edit Course" : "Create Course"}
      </h2>
      
      {/* Progress Indicator */}
      <div className="progress mb-4" style={{ height: "8px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${(tabOrder.indexOf(activeTab) + 1) * 33.33}%`,
            transition: "width 0.3s ease",
          }}
          aria-valuenow={(tabOrder.indexOf(activeTab) + 1) * 33.33}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 text-primary">
          Step {tabOrder.indexOf(activeTab) + 1} of {tabOrder.length}:{" "}
          {activeTab === TABS.COURSE && "Course Details"}
          {activeTab === TABS.SUBJECTS && "Subjects"}
          {activeTab === TABS.MATERIALS && "Materials"}
        </h5>
      </div>

      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ 
              active: activeTab === TABS.COURSE,
              "text-success": tabOrder.indexOf(activeTab) > 0
            })}
            onClick={() => toggleTab(TABS.COURSE)}
          >
            <i className="bi bi-book me-1"></i> Course
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ 
              active: activeTab === TABS.SUBJECTS,
              "text-success": tabOrder.indexOf(activeTab) > 1
            })}
            onClick={() => toggleTab(TABS.SUBJECTS)}
          >
            <i className="bi bi-journal-text me-1"></i> Subjects
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ 
              active: activeTab === TABS.MATERIALS,
              "text-success": tabOrder.indexOf(activeTab) > 2
            })}
            onClick={() => toggleTab(TABS.MATERIALS)}
          >
            <i className="bi bi-file-earmark-text me-1"></i> Materials
          </NavLink>
        </NavItem>
      </Nav>
      
      <Form onSubmit={handleSubmit}>
        <div className="tab-container position-relative">
          {saving && (
            <div className="saving-overlay">
              <Spinner color="primary" size="sm" className="me-2" />
              <span>Saving...</span>
            </div>
          )}
          
          <TabContent activeTab={activeTab}>
            {/* Course Tab */}
            <TabPane
              tabId={TABS.COURSE}
              style={{ cursor: "pointer", padding: "20px", border: "1px solid #dee2e6", borderTop: "none", borderRadius: "0 0 5px 5px" }}
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
                  disabled={submitting}
                />
              </FormGroup>

              {/* Course Name */}
              <FormGroup>
                <Label for="name">Course Name *</Label>
                <Input
                  type="text"
                  value={courseData.name}
                  placeholder="Enter course name"
                  className="form-control"
                  required
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
                  disabled={submitting}
                />
                <Input
                  type="hidden"
                  value={courseData.join_code}
                  className="form-control"
                />
              </FormGroup>

              {/* Description */}
              <FormGroup>
                <Label for="description">Description *</Label>
                <ReactQuill
                  value={courseData.description || ""}
                  onChange={(value) =>
                    setCourseData((prev) => ({ ...prev, description: value }))
                  }
                  placeholder="Enter course description..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  style={{ minHeight: "150px", marginBottom: "50px" }}
                  readOnly={submitting}
                />
              </FormGroup>

              {/* Course Type */}
              <FormGroup>
                <Label for="course_type">Course Type *</Label>
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
                  required
                  disabled={submitting}
                >
                  <option value="">Select Course Type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Input>
              </FormGroup>

              {/* Duration */}
              <FormGroup>
                <Label for="duration">Duration (Months) *</Label>
                <Input
                  type="number"
                  value={courseData.duration}
                  placeholder="Enter course duration"
                  className="form-control"
                  required
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  disabled={submitting}
                />
              </FormGroup>
            </TabPane>

            {/* Subjects Tab */}
            <TabPane tabId={TABS.SUBJECTS} style={{ padding: "20px", border: "1px solid #dee2e6", borderTop: "none", borderRadius: "0 0 5px 5px" }}>
              <Row>
                {courseData.subjects.map((subject, subjectIndex) => (
                  <Col md={6} sm={12} key={subjectIndex} className="mb-4">
                    <div className="p-3 border rounded shadow-sm bg-light h-100">
                      {/* Header with delete button */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Subject {subjectIndex + 1}</h5>
                        {courseData.subjects.length > 1 && (
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
                            disabled={submitting}
                          >
                            <i className="bi bi-x-circle-fill"></i>
                          </Button>
                        )}
                      </div>

                      {/* Subject Name */}
                      <FormGroup>
                        <Label for={`subject-name-${subjectIndex}`}>Subject Name *</Label>
                        <Input
                          type="text"
                          id={`subject-name-${subjectIndex}`}
                          value={subject.name}
                          onChange={(e) =>
                            handleSubjectChange(subjectIndex, "name", e.target.value)
                          }
                          placeholder="Enter subject name"
                          required
                          disabled={submitting}
                        />
                      </FormGroup>

                      {/* Subject Description */}
                      <FormGroup>
                        <Label for={`subject-description-${subjectIndex}`}>
                          Subject Description *
                        </Label>
                        <ReactQuill
                          value={subject.description || ""}
                          onChange={(value) =>
                            handleSubjectChange(subjectIndex, "description", value)
                          }
                          placeholder="Enter subject description..."
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, false] }],
                              ["bold", "italic", "underline"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["link"],
                              ["clean"],
                            ],
                          }}
                          style={{ minHeight: "150px", marginBottom: "50px" }}
                          readOnly={submitting}
                        />
                      </FormGroup>

                      {/* Subject Duration */}
                      <FormGroup>
                        <Label for={`subject-duration-${subjectIndex}`}>
                          Subject Duration (Months) *
                        </Label>
                        <Input
                          type="number"
                          id={`subject-duration-${subjectIndex}`}
                          value={subject.duration}
                          onChange={(e) =>
                            handleSubjectChange(subjectIndex, "duration", e.target.value)
                          }
                          placeholder="e.g., 6"
                          required
                          disabled={submitting}
                        />
                      </FormGroup>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Add Subject Button */}
              <div className="text-center mt-3">
                <Button color="primary" onClick={addSubject} disabled={submitting || saving}>
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle-fill"></i> Add Subject
                    </>
                  )}
                </Button>
              </div>
            </TabPane>

            {/* Materials Tab */}
            <TabPane tabId={TABS.MATERIALS} style={{ padding: "20px", border: "1px solid #dee2e6", borderTop: "none", borderRadius: "0 0 5px 5px" }}>
              <Row>
                {courseData.subjects.map((subject, subjectIndex) => (
                  <Col md={12} key={subjectIndex}>
                    <div className="mb-4 p-3 border rounded">
                      <div className="bg-primary py-2 d-flex flex-column justify-content-center align-items-center rounded mb-3">
                        <h4 className="mb-0 text-white">{subject.name} Materials</h4>
                      </div>

                      <Row>
                        {subject.materials.map((material, materialIndex) => (
                          <Col md={12} lg={6} key={materialIndex} className="mb-3">
                            <div className="my-3 p-3 border rounded">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <h5 className="mb-0">Material {materialIndex + 1}</h5>
                                {subject.materials.length > 1 && (
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
                                    disabled={submitting}
                                  >
                                    <i className="bi bi-x-circle-fill"></i>
                                  </Button>
                                )}
                              </div>

                              <FormGroup>
                                <Label for={`material-name-${subjectIndex}-${materialIndex}`}>
                                  Material Name *
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
                                  required
                                  disabled={submitting}
                                />
                              </FormGroup>

                              <FormGroup>
                                <Label for={`material-description-${subjectIndex}-${materialIndex}`}>
                                  Material Description
                                </Label>
                                <ReactQuill
                                  id={`material-description-${subjectIndex}-${materialIndex}`}
                                  value={material.description || ""}
                                  onChange={(value) =>
                                    handleMaterialChange(subjectIndex, materialIndex, "description", value)
                                  }
                                  theme="snow"
                                  modules={{
                                    toolbar: [
                                      [{ header: [1, 2, false] }],
                                      ["bold", "italic", "underline", "strike"],
                                      [{ list: "ordered" }, { list: "bullet" }],
                                      ["link", "image"],
                                      ["clean"],
                                    ],
                                  }}
                                  formats={[
                                    "header",
                                    "bold", "italic", "underline", "strike",
                                    "list", "bullet",
                                    "link", "image"
                                  ]}
                                  placeholder="Enter material description..."
                                  style={{ minHeight: "150px" }}
                                  readOnly={submitting}
                                />
                              </FormGroup>
                              <FormGroup>
                                <Label
                                  for={`material-content_type-${subjectIndex}-${materialIndex}`}
                                >
                                  Content Type *
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
                                  required
                                  disabled={submitting}
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
                                  disabled={submitting}
                                />
                              </FormGroup>
                            </div>
                          </Col>
                        ))}
                      </Row>

                      <Button
                        color="primary"
                        className="mt-2"
                        onClick={() => addMaterial(subjectIndex)}
                        disabled={submitting || saving}
                      >
                        {saving ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle-fill"></i> Add Material
                          </>
                        )}
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </TabPane>
          </TabContent>
          
          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-4 pt-3 border-top">
            <div>
              {activeTab !== TABS.COURSE && (
                <Button
                  color="secondary"
                  onClick={handlePrevious}
                  className="me-2"
                  disabled={submitting || saving}
                >
                  <i className="bi bi-arrow-left me-1"></i> Previous
                </Button>
              )}
            </div>
            
            <div>
              {activeTab !== TABS.MATERIALS ? (
                <Button
                  color="primary"
                  onClick={handleNext}
                  disabled={submitting || saving}
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Next <i className="bi bi-arrow-right ms-1"></i>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  color="success"
                  type="submit"
                  disabled={submitting || saving}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      {courseId ? "Updating..." : "Creating..."}
                    </>
                  ) : courseId ? (
                    <>
                      <i className="bi bi-check-circle me-1"></i> Update Course
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-1"></i> Create Course
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Form>

      {/* Add CSS for loading overlays */}
      <style>
        {`
          .overlay-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          
          .spinner-container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
          
          .saving-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            font-weight: 500;
            color: #4f46e5;
          }
          
          .tab-container {
            position: relative;
            min-height: 200px;
          }
          
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default CourseForm;