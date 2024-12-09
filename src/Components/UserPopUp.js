import React, { useState } from "react";
import "../index.css"; // Global styles

const UserPopup = ({ onClose, newUser, adminEmail }) => {
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (adminPassword === "admin123") {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        guestId: Math.random().toString(36).substring(2, 9),
        adminEmail:"hrithik2537H@gmail.com", // Make sure this is passed from parent component
      };

      console.log("Submitting User Data:", userData);

      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/user/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("User added successfully:", result);
          onClose(); // Close the popup
        } else {
          console.error("Failed to add user:", response.statusText);
          setErrorMessage("Failed to add user. Please try again.");
        }
      } catch (error) {
        console.error("Error during user creation:", error);
        setErrorMessage("An error occurred. Please try again.");
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
