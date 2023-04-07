import  express from "express";
import cors from "cors";

const PORT =5000;
const app = express() // app do servidor 

const serverTwetts =[]
const usuarios =[]

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
    const { user } = req.headers

    if (!twetter.tweet) return res.status(400).send("Todos os campos são obrigatórios!")
    if (!(typeof twetter.tweet === "string")) return res.sendStatus(400)

    if (user) {
        const userRegistered = usuarios.find(item => item.username === user)

        if (userRegistered) {
            serverTwetts.push({username: user, tweet: twetter.tweet})
            return res.status(201).send("OK")
        }
        return res.status(400).send("UNAUTHORIZED")
    }

    const userRegistered = usuarios.find(item => item.username === twetter.username)

    if (userRegistered) {
        serverTwetts.push(twetter)
        return res.status(200).send("OK")
    }

    return res.status(400).send("UNAUTHORIZED")

})

app.get("/tweets", (req, res) => {
    const { query } = req
    const page = parseInt(query.page) || 1
    const perPage = 10
  
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
  
    const tweets = serverTwetts.slice().reverse()
    const totalTweets = tweets.length
  
    const totalPages = Math.ceil(totalTweets / perPage)
  
    if (totalTweets === 0) {
      return res.send([])
    }
  
    if (page > totalPages) {
      return res.status(404).send("Page not found")
    }
  
    const tweetsOnPage = tweets.slice(startIndex, endIndex)
    const tweetsWithAvatar = tweetsOnPage.map((tweet) => {
      const user = usuarios.find((u) => u.username === tweet.username)
      return { ...tweet, avatar: user ? user.avatar : null }
    })
  
    res.send({
      tweets: tweetsWithAvatar,
      currentPage: page,
      totalPages: totalPages,
    })
  })


app.listen(PORT, () => console.log(`rodando servidor na porta ${PORT}`))