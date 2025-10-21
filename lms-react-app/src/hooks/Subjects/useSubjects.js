import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthcontext } from '../../contexts/Authcontext';

export const useSubject = () => {
    const [loading, setLoading] = useState(false);
    const [subject, setSubject] = useState([]);
    const { AuthUser } = useAuthcontext();

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/subjects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    credentials: 'include'
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message);
            }

            const data = await res.json();
            setSubject(data);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects(); 
        
    }, [subject]); 
    return { loading, subject };
};
