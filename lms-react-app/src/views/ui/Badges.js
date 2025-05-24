import React, { useState } from 'react';
import { Table, Badge, Button, Card, CardBody, CardTitle, Row, Col } from "reactstrap";

const Badges = () => {
  return (
    <div>
      <Row>
        <Col xs="12" md="12" sm="12">
          {/* --------------------------------------------------------------------------------*/}
          {/* Card-1*/}
          {/* --------------------------------------------------------------------------------*/}
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              Badges
            </CardTitle>
            <CardBody className="">
              <div>
                <Table striped>
                  <thead>
                    <tr>
                      <th>Alert Type</th>
                      <th>Alert Message</th>
                      <th>Link Example</th>
                      <th>Dismissible</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Primary</td>
                      <td>
                        
                      </td>
                      <td>
                        
                      </td>
                      <td rowSpan={2}>
                        
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Badges;
