const BASE_URL = `http://localhost:3000/`
const CALORIE_URL = `${BASE_URL}/api/v1/calorie_entries`
// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
document.addEventListener("DOMContentLoaded", function(){
	console.log('connected')
	getCaloriesList()
	createEventListeners()
})

function createEventListeners() {
	getCalorieForm().addEventListener('submit', processCalorieForm)
	document.querySelector('#edit-calorie-form').addEventListener('submit', processEditForm)
}

function linkFormToEntry(event) {
	event.preventDefault()
	let entryID = event.currentTarget.id.split('-')[2]
	let editForm = document.querySelector('#edit-calorie-form')
	editForm.dataset.id = event.currentTarget.id

	let newCalories = editForm.querySelector('#edit-calories')
	let oldCalories = document.getElementById(`item-calorie-${entryID}`).innerText
	newCalories.value = Number(oldCalories)
	let newNotes = editForm.querySelector('#edit-notes')
	let oldNotes = document.getElementById(`item-note-${entryID}`).innerText
	newNotes.innerText = oldNotes
}

function getCalorieForm() {
	return document.getElementById('new-calorie-form')
}

function getCaloriesList() {

	fetch(CALORIE_URL)
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				alert("Something went wrong. Please refresh the page to try again")
			}
		})
		.then(entries => entries.forEach(entry => renderCalorieEntry(entry)))
		.catch(error => console.log(`!!${error.message}`))
}

function renderCalorieEntry(entry) {
	let calorieList = document.getElementById('calories-list')

	let calorieItem = document.createElement('li')
	calorieItem.id = `calorie-item-${entry.id}`
	calorieItem.classList.add('calories-list-item')
	calorieItem.innerHTML = `
		<div class="uk-grid">
	        <div class="uk-width-1-6">
	          <strong id='item-calorie-${entry.id}'>${entry.calorie}</strong>
	          <span>kcal</span>
	        </div>
	        <div class="uk-width-4-5">
	          <em class="uk-text-meta" id="item-note-${entry.id}">${entry.note}</em>
	        </div>
		</div>
	`
	let actionMenu = document.createElement('div')
	actionMenu.className = "list-item-menu"
		let editBtn = document.createElement('a')
		editBtn.className = "edit-button"
		editBtn.id = `edit-btn-${entry.id}`
		editBtn.addEventListener('click', linkFormToEntry)
		editBtn.setAttribute('uk-icon', "icon: pencil")
		editBtn.setAttribute('uk-toggle', "target: #edit-form-container")

		let deleteBtn = document.createElement('a')
		deleteBtn.className = "delete-button"
		deleteBtn.id = `delete-btn-${entry.id}`
		deleteBtn.setAttribute('uk-icon', 'icon: trash')
		deleteBtn.addEventListener('click', deleteCalorieEntry)
	actionMenu.append(editBtn, deleteBtn)

	calorieItem.appendChild(actionMenu)
	
	calorieList.prepend(calorieItem)
}

function processCalorieForm(event) {
	event.preventDefault()

	let calories = event.target.calories.value
	let notes = event.target.notes.value

	let config = {
		method: 'POST',
		headers: {
			'Content-Type':'application/json',
			'Accept':'application/json'
		},
		body: JSON.stringify({
			calorie: calories,
			note: notes
		})
	}

	fetch(CALORIE_URL,config)
		.then(response => {
			if (response.ok) {
				getCalorieForm().reset()
				return response.json()
			} else {
				alert("Something went wrong. Please try again")
			}
		})
		.then(newItem =>renderCalorieEntry(newItem))
		.catch(error => console.log(`!!${error.message}`))
}

function processEditForm(event) {
	// identify which calorie_entry to update
	let calorieID = event.currentTarget.dataset.id.split('-')[2]
	// get edit form data
	let calories = event.target.calories.value
	let notes = event.target.notes.value

	let config = {
		method: 'PATCH',
		headers: {
			'Content-Type':'application/json',
			'Accept':'application/json'
		},
		body: JSON.stringify({
			calorie: calories,
			note: notes
		})
	}

	fetch(`${CALORIE_URL}/${calorieID}`, config)
		.then(response => {
			if (response.ok) {		
				return response.json()
			} else {
				alert("Something went wrong. Please try again")
			}
		})
		.then(updatedEntry => {
			let calories = document.getElementById(`item-calorie-${calorieID}`)
			let notes = document.getElementById(`item-note-${entryID}`)
			calories.innerText = json.calorie
			notes.innerText = json.note
		})
		.catch(error => console.log(`!!${error.message}`))
}

function deleteCalorieEntry(event) {
	let eventID = event.currentTarget.id.split('-')
	let entryID = eventID[eventID.length - 1]

	fetch(`${CALORIE_URL}/${entryID}`, {
		method: 'DELETE',
		headers: {
			'Content-Type':'application/json',
			'Accept':'application/json'
		}
	})
	.then(response => {
		if (response.ok) {
			document.querySelector(`#calorie-item-${entryID}`).remove()
		} else {
			alert("Something went wrong. Please try again")
		}
	})
	.catch(error => console.log(`!!${error.message}`))
}