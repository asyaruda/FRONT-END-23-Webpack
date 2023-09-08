const data = {
  "id": 1,
  "firstName": "Omer",
  "phone": "256-79-92"
}


function fillOutForm (formElements, data) {
  for (const input of formElements) {
    if (
      ['text', 'hidden'].includes(input.type)
      && data?.[input.id]
    ) {
      input.value = data[input.id]
    }
  }
}