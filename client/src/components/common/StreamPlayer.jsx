import { useEffect, useState, useRef } from "react";
import api from "../../services/api";

function VideoListPlayer() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const videoRef = useRef(null);
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
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, videos.length, isPlaying]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(true);
    setProgress(0);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) < 10) {
      togglePlayPause();
    } else if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
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
            ref={index === currentIndex ? videoRef : null}
            src={`${API_URL}/videos/stream/${video.id}`}
            style={styles.video}
            autoPlay={index === currentIndex}
            loop
            playsInline
            muted={index !== currentIndex}
            onTimeUpdate={(e) => {
              if (index === currentIndex) {
                setProgress((e.target.currentTime / e.target.duration) * 100);
              }
            }}
          />
          {index === currentIndex && (
            <div style={styles.playPauseIcon}>
              {isPlaying ? '⏸' : '▶️'}
            </div>
          )}
          <div style={styles.info}>
            <h3>{video.key}</h3>
            <p>{new Date(video.createdAt).toLocaleDateString()}</p>
          </div>
          {index === currentIndex && (
            <div style={styles.progressBar}>
              <div style={{...styles.progress, width: `${progress}%`}}></div>
            </div>
          )}
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
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: 18,
  },
  playPauseIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 60,
    color: '#fff',
    opacity: 0,
    animation: 'fadeInOut 0.5s',
    pointerEvents: 'none',
  },
};

export default VideoListPlayer;
