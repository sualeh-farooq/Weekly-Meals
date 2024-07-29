import { useState, useEffect, useMemo, useCallback } from 'react';
import { Tab, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import WeekNavTabs from './nav_tabs';
import RecipeCard from './recipe_card';
import { BarLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import DishesPlaceholder from './dish_placeholder';
import Swal from 'sweetalert2';

async function MealsData() {
  const response = await fetch('https://dummyjson.com/recipes');
  const responseResult = response.json();
  return responseResult;
}

function MealSection() {
  const [activeTab, setActiveTab] = useState('all_meals');
  const [recipeSelectCard, setRecipeSelectCard] = useState([]);
  const [addWeekModal, setAddWeekModal] = useState(false);
  const [allMeals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [weekDishes, setWeekDishes] = useState([]);
  const [weeks, setWeeks] = useState([
    { id: 'week1', title: 'Week 1' },
    { id: 'week2', title: 'Week 2' },
    { id: 'week3', title: 'Week 3' },
    { id: 'week4', title: 'Week 4' },
  ]);

  useEffect(() => {
    const fetchRecipeData = async () => {
      setIsLoading(true);
      const recipes = await MealsData();
      setMeals(recipes.recipes);
      setIsLoading(false);
    };
    fetchRecipeData();
  }, []);

  const recipeSelection = (cardId) => {
    setRecipeSelectCard((existingVal) => {
      if (existingVal.includes(cardId)) {
        return existingVal.filter((id) => id !== cardId);
      } else {
        return [...existingVal, cardId];
      }
    });
  };


  useEffect(() => {
    setIsDisabled(recipeSelectCard.length <= 0);
  }, [recipeSelectCard]);

  const activeNav = useCallback((tabKey) => {
    setActiveTab(tabKey);
  }, []);

  const weekModalHandle = () => {
    setAddWeekModal((current) => !current);
  };

  const weekToggle = useCallback((week) => {
    setSelectedWeek((existingValue) => {
      if (existingValue.includes(week.id)) {
        return existingValue.filter((selectedWeek) => selectedWeek !== week.id);
      } else {
        return [...existingValue, week.id];
      }
    });
  }, []);

  const addDishes = useCallback(() => {
    const sameWeeks = selectedWeek.filter(week =>
      weekDishes.some(dish => dish.id === recipeSelectCard[0] && dish.dishforWeek.includes(week))
    );
    if (sameWeeks.length > 0) {
      const sameDish = allMeals.find(dish => dish.id === recipeSelectCard[0]);
      const sameWeekNames = sameWeeks.map(weekId => weeks.find(week => week.id === weekId).title).join(', ');

      Swal.fire(
        `Already Added in ${sameWeekNames} !`,
        `${sameDish.name} is Already Added in ${sameWeekNames}`,
        'info'
      );;
      return;
    }

    if (selectedWeek.length <= 0) {
      toast.warn("Please select a week first", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    } else {
      const filteredDishes = allMeals.filter((data) => recipeSelectCard.includes(data.id));
      const dishesofWeek = filteredDishes.map((val) => {
        const existingDish = weekDishes.find(dish => dish.id === val.id);
        return {
          ...val,
          dishforWeek: existingDish ? [...new Set([...existingDish.dishforWeek, ...selectedWeek])] : selectedWeek
        };
      });
      setWeekDishes((existingVal) => {
        let updatedDishes = [...existingVal];
        dishesofWeek.forEach((newDish) => {
          const index = updatedDishes.findIndex((dish) => dish.id === newDish.id);
          if (index !== -1) {
            updatedDishes[index] = newDish;
          } else {
            updatedDishes.push(newDish);
          }
        });
        return updatedDishes;
      });

      toast.success("Added Successfully", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });

      setTimeout(() => {
        setAddWeekModal(false);
        setRecipeSelectCard([]);
        setSelectedWeek([]);
      }, 2000);
    }
  }, [recipeSelectCard, selectedWeek, allMeals, weeks, weekDishes]);

  const deleteDish = useCallback((id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setWeekDishes(existingDishes => {
          return existingDishes.map(dish => {
            if (dish.id === id) {
              return {
                ...dish,
                dishforWeek: dish.dishforWeek.filter(week => week !== activeTab)
              };
            }
            return dish;
          }).filter(dish => dish.dishforWeek.length > 0);
        });
        Swal.fire(
          'Deleted!',
          'Your dish has been deleted from the week.',
          'success'
        );
      }
    });
  }, [activeTab]);



  return (
    <>
      <Container className='navs-container' fluid>
        <Row>
          <Col>
            <WeekNavTabs isDisabled={isDisabled} addWeekModal={weekModalHandle} defaultActive={activeTab} activeTab={(e) => activeNav(e)} />
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <Tab.Content className='py-4'>
              <Tab.Pane eventKey="all_meals" active={activeTab === 'all_meals'}>
                {
                  isLoading ? (
                    <div className='w-100 py-4 d-flex justify-content-center   ' >
                      <span>
                        <BarLoader width={500} color='#044474' className='mt-5' />
                      </span>
                    </div>
                  ) : (
                    <div className='d-flex flex-wrap justify-content-between gap-3' >
                      {
                        allMeals.map((val, index) => {
                          return (
                            <RecipeCard
                              key={index}
                              cardId={val.id}
                              isSelect={recipeSelectCard.includes(val.id)}
                              cardSelect={recipeSelection}
                              recipeImg={val.image}
                              recipeType={val.mealType[0]}
                              recipeTitle={val.name}
                              recipeContent={val.instructions}
                              recipeCusine={val.cuisine}
                              rating={val.rating}
                              cardDisabled={false}
                            />

                          )
                        })
                      }
                    </div>
                  )
                }
              </Tab.Pane>
              <Tab.Pane eventKey="week1" active={activeTab === 'week1'}>
                <div className={'w-100 d-flex flex-wrap justify-content-start gap-5'} >
                  {
                    weekDishes.length > 0 ? (
                      <>
                        {weekDishes.filter((data) => data.dishforWeek.includes('week1')).length > 0 ? (
                          weekDishes.filter((data) => data.dishforWeek.includes('week1'))
                            .map((val, index) => {

                              return (
                                <RecipeCard
                                  key={index}
                                  cardId={val.id}
                                  isSelect={recipeSelectCard.includes(val.id)}
                                  cardSelect={recipeSelection}
                                  recipeImg={val.image}
                                  recipeType={val.mealType[0]}
                                  recipeTitle={val.name}
                                  recipeContent={val.instructions}
                                  recipeCusine={val.cuisine}
                                  rating={val.rating}
                                  cardDisabled={true}
                                  deleteDish={() => deleteDish(val.id)}

                                />
                              );
                            })
                        ) : (
                          <DishesPlaceholder week="1" />
                        )}
                      </>
                    ) : (
                      <DishesPlaceholder week="1" />
                    )
                  }
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="week2" active={activeTab === 'week2'}>
                <div className={'w-100 d-flex flex-wrap justify-content-start gap-5'} >
                  {
                    weekDishes.length > 0 ? (
                      <>
                        {weekDishes.filter((data) => data.dishforWeek.includes('week2')).length > 0 ? (
                          weekDishes.filter((data) => data.dishforWeek.includes('week2'))
                            .map((val, index) => {

                              return (
                                <RecipeCard
                                  key={index}
                                  cardId={val.id}
                                  isSelect={recipeSelectCard.includes(val.id)}
                                  cardSelect={recipeSelection}
                                  recipeImg={val.image}
                                  recipeType={val.mealType[0]}
                                  recipeTitle={val.name}
                                  recipeContent={val.instructions}
                                  recipeCusine={val.cuisine}
                                  rating={val.rating}
                                  cardDisabled={true}
                                  deleteDish={() => deleteDish(val.id)}


                                />
                              );
                            })
                        ) : (
                          <DishesPlaceholder week="2" />
                        )}
                      </>
                    ) : (
                      <DishesPlaceholder week="2" />
                    )
                  }
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="week3" active={activeTab === 'week3'}>
                <div className={'w-100 d-flex flex-wrap justify-content-start gap-5'} >
                  {
                    weekDishes.length > 0 ? (
                      <>
                        {weekDishes.filter((data) => data.dishforWeek.includes('week3')).length > 0 ? (
                          weekDishes.filter((data) => data.dishforWeek.includes('week3'))
                            .map((val, index) => {

                              return (
                                <RecipeCard
                                  key={index}
                                  cardId={val.id}
                                  isSelect={recipeSelectCard.includes(val.id)}
                                  cardSelect={recipeSelection}
                                  recipeImg={val.image}
                                  recipeType={val.mealType[0]}
                                  recipeTitle={val.name}
                                  recipeContent={val.instructions}
                                  recipeCusine={val.cuisine}
                                  rating={val.rating}
                                  cardDisabled={true}
                                  deleteDish={() => deleteDish(val.id)}

                                />
                              );
                            })
                        ) : (
                          <DishesPlaceholder week="3" />
                        )}
                      </>
                    ) : (
                      <DishesPlaceholder week="3" />
                    )
                  }
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="week4" active={activeTab === 'week4'}>
                <div className={'w-100 d-flex flex-wrap justify-content-start gap-5'} >
                  {
                    weekDishes.length > 0 ? (
                      <>
                        {weekDishes.filter((data) => data.dishforWeek.includes('week4')).length > 0 ? (
                          weekDishes.filter((data) => data.dishforWeek.includes('week4'))
                            .map((val, index) => {
                              return (
                                <RecipeCard
                                  key={index}
                                  cardId={val.id}
                                  isSelect={recipeSelectCard.includes(val.id)}
                                  cardSelect={recipeSelection}
                                  recipeImg={val.image}
                                  recipeType={val.mealType[0]}
                                  recipeTitle={val.name}
                                  recipeContent={val.instructions}
                                  recipeCusine={val.cuisine}
                                  rating={val.rating}
                                  cardDisabled={true}
                                  deleteDish={() => deleteDish(val.id)}


                                />
                              );
                            })
                        ) : (
                          <DishesPlaceholder week="4" />
                        )}
                      </>
                    ) : (
                      <DishesPlaceholder week="4" />
                    )
                  }
                </div>

              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>


      <Modal size="lg" centered show={addWeekModal} onHide={() => setAddWeekModal(!addWeekModal)}>
        <Modal.Body className='p-5 d-flex flex-column align-items-center gap-3' >
          <h3 className='fw-bold' >Select Week</h3>
          <div className="d-flex justify-content-between gap-4 p-3 flex-wrap">
            {weeks.map((week) => (
              <div
                className='week_selection_btn'
                key={week.id}
                style={{
                  backgroundColor: selectedWeek.includes(week.id) ? '#cfecff' : '#f2f2f2',
                }}
                onClick={() => weekToggle(week)}
              >
                <span>{week.title}</span>
              </div>
            ))}

          </div>
          <Button onClick={addDishes} className='add_week_btn' > Save </Button>

        </Modal.Body>

      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
}

export default MealSection;
