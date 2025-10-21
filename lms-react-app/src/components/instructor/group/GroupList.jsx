import React, { useEffect } from 'react';
import { useInstructorContext } from '../../../contexts/Instructor-context';
import { fetchGroups, deleteGroup } from '../../../service/groupService';
import {
    Card,
    CardBody,
    CardTitle,
    Button,
    Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const GroupList = () => {
    const { groupList, setGroupList } = useInstructorContext();


    const fetchGroupList = async () => {
        try {
            const res = await fetchGroups();

            setGroupList(res?.data);
        } catch (error) {
            toast.error("Failed to fetch groups. Please try again.", error);
        }
    };

    useEffect(() => {
        fetchGroupList();
    }, []);


    const removeGroup = async (groupId) => {
        try {
            await deleteGroup(groupId);
            setGroupList((prev) => prev.filter(group => group._id !== groupId));
            toast.success("Group deleted successfully.");
        } catch (error) {
            toast.error("Failed to delete group. Please try again.");
        }
    };

    return (
        <Card>
            <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <CardTitle tag="h5">Groups</CardTitle>
                    <Link to="/instructor/create-group" className="btn btn-primary">
                        Add Group
                    </Link>
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
                        {groupList && groupList.length > 0 ? (
                            groupList.map((group) => (
                                group && group.name ? (
                                    <tr key={group._id}>
                                        <td>
                                            <h6 className="mb-0">{group.name}</h6>
                                            <span className="text-muted">{group.description}</span>
                                        </td>
                                        <td>{group.duration ? `${group.duration} months` : 'N/A'}</td>
                                        <td>
                                            {group.status === 'active' ? (
                                                <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                                            ) : (
                                                <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                                            )}
                                        </td>
                                        <td>
                                            <Link to={`/instructor/edit-group/${group._id}`} className='me-1'>
                                                <Button color="warning" size="sm"><i className='bi bi-pen-fill'></i></Button>
                                            </Link>
                                            <Button 
                                                color="danger" 
                                                size="sm" 
                                                onClick={() => removeGroup(group._id)}
                                            >
                                                <i className='bi bi-trash'></i>
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
    );
};

export default GroupList;
