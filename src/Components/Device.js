import React from "react";
import { LightbulbOutlined, AcUnitOutlined, AirOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';


function Device(props) {
    return (
        <div className="col-12 col-sm-6 col-md-3 mb-3 d-flex align-items-stretch">
        <div className="card border-1 h-100 w-100">
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">{props.name}</h5>
                    {props.type === "Light" && <LightbulbOutlined className="text-warning" style={{ fontSize: 28 }} />}
                    {props.type === "Air Conditioner" && <AcUnitOutlined className="text-primary" style={{ fontSize: 28 }} />}
                    {props.type === "Fan" && <AirOutlined className="text-info" style={{ fontSize: 28 }} />}
                </div>
                <div className="d-flex flex-column">
                    <p className="card-text mb-2">Location: {props.location}</p>
                    <p className="card-text mb-2">Type: {props.type}</p>
                </div>
                <div className="mt-3 d-flex justify-content-between">
                    <button className="btn btn-outline-warning btn-sm me-2">
                        <EditOutlined fontSize="small" /> Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                        <DeleteOutlined fontSize="small" /> Delete
                    </button>
                </div>
            </div>
        </div></div>
    );
}

export default Device;
