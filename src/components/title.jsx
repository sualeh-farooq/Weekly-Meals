import { Row, Col, Container } from 'react-bootstrap'
export default function Title({ title }) {
    return (
       <Container>
         <Row>
            <Col>
                <div className='py-4'  >
                    <h2 className="fw-bold" >{title}</h2>
                </div>
            </Col>
        </Row>
       </Container>
    )
}