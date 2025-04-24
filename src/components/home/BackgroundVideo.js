import React from "react";
import DniesterSlider from "./DniesterSlider.jsx";

const BackgroundVideo = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src="/video/mp4/video1.mp4" type="video/mp4" />
        Ваш браузер не підтримує відео.
      </video>
      <div className="absolute inset-0 mix-blend-multiply bg-[var(--video-filter)]" />
      {/* <div className="overlay">
        <h1 className="title">Нижньодністровська ГЕС</h1>
      </div> */}
      <DniesterSlider />
    </div>
  );
};

export default BackgroundVideo;
