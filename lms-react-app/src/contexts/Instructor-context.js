import { createContext, useState, useContext } from "react";

export const InstructorContext = createContext()

export const useInstructorContext = () => {
    return useContext(InstructorContext)
}

export const InstructorContextProvider = ({ children }) => {
    const [groupList, setGroupList] = useState([])

    return <InstructorContext.Provider value={
        {
            groupList, setGroupList
        }
        }>
        {children}
        </InstructorContext.Provider>
}