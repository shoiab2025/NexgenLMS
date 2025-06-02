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
            course_type: fetchedCourseData.course_type || "general",
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
              <FormGroup>
                <Label for="description">Description</Label>
                <ReactQuill
                  value={courseData.description || ""}
                  onChange={(value) =>
                    setCourseData((prev) => ({ ...prev, description: value }))
                  }
                />
              </FormGroup>
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
                  {authUser?.user?.isAdmin && (
                    <>
                      <option value="school">School</option>
                      <option value="college">College</option>
                      <option value="academic">Academic</option>
                    </>
                  )}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="duration">Duration (hours)</Label>
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
              <FormGroup>
                <Label for="imageUrl">Image URL</Label>
                <Input
                  type="text"
                  value={courseData.imageUrl}
                  className="form-control"
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
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
                      maxHeight: "300px",
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
            </TabPane>
            {/* Subjects Tab */}
            <TabPane tabId={TABS.SUBJECTS} style={{ padding: "0px" }}>
              {courseData.subjects.map((subject, subjectIndex) => (
                <div key={subjectIndex} className="mb-3">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h4>Subject {subjectIndex + 1}</h4>
                    <Button
                      color="danger"
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
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </div>
              ))}
              <Button color="primary mb-2" onClick={addSubject}>
                <i className="bi bi-plus-circle-fill"></i> Add
              </Button>
            </TabPane>
            {/* Materials Tab */}
            <TabPane tabId={TABS.MATERIALS} style={{ padding: "0px" }}>
              {courseData.subjects.map((subject, subjectIndex) => (
                <div key={subjectIndex}>
                  {subject.materials.map((material, materialIndex) => (
                    <div key={materialIndex} className="my-3">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <h5>{subject.name} Materials</h5>
                        </div>
                        <div>
                          <Button
                            color="danger"
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
                      </div>
                      <FormGroup>
                        <Label
                          for={`material-name-${subjectIndex}-${materialIndex}`}
                        >
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
                  ))}
                  <Button
                    color="primary mb-2"
                    onClick={() => addMaterial(subjectIndex)}
                  >
                    <i className="bi bi-plus-circle-fill"></i> Add
                  </Button>
                </div>
              ))}
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
