var express = require('express')
var cors = require('cors')
require('dotenv').config()
const multer = require('multer')
const path = require('path')

// storage location and file name
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

// upload middleware
const upload = multer({ storage })

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  const file = req.file
  if (!file) return res.status(400).send('Please upload a file')
  let responseObject = {}
  responseObject['name'] = req.file.originalname
  responseObject['type'] = req.file.mimetype
  responseObject['size'] = req.file.size
  res.json(responseObject)
})

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
})
