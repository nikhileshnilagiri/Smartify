import React, { useState } from "react";
import '../index.css';  // Import your global CSS here

const UserPopup = ({ onClose, newUser, adminEmail }) => {
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleSubmit = async () => {
    // Simple password validation (you can replace this with real validation)
    if (adminPassword === "admin123") {
      const guestId = Math.random().toString(36).substr(2, 9); // Generate a small unique guest ID

      // Prepare the data to send to the backend
      const userData = {
        name: newUser.name,
        email: newUser.email,
        guestId: guestId,
        adminEmail: adminEmail // Send the admin email as part of the request
      };

      // Send the POST request to the backend
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/user/saveUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),  // Convert the user data into JSON format
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const result = await response.json(); // Assuming the backend returns a JSON response
        console.log("User Created Successfully:", result);
        onClose(); // Close the popup after submission
      } catch (error) {
        console.error("Error creating user:", error);
        setErrorMessage("Error creating user. Please try again.");
      }
    } else {
      setErrorMessage("Incorrect Admin Password!");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h3>Confirm User Creation</h3>
        <p>Are you sure you want to create the user?</p>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter Admin Password"
            value={adminPassword}
            onChange={handlePasswordChange}
          />
        </div>
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
        <button className="btn btn-primary" onClick={handleSubmit}>
          Confirm
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserPopup;
