// VideoListPlayer.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";

function VideoListPlayer() {
  const [videos, setVideos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      const res = await api.get("/videos");
      setVideos(res.data);
      if (res.data.length > 0) {
        setSelectedId(res.data[0].id); // auto-select first
      }
    };
    loadVideos();
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 2 }}>
        {selectedId ? (
          <video
            key={selectedId} // force reload when id changes
            controls
            width="640"
            src={`http://localhost:5000/api/videos/stream/${selectedId}`}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>No videos available</p>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h3>All videos</h3>
        {videos.map(v => (
          <div
            key={v.id}
            style={{
              padding: 8,
              marginBottom: 8,
              cursor: "pointer",
              border: v.id === selectedId ? "2px solid blue" : "1px solid #ccc"
            }}
            onClick={() => handleSelect(v.id)}
          >
            <div>{v.key}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {new Date(v.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoListPlayer;
