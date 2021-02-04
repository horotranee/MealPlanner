import React, { Component } from 'react'
import Modal from 'react-modal'
import { Select, FormControl, InputLabel, Button, TextField, MenuItem, Typography, NativeSelect, List, ListItem } from '@material-ui/core'
import { Close, ChevronLeft, Publish } from '@material-ui/icons'
import { addMeal } from '../../actions/actions'
import './styles.css'

export class index extends Component {
  state = {
    mealName: '',
    mealNum: '',
    ingredients: [{
      name: '',
      units: 'cup',
      qty: ''
    }],
    description: '',
    options: [
      { title: 'option1' },
      { title: 'option2' },
    ]
  }

  handleReturn = () => {
    this.props.showListModal()
    this.props.exit()
  }

  handleClose = () => {
    this.setState({
      mealName: '',
      mealNum: '', 
      ingredients: [{ name: '', units: 'cup', qty: '' }],
      description: '' 
    })
  }

  handleNameChange = event => {
    this.setState({ mealName: event.target.value })
  }

  handleNumChange = event => {
    this.setState({ mealNum: event.target.value })
  }

  handleIngredientQtyChange = event => {
    const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
    let ingredients = [...this.state.ingredients]
    ingredients[index].qty = event.target.value
    this.setState({ ingredients: ingredients })
  }

  handleIngredientUnitsChange = event => {
    const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
    let ingredients = [...this.state.ingredients]
    ingredients[index].units = event.target.value
    this.setState({ ingredients: ingredients })
  }

  handleIngredientNameChange = event => {
    const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
    let ingredients = [...this.state.ingredients]
    ingredients[index].name = event.target.value
    this.setState({ ingredients: ingredients })
  }

  handleAddIngredient = event => {
    event.preventDefault()
    this.setState(prevState => { 
      return {
        ingredients: [...prevState.ingredients, { name: '', units: 'cup', qty: '' }]
      }
    })
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    const validMealNum = this.state.mealNum || 0
    // convert mealNum to number and call api
    const payload = {
      name: this.state.mealName,
      ingredients: this.state.ingredients.filter(ingredient => ingredient.name && ingredient.qty),
      date: this.props.date.toString(),
      mealNum: parseInt(validMealNum),
      description: this.state.description
    }
    addMeal(payload, this.props.uid).then(() => this.handleReturn()).catch(error => console.log(error))
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        id='mealModal'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.exit}
        onAfterClose={this.handleClose}
        contentLabel="Meal Modal"
      >
        <div className='modalHeader'>
          <Typography variant='h4'>Add a meal for {this.props.date.toDateString()}</Typography>
          <Button variant='contained' startIcon={<ChevronLeft />} onClick={this.handleReturn}>Return</Button>
        </div>
        <form id='mealModalForm' onSubmit={this.handleSubmit}>
          <FormControl className="input-field">
            <TextField label='Meal Name' onChange={this.handleNameChange} required />
          </FormControl>
          <FormControl className="input-field">
            <InputLabel id='selectLabel' required>Meal:</InputLabel>
            <Select labelId='selectLabel' name='mealNum' id="mealSelect" onChange={this.handleNumChange} required >
              <MenuItem value="0">Breakfast</MenuItem>
              <MenuItem value="1">Lunch</MenuItem>
              <MenuItem value="2">Dinner</MenuItem>
              <MenuItem value="3">Snack</MenuItem>
            </Select>
          </FormControl>
          <FormControl className='input-field list-holder'>
            <Typography variant='h5'>Ingredients:</Typography>
            <List component='nav' aria-label='ingredient list'>
            {
              this.state.ingredients.map((ingredient, index) => {
                return(
                  <div>
                    <ListItem className='ingredientContainer' index={index}>
                      <TextField type='number' label='Quantity' className='qInput' inputProps={{ type: 'number' }} onChange={this.handleIngredientQtyChange} />
                      <FormControl>
                        <InputLabel htmlFor="units">Units</InputLabel>
                        <NativeSelect
                          className='uInput'
                          value={this.state.ingredients[index].units}
                          onChange={this.handleIngredientUnitsChange}
                          name='units'
                        >
                          <optgroup label="Mass">
                            <option value="kg">kilogram</option>
                            <option value="g">gram</option>
                            <option value="oz">ounce</option>
                            <option value="lb">pound</option>
                          </optgroup>
                          <optgroup label="Volume">
                            <option value="ml">mL</option>
                            <option value="l">L</option>
                            <option value="tsp">teaspoon</option>
                            <option value="Tbs">tablespoon</option>
                            <option value="cup">cup</option>
                            <option value="pnt">pint</option>
                          </optgroup>
                        </NativeSelect>
                      </FormControl>
                      <TextField className='nInput' label='Ingredient' onChange={this.handleIngredientNameChange} />
                    </ListItem>
                    <hr />
                  </div>
                )
              })
            }
            </List>
            <Button variant='contained' onClick={this.handleAddIngredient}>Add Ingredient</Button>
          </FormControl>
          <FormControl className='input-field'>
            <TextField label='Description' onChange={this.handleDescriptionChange} />
          </FormControl>
          <div className='modalFooterButtons'>
            <Button startIcon={<Publish />} type='submit' variant='contained'>Submit</Button>
            <Button startIcon={<Close />} variant='contained' onClick={this.props.exit}>Cancel</Button>
          </div>
        </form>
      </Modal>
    )
  }
}

export default index
