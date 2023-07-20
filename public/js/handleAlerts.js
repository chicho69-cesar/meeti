const bodyAlerts = document.querySelectorAll('.alerts')

bodyAlerts.forEach(alert => {
  alert.addEventListener('click', async () => {
    console.log('Click...')
    alert.style.display = 'none'

    const response = await fetch('/remove-messages')
    console.log(response)
  })
})
