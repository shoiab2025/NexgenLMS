import { createContext, useState, useContext } from "react";

export const StudentContext = createContext()

export const useStudentContext = () => {
    return useContext(StudentContext)
}

export const StudentContextProvider = ({ children }) => {
    const [studentCoursesList, setStudentCoursesList] = useState([])
    const [studentCourse, setStudentCourse] = useState(null)
    const [studentCourseId, setStudentCourseId] = useState(null)

    return <StudentContext.Provider value={
        {
            studentCoursesList, setStudentCoursesList,
            studentCourse, setStudentCourse,
            studentCourseId, setStudentCourseId
        }
        }>
        {children}
        </StudentContext.Provider>
}