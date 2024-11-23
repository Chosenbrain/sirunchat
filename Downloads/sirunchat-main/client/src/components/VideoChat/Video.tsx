import React, { useEffect, useRef } from "react";
import { styled } from "@mui/system";

const MainContainer = styled("div")({
    borderRadius: "8px",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#000", // Added for better UX in case video is loading
});

const VideoEl = styled("video")({
    height: "100%",
    borderRadius: "8px",
    display: "block",
    maxWidth: "100%",
    backgroundColor: "transparent",
});

interface VideoProps {
    stream: MediaStream;
    isLocalStream: boolean;
    dimensions: {
        x: number;
        y: number;
    };
}

const Video: React.FC<VideoProps> = ({ stream, isLocalStream, dimensions }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            video.srcObject = stream;

            video.onloadedmetadata = () => {
                video.play().catch((err) =>
                    console.error("Video playback error:", err)
                );
            };

            // Set properties specific to local streams
            if (isLocalStream) {
                video.muted = true;
                video.volume = 0;
            }
        }
    }, [stream, isLocalStream]);

    return (
        <MainContainer style={{ height: dimensions.y, width: dimensions.x }}>
            <VideoEl ref={videoRef} autoPlay playsInline muted={isLocalStream} />
        </MainContainer>
    );
};

export default Video;
