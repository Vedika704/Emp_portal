"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.replace("/employee/details");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Welcome Back 🎉</h2>
         <h2>Login To Your Dashboard</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.button}>
          Login
        </button>

        <p>
          Don’t have an account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
  },
  card: {
    background: "#fff",
    padding: 40,
    borderRadius: 20,
    width: 360,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    background: "#667eea",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
  },
};
