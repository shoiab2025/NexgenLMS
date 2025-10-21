// hooks/Tests/useCreateTests.js
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthcontext } from '../../contexts/Authcontext';

export const useCreateTests = () => {
  const [loading, setLoading] = useState(false);
  const { AuthUser } = useAuthcontext();

  const createTest = async (testData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ data: testData }), // FIXED: stringify body
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create test");
      }

      const result = await res.json();
      toast.success("Test created successfully!");
      return result;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
      throw error; // important if you want to catch errors outside
    } finally {
      setLoading(false);
    }
  };

  return { createTest, loading };
};

export const updateTest = async (testId, updatedData) => {

  try {
    const res = await fetch(`/api/tests/${testId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update test");
    }

    const result = await res.json();
    toast.success("Test updated successfully!");

    return result;
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Something went wrong!");
    throw error;
  }
};
