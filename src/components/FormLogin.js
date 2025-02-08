import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function FormLogin({ onLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/login_check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);

      onLogin(true);

      Navigate("/employees");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    Navigate("/register");
  };

  return (
    <div className="w-full flex h-screen">
      <div className="bg-gray-800 p-8 rounded-lg w-1/4 m-auto items-center justify-center">
        <h1 className="text-2xl text-white font-semibold">Employees App</h1>
        <form className="mt-4" onSubmit={handleSubmit}>
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
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 d-flex">
            <button
              className="w-full bg-violet-500 text-white font-semibold p-2 rounded-lg"
              type="submit"
            >
              Login
            </button>
            <button
              className="w-full text-white font-semibold p-2 rounded-lg mt-2"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
