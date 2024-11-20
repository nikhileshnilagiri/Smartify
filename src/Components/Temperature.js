import React from "react";

function Temperature() {
    return (
        <div className="col-12 col-md-4 mb-3 d-flex align-items-stretch">
            <div className="d-flex align-items-center justify-content-center gap-3 rounded-3 bg-primary p-3 text-white w-100 h-100">
                {/* Weather Icon Section */}
                    <img
                        src={require("../Assets/cloudy.png")}
                        alt="Weather Icon"
                        className="w-25 mb-1"
                    />


                {/* Vertical Divider */}
                <div className="border border-light" style={{ height: '100px', width: '1px' }} />

                {/* Temperature Section */}
                <div className="d-flex flex-column align-items-start">
                    <span className="text-sm">Temperature</span>
                    <span className="fs-1 fw-bold">22°C</span>
                    <span className="text-sm">Cloudy</span>
                </div>
            </div>
        </div>
    );
}

export default Temperature;
