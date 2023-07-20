import axios from 'axios'

document.addEventListener('DOMContentLoaded', () => {
  const assistance = document.querySelector('#confirm-assistance')

  if (assistance) {
    assistance.addEventListener('submit', confirmAssistance)
  }
})

function confirmAssistance(e) {
  e.preventDefault()

  const btn = document.querySelector('#confirm-assistance input[type="submit"]')
  let action = document.querySelector('#action').value
  const message = document.querySelector('#message')

  // limpia la respuesta previa
  while (message.firstChild) {
    message.removeChild(message.firstChild)
  }

  // obtiene el valor cancelar o confirmar en el hidden
  const data = {
    action
  }

  axios.post(this.action, data)
    .then(response => {
      console.log(response)

      if (action === 'confirm') {
        // modifica los elementos del botón
        document.querySelector('#action').value = 'cancelar'
        btn.value = 'Cancelar'
        btn.classList.remove('btn-blue')
        btn.classList.add('btn-red')
      } else {
        document.querySelector('#action').value = 'confirmar'
        btn.value = 'Si'
        btn.classList.remove('btn-red')
        btn.classList.add('btn-blue')
      }

      // mostrar un mensaje
      message.appendChild(document.createTextNode(response.data))
    })
}
