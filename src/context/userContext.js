"use client";
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLength, setCartLength] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false); // No token, stop loading
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data?.user) {
          setUser(data.user); // Set user state from API response
        } else {
          throw new Error("User not found in response");
        }

        setLoading(false); // Stop loading after fetching user data
      } catch (err) {
        console.error("Error during user fetch:", err);
        setError(err.message); // Set error state
        setLoading(false); // Stop loading
      }
    };

    fetchUserData(); // Fetch user data on mount
  }, []); // Empty dependency array to only run once
  
  // Log out user function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Token is missing");
        return;
      }

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Send the Bearer token
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        console.log("Logged out successfully");
        router.push('/common/login');
      } else {
        console.error("Logout failed", data.message);
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, logout, setUser, setCartLength, cartLength }}>
      {children}
    </UserContext.Provider>
  );
};
