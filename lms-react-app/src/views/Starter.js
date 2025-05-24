import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import {
  RiBookOpenFill,
  RiGraduationCapFill,
  RiTeamFill,
} from "react-icons/ri";
import { useGroup } from "../hooks/Groups/useGroups";
import { courseListService } from "../service/baseService";
import axios from "axios";
import toast from "react-hot-toast";

const Starter = () => {
  const [institution, Setinstitution] = useState();

  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [cords, setCords] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingins, setLoadingIns] = useState(true);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await courseListService();
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };
  // Fetch all courses
  const fetchIns = async () => {
    try {
      const response = await axios.get("/api/institution");
      Setinstitution(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoadingIns(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      const allUsers = response.data;
      setUsers(allUsers);
      // Categorize users
      setStudents(allUsers.filter(user => user.role === "student" && !user.isAdmin));
      setTeachers(allUsers.filter(user => user.role === "teacher" && !user.isAdmin));
      setAdmins(allUsers.filter(user => user.isAdmin));
      setCords(allUsers.filter(user => user.role === "coordinator" && !user.isAdmin));
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage =
        error.response?.data?.message || "Error fetching users. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchCourses();
    fetchUsers();
    fetchIns();
  }, []);


  // Use loadingUsers for user-related cards
  return (
    <div>
      <Row className="cg-4 rg-2">
        {/* Courses Card */}
        <Col sm="12" lg="3" xl="3" xxl="3">
          <Card className="shadow border-0 rounded-4 p-3 position-relative overflow-hidden stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-light-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                <RiBookOpenFill size={35} color="#0147ab" />
              </div>
              <div>
                <CardTitle tag="h6" className="fw-semibold text-secondary text-uppercase mb-1">
                  Courses
                </CardTitle>
                <h4 className="fw-bold mb-0 text-dark">
                  {loadingCourses ? (
                    <span className="text-warning">Loading...</span>
                  ) : (
                    <span className="count-text">{courses.length}</span>
                  )}
                </h4>
              </div>
            </div>
          </Card>
        </Col>
        {/* Institutions */}
        <Col sm="12" lg="3" xl="3" xxl="3">
          <Card className="shadow border-0 rounded-4 p-3 position-relative overflow-hidden stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-light-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                {/* Changed icon for Institutions */}
                <svg fill="#0147ab" height="35" width="35" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 410 410" xmlSpace="preserve">
                  <g>
                    <path d="M268.912,79.489L205,62.817l-63.913,16.672v21.305H89.678v246.389h68.699v-77.189h38.285v77.189h16.674v-77.189h38.285
    v77.189h68.7V100.794h-51.409V79.489z M134.602,314.456h-25.935v-53.727h25.935V314.456z M134.602,247.763h-25.935v-53.725h25.935
    V247.763z M134.602,181.071h-25.935v-53.723h25.935V181.071z M190.179,247.763h-25.935v-53.725h25.935V247.763z M190.179,181.071
    h-25.935v-53.723h25.935V181.071z M245.756,247.763H219.82v-53.725h25.936V247.763z M245.756,181.071H219.82v-53.723h25.936
    V181.071z M275.397,127.349h25.935v53.723h-25.935V127.349z M275.397,194.038h25.935v53.725h-25.935V194.038z M275.397,260.729
    h25.935v53.727h-25.935V260.729z"/>
                    <path d="M0,347.183h72.389V160.075H0V347.183z M22.986,186.628h27.789v55.885H22.986V186.628z M22.986,258.88h27.789v55.883H22.986
    V258.88z"/>
                    <path d="M337.61,160.075v187.107H410V160.075H337.61z M387.012,314.763h-27.787V258.88h27.787V314.763z M387.012,242.513h-27.787
    v-55.885h27.787V242.513z"/>
                  </g>
                </svg>
              </div>
              <div>
                <CardTitle tag="h6" className="fw-semibold text-secondary text-uppercase mb-1">
                  Institutions
                </CardTitle>
                <h4 className="fw-bold mb-0 text-dark">
                  {loadingins ? (
                    <span className="text-warning">Loading...</span>
                  ) : (
                    <span className="count-text">{institution?.length || 0}</span>
                  )}
                </h4>
              </div>
            </div>
          </Card>
        </Col>
        {/* Total Users */}
        <Col sm="12" lg="3" xl="3" xxl="3">
          <Card className="shadow border-0 rounded-4 p-3 position-relative overflow-hidden stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-light-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                <RiTeamFill fill="#0147ab" size={35} />
              </div>
              <div>
                <CardTitle tag="h6" className="fw-semibold text-secondary text-uppercase mb-1">
                  Total Users
                </CardTitle>
                <h4 className="fw-bold mb-0 text-dark">
                  {loadingUsers ? (
                    <span className="text-warning">Loading...</span>
                  ) : (
                    <span className="count-text">{users.length}</span>
                  )}
                </h4>
              </div>
            </div>
          </Card>
        </Col>
        {/* Students */}
        <Col sm="12" lg="3" xl="3" xxl="3">
          <Card className="shadow border-0 rounded-4 p-3 position-relative overflow-hidden stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-light-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                <RiTeamFill fill="#0147ab" size={35} />
              </div>
              <div>
                <CardTitle tag="h6" className="fw-semibold text-secondary text-uppercase mb-1">
                  Students
                </CardTitle>
                <h4 className="fw-bold mb-0 text-dark">
                  {loadingUsers ? (
                    <span className="text-warning">Loading...</span>
                  ) : (
                    <span className="count-text">{students.length}</span>
                  )}
                </h4>
              </div>
            </div>
          </Card>
        </Col>
        {/* Teachers */}
        <Col sm="12" lg="3" xl="3" xxl="3">
          <Card className="shadow border-0 rounded-4 p-3 position-relative overflow-hidden stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-light-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                <RiGraduationCapFill fill="#0147ab" size={35} />
              </div>
              <div>
                <CardTitle tag="h6" className="fw-semibold text-secondary text-uppercase mb-1">
                  Teachers
                </CardTitle>
                <h4 className="fw-bold mb-0 text-dark">
                  {loadingUsers ? (
                    <span className="text-warning">Loading...</span>
                  ) : (
                    <span className="count-text">{teachers.length}</span>
                  )}
                </h4>
              </div>
            </div>
          </Card>
        </Col>
        {/* Admins */}
        <Col sm="12" lg="3" xl="3" xxl="3">
          <Card className="shadow border-0 rounded-4 p-3 position-relative overflow-hidden stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-light-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                {/* Changed icon for Admins */}
                <svg fill="#0147ab" height="35" width="35" viewBox="0 0 474.565 474.565" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path d="M255.204,102.3c-0.606-11.321-12.176-9.395-23.465-9.395C240.078,95.126,247.967,98.216,255.204,102.3z" />
                    <path d="M134.524,73.928c-43.825,0-63.997,55.471-28.963,83.37c11.943-31.89,35.718-54.788,66.886-63.826
                      C163.921,81.685,150.146,73.928,134.524,73.928z"/>
                    <path d="M43.987,148.617c1.786,5.731,4.1,11.229,6.849,16.438L36.44,179.459c-3.866,3.866-3.866,10.141,0,14.015l25.375,25.383
                      c1.848,1.848,4.38,2.888,7.019,2.888c2.61,0,5.125-1.04,7.005-2.888l14.38-14.404c2.158,1.142,4.55,1.842,6.785,2.827
                      c0-0.164-0.016-0.334-0.016-0.498c0-11.771,1.352-22.875,3.759-33.302c-17.362-11.174-28.947-30.57-28.947-52.715
                      c0-34.592,28.139-62.739,62.723-62.739c23.418,0,43.637,13.037,54.43,32.084c11.523-1.429,22.347-1.429,35.376,1.033
                      c-1.676-5.07-3.648-10.032-6.118-14.683l14.396-14.411c1.878-1.856,2.918-4.38,2.918-7.004c0-2.625-1.04-5.148-2.918-7.004
                      l-25.361-25.367c-1.94-1.941-4.472-2.904-7.003-2.904c-2.532,0-5.063,0.963-6.989,2.904l-14.442,14.411
                      c-5.217-2.764-10.699-5.078-16.444-6.825V9.9c0-5.466-4.411-9.9-9.893-9.9h-35.888c-5.451,0-9.909,4.434-9.909,9.9v20.359
                      c-5.73,1.747-11.213,4.061-16.446,6.825L75.839,22.689c-1.942-1.941-4.473-2.904-7.005-2.904c-2.531,0-5.077,0.963-7.003,2.896
                      L36.44,48.048c-1.848,1.864-2.888,4.379-2.888,7.012c0,2.632,1.04,5.148,2.888,7.004l14.396,14.403
                      c-2.75,5.218-5.063,10.708-6.817,16.438H23.675c-5.482,0-9.909,4.441-9.909,9.915v35.889c0,5.458,4.427,9.908,9.909,9.908H43.987z"/>
                    <path d="M354.871,340.654c15.872-8.705,26.773-25.367,26.773-44.703c0-28.217-22.967-51.168-51.184-51.168
                      c-9.923,0-19.118,2.966-26.975,7.873c-4.705,18.728-12.113,36.642-21.803,52.202C309.152,310.022,334.357,322.531,354.871,340.654z"/>
                    <path d="M460.782,276.588c0-5.909-4.799-10.693-10.685-10.693H428.14c-1.896-6.189-4.411-12.121-7.393-17.75l15.544-15.544
                      c2.02-2.004,3.137-4.721,3.137-7.555c0-2.835-1.118-5.553-3.137-7.563l-27.363-27.371c-2.08-2.09-4.829-3.138-7.561-3.138
                      c-2.734,0-5.467,1.048-7.547,3.138l-15.576,15.552c-5.623-2.982-11.539-5.481-17.751-7.369v-21.958
                      c0-5.901-4.768-10.685-10.669-10.685H311.11c-2.594,0-4.877,1.04-6.739,2.578c3.26,11.895,5.046,24.793,5.046,38.552
                      c0,8.735-0.682,17.604-1.956,26.423c7.205-2.656,14.876-4.324,22.999-4.324c36.99,0,67.086,30.089,67.086,67.07
                      c0,23.637-12.345,44.353-30.872,56.303c13.48,14.784,24.195,32.324,31.168,51.976c1.148,0.396,2.344,0.684,3.54,0.684
                      c2.733,0,5.467-1.04,7.563-3.13l27.379-27.371c2.004-2.004,3.106-4.721,3.106-7.555s-1.102-5.551-3.106-7.563l-15.576-15.552
                      c2.982-5.621,5.497-11.555,7.393-17.75h21.957c2.826,0,5.575-1.118,7.563-3.138c2.004-1.996,3.138-4.72,3.138-7.555
                      L460.782,276.588z"/>
                    <path d="M376.038,413.906c-16.602-48.848-60.471-82.445-111.113-87.018c-16.958,17.958-37.954,29.351-61.731,29.351
                      c-23.759,0-44.771-11.392-61.713-29.351c-50.672,4.573-94.543,38.17-111.145,87.026l-9.177,27.013
                      c-2.625,7.773-1.368,16.338,3.416,23.007c4.783,6.671,12.486,10.631,20.685,10.631h315.853c8.215,0,15.918-3.96,20.702-10.631
                      c4.767-6.669,6.041-15.234,3.4-23.007L376.038,413.906z"/>
                    <path d="M120.842,206.782c0,60.589,36.883,125.603,82.352,125.603c45.487,0,82.368-65.014,82.368-125.603
                      C285.563,81.188,120.842,80.939,120.842,206.782z"/>
                  </g>
                </svg>
              </div>
              <div>
                <CardTitle tag="h6" className="fw-semibold text-secondary text-uppercase mb-1">
                  Admins
                </CardTitle>
                <h4 className="fw-bold mb-0 text-dark">
                  {loadingUsers ? (
                    <span className="text-warning">Loading...</span>
                  ) : (
                    <span className="count-text">{admins.length}</span>
                  )}
                </h4>
              </div>
            </div>
          </Card>
        </Col>
        {/* Coordinators */}
        <Col sm="12" lg="3" xl="3" xxl="3">
          <Card className="shadow border-0 rounded-4 p-3 position-relative overflow-hidden stat-card">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-circle bg-light-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                {/* Changed icon for Coordinators */}
                <svg fill="#0147ab" width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M67.2251757,28.8925457 C60.803794,31.475647 57.4164154,37.7172558 57.0360849,48 L67.252035,48 C68.1401206,44.5495456 71.2723211,42 75,42 C79.418278,42 83,45.581722 83,50 C83,54.418278 79.418278,58 75,58 C71.2723211,58 68.1401206,55.4504544 67.252035,52 L57.0360849,52 C57.4164154,62.2827442 60.803794,68.524353 67.2251757,71.1074543 C68.0753298,67.6026091 71.2337289,65 75,65 C79.418278,65 83,68.581722 83,73 C83,77.418278 79.418278,81 75,81 C71.4173768,81 68.3847898,78.6450155 67.3658068,75.3986144 C58.2714555,72.6198798 53.4832533,64.6615559 53.0347583,52 L47,52 C45.8954305,52 45,51.1045695 45,50 C45,48.8954305 45.8954305,48 47,48 L53.0347583,48 L53.0347583,48 C53.4832533,35.3384441 58.2714555,27.3801202 67.3658068,24.6013856 C68.3847898,21.3549845 71.4173768,19 75,19 C79.418278,19 83,22.581722 83,27 C83,31.418278 79.418278,35 75,35 C71.2337289,35 68.0753298,32.3973909 67.2251757,28.8925457 Z M75,31 C77.209139,31 79,29.209139 79,27 C79,24.790861 77.209139,23 75,23 C72.790861,23 71,24.790861 71,27 C71,29.209139 72.790861,31 75,31 Z M75,77 C77.209139,77 79,75.209139 79,73 C79,70.790861 77.209139,69 75,69 C72.790861,69 71,70.790861 71,73 C71,75.209139 72.790861,77 75,77 Z M75,54 C77.209139,54 79,52.209139 79,50 C79,47.790861 77.209139,46 75,46 C72.790861,46 71,47.790861 71,50 C71,52.209139 72.790861,54 75,54 Z M45.0743802,68 L22.4628099,68 C19.9338843,68 18,65.6198347 18,62.9421488 C18.1487603,58.9256198 22.3140496,56.8429752 26.6280992,54.9090909 C29.6033058,53.5702479 30.0495868,52.5289256 30.0495868,51.1900826 C30.0495868,49.8512397 29.1570248,48.661157 28.2644628,47.768595 C26.4793388,46.1322314 25.5867769,43.9008264 25.5867769,41.2231405 C25.5867769,36.3140496 28.5619835,32 33.9173554,32 C39.2727273,32 42.2479339,36.3140496 42.2479339,41.2231405 C42.2479339,43.9008264 41.3553719,46.1322314 39.5702479,47.768595 C38.5289256,48.661157 37.785124,49.8512397 37.785124,51.1900826 C37.785124,52.3801653 38.231405,53.5702479 41.2066116,54.9090909 C45.5206612,56.8429752 49.6859504,58.9256198 49.8347107,62.9421488 C49.5371901,65.6198347 47.6033058,68 45.0743802,68 L45.0743802,68 Z" />
                </svg>
              </div>
              <div>
                <CardTitle tag="h6" className="fw-semibold text-secondary text-uppercase mb-1">
                  Coordinators
                </CardTitle>
                <h4 className="fw-bold mb-0 text-dark">
                  {loadingUsers ? (
                    <span className="text-warning">Loading...</span>
                  ) : (
                    <span className="count-text">{cords.length}</span>
                  )}
                </h4>
              </div>
            </div>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default Starter;
