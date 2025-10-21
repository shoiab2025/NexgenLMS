// hooks/Tests/useDeleteTests.js
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useDeleteTests = () => {
  const [loading, setLoading] = useState(false);

  const deleteTest = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tests/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ correctly placed
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete test');
      }

      const data = await res.json();
      toast.success('Test deleted successfully');
      return data;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Delete failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTest, loading };
};
