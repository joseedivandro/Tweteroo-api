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
  const urlPage = Number(req.query.page);
  const allTweets = [...serverTwetts].reverse();
  const tweetPages = 10;

  if (urlPage <= 0 || isNaN(urlPage)) {
    return res.status(400).send("Informe uma página válida!");
  }

  const Paginacao = paginateTweets(allTweets, urlPage, tweetPages);
  const newTweet = adicionaAvatar(Paginacao);

  return res.send(newTweet);
});

function paginateTweets(tweets, page, tweetPages) {
  const indexPage = (page - 1) * tweetPages;
  const endIndex = indexPage + tweetPages;
  return tweets.slice(indexPage, endIndex);
}

function adicionaAvatar(tweets) {
  return tweets.map(tweet => {
    const user = usuarios.find(u => u.username === tweet.username);
    return {
      username: tweet.username,
      avatar: user?.avatar || null,
      tweet: tweet.tweet,
    };
  });
}

app.listen(PORT, () => console.log(`rodando servidor na porta ${PORT}`))