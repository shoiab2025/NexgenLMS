import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthcontext } from '../../contexts/Authcontext';

export const useCreateGroup = () => {
    const [loading, setLoading] = useState(false);
    const { AuthUser } = useAuthcontext();

    const createGroup = async (name, description, duration, status) => {
        setLoading(true);
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, duration, status }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
            }

            const data = await res.json();

            toast.success('Group Created successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, createGroup };
};