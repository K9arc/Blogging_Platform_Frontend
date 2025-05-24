import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Envelope, Lock, BoxArrowInRight, PersonPlus } from "react-bootstrap-icons";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);
      navigate("/");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError("Please fill in all fields correctly.");
        } else if (status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(`Error: ${error.response.data.message || "Something went wrong"}`);
        }
      } else {
        setError("Network error. Please check your connection.");
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold">Welcome Back</h2>
              <p className="text-muted">Please sign in to continue</p>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Envelope />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Lock />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                ) : (
                  <>
                    <BoxArrowInRight className="me-2" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot password?
                </Link>
              </div>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center text-muted">
            Don't have an account? <Link to="/signup" className="text-decoration-none">Sign up</Link>
          </Card.Footer>
        </Card>
      </div>
    </Container>
  );
}