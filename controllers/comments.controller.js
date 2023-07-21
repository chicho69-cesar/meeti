import { request, response } from 'express'
import { Comment, Meeti } from '../models/index.js'

export const addComment = async (req = request, res = response) => {
  const { id: meetiId } = req.params
  const { id: userId } = req.user
  const { comment } = req.body

  await Comment.create({
    message: comment,
    meetiId,
    userId,
  })

  return res.redirect('back')
}

export const deleteComment = async (req = request, res = response) => {
  const { commentId } = req.body

  const comment = await Comment.findOne({
    where: { id: commentId },
  })

  if (!comment) {
    return res.status(404).send('Comment not found')
  }

  const meeti = await Meeti.findOne({
    where: { id: comment.meetiId },
  })

  if (comment.userId === req.user?.id || meeti.userId === req.user?.id) {
    await Comment.destroy({
      where: { id: commentId },
    })

    return res.status(200).send('Comment deleted')
  } else {
    return res.status(403).send('Unauthorized action')
  }
}
