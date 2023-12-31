const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require ('passport')
const session = require ('express-session')
const MongoStore = require('connect-mongo') //(session)
const connectDB = require('./config/db')
// const cors = require('cors');

//load config
dotenv.config({ path: './config/config.env'})

//Passport config
require('./config/passport')(passport)
connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// CORS middleware 
// app.use(cors());

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
//handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')


//HandelBars
//Add the word .engine after exphbs so that it doesnt throw an error
app.engine('.hbs',exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate, 
        editIcon,
        select 
    },
    defaultLayout: 'main',
    extname: '.hbs'
    })
);
app.set('view engine', '.hbs')

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
    })
)

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

// set global variable
app.use(function (req, res, next){
    res.locals.user = req.user || null
    next()
})
//Static Folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/entries', require('./routes/entries'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`)
    )