const authenticate = (req, res, next) => {
  // console.log(req.session.id);

  
    if (!req.session || !req.session.id) {

    
      
      
      
      // If no session or user is found, the user is unauthorized
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Attach the session user data to the request object
    req.user = req.session.user;
  
    // Proceed to the next middleware or route handler
    next();
  };
  
  module.exports = authenticate;