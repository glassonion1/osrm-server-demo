const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const OSRM = require('@project-osrm/osrm')
const healthRouter = require('./routes/health')
const apiRouter = require('./routes/api')

const app = express()

const osrm = new OSRM({
  path: `/data/${process.env.REGION_VERSION}.osm.pbf`,
  //algorithm: "MLD",
  algorithm: 'CH'
})
app.set('osrm', osrm)

app.use(morgan('short'))
app.use(helmet())
app.use(bodyParser.json({ extended: true, limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/health', healthRouter)
app.use('/api', apiRouter)

app.listen(5050, () => {
  console.log('Start on port 5050.')
})
