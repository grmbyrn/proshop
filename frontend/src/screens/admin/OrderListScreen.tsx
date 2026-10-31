import { Link } from 'react-router-dom'
import {Table, Button} from 'react-bootstrap'
import { FaTimes } from "react-icons/fa"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useGetOrdersQuery } from "../../slices/ordersApiSlice"
import { getErrorMessage } from '../../utils/getErrorMessage'
import { formatDate } from '../../utils/formatDate'

const OrderListScreen = () => {
  const {data: orders, error} = useGetOrdersQuery()

  return (
    <>
      <h1>Orders</h1>
      {error ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
      ) : !orders ? (
        <Loader />
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
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    formatDate(order.paidAt)
                  ) : (
                    <FaTimes style={{color: 'red'}} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    formatDate(order.deliveredAt)
                  ) : (
                    <FaTimes style={{color: 'red'}} />
                  )}
                </td>
                <td>
                  <Link to={`/order/${order._id}`} className="btn btn-light btn-sm">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
export default OrderListScreen