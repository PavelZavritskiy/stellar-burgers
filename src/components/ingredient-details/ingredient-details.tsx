import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredientsState } from '../../services/features/ingredientSlice';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(getIngredientsState).ingredients;
  let { id } = useParams();
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
