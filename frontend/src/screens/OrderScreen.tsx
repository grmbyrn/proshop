import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap"
import {toast} from 'react-toastify'
import { useAppSelector } from '../hooks'
import {
    PayPalButtons,
    usePayPalScriptReducer,
    DISPATCH_ACTION,
    SCRIPT_LOADING_STATE,
    type PayPalButtonsComponentProps
} from '@paypal/react-paypal-js';
import Message from "../components/Message"
import Loader from "../components/Loader"
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useDeliverOrderMutation
} from "../slices/ordersApiSlice"
import { getErrorMessage } from '../utils/getErrorMessage'
import { formatDateTime } from '../utils/formatDate'

const OrderScreen = () => {
    const {id: orderId} = useParams() as {id: string}

    const {data: order, refetch, error} = useGetOrderDetailsQuery(orderId)

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation()

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer()

    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery()

    const {userInfo} = useAppSelector((state) => state.auth)

    useEffect(() => {
        if(!errorPayPal && !loadingPayPal && paypal?.clientId){
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: DISPATCH_ACTION.RESET_OPTIONS,
                    value: {
                        clientId: paypal.clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({type: DISPATCH_ACTION.LOADING_STATUS, value: SCRIPT_LOADING_STATE.PENDING})
            }
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript()
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])

    const onApprove: PayPalButtonsComponentProps['onApprove'] = (data, actions) => {
        return actions.order!.capture().then(async function(details){
            try{
                await payOrder({orderId, details}).unwrap()
                refetch()
                toast.success('Payment successful')
            } catch(error){
                toast.error(getErrorMessage(error))
            }
        })
    }

    // TESTING ONLY! REMOVE BEFORE PRODUCTION
    // async function onApproveTest(){
    //     await payOrder({orderId, details: {payer: {}}})
    //     refetch()
    //     toast.success('Payment successful')
    // }

    const onError: PayPalButtonsComponentProps['onError'] = (err) => {
        toast.error(getErrorMessage(err))
    }

    const createOrder: PayPalButtonsComponentProps['createOrder'] = (data, actions) => {
        return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: order!.totalPrice.toFixed(2)
                    }
                }
            ]
        }).then((orderId) => {
            return orderId
        })
    }

    const deliverOrderHandler = async () => {
        try{
            await deliverOrder(orderId).unwrap()
            refetch()
            toast.success('Order delivered')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

  return error ? <Message variant='danger'>{getErrorMessage(error)}</Message>
  : !order ? <Loader /> : (
    <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant="flash">
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email: </strong> {order.user.email}
                        </p>
                        <p>
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <Message variant='success'>
                                Delivered on {formatDateTime(order.deliveredAt)}
                            </Message>
                        ) : (
                            <Message variant='danger'>
                                Not Delivered
                            </Message>
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant='success'>
                                Paid on {formatDateTime(order.paidAt)}
                            </Message>
                        ) : (
                            <Message variant='danger'>
                                Not Paid
                            </Message>
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item.product}`}>
                                            {item.name}
                                        </Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>

                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>

                            <Row>
                                <Col>Tax</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>

                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader />}

                                {isPending ? (
                                    <Loader />
                                ) : (
                                    <div>
                                        {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                                        {/* <Button
                                            style={{ marginBottom: '10px' }}
                                            onClick={onApproveTest}
                                        >
                                            Test Pay Order
                                        </Button> */}

                                        <div>
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            ></PayPalButtons>
                                        </div>
                                    </div>
                                )}
                            </ListGroup.Item>
                        )}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className="btn btn-block"
                                    onClick={deliverOrderHandler}
                                >
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  )
}
export default OrderScreen