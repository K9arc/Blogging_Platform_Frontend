import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Person, Envelope, Lock, PersonPlus, ArrowLeft } from "react-bootstrap-icons";

export default function Signup() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await API.post("/auth/signup", form);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Please fill all fields correctly");
        } else if (error.response.status === 409) {
          setError("Email or username already exists");
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "450px" }}>
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <Button 
                variant="link" 
                onClick={() => navigate(-1)} 
                className="position-absolute start-0 ms-3 text-secondary"
              >
                <ArrowLeft size={20} />
              </Button>
              <h2 className="fw-bold mb-1">Create Account</h2>
              <p className="text-muted">Join our community today</p>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Person />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    minLength={3}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Envelope />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
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
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <Form.Text className="text-muted">
                  At least 6 characters
                </Form.Text>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" />
                ) : (
                  <>
                    <PersonPlus className="me-2" />
                    Sign Up
                  </>
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <p className="text-muted mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none fw-semibold">
                  Log in
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}