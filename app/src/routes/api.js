const express = require('express')

const router = express.Router()

const convertOptions = (req) => {
  const options = {
    coordinates: req.body.coordinates,
    // Return route steps for each route leg
    steps: req.body.steps || false,
    // Returned route geometry format. Can also be geojson
    geometries: req.body.geometries || 'polyline',
    // Return annotations for each route leg
    annotations: req.body.annotations || false,
    // Add overview geometry either full, simplified according to
    // highest zoom level it could be display on, or not at all
    overview: req.body.overview || 'false'
  }

  return options
}

router.post('/route', (req, res) => {
  if (!req.body.coordinates) {
    return res.status(422).json({ error: 'Missing coordinates' })
  }

  if (req.body.coordinates.length < 2) {
    return res.status(422).json({ error: 'Needs at least two coordinates' })
  }

  const options = convertOptions(req)

  options.alternatives = req.body.alternatives || false
  options.continue_straight = req.body.continue_straight || false

  const osrm = req.app.get('osrm')
  try {
    osrm.route(options, (err, result) => {
      if (err) {
        return res.status(422).json({ error: err.message })
      }
      return res.json(result)
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

router.post('/match', (req, res) => {
  if (!req.body.coordinates) {
    return res.status(422).json({ error: 'Missing coordinates' })
  }

  if (req.body.coordinates.length < 2) {
    return res.status(422).json({ error: 'Needs at least two coordinates' })
  }

  const options = convertOptions(req)

  options.snapping = req.body.snapping || 'default'
  options.gaps = req.body.gaps || 'split'
  options.tidy = req.body.tidy || false

  if (req.body.timestamps) {
    options.timestamps = req.body.timestamps
  }

  if (req.body.radiuses) {
    options.radiuses = req.body.radiuses
  }

  const osrm = req.app.get('osrm')
  try {
    osrm.match(options, (err, result) => {
      if (err) {
        return res.status(422).json({ error: err.message })
      }
      return res.json(result)
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

module.exports = router
