import { useEffect, useState, useRef } from "react";
import api from "../../services/api";

function VideoListPlayer() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://airbnb-clone-2cp7.onrender.com/api';

  useEffect(() => {
    const loadVideos = async () => {
      const res = await api.get("/videos");
      setVideos(res.data);
    };
    loadVideos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) goToNext();
    if (touchStart - touchEnd < -50) goToPrev();
  };

  if (videos.length === 0) return <div style={styles.loading}>Loading videos...</div>;

  return (
    <div
      ref={containerRef}
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          style={{
            ...styles.videoSlide,
            transform: `translateY(${(index - currentIndex) * 100}%)`,
          }}
        >
          <video
            src={`${API_URL}/videos/stream/${video.id}`}
            style={styles.video}
            autoPlay={index === currentIndex}
            loop
            playsInline
            muted={index !== currentIndex}
          />
          <div style={styles.info}>
            <h3>{video.key}</h3>
            <p>{new Date(video.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
      <div style={styles.indicator}>{currentIndex + 1} / {videos.length}</div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoSlide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'transform 0.3s ease-out',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  info: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
  },
  indicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '8px 12px',
    borderRadius: 20,
    fontSize: 14,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: 18,
  },
};

export default VideoListPlayer;
