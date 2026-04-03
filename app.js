import { Camera, SwitchCamera, Zap, ZapOff, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useVoice } from "@/hooks/useVoice";
import EthiopianPattern from "@/components/EthiopianPattern";

const CameraScreen = () => {
  const [mode, setMode] = useState<"text" | "object">("text");
  const [flash, setFlash] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { speak } = useVoice();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCameraError(null);
      speak("Camera activated. Point at text or objects.");
    } catch (err) {
      setCameraError("Camera access denied. Please allow camera permissions.");
      speak("Camera access was denied. Please enable camera permissions in your browser settings.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleCapture = () => {
    if (mode === "text") {
      speak("Analyzing text in view. This feature requires a native app for full OCR processing. In the web demo, point your camera and the text would be read aloud.");
    } else {
      speak("Scanning for objects. This feature requires AI model integration for real-time detection. In a native app, detected objects would be announced.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]" role="main" aria-label="Camera screen">
      {/* Camera Viewfinder */}
      <div className="flex-1 bg-accent relative flex items-center justify-center overflow-hidden">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="text-center space-y-4 p-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Camera size={36} className="text-primary" />
            </div>
            <p className="text-foreground font-medium text-lg">
              {cameraError || "Tap below to start camera"}
            </p>
          </div>
        )}

        {/* Scan frame overlay */}
        {cameraActive && (
          <div className="absolute inset-8 border-2 border-primary/60 rounded-2xl pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl" />
          </div>

  )}
{/* Top controls */}
        {cameraActive && (
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button
              onClick={() => setFlash(!flash)}
              className="w-12 h-12 rounded-full bg-accent/80 backdrop-blur flex items-center justify-center"
              aria-label={flash ? "Turn off flash" : "Turn on flash"}
            >
              {flash ? <Zap size={20} className="text-foreground" /> : <ZapOff size={20} className="text-foreground" />}
            </button>
            <button
              className="w-12 h-12 rounded-full bg-accent/80 backdrop-blur flex items-center justify-center"
              aria-label="Switch camera"
            >
              <SwitchCamera size={20} className="text-foreground" />
            </button>
          </div>
        )}
      </div>

      <EthiopianPattern className="w-full h-6" />

      {/* Controls */}
      <div className="bg-card p-4 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("text"); speak("Text reading mode"); }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              mode === "text" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
            aria-pressed={mode === "text"}
          >
            📖 Read Text
          </button>
          <button
            onClick={() => { setMode("object"); speak("Object detection mode"); }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              mode === "object" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
            aria-pressed={mode === "object"}
          >
            🔍 Detect Objects
          </button>
        </div>

        {!cameraActive ? (
          <button
            onClick={startCamera}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-primary-foreground text-lg font-bold active:scale-[0.97] transition-transform"
            aria-label="Start camera"
          >
            <Camera size={24} />
            Start Camera
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCapture}
              className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary text-primary-foreground text-lg font-bold active:scale-[0.97] transition-transform"
              aria-label={mode === "text" ? "Capture and read text" : "Capture and identify objects"}
            >
              <Volume2 size={20} />
              {mode === "text" ? "Read Now" : "Identify"}
            </button>
            <button
              onClick={stopCamera}
              className="py-4 px-5 rounded-2xl bg-secondary text-secondary-foreground font-bold active:scale-[0.97] transition-transform"
              aria-label="Stop camera"
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraScreen;
