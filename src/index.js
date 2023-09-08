import './index.css'

const EDIT_BTN_CLASS = 'editBtn'
const DELETE_BTN_CLASS = 'deleteBtn'
const WAITER_ITEM_CLASS = 'waiterItem'
const url = 'http://localhost:4000/waiters'

const waitersContainer = document.querySelector('#waitersContainer')
const form = document.querySelector('#waitersForm')
let waitersList = []

waitersContainer.addEventListener('click', onWaitersContainerClick)
form.addEventListener('submit', onFormSubmit)

init()

function init() {
  fetch(url)
    .then(response => response.json())
    .then(list => {
      renderList(list);
      waitersList = list;
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    });
}

function onWaitersContainerClick(e) {
  const target = e.target;
  const waiterEl = findWaiterEl(target);
  const id = Number(waiterEl?.dataset?.id);

  if (id) {
    if (isEditButtonClicked(target)) {
      const waiter = getWaiterById(id)
      fillOutForm(form.elements, waiter)
    } 
    else if (isDeleteButtonClicked(target)) {
      deleteWaiter(id)
    }
  }
}

function onFormSubmit(e) {
  e.preventDefault()

  const waiter = getFormData(form.elements)

  console.log(waiter)

 if (isWaiterValid(waiter)) {
    if (waiter.id) {
      updateWaiter(waiter.id, waiter)
    } 
    
    else {
      createWaiter(waiter)
    }
  } 
  
  else {
    console.log("Waiter data is incomplete or invalid.")
  }
}

function isEditButtonClicked(el) {
  return el.closest(`.${EDIT_BTN_CLASS}`)
}

function isDeleteButtonClicked(el) {
  return el.closest(`.${DELETE_BTN_CLASS}`)
}

function findWaiterEl(el) {
  return el.closest(`.${WAITER_ITEM_CLASS}`)
}

function renderList(waiters) {
  waitersContainer.innerHTML = waiters.map(generateWaiterHtml).join('')
}

function generateWaiterHtml(waiter) {
  return `
    <tr class="${WAITER_ITEM_CLASS}" 
    data-id="${waiter.id}">
      <td>${waiter.firstName}</td>
      <td>${waiter.phone}</td>
      <td>
        <span>
          <button class="${EDIT_BTN_CLASS}">[Edit]</button>
          <button class="${DELETE_BTN_CLASS}">[Delete]</button>
        </span>
      </td>
    </tr>
  `
}

function replaceWaiterEl(id, waiter) {
  const oldWaiterEl = findWaiterElById(id)

  oldWaiterEl.outerHTML = generateWaiterHtml(waiter)
}

function findWaiterElById(id) {
  return waitersContainer.querySelector(`[data-id="${id}"]`)
}

function getWaiterById(id) {
  return waitersList.find(waiter => waiter.id === id)
}

function replaceWaiterInList(id, waiter) {
  waitersList = waitersList.map(w => w.id === Number(id) ? { ...waiter, id: Number(id) } : w)
}

function getFormData(formElements) {
  const formData = {}
  Array.from(formElements).forEach(element => {
    if (element.name) {
      formData[element.name] = element.value
    }
  })
  return formData
}

function isWaiterValid(waiter) {
  if (!waiter.firstName || !waiter.phone) {
    alert("Please fill in all required fields.")
    return false;
  }

  if (!/^\d+$/.test(waiter.phone)) {
    alert("Phone number should contain only digits.")
    return false;
  }

  return true;
}

function updateWaiter(id, data) {
  return fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(updatedWaiter => {
    replaceWaiterInList(id, updatedWaiter)
    replaceWaiterEl(id, updatedWaiter)
  })
  .catch(error => {
    console.error('Error updating waiter:', error)
  });
}

function createWaiter(data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(createdWaiter => {
    waitersList.push(createdWaiter)
    appendWaiterElement(createdWaiter)
  })
  .catch(error => {
    console.error('Error creating waiter:', error)
  })
}


function deleteWaiter(id) {
  fetch(`${url}/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.status === 204) {
      removeWaiterFromList(id);
      removeWaiterElement(id);
    } else {
      console.error('Error deleting waiter. Status:', response.status)
    }
  })
  .catch(error => {
    console.error('Error deleting waiter:', error)
  })
}

function removeWaiterFromList(id) {
  waitersList = waitersList.filter(waiter => waiter.id !== id)
}

function removeWaiterElement(id) {
  const waiterEl = findWaiterElById(id)
  if (waiterEl) {
    waiterEl.remove()
  }
}

function appendWaiterElement(waiter) {
  const waiterHtml = generateWaiterHtml(waiter)
  waitersContainer.insertAdjacentHTML('beforeend', waiterHtml)
}