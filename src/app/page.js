"use client";

import { useState } from 'react';
import Header from './components/Header';

const Page = () => {
  const [email, setEmail] = useState(null);

  const handleLogin = async (formData) => {
    const loggedInEmail = await login(formData);
    if (loggedInEmail) {
      setEmail(loggedInEmail);  // Store email in state
    } else {
      console.error("Login failed");
    }
  };

  return (
    <>
      <Header />
     
    </>
  );
};

export default Page;
