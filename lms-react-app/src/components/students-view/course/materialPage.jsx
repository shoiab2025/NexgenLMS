import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMaterialById } from "../../../service/baseService";
import { Col, Row, Card, CardBody, CardTitle, Spinner, Button } from "reactstrap";

const MaterialPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [materialData, setMaterialData] = useState(null);

  const { id } = params;

  const fetchMaterialById = async (subId) => {
    try {
      const data = await getMaterialById(subId);
      const material = data.data;
      setMaterialData(material);
    } catch (error) {
      console.error("Error fetching material by ID:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMaterialById(id);
    }
  }, [id]);

  // Helper function to extract Google Drive file ID
  function getDriveId(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
  }

  return (
    <div className="container my-4">
      <Button color="secondary" className="mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>
      <h3 className="mt-5 mb-3">
        {materialData ? `${materialData.name} Material - ${materialData.content_type}` : "Materials"}
      </h3>

      {materialData === null ? (
        <div>No material available.</div>
      ) : materialData.content_type === "Video" ? (
        <Row>
          <Col md="12" key={materialData._id} className="mb-3">
            <div
              className="embed-responsive"
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                maxWidth: "100%",
              }}
            >
              <video
                src={materialData.content_url}
                controls
                controlsList="nodownload"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                title="Video"
              ></video>
            </div>
          </Col>
          <Col md="8" key={materialData._id + "-details"} className="mb-3">
            <h5>Material Details:</h5>
            <div className="bg_description">
              <table className="table table-bordered bg_description">
                <tbody>
                  <tr className="bg_description">
                    <td className="bg_description">Name</td>
                    <td className="bg_description">{materialData.name}</td>
                  </tr>
                  <tr className="bg_description">
                    <td className="bg_description">Description</td>
                    <td className="bg_description">{materialData.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      ) : materialData.content_type === "PDF" ? (
        <Row>
          <Col md="12" key={materialData._id} className="mb-3">
            <iframe
              src={
                materialData.content_url.includes("drive.google.com")
                  ? `https://drive.google.com/file/d/${getDriveId(materialData.content_url)}/preview`
                  : materialData.content_url
              }
              width="100%"
              height="600px"
              allow="autoplay"
              title="PDF"
              style={{ border: "none" }}
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </Col>
          <Col md="8" key={materialData._id + "-details"} className="mb-3">
            <h5>Material Details:</h5>
            <div className="bg_description">
              <table className="table table-bordered bg_description">
                <tbody>
                  <tr className="bg_description">
                    <td className="bg_description">Name</td>
                    <td className="bg_description">{materialData.name}</td>
                  </tr>
                  <tr className="bg_description">
                    <td className="bg_description">Description</td>
                    <td className="bg_description">{materialData.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      ) : (
        <div>No valid material found.</div>
      )}
    </div>
  );
};

export default MaterialPage;
