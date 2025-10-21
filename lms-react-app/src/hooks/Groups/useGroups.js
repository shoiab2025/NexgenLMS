import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthcontext } from '../../contexts/Authcontext';

export const useGroup = () => {
    const [loading, setLoading] = useState(false);
    const [group, setGroup] = useState([]);
    const { AuthUser } = useAuthcontext();

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/groups', {
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
            setGroup(data);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
        
    }, []);
    return { loading, group };
};
