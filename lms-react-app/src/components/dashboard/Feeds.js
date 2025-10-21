import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  CardSubtitle,
  ListGroupItem,
  Button,
} from "reactstrap";
import { useGroup } from "../../hooks/Groups/useGroups";


const FeedData = [
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    color: "primary",
    date: "6 minute ago",
  },
  {
    title: "New user registered.",
    icon: "bi bi-person",
    color: "info",
    date: "6 minute ago",
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    color: "danger",
    date: "6 minute ago",
  },
  {
    title: "New order received.",
    icon: "bi bi-bag-check",
    color: "success",
    date: "6 minute ago",
  },
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    color: "dark",
    date: "6 minute ago",
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    color: "warning",
    date: "6 minute ago",
  },
];

const Feeds = () => {
  // const {group, loading} = useGroup();
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Active Groups</CardTitle>
        <ListGroup flush className="mt-1">
          {/* {group.map((item, index) => (
            item.status === 'active' && ( // Check if status is 'active'
              <ListGroupItem
                key={index}
                action
                href="/"
                tag="a"
                className="d-flex align-items-center p-3 border-0"
              >
                {item.name}
                <small className="ms-auto text-muted text-small">
                  {item.duration} months
                </small>
                
              </ListGroupItem>
            )
          ))} */}
        </ListGroup>

      </CardBody>
    </Card>
  );
};

export default Feeds;
