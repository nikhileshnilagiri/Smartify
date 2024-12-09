import { useState, useEffect } from 'react';
import { useUser } from '../Context/UserContext';
import Footer from '../Components/Footer';
import { TextField, Grid } from '@mui/material';
import Popup from '../Components/UserPopUp'; // Import the Popup component
import GuestUserCard from '../Components/GuestUserCard'; // Import the GuestUserCard component

export default function Users() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
  });

  const [showPopup, setShowPopup] = useState(false); // Manage the visibility of the popup

  const guestUsers = [
    { name: 'John Doe', email: 'johndoe@example.com', role: 'Guest' },
    { name: 'Jane Smith', email: 'janesmith@example.com', role: 'Guest' },
    { name: 'Alex Johnson', email: 'alexj@example.com', role: 'Guest' },
  ]; // Example guest user data

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveUser = () => {
    setShowPopup(true); // Show the popup on Save User button click
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <main className={`d-flex flex-column min-vh-100 fade-in ${isLoaded ? 'visible' : ''}`}>
      <div className="container mt-4 pt6 flex-grow-1">
        <section>
          <h2 className="text-3xl font-weight-bold mb-4">User Management</h2>
        </section>

        {/* User Management Card */}
        <section>
          <div className="card mb-5 shadow border-0">
            <div className="card-body">
              <h5 className="card-title">Manage Users</h5>
              <p className="card-text text-muted">
                View and manage all users in your system.
              </p>
            </div>

            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ maxWidth: '500px' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Guest Users Section */}
        <section>
          <div className="card mb-5 shadow border-0">
            <div className="card-body">
              <h5 className="card-title">Guest Users</h5>
              <p className="card-text text-muted">
                View and search guest users in your system.
              </p>
            </div>

            <div className="card-body">
              <Grid container spacing={3}>
                {guestUsers
                  .filter((guest) =>
                    guest.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((guest, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <GuestUserCard guest={guest} />
                    </Grid>
                  ))}
              </Grid>
            </div>
          </div>
        </section>

        {/* Add New User Section */}
        <section>
          <div className="card mb-5 shadow border-0">
            <div className="card-body">
              <h5 className="card-title">Add New User</h5>
              <p className="card-text text-muted">
                Fill in the details to add a new user to the system.
              </p>
            </div>

            {/* User Input Fields */}
            <div className="card-body">
              <div className="mb-3">
                <TextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-success rounded-pill px-4"
                  onClick={handleSaveUser}
                >
                  Save User
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Popup for Confirmation */}
      {showPopup && <Popup onClose={handleClosePopup} newUser={newUser} />}

      <Footer />
    </main>
  );
}
