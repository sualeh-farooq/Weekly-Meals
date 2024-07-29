import { Container, Row, Col } from "react-bootstrap";

export default function Hero() {
    return (
        <Container fluid className="main_cover d-flex justify-content-center align-items-center ">
           <Row>
           <Col lg={12} className="text-center">
                <h1 className="display-5 fw-bold">Optimize Your Meal</h1>
                <p className="lead mb-4">
                    Select Meal to Add in Week. You will be able to edit, modify, and change the Meal Weeks.
                </p>
            </Col>
           </Row>
        </Container>
    );
}
