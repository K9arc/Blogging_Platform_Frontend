import React, { useEffect, useState } from "react";
import API from "../services/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Container, Card, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
import { PencilSquare, Trash, Check, X, PlusCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

// Enhanced date formatting helper
const formatDate = (dateString) => {
  if (!dateString || dateString === "Invalid Date") return "Date not available";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date not available";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date not available";
  }
};

export default function Dashboard() {
  const [myPosts, setMyPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/posts/my");
      
      // Process posts to ensure valid dates
      const processedPosts = res.data.map(post => {
        let createdAt = post.createdAt || new Date().toISOString();
        let updatedAt = post.updatedAt || createdAt;
        
        // Validate dates
        if (isNaN(new Date(createdAt).getTime())) createdAt = new Date().toISOString();
        if (isNaN(new Date(updatedAt).getTime())) updatedAt = createdAt;
        
        return {
          ...post,
          createdAt,
          updatedAt
        };
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by newest first
      
      setMyPosts(processedPosts);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        await API.delete(`/posts/${id}`);
        setSuccess("Post deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
        fetchMyPosts();
      }
    } catch (err) {
      setError("Failed to delete post.");
      console.error(err);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditForm({ title: post.title, content: post.content });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/posts/${editingPostId}`, editForm);
      
      // Update the post in state with the response data
      setMyPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === editingPostId ? response.data : post
        )
      );
      
      setEditingPostId(null);
      setEditForm({ title: "", content: "" });
      setSuccess("Post updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update post.");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditForm({ title: "", content: "" });
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Posts</h2>
        <div>
          <Button variant="primary" onClick={() => navigate("/new")} className="me-2">
            <PlusCircle className="me-1" /> New Post
          </Button>
          <Badge bg="secondary" pill>
            {myPosts.length} post{myPosts.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : myPosts.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h4>You don't have any posts yet</h4>
            <p className="text-muted">Create your first post to get started</p>
            <Button variant="primary" onClick={() => navigate("/new")}>
              <PlusCircle className="me-1" /> Create Post
            </Button>
          </Card.Body>
        </Card>
      ) : (
        myPosts.map((post) =>
          editingPostId === post.id ? (
            <Card key={post.id} className="mb-4">
              <Card.Body>
                <Form onSubmit={handleEditSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      placeholder="Title"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <CKEditor
                      editor={ClassicEditor}
                      data={editForm.content}
                      onChange={(event, editor) =>
                        setEditForm({ ...editForm, content: editor.getData() })
                      }
                      config={{
                        toolbar: [
                          "heading",
                          "|",
                          "bold",
                          "italic",
                          "link",
                          "bulletedList",
                          "numberedList",
                          "blockQuote",
                          "undo",
                          "redo",
                        ],
                      }}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-secondary"
                      onClick={handleCancelEdit}
                      className="me-2"
                    >
                      <X className="me-1" /> Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      <Check className="me-1" /> Save Changes
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card key={post.id} className="mb-4">
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <div
                  className="ck-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <div className="d-flex justify-content-end mt-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => handleEditClick(post)}
                    className="me-2"
                  >
                    <PencilSquare className="me-1" /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash className="me-1" /> Delete
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="text-muted small">
                {post.createdAt === post.updatedAt ? (
                  <>Posted: {formatDate(post.createdAt)}</>
                ) : (
                  <>Updated: {formatDate(post.updatedAt)}</>
                )}
              </Card.Footer>
            </Card>
          )
        )
      )}
    </Container>
  );
}