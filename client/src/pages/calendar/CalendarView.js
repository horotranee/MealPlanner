import React, { useState, useEffect, useRef } from 'react'
import Calendar from 'react-calendar'
import { List, ListItem, ListItemText, ListItemIcon, Typography, Drawer } from '@material-ui/core'
import { Edit, ChevronRight, ChevronLeft } from '@material-ui/icons'
import ListIcon from '@material-ui/icons/List'
import { getUserById } from '../../actions/actions'
import 'react-calendar/dist/Calendar.css'
import './CalendarView.css'

import NavBar from '../../components/general/NavBar'
import MealModal from '../../components/calendar/MealModal'
import ListModal from '../../components/calendar/ListModal'
import ShoppingModal from '../../components/calendar/ShoppingModal'
import IngredientModal from '../../components/calendar/IngredientModal'

export default function CalendarView (props) {
  const [mealsByDate, setMealsByDate] = useState({})
  const [showMealModal, setShowMealModal] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const [showShoppingModal, setShowShoppingModal] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDrawer, setShowDrawer] = useState(false)
  const firstUpdate = useRef(true)
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    getUserById(props.uid).then(user => {
      if (!user) {
        return
      }
      const mealsByDate = {}
      user.meals.forEach(meal => {
        if (mealsByDate[new Date(meal.date).toDateString()]) {
          mealsByDate[new Date(meal.date).toDateString()].push(meal)
        } else {
          mealsByDate[new Date(meal.date).toDateString()] = [meal]
        }
      })
      setMealsByDate(mealsByDate)
    })
  }, [props.uid])
  useEffect(() => {
    setShowDrawer(false)
  }, [showMealModal, showListModal, showShoppingModal, showIngredientModal])

  const calendarContent = ({ date, view }) => {
    if (view === 'month' && props.uid) {
      return getTileContent(mealsByDate[date.toDateString()])
    }
  }

  const toMealModal = () => {
    setShowListModal(false)
    setShowMealModal(true)
  }

  const toListModal = () => {
    setShowListModal(true)
    setShowMealModal(false)
  }

  return (
    <div id='calView'>
      <NavBar uid={props.uid} />
      <div id='content'>
        <div id='main'>
          <Drawer
            id='calendar-action-drawer'
            variant='permanent'
            className={showDrawer ? 'full' : 'small'}
          >
            <List>
              <ListItem button onClick={() => setShowDrawer(!showDrawer)}>
                <ListItemIcon className='action-icon-container'>
                  {showDrawer ? <ChevronLeft /> : <ChevronRight />}
                </ListItemIcon>
                <ListItemText className={showDrawer ? '' : 'hide'} primary={<Typography variant='body1'>Close</Typography>}/>
              </ListItem>
            </List>
            <List>
              <ListItem button onClick={() => setShowShoppingModal(true)}>
                <ListItemIcon className='action-icon-container'>
                  <Edit />
                </ListItemIcon>
                <ListItemText className={showDrawer ? '' : 'hide'} primary={<Typography variant='body1'>Shopping List</Typography>}/>
              </ListItem>
            </List>
            <List>
              <ListItem button onClick={() => setShowIngredientModal(true)}>
                <ListItemIcon className='action-icon-container'>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText className={showDrawer ? '' : 'hide'} primary={<Typography variant='body1'>My Pantry</Typography>}/>
              </ListItem>
            </List>
          </Drawer>
          <div className={showDrawer ? 'shade' : 'shade hide'} onClick={() => setShowDrawer(false)}/>
          <Calendar
            className="custom-calendar-styles"
            calendarType='US'
            onChange={(value) => handleChange(value, setShowListModal, setSelectedDate)}
            tileContent={calendarContent}
            tileClassName={'calendar-button-styles'}
            minDetail='month'
          />
          {/* <div id="buttonContainer" className={(showListModal || showMealModal || showShoppingModal || showIngredientModal ? 'hide' : '')}>
            <Button color='primary' variant='contained' onClick={() => setShowShoppingModal(true)} startIcon={<ListIcon />}>My Shopping List</Button>
            <Button color='primary' variant='contained' onClick={() => setShowIngredientModal(true)} startIcon={<Edit />}>Edit My Pantry</Button>
          </div> */}
        </div>
        <ListModal
          uid={props.uid}
          isOpen={showListModal}
          exit={() => setShowListModal(false)}
          date={selectedDate}
          showMealModal={toMealModal}
        />
        <MealModal
          uid={props.uid}
          isOpen={showMealModal}
          exit={() => setShowMealModal(false)}
          date={selectedDate}
          showListModal={toListModal}
        />
        <ShoppingModal
          uid={props.uid}
          isOpen={showShoppingModal}
          exit={() => setShowShoppingModal(false)}
        />
        <IngredientModal
          uid={props.uid}
          isOpen={showIngredientModal}
          exit={() => setShowIngredientModal(false)}
        />
      </div>
    </div>
  )
}

const handleChange = (value, setShowListModal, setSelectedDate) => {
  setSelectedDate(value)
  setShowListModal(true)
}

const getTileContent = (meals) => {
  if (meals) {
    return(
      <div>
        <List className='calendar-list'>
          {
            meals.map((meal, index) => {
              if (index < 3) {
                return (  
                  <ListItem className='calendar-list-item'>
                    <ListItemText primary={<Typography variant='body2'><b>{index === 2 ? '...' : meal.name}</b></Typography>} />
                  </ListItem>
                )
              } else {
                return null
              }
            })
          }
        </List>
        <Typography className='meal-length-display' variant='body2'><b>{meals.length} meals</b></Typography>
      </div>
    )
  } else {
    console.log('null stuff')
    return null
  }
}
