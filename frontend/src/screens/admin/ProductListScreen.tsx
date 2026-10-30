import {Table, Button, Row, Col} from 'react-bootstrap'
import { FaEdit, FaTrash } from "react-icons/fa"
import { useParams, Link } from "react-router-dom"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Paginate from "../../components/Paginate"
import {toast} from 'react-toastify'
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice"
import { getErrorMessage } from '../../utils/getErrorMessage'

const ProductListScreen = () => {
    const {pageNumber} = useParams()

    const {data, isLoading, error, refetch} = useGetProductsQuery({
        pageNumber
    })

    const [createProduct, {isLoading: loadingCreate }] = useCreateProductMutation()

    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation()

    const deleteHandler = async (id: string) => {
        if(window.confirm('Are you sure?')){
            try{
                await deleteProduct(id).unwrap()
                toast.success('Product deleted')
                refetch()
            } catch(error){
                toast.error(getErrorMessage(error))
            }
        }
    }

    const createProductHandler = async () => {
        if(window.confirm('Are you sure you want to create a new product?')){
            try{
                await createProduct().unwrap()
                refetch()
            } catch(error){
                toast.error(getErrorMessage(error))
            }
        }
    }

  return ( 
    <>
        <Row className="align-items-center">
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className="text-end">
                <Button className="my-3" onClick={createProductHandler}>
                    <FaEdit /> Create Product
                </Button>
            </Col>
        </Row>

        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}

        {error ? <Message variant='danger'>{getErrorMessage(error)}</Message> : !data ? <Loader /> : (
            <>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <Link to={`/admin/product/${product._id}/edit`} className="btn btn-light btn-sm mx-2">
                                        <FaEdit />
                                    </Link>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                                        <FaTrash color='white' />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paginate
                    pages={data.pages}
                    page={data.page}
                    isAdmin={true}
                />
            </>
        )}
    </>
  )
}
export default ProductListScreen