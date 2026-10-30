import { useNavigate, Link, NavLink } from 'react-router-dom'
import {Badge, Navbar, Nav, Container, NavDropdown} from 'react-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import { useAppSelector, useAppDispatch } from '../hooks'
import { useLogoutMutation } from '../slices/usersApiSlice'
import {logout} from '../slices/authSlice'
import SearchBox from './SearchBox'
import logo from '../assets/logo.png'
import { resetCart } from '../slices/cartSlice'
 
const Header = () => {
    const {cartItems} = useAppSelector((state) => state.cart)
    const {userInfo} = useAppSelector((state) => state.auth)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try{
            await logoutApiCall().unwrap()
            dispatch(logout())
            dispatch(resetCart())
            navigate('/login')
        } catch(error){
            console.log(error);
        }
    }

  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='md'>
            <Container>
                <Navbar.Brand as={Link} to='/'>
                    <img src={logo} alt='proshop' />
                    ProShop
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <SearchBox />
                        <Nav.Link as={NavLink} to='/cart'>
                            <FaShoppingCart /> Cart
                            {
                                cartItems.length > 0 && (
                                    <Badge pill bg='success' style={{marginLeft:'5px'}}>
                                        {cartItems.reduce((acc, c) => acc + c.qty, 0)}
                                    </Badge>
                                )
                            }
                        </Nav.Link>
                        {userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'>
                                <NavDropdown.Item as={NavLink} to='/profile'>Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={NavLink} to='/login'>
                                <FaUser /> Sign In
                            </Nav.Link>
                        )}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='adminmenu'>
                                <NavDropdown.Item as={NavLink} to='/admin/productlist'>Products</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/admin/userlist'>Users</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to='/admin/orderlist'>Orders</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}
export default Header