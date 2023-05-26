import { LinkContainer } from "react-router-bootstrap"
import {Table, Button} from 'react-bootstrap'
import { FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useGetUsersQuery } from "../../slices/ordersApiSlice"

const UserListScreen = () => {
  const {data: users, refetch, isLoading, error} = useGetUsersQuery()

  const deleteHandler = (id) => {
    console.log('delete')
  }

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{color: 'red'}} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{color: 'red'}} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
export default UserListScreen