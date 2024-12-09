import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const GuestIDPopup = ({ onClose, onVerify }) => {
  const [guestID, setGuestID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    console.log("GuestIDPopup.js: Attempting to verify Guest ID:", guestID);
    if (guestID.trim() === "") {
      setErrorMessage("Please enter a valid Guest ID.");
      return;
    }

    const guestToken = `guest-${Math.random().toString(36).substr(2, 9)}`;
    Cookies.set("guestToken", guestToken, { expires: 1 });
    console.log("GuestIDPopup.js: Generated Guest Token:", guestToken);
    onVerify(guestToken);
    onClose();
    console.log("GuestIDPopup.js: Navigating to /dashboard and closing popup.");
    navigate("/dashboard");
  };

  return (
    <div className="guest-popup-overlay">
      <div className="guest-popup-container">
        <h3 className="guest-popup-title">Enter Guest ID</h3>
        <TextField
          label="Guest ID"
          variant="outlined"
          fullWidth
          value={guestID}
          onChange={(e) => setGuestID(e.target.value)}
          error={!!errorMessage}
          helperText={errorMessage}
        />
        <div className="guest-popup-actions">
          <Button variant="contained" color="primary" onClick={handleVerify}>
            Verify
          </Button>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestIDPopup;
