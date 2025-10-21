import React, { useState, useEffect } from 'react';
import { Table, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import { useGroup } from '../../hooks/Groups/useGroups';
import { useCreateGroup } from '../../hooks/Groups/useCreateGroup';
import { useUpdateGroup } from '../../hooks/Groups/useUpdateGroup';

const Groups = () => {
  const [newGroup, setNewGroup] = useState({ name: '', description: '', duration: '', status: 'Active' });
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]); 
  const { createGroup } = useCreateGroup();
  const { UpdateGroup } = useUpdateGroup();
  const { group: fetchedGroups } = useGroup(); 


  useEffect(() => {
    if (fetchedGroups) {
      setGroups(fetchedGroups);
    }
  }, [fetchedGroups]);


  const toggleModal = () => setIsModalOpen(!isModalOpen);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prevGroup) => ({ ...prevGroup, [name]: value }));
  };


  const saveGroup = async () => {
    if (newGroup.name && newGroup.description && newGroup.duration && newGroup.status) {
      if (editIndex !== null) {
      
        await UpdateGroup(newGroup.name, newGroup.description, newGroup.duration, newGroup.status.toLowerCase(), newGroup._id);

      
        const updatedGroups = [...groups];
        updatedGroups[editIndex] = newGroup;
        setGroups(updatedGroups);
      } else {
      
        const createdGroup = await createGroup(newGroup.name, newGroup.description, newGroup.duration, newGroup.status.toLowerCase());
        setGroups([...groups, createdGroup]);
      }

    
      setNewGroup({ name: '', description: '', duration: '', status: 'Active' });
      setEditIndex(null);
      toggleModal();
    } else {
      alert('Please fill all fields');
    }
  };


  const editGroup = (index) => {
    setEditIndex(index);
    setNewGroup(groups[index]);
    toggleModal();
  };

  return (
    <div>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h5">Groups</CardTitle>
            <Button
              color="primary"
              onClick={() => {
                setEditIndex(null);
                setNewGroup({ name: '', description: '', duration: '', status: 'Active' });
                toggleModal();
              }}
            >
              Add Group
            </Button>
          </div>
          <Table responsive borderless>
            <thead>
              <tr className="bg-primary text-white">
                <th>Group</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups && groups.length > 0 ? (
                groups.map((group, index) => (
                  group && group.name ? (
                    <tr key={index}>
                      <td>
                        <h6 className="mb-0">{group.name}</h6>
                        <span className="text-muted">{group.description}</span>
                      </td>
                      <td>{group.duration} months</td>
                      <td>
                        {group.status === "active" ? (
                          <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                        ) : (
                          <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                        )}
                      </td>
                      <td>
                        <Button color="warning" size="sm" onClick={() => editGroup(index)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ) : null
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No groups available.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal for adding/editing a group */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editIndex !== null ? 'Edit Group' : 'Add New Group'}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Group Name</Label>
            <Input
              type="text"
              name="name"
              value={newGroup.name}
              onChange={handleInputChange}
              placeholder="Enter group name"
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="text"
              name="description"
              value={newGroup.description}
              onChange={handleInputChange}
              placeholder="Enter group description"
            />
          </FormGroup>
          <FormGroup>
            <Label for="duration">Duration</Label>
            <Input
              type="text"
              name="duration"
              value={newGroup.duration}
              onChange={handleInputChange}
              placeholder="Enter duration"
            />
          </FormGroup>
          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              type="select"
              name="status"
              value={newGroup.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveGroup}>
            {editIndex !== null ? 'Update Group' : 'Add Group'}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Groups;
