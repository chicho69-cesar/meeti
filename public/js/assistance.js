import axios from 'axios'

document.addEventListener('DOMContentLoaded', () => {
  const assistance = document.querySelector('#confirm-assistance')

  if (assistance) {
    assistance.addEventListener('submit', confirmAssistance)
  }
})

function confirmAssistance(e) {
  e.preventDefault()
  const confirmUrl = e.target.action

  const btn = document.querySelector('#confirm-assistance input[type="submit"]')
  let action = document.querySelector('#actionButton').value
  const message = document.querySelector('#message')

  // limpia la respuesta previa
  while (message.firstChild) {
    message.removeChild(message.firstChild)
  }

  // obtiene el valor cancelar o confirmar en el hidden
  const data = {
    action
  }

  axios.post(confirmUrl, data)
    .then(response => {
      console.log(response)

      if (action === 'confirm') {
        // modifica los elementos del botón
        document.querySelector('#actionButton').value = 'cancel'
        btn.value = 'Cancelar'
        btn.classList.remove('btn-blue')
        btn.classList.add('btn-red')
      } else {
        document.querySelector('#actionButton').value = 'confirm'
        btn.value = 'Si'
        btn.classList.remove('btn-red')
        btn.classList.add('btn-blue')
      }

      // mostrar un mensaje
      message.appendChild(document.createTextNode(response.data))
    })
}
