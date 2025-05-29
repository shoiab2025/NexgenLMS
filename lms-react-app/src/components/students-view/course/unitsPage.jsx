import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMaterialBySubject } from "../../../service/baseService";
import { Col, Row, Card, CardBody, CardTitle, Spinner } from "reactstrap";

const UnitsPage = () => {
  const params = useParams();
  const [materialData, setMaterialData] = useState(null);
  const [subjectData, setSubjectData] = useState(null);

  const { id } = params;

  const fetchMaterialBySubject = async (subId) => {
    try {
      const data = await getMaterialBySubject(subId);
      const { materials, subject } = data.data;
      setMaterialData(materials);
      setSubjectData(subject);
    } catch (error) {
      console.error("Error fetching material by subject ID:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMaterialBySubject(id); // Fetch materials when `id` is available
    }
  }, [id]);

  return (
    <div className="container my-4">
      <h3 className="mt-2 mb-3">Contents {subjectData ? `of ${subjectData.name}`: ``}</h3>
      {materialData === null ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : materialData.length === 0 ? (
        <div>No materials available.</div>
      ) : (
        <Row>
          {materialData.map((unit, index) => (
            <Col md="4" key={unit._id} className="mb-3">
              <Card className="unit-card">
                <CardBody>
                  <Link to={`/course/materials/${unit._id}`} className="text-decoration-none">
                    <CardTitle tag="h5" className="mb-0">
                      {index + 1}. {unit.name}
                    </CardTitle>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default UnitsPage;
