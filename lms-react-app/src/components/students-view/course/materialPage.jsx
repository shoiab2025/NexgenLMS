import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMaterialById } from "../../../service/baseService";
import { Col, Row, Card, CardBody, CardTitle, Spinner } from "reactstrap";

const MaterialPage = () => {
  const params = useParams();
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
      fetchMaterialById(id); // Fetch material when `id` is available
    }
  }, [id]);

  return (
    <div className="container my-4">
      <h3 className="mt-5 mb-3">
        {materialData ? `${materialData.name} Material - ${materialData.content_type}` : "Materials"}
      </h3>

      {materialData === null ? (
        <div>No material available.</div>
      ) : materialData.content_type === "Video" ? (
        <Row>
          <Col md="8" key={materialData._id} className="mb-3">
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
              <iframe
                className="embed-responsive-item"
                src={materialData.content_url}
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                title="Video"
              ></iframe>
            </div>
          </Col>
          <Col md="4" key={materialData._id} className="mb-3">
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
                  <tr className="bg_description">
                    <td className="bg_description">Posted</td>
                    <td className="bg_description">
                      {new Date(materialData.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      ) : materialData.content_type === "PDF" ? (
        <Row>
          <Col md="12" key={materialData._id} className="mb-3">
            {/* Add logic to embed PDF, for example using an iframe or PDF.js */}
            <embed
              src={materialData.content_url}
              type="application/pdf"
              width="100%"
              height="600px"
            />
          </Col>
          
          <Col md="4" key={materialData._id} className="mb-3">
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
                  <tr className="bg_description">
                    <td className="bg_description">Posted</td>
                    <td className="bg_description">
                      {new Date(materialData.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
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
