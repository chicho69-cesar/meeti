# Asi obtendria los 3 meetis mas cercanos en la funcion `showMeeti`

`meeti.controller.js`

```js
export const showMeeti = async (req = request, res = response) => {
  const { slug } = req.params

  const meeti = await Meeti.findOne({
    where: { slug },
    include: [
      { model: Group, as: 'group' },
      { model: User, as: 'user', attributes: ['id', 'name', 'image'] },
    ]
  })

  if (!meeti) {
    return res.redirect('/')
  }

  const latRef = meeti.location[0] // Latitud de referencia
  const lngRef = meeti.location[1] // Longitud de referencia

  console.log('Lat: ', { lat: latRef, type: typeof latRef })
  console.log('Lng: ', { lat: lngRef, type: typeof lngRef })

  const allMeetis = await Meeti.findAll({
    include: [
      { model: Group, as: 'group' },
      { model: User, as: 'user', attributes: ['id', 'name', 'image'] },
    ]
  })

  const meetisWithDistances = allMeetis.map((meet) => {
    const location = meet.location

    if (location) {
      const meeti_lat = location[0]
      const meeti_lng = location[1]

      const distance = calculateDistance(
        latRef,
        lngRef,
        meeti_lat,
        meeti_lng
      )

      return {
        meeti: meet,
        distance,
      }
    }

    return null
  })

  // Filter out any Meeti without location information
  const validMeetisWithDistances = meetisWithDistances.filter(
    (entry) => entry !== null
  )

  // Sort the Meetis based on distance in ascending order
  validMeetisWithDistances.sort((a, b) => a.distance - b.distance)

  // Take the first 3 elements from the sorted array (3 closest Meetis)
  const threeClosestMeetis = validMeetisWithDistances.slice(0, 3)

  const nearbyMeetis = [
    threeClosestMeetis[0].meeti,
    threeClosestMeetis[1].meeti,
    threeClosestMeetis[2].meeti,
  ]

  const comments = await Comment.findAll({
    where: { meetiId: meeti.id },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'image'] },
    ]
  })

  return res.render('show-meeti', {
    pageName: meeti.title,
    user: req.user,
    userLogged: req.user,
    meeti,
    comments,
    nearbyMeetis,
    moment,
    messages: req.session.messages,
  })
}
```
