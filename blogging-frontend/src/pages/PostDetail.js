import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    API.get(`/posts/${id}`).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
