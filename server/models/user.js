const mongoose = require('mongoose')
const { hashPassword } = require('../helpers/bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    require : [true,'Email is required'],
    validate : {
      validator :
        function (value){
          return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(value)
        },
      message: 'Email must include @ and .'
    },
},
    address: {
        type: String,
        required: [true, 'Address is required'],
        minlength: [6, 'Address length minimum 12']   
      },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password length minimum 6']    
  },
  role : {
      type : String,
      default : 'customer'
  },
  cart : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Item'
  }],
  history : [{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
}, {
    timestamps: true,
    versionKey: false
})


userSchema.pre('save', function () {
 this.password = hashPassword(this.password)
  next()
})

userSchema.path('email').validate(function (value) {
  return User.findOne({ email: value })
      .then(isFound => {
          if (isFound) return false
      })
      .catch(err => {
          throw err;
      })
}, 'Email is already registed')


const User = mongoose.model('User', userSchema)

module.exports = User