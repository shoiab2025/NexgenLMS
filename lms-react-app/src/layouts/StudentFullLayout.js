import { Outlet } from "react-router-dom";
import StudentHeader from "../components/students-view/StudentHeader";
import StudentFooter from "../components/students-view/StudentFooter";

const StudentFullLayout = () => {
  return (
    <div className="pageWrapper">
      <StudentHeader />
        <main className="contentArea">
          <Outlet />
        </main>
      <StudentFooter />
    </div>
  );
};

export default StudentFullLayout;
