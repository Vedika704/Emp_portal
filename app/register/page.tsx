"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Registration successful. Please login.");
      window.location.href = "/login";
    } else {
      const data = await res.json();
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p>
          Already have an account?{" "}
          <a href="/login">Login</a>
        </p>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(120deg, #667eea, #764ba2);
        }

        .card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 360px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
          text-align: center;
        }

        h1 {
          margin-bottom: 20px;
          color: #4c51bf;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 14px;
          border-radius: 12px;
          border: 1px solid #cbd5e0;
          outline: none;
        }

        button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #43cea2, #185a9d);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        p {
          margin-top: 15px;
        }

        a {
          color: #667eea;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
