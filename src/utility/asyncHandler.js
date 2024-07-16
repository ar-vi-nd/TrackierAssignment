const asyncHandler = (fun)=>{
    return (req,res,next)=>{
          Promise.resolve(fun(req,res,next)).catch(err=>{
            console.log(err)
              res.status(500).json({message:"Internal Server Error",success:false})
          })
      }
  }

  export  {asyncHandler}