function getFormData (formElements) {
  const data = {}

  for (const input of formElements) {
    if (['text', 'hidden'].includes(input.type)) {
      data[input.id] = input.value
    }
  }

  return data
}