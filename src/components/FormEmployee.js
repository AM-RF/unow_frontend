import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [positions, setPositions] = React.useState([]);

  React.useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchEmployee = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/employees/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch employee data");
          }

          const data = await response.json();
          setName(data.name);
          setLastname(data.lastname);
          setPosition(data.position);
          const formattedDob = new Date(data.dob).toISOString().split("T")[0];
          setDob(formattedDob);
          setEmail(data.email);
        } catch (error) {
          setError(error.message);
          console.error("Error fetching employee data:", error);
        }
      };

      fetchEmployee();
    }

    const fetchPositions = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/positions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch positions");
        }

        const data = await response.json();
        setPositions(data.positions);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const urlToUse = isEditing
        ? `${process.env.REACT_APP_API_URL}/employees/${id}`
        : `${process.env.REACT_APP_API_URL}/employees`;
      const methodToUse = isEditing ? "PUT" : "POST";

      const response = await fetch(urlToUse, {
        method: methodToUse,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, lastname, position, dob, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to register employee");
      }

      navigate("/employees");
    } catch (error) {
      setError(error.message);
      console.error("Error registering employee:", error);
    }
  };

  const handleBack = () => {
    navigate("/employees");
  };

  return (
    <div className="w-full flex h-screen">
      <div className="bg-gray-800 p-8 rounded-lg w-1/4 m-auto items-center justify-center">
        <h1 className="text-2xl text-white font-semibold">
          {isEditing ? "Edit" : "Register"} Employee
        </h1>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="lastname"
            >
              Lastname
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="position"
            >
              Position
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
              name="position"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option value="">Select a position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-medium mb-2"
              htmlFor="dob"
            >
              Date of birth
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
              type="date"
              name="dob"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 d-flex justify-between">
            <button
              className="w-full bg-violet-500 text-white font-semibold p-2 rounded-lg"
              type="submit"
            >
              {isEditing ? "Update" : "Register"}
            </button>
            <button
              className="w-full bg-red-500 text-white font-semibold p-2 rounded-lg mt-2"
              type="button"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
