import {Container, Row, Col} from 'react-bootstrap'
import { Link } from "react-router-dom"

const Footer = () => {
    const currentYear = new Date().getFullYear()
  return (
    <footer>
        <Container>
            <Row>
                <Col>
                    <p>ProShop &copy; {currentYear}</p>
                    <p class="copyright">
                        &copy; {currentYear} ProShop. All Rights Reserved | Crafted by <Link to='https://github.com/grmbyrn'
                        target="_blank">Graeme Byrne</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}
export default Footer