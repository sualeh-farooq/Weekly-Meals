import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ReactStars from 'react-rating-stars-component';
import { FaRegTrashAlt } from "react-icons/fa";

function RecipeCard({ cardSelect, isSelect, cardId, recipeImg, recipeType, recipeTitle, recipeContent, recipeCusine, rating, cardDisabled, deleteDish }) {
  return (
    <Card 
      onClick={() => {
        if (!cardDisabled) {
          cardSelect(cardId);
        }
      }} 
      className={`recipe_card ${isSelect ? 'selected-border' : ''}`}
      style={{ cursor: cardDisabled ? 'normal' : 'pointer' }}>
      <div className='recipe_card_top'>
        <Card.Img className='recipe_product_img' src={recipeImg} />
        <span className='meal_type_badge'>{recipeType}</span>
        {cardDisabled ? (
          <button onClick={() => deleteDish(cardId)} className='delete_btn'>
            <FaRegTrashAlt size={20} color='#ec3855' />
          </button>
        ) : null}
      </div>
      <Card.Body>
        <div>
          <Card.Title className='recipe_title'>{recipeTitle}</Card.Title>
          <Card.Text className='recipe_content'>
            {recipeContent.map((val, index) => {
              return val;
            })}
          </Card.Text>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <span>
            <b>Cuisine: </b> {recipeCusine}
          </span>
          <span className='d-flex align-items-center gap-1'>
            <b>Rating: </b>
            <span>{rating}</span>
            <ReactStars
              count={5}
              size={20}
              value={rating}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#02599c"
              edit={false}
            />
          </span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;
