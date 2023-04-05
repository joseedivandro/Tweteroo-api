import  express from "express";
import cors from "cors";

const PORT =5000;
const app = express() // app do servidor 


app.use(cors())
app.use(express.json)()
app.listen(PORT, () => console.log(`rodando servidor na porta ${PORT}`))

app.post("./sign-up", (req, res)=> {

    const user = req.body

})