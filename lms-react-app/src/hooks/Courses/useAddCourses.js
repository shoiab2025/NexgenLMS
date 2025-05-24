import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthcontext } from '../../contexts/Authcontext';

export const useCreateCourse = () => {
    const [loading, setLoading] = useState(false);
    const { AuthUser } = useAuthcontext();

    const createCourse = async (name, description, duration, subject_ids, status) => {
        setLoading(true);
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, duration, subject_ids, status }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message);
            }

            const data = await res.json();

            toast.success('Course Created successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, createCourse };
};
