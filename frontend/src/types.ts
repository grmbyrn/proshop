// Shapes of the JSON returned by the backend API

export interface UserInfo {
    _id: string
    name: string
    email: string
    isAdmin: boolean
}

export interface User extends UserInfo {
    createdAt: string
    updatedAt: string
}

export interface Review {
    _id: string
    user: string
    name: string
    rating: number
    comment: string
    createdAt: string
}

export interface Product {
    _id: string
    user: string
    name: string
    image: string
    brand: string
    category: string
    description: string
    reviews: Review[]
    rating: number
    numReviews: number
    price: number
    countInStock: number
}

export interface PaginatedProducts {
    products: Product[]
    page: number
    pages: number
}

export interface CartItem extends Product {
    qty: number
}

export interface ShippingAddress {
    address: string
    city: string
    postalCode: string
    country: string
}

export interface OrderItem {
    _id: string
    name: string
    qty: number
    image: string
    price: number
    product: string
}

export interface Order {
    _id: string
    // Populated with name/email on the order details and admin order list endpoints
    user: Pick<User, '_id' | 'name'> & { email?: string }
    orderItems: OrderItem[]
    shippingAddress: ShippingAddress
    paymentMethod: string
    itemsPrice: number
    taxPrice: number
    shippingPrice: number
    totalPrice: number
    isPaid: boolean
    paidAt?: string
    isDelivered: boolean
    deliveredAt?: string
    createdAt: string
}

// The user's own orders are not populated, so user is just the ID
export interface MyOrder extends Omit<Order, 'user'> {
    user: string
}
