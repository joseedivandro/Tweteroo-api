import  express from "express";
import cors from "cors";

const PORT =5000;
const app = express() // app do servidor 

const usuarios = []

app.use(cors())
app.use(express.json())
app.listen(PORT, () => console.log(`rodando servidor na porta ${PORT}`))

app.post("./sign-up", (req, res)=> {

    const user = req.body
    if(!user.username || !user.avatar){
        return res.status(400).send("Todos os Campos obrigatórios!")
    }

    const TipoElemento = (typeof user.username === "string" && typeof user.avatar === "string")

    if(!TipoElemento){
        return res.sendStatus(400)
    }
    usuarios.push(user)
    res.status(200).send("OK")
}



)