import { Link } from "react-router-dom";
import "./Registration.css"

const Registration = () => {
  return (
    <div className="registration">
      <h1>Create Account</h1>
      <p>Sign up to start managing your tasks</p>

      <label htmlFor="name">Name</label>
      <input id="name" type="text" placeholder="Enter your name" />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" placeholder="Enter your email" />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" placeholder="Create a password" />

      <button>Create Account</button>

      <p>
        Already have an account?{" "}
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Registration;
