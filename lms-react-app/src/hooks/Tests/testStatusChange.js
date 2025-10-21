import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthcontext } from '../../contexts/Authcontext';

export const useTestStatusChange = () => {
  const [loading, setLoading] = useState(false);
  const { AuthUser } = useAuthcontext();

  const changeStatus = async (id, status) => {
    setLoading(true);
    console.log("Changing status for test ID:", id, "to status:", JSON.stringify({ status }));
    try {
      const res = await fetch(`/api/tests/test-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }), // Send { status: "enabled" | "disabled" }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update test status");
      }

      const result = await res.json();
      toast.success("Test status updated successfully!");
      console.log("Test status updated successfully:", result);
      return result.data;
    } catch (error) {
      console.error(error); 
      toast.error(error.message || "Something went wrong!");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { changeStatus, loading };
};
