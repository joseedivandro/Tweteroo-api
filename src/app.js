import  express from "express";
import cors from "cors";

const PORT =5000;
const app = express() // app do servidor 

const usuarios = []

app.use(cors())
app.use(express.json())


app.post("/sign-up", (req, res)=> {

    const user = req.body
    if(!user.username || !user.avatar){
        return res.status(400).send("Todos os Campos são obrigatórios!")
    }

    const TipoElemento = (typeof user.username === "string" && typeof user.avatar === "string")

    if(!TipoElemento){
        return res.sendStatus(400)
        console.log("deu errado")
    }
    usuarios.push(user)
    res.status(200).send("OK")
    console.log("deu certo")
})


app.post("/tweets", (req, res) => {
    const twetter = req.body
    if (!twetter.tweet) return res.status(400).send("Todos os campos são obrigatórios!")
    if (!(typeof twetter.tweet === "string")) return res.sendStatus(400)

    const userRegistered = usuarios.find(item => item.username === twetter.username)

    if (userRegistered) {
        serverTweets.push(twetter)
        return res.status(201).send("OK")
    }
    return res.status(401).send("UNAUTHORIZED")
})

app.listen(PORT, () => console.log(`rodando servidor na porta ${PORT}`))