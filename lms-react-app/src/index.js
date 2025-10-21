import React, { Suspense } from "react";
import { createRoot } from 'react-dom/client';
import "./assets/scss/style.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Loader from "./layouts/loader/Loader";
import { AuthContextProvider } from './contexts/Authcontext';
import { StudentContextProvider } from './contexts/Student-context'; 
import { InstructorContextProvider } from "./contexts/Instructor-context";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Suspense fallback={<Loader />}>
    <BrowserRouter>
      <AuthContextProvider>
      <InstructorContextProvider>
        <StudentContextProvider>
          <App />
        </StudentContextProvider>
        </InstructorContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </Suspense>
);
