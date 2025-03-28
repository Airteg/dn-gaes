import React from "react";

const BackgroundVideo = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src="/video/mp4/video1.mp4" type="video/mp4" />
        Ваш браузер не підтримує відео.
      </video>
      <div className="overlay">
        <h1 className="title">Нижньодністровська ГЕС</h1>
      </div>
    </div>
  );
};

export default BackgroundVideo;
