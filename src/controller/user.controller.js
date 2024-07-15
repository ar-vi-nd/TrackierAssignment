const userRegister = async(req,res)=>{
    try {

        console.log("user registered")
        res.json({message:"User Registered"})
        
    } catch (error) {
        console.log("Error Logging in")
    }
}

const userSignup = async(req,res)=>{
    try {

        
        
    } catch (error) {
        console.log("Error Signing Up")
    }
}

export {userRegister}