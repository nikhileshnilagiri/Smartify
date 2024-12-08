import { useState, useEffect } from "react";
import { useUser } from "../Context/UserContext";
import Footer from "../Components/Footer";
import { TextField } from "@mui/material";

export default function Users() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  });

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
    console.log("New User: ", newUser);
    setNewUser({ name: "", email: "", role: "" });
  };

  return (
    <main className={`d-flex flex-column min-vh-100 fade-in ${isLoaded ? "visible" : ""}`}>
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
                  style={{ maxWidth: "500px" }}
                />
                <TextField id="standard-basic" label="Standard" variant="standard" onClick={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
        </section>

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
                <TextField id="standard-basic" label="Username" variant="standard" onClick={handleInputChange} />
              </div>
              <div className="mb-3">
                <TextField id="standard-basic" label="Email" variant="standard" onClick={handleInputChange} />
              </div>

              <div className="mb-3">
                <TextField id="standard-basic" label="Password" variant="standard" onClick={handleInputChange} />
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

      <Footer />
    </main>
  );
}
