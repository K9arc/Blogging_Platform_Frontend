import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { Container, Card, Form, Spinner, Badge, Row, Col, Alert } from "react-bootstrap";
import { Search, Person, Clock } from "react-bootstrap-icons";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/posts");
        setPosts(res.data);
        setFilteredPosts(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerSearch) ||
        (post.content && post.content.toLowerCase().includes(lowerSearch)) ||
        (post.username && post.username.toLowerCase().includes(lowerSearch))
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  const truncateContent = (html, maxLength = 150) => {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Blog Posts</h1>
        <p className="text-muted">Discover interesting stories and ideas</p>
      </div>

      <Form.Group className="mb-4">
        <div className="position-relative">
          <Form.Control
            type="search"
            placeholder="Search posts by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-5"
          />
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3" />
        </div>
      </Form.Group>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredPosts.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredPosts.map((post) => (
            <Col key={post.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>
                    <Link to={`/post/${post.id}`} className="text-decoration-none">
                      {post.title}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    <Person className="me-1" />
                    {post.username || "Anonymous"}
                    <span className="mx-2">•</span>
                    <Clock className="me-1" />
                    {formatDate(post.createdAt)}
                  </Card.Text>
                  <Card.Text className="text-truncate">
                    {truncateContent(post.content)}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-top-0">
                  <Link
                    to={`/post/${post.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Read More
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center py-5">
          <Card.Body>
            <h4>No posts found</h4>
            <p className="text-muted">
              {searchTerm
                ? "Try a different search term"
                : "There are no posts available"}
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}