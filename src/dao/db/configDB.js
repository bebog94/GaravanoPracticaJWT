import mongoose from "mongoose";


const URI= 'mongodb+srv://bebogaravano:b.3823584568@cluster0.gcmvsft.mongodb.net/2dapreentrega?retryWrites=true&w=majority'

mongoose
  .connect(URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((error) => console.log(error));


  export default URI ;
