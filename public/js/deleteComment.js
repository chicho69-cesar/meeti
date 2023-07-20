import axios from 'axios'
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', () => {
  const formsDelete = document.querySelectorAll('.delete-comment')

  // revisar que existan los formularios
  if (formsDelete.length > 0) {
    formsDelete.forEach((form) => {
      form.addEventListener('submit', deleteComment)
    })
  }
})

function deleteComment(e) {
  e.preventDefault()

  Swal.fire({
    title: 'Eliminar Comentario?',
    text: 'Un comentario eliminado no se puede recuperar',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.value) {
      // tomar el id del comentario
      const commentId = this.children[0].value

      // crear el objeto
      const data = {
        commentId: commentId
      }

      // ejecutar axios y pasar los datos
      axios.post(this.action, data).then((response) => {
        Swal.fire('Eliminado', response.data, 'success')

        // Eliminar del DOM
        this.parentElement.parentElement.remove()
      }).catch(error => {
        if (error.response.status === 403 || error.response.status === 404) {
          Swal.fire('Error', error.response.data, 'error')
        }
      })
    }
  })
}
