// TestFormReact.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCreateTests } from "../../hooks/Tests/useCreateTest";
import { useCourse } from "../../hooks/Courses/useCourses";
import { useAuthcontext } from "../../contexts/Authcontext";
import { useParams, useRoutes } from "react-router-dom";
import { useGetTests } from "../../hooks/Tests/getTest";

const defaultQuestion = () => ({
  question_type: "MCQ",
  question_text: "",
  options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
  correct_option: "",
  correct_option_text: "",
  positive_mark: 1,
  correct_answer_solution: "",
  negative_mark: 0,
});

const TestEditForm = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { authUser } = useAuthcontext();
  const user = authUser?.user || null;
  const {id} = useParams();
  const test = useGetTests({id});
  
  console.log(test.tests.data);
  const [testForm, setTestForm] = useState(test.tests.data);

  const { createTest, loading } = useCreateTests();
  const { course } = useCourse();
  const [subject, setSubject] = useState([]);

  const handleInputChange = (field, value) => {
    if (field === "test_subject") {
      const selectedSubject = course.find((sub) => sub._id === value);
      setSubject(selectedSubject ? selectedSubject.subjects : []);
    }
    setTestForm({ ...testForm, [field]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...testForm.test_questions];
    updatedQuestions[index][field] = value;
    setTestForm({ ...testForm, test_questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...testForm.test_questions];
    updatedQuestions[qIndex].options[oIndex].text = value;
    setTestForm({ ...testForm, test_questions: updatedQuestions });
  };

  const addQuestion = () => {
    setTestForm((prev) => ({
      ...prev,
      test_questions: [...prev.test_questions, defaultQuestion()],
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = testForm.test_questions.filter(
      (_, i) => i !== index
    );
    setTestForm({ ...testForm, test_questions: updatedQuestions });
  };

  const addOption = (index) => {
    const updatedQuestions = [...testForm.test_questions];
    if (updatedQuestions[index].options.length < 6) {
      updatedQuestions[index].options.push({ text: "" });
    }
    setTestForm({ ...testForm, test_questions: updatedQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...testForm.questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    if (updatedQuestions[qIndex].options.length < 2) {
      updatedQuestions[qIndex].options.push({ text: "" });
    }
    setTestForm({ ...testForm, questions: updatedQuestions });
  };

  const updateCorrectOptionText = (qIndex, oIndex) => {
    const question = testForm.test_questions[qIndex];
    const selectedOption = String.fromCharCode(65 + oIndex);
    const optionText = question.options[oIndex].text;
    const updatedQuestions = [...testForm.test_questions];
    updatedQuestions[qIndex].correct_option = selectedOption;
    updatedQuestions[qIndex].correct_option_text = optionText;
    setTestForm({ ...testForm, test_questions: updatedQuestions });
  };

  const nextTab = () => {
    if (activeTab === "details") setActiveTab("questions");
    else if (activeTab === "questions") setActiveTab("solutions");
  };

  const prevTab = () => {
    if (activeTab === "solutions") setActiveTab("questions");
    else if (activeTab === "questions") setActiveTab("details");
  };

  const saveTest = async () => {
    try {
      await createTest(testForm); // call it manually when needed
      toast.success("Test saved successfully!");
      setTestForm({
        test_name: "",
        test_type: "pre-test",
        test_duration: "",
        test_subject: "",
        test_lesson: "",
        test_questions: [defaultQuestion()],
      });
      setActiveTab("details");
    } catch (error) {
      console.error("Error saving test:", error);
    }
  };

  return (
    <div className="test-form-container">
      <h1 className="test-form-heading">
        {activeTab === "details" ? "Add Test" : "Edit Test"}
      </h1>

      <div className="test-tabs">
        {["details", "questions", "solutions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <form
          className="test-form"
          onSubmit={(e) => {
            e.preventDefault();
            nextTab();
          }}
        >
          <div className="form-group">
            <label className="form-label">Test Name</label>
            <input
              type="text"
              className="form-input"
              value={testForm.test_name}
              onChange={(e) => handleInputChange("test_name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Test Type</label>
            <select
              className="form-select"
              value={testForm.test_type}
              onChange={(e) => handleInputChange("test_type", e.target.value)}
            >
              <option value="pre-test">Pre Test</option>
              <option value="post-test">Post Test</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Test Duration</label>
            <input
              type="text"
              className="form-input"
              value={testForm.test_duration}
              onChange={(e) =>
                handleInputChange("test_duration", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Test Subject</label>
            <select
              className="form-select"
              value={testForm.test_subject}
              onChange={(e) =>
                handleInputChange("test_subject", e.target.value)
              }
            >
              <option value="">Select Lesson</option>

              {course.map((subject) => (
                <option
                  key={subject._id}
                  value={subject._id}
                  className="form-option"
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Test Lesson</label>
            <select
              className="form-select"
              value={testForm.test_lesson}
              onChange={(e) => handleInputChange("test_lesson", e.target.value)}
            >
              <option value="">Select Lesson</option>
              {subject.map((sub) => (
                <option key={sub._id} value={sub._id} className="form-option">
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="button-container">
            <button type="submit" className="test-button test-button-primary">
              Next
            </button>
          </div>
        </form>
      )}

      {activeTab === "questions" && (
        <form
          className="test-form"
          onSubmit={(e) => {
            e.preventDefault();
            nextTab();
          }}
        >
          {testForm.test_questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <h3 className="question-title">Question {qIndex + 1}</h3>

              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select"
                  value={question.question_type}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "question_type",
                      e.target.value
                    )
                  }
                >
                  <option value="MCQ">MCQ</option>
                  <option value="TrueFalse">True Or False</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Question Text</label>
                {["short_answer", "essay"].includes(question.question_type) ? (
                  <ReactQuill
                    value={question.question_text}
                    onChange={(content) =>
                      handleQuestionChange(qIndex, "question_text", content)
                    }
                  />
                ) : (
                  <textarea
                    className="form-input"
                    value={question.question_text}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "question_text",
                        e.target.value
                      )
                    }
                  />
                )}
              </div>

              {question.question_type === "MCQ" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Options</label>
                    <div className="options-for-question">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="option-item">
                          <input
                            type="text"
                            className="form-input"
                            value={option.text}
                            placeholder={`Option ${String.fromCharCode(
                              65 + oIndex
                            )}`}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                          />
                          <input
                            type="radio"
                            checked={
                              question.correct_option ===
                              String.fromCharCode(65 + oIndex)
                            }
                            onChange={() =>
                              updateCorrectOptionText(qIndex, oIndex)
                            }
                          />
                          <label>{String.fromCharCode(65 + oIndex)}</label>
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="test-button-danger"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="test-button"
                    >
                      Add Option
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correct Option Text</label>
                    <input
                      type="text"
                      value={question.correct_option_text}
                      disabled
                      className="form-input"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Marks</label>
                <input
                  type="number"
                  className="form-input"
                  value={question.positive_mark}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "positive_mark",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Solution</label>
                <ReactQuill
                  value={question.correct_answer_solution}
                  onChange={(content) =>
                    handleQuestionChange(
                      qIndex,
                      "correct_answer_solution",
                      content
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Negative Marks</label>
                <input
                  type="number"
                  className="form-input"
                  value={question.negative_mark}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      "negative_mark",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="test-button-danger test-button"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}

          <div className="button-container">
            <button
              type="button"
              onClick={addQuestion}
              className="test-button-secondary test-button"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="test-button-primary test-button"
              disabled={testForm.test_questions.length === 0}
            >
              Next
            </button>
          </div>
        </form>
      )}

      {activeTab === "solutions" && (
        <form
          className="test-form"
          onSubmit={(e) => {
            e.preventDefault();
            saveTest();
          }}
        >
          {testForm.test_questions.map((question, index) => (
            <div key={index} className="question-solution-form-item">
              <h3 className="question-title">
                Solution {index + 1} for Question: {question.question_text}
              </h3>
              <div className="form-group">
                <label className="form-label">Solution</label>
                <ReactQuill
                  value={question.correct_answer_solution}
                  onChange={(content) =>
                    handleQuestionChange(
                      index,
                      "correct_answer_solution",
                      content
                    )
                  }
                />
              </div>
            </div>
          ))}

          <div className="button-container">
            <button
              type="button"
              onClick={prevTab}
              className="test-button-secondary"
            >
              Previous
            </button>
            <button type="submit" className="test-button-primary">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TestEditForm;
