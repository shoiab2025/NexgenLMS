import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthcontext } from '../../contexts/Authcontext';

export const useUpdateSubject = () => {
    const [loading, setLoading] = useState(false);
    const { AuthUser } = useAuthcontext();

    const UpdateSubject = async (name, description, duration, status, id) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/subject/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, duration, status }),
            });

            debugger;
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message);
            }

            const data = await res.json();

            toast.success('Subject Updated successfully');
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, UpdateSubject };
};