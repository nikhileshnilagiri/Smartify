import React from "react";

function Humidity(){
    return(
        <div className="col-12 col-md-4 mb-3 d-flex align-items-stretch">
            <div className="d-flex align-items-center justify-content-center gap-3 rounded-3 bg-primary p-3 text-white w-100 h-100">
                <img
                    src={require("../Assets/humidity.png")}
                    alt="Weather Icon"
                    className="w-25 mb-1"
                />
                <div className="border border-light" style={{ height: '100px', width: '1px' }} />
                <div className="d-flex flex-column align-items-start">
                    <span className="text-sm">Humidity</span>
                    <span className="fs-1 fw-bold">45%</span>
                    <span className="text-sm">Optimal Level</span>
                </div>
            </div>
        </div>
    );
}
export default Humidity;