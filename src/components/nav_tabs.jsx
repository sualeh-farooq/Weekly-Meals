import { Tab, Col, Nav, Row, Button, Container } from 'react-bootstrap';
function WeekNavTabs({ activeTab, defaultActive , addWeekModal , isDisabled  }) {
    return (
        <Tab.Container id="left-tabs-example" defaultActiveKey={defaultActive} onSelect={activeTab}>
            <div className='bg-white p-4'>
                <Container>
                    <Row>
                        <Col>
                            <div className='d-flex align-items-center justify-content-between'>
                                <Nav variant="pills" className="flex-row">
                                    <Nav.Item>
                                        <Nav.Link eventKey="all_meals">All Meals</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="week1">Week 1</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="week2">Week 2</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="week3">Week 3</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="week4">Week 4</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <div>
                                    <Button disabled={isDisabled} onClick={addWeekModal} className='add_week_btn' >Add to Week</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Tab.Container>
    );
}

export default WeekNavTabs;
