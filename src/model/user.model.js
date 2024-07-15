import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
        trim: true,
        index : true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type: String,
        required: [true,"Password is must"]
    },
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
    next()
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    // console.log( await bcrypt.hash(password,10))
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id : this._id,
        email: this.email,
        username: this.username,
        fullName : this.fullName
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

const User = mongoose.model("User",userSchema)
export default User;