import React, { useState } from 'react'
import Modal from 'react-modal'
import { Button, Accordion, AccordionSummary, AccordionDetails, ButtonGroup, Typography } from '@material-ui/core'
import { Add, Close, ExpandMore, Restore } from '@material-ui/icons'
import ReuseModal from './ReuseModal'
import { getUserById, addMeal } from '../../actions/actions'
import { uid } from 'react-uid'
import './ListModal.css'

export default function ListModal (props) {
  const [meals, setMeals] = useState([])
  const [loadMeals, setLoadMeals] = useState([])
  const [showMeals, setShowMeals] = useState(false)
  return (
    <Modal
      id='listModal'
      isOpen={props.isOpen}
      onAfterOpen={() => getMeals(props, setMeals, setLoadMeals)}
      onRequestClose={props.exit}
      contentLabel='List Modal'
    >
      <div className='modalHeader'>
        <Typography variant='h4'>Meals for {props.date.toDateString()}:</Typography>
      </div>
      {getModalBody(props, meals, setShowMeals)}
      <ReuseModal
        open={showMeals}
        handleClose={() => setShowMeals(false)}
        meals={loadMeals}
        handleSelect={meal => reuseMeal(props, meal, setMeals, setLoadMeals)}
      />
    </Modal>
  )
}

const getModalBody = (props, meals, setShowMeals) => {
  if (meals.length === 0) {
    return (
      <div className='modalBody modalBodyEmpty'>
        <ButtonGroup id='controlButtons' orientation='vertical'>
          <Button variant='contained' onClick={() => showMealModal(props)} startIcon={<Add />}>New Meal</Button>
          <Button variant='contained' onClick={() => setShowMeals(true)} startIcon={<Restore />}>Load Meal</Button>
          <Button variant='contained' onClick={props.exit} startIcon={<Close />}>Close</Button>
        </ButtonGroup>
      </div>
    )
  } else {
    return (
      <div className='modalBody'>
        {meals.map(meal => {
          return (
            <Accordion key={uid(meal)}>
              <AccordionSummary expandIcon={<ExpandMore />} ><Typography variant='h6'>{getMealText(meal.mealNum)} {meal.name}</Typography></AccordionSummary>
              <AccordionDetails>
                <div className='mealDetails'>
                  <Typography variant='h6'>Ingredients: </Typography>
                  <ul>
                    {
                      meal.ingredients.map(ingredient => {
                        return (
                          <li key={uid(ingredient)}>
                            {ingredient.qty} {ingredient.units} of {ingredient.name}
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
                <div className='mealDetails'>
                  <Typography variant='h6'>Description:</Typography>
                  <ul>{meal.description}</ul>
                </div>
              </AccordionDetails>
            </Accordion>
          )
        })}
        <ButtonGroup id='controlButtons'>
          <Button variant='contained' onClick={() => showMealModal(props)} startIcon={<Add />}>New Meal</Button>
          <Button variant='contained' onClick={() => setShowMeals(true)} startIcon={<Restore />}>Load Meals</Button>
          <Button variant='contained' onClick={props.exit} startIcon={<Close />}>Close</Button>
        </ButtonGroup>
      </div>
    )
  }
}

const getMeals = (props, setMeals, setLoadMeals) => {
  if (!props.uid) {
    return
  }
  getUserById(props.uid).then(user => {
    if (user) {
      const mealsToday = user.meals.filter(element => {
        const mealDate = new Date(element.date)
        return (mealDate.toDateString() === props.date.toDateString())
      })
      setLoadMeals(user.mealHistory)
      setMeals(mealsToday)
    }
  }).catch(error => console.log(error))
}

const showMealModal = (props) => {
  props.showMealModal()
  props.exit()
}

const getMealText = (mealNum) => {
  if (mealNum === 0) {
    return 'Breakfast:'
  } else if (mealNum === 1) {
    return 'Lunch:'
  } else if (mealNum === 2) {
    return 'Dinner:'
  } else {
    return 'Snack:'
  }
}

const reuseMeal = (props, meal, setMeals, setLoadMeals) => {
  const validNum = meal.mealNum === '' ? 1 : meal.mealNum
  const payload = {...meal, date: props.date, mealNum: validNum}
  addMeal(payload, props.uid).then(() => {
    getMeals(props, setMeals, setLoadMeals)
  }).catch(error => console.log(error))
}
