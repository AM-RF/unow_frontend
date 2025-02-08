import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function ListEmployee() {
  const [employees, setEmployees] = React.useState([]);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/employees`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error employees list");
        }

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEmployees();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (id) => {
    navigate(`/update-employee/${id}`);
  };

  const handleRegister = () => {
    navigate("/register-employee");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/employees/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error deleting employee");
    }

    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-800 p-4">
          <h1 className="text-2xl font-semibold text-white">Employees list</h1>
          <button
            className="bg-violet-500 text-white px-4 py-2 rounded-lg"
            onClick={handleRegister}
          >
            New employee
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white text-left">Name</th>
              <th className="bg-gray-800 text-white text-left">Email</th>
              <th className="bg-gray-800 text-white text-left">Position</th>
              <th className="bg-gray-800 text-white text-left">
                Date of birth
              </th>
              <th className="bg-gray-800 text-white text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.lastname}</td>
                <td>{employee.position}</td>
                <td>{formatDate(employee.dob)}</td>
                <td>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg"
                    onClick={() => handleEdit(employee.id)}
                  >
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded-lg"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
