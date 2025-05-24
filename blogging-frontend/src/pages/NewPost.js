import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ArrowLeft, Save, JournalText } from "react-bootstrap-icons";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create a post.");
        return;
      }

      await API.post("/posts", { title, content });
      setSuccess("Post created successfully!");
      setTimeout(() => {
        setTitle("");
        setContent("");
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response && error.response.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
              className="d-flex align-items-center"
            >
              <ArrowLeft className="me-1" /> Back
            </Button>
            <h4 className="mb-0 d-flex align-items-center">
              <JournalText className="me-2" /> Create New Post
            </h4>
            <div style={{ width: "120px" }}></div> {/* Spacer for alignment */}
          </div>
        </Card.Header>
        
        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Post Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Post Content</Form.Label>
              <div className="ck-editor-container">
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(event, editor) => setContent(editor.getData())}
                  config={{
                    toolbar: [
                      'heading', '|',
                      'bold', 'italic', 'link', 'bulletedList', 'numberedList',
                      'blockQuote', 'insertTable', 'undo', 'redo'
                    ],
                    placeholder: "Write your post content here..."
                  }}
                />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                disabled={loading || !title || !content}
                className="px-4 py-2"
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" role="status" />
                ) : (
                  <>
                    <Save className="me-2" /> Publish Post
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style jsx>{`
        .ck-editor-container :global(.ck-editor__editable) {
          min-height: 300px;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        .ck-editor-container :global(.ck-editor__editable:focus) {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </Container>
  );
}