import React, { useEffect, useState } from "react";

function Voice() {

    const [command, setCommand] = useState("");
    const [isListening, setIsListening] = useState(false);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    useEffect(() => {

        if (recognition) {
          recognition.continuous = false;
          recognition.lang = "en-US";
    
          recognition.onstart = () => setIsListening(true);
          recognition.onend = () => setIsListening(false);
          recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript;
            setCommand(transcript);
          };
        }
      }, [recognition]);

      const toggleListening = () => {
        if (isListening) {
          recognition.stop();
        } else {
          recognition.start();
    
          setTimeout(() => {
            recognition.stop();
          }, 5000);
        }
      };


    return (
        <div className="col-12 col-md-4 mb-3 d-flex align-items-stretch">
            <div className="d-flex align-items-center justify-content-center gap-3 rounded-3 bg-primary p-3 text-white w-100 h-100">
                <img
                    src={require("../Assets/mic.png")}
                    alt="Weather Icon"
                    className="mb-1"
                    style={{width:"70px"}}
                    onClick={toggleListening}
                />

                <div className="border border-light" style={{ height: '80px', width: '1px' }} />

                <div className="d-flex flex-column align-items-start">
                    <span className="text-sm">Voice Control</span>
                    <span className="text-sm mt-1">{isListening ? "Listening..." : "Start Listening"}</span>
                    <span className="text-sm mt-1">{command ? `You said: "${command}"` : "Say a command..."}</span>
                </div>
            </div>
        </div>
    );
}

export default Voice;
