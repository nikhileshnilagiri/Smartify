import React, { useState } from "react";
import axios from 'axios'; // Import Axios
import '../index.css';  // Global styles

const UserPopup = ({ onClose, newUser, adminEmail }) => {
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (adminPassword === "admin123") {
      const guestId = Math.random().toString(36).substring(2, 9);

      const userData = {
        name: newUser.name,
        email: newUser.email,
        guestId,
        adminEmail,
      };

      try {
        // Sending a POST request using Axios
        const response = await axios.post(`http://localhost:8080/addUser/guests`, userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle the success response
        if (response.status === 200) {
          console.log("User Created Successfully:", response.data);
          onClose();  // Close the popup
        }
      } catch (error) {
        // Handle the error response
        setErrorMessage("Error creating user. Please try again.");
        console.error("Error:", error.response ? error.response.data : error.message);
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
