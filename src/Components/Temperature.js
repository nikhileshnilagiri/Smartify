import React from "react";

function Temperature() {
    return (
        <div className="col-12 col-md-4 mb-3">
            <div className="card border-0 shadow" style={{ borderRadius: "40px", height: "150px", overflow: "hidden" }}>
                <div className="bg-image" style={{ position: "relative", height: "100%" }}>
                    <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/draw1.webp"
                        className="card-img"
                        alt="weather"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                    <div
                        className="mask"
                        style={{
                            backgroundColor: "rgba(190, 216, 232, .5)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                    ></div>
                    <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center">
                        <h4 className="mb-0">Temperature</h4>
                        <p className="display-2 mb-0" style={{ fontSize: "3em" }}>22°C</p>
                        <h5>Snowy</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Temperature;