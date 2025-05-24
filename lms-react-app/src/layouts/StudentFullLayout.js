import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";
import StudentHeader from "../components/students-view/StudentHeader";
import StudentFooter from "../components/students-view/StudentFooter";

const StudentFullLayout = () => {
  return (
  <>
  <StudentHeader />
    <main>
          {/* <Container className="p-4" fluid> */}
            <Outlet />
          {/* </Container> */}
    </main>
      <StudentFooter />
  </>
  );
};

export default StudentFullLayout;
