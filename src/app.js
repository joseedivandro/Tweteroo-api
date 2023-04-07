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


function addAvatarToTweets(refTweets) {
    if (!refTweets) return [];
  
    const refTweetsWithAvatar = refTweets.map((item) => {
      const nameAndAvatar = serverTwetts.find((_item) => _item.username === item.username);
      return {
        username: item.username,
        avatar: nameAndAvatar.avatar,
        tweet: item.tweet,
      };
    });
  
    return refTweetsWithAvatar;
  }
  
  function divideTweets(tweetsToDivide, arrSize) {
    const dividedTweets = [];
  
    let mainCounter = 1; // starts with 1 to match urlPage when loading tweets
    let auxCounter = 0;
  
    for (let i = 0; i < tweetsToDivide.length; i += arrSize) {
      dividedTweets[mainCounter] = [];
      do {
        dividedTweets[mainCounter].push(tweetsToDivide[auxCounter]);
        auxCounter++;
      } while (dividedTweets[mainCounter].length < arrSize && tweetsToDivide[auxCounter]);
      mainCounter++;
    }
  
    return dividedTweets;
  }
  
  app.get('/tweets/:username', (req, res) => {
    const { username } = req.params;
  
    allTweets = addAvatarToTweets(serverTwetts.reverse());
  
    const userTweets = allTweets.filter((item) => item.username === username);
  
    res.send(userTweets);
  });
  
  app.get('/tweets', (req, res) => {
    let dividedTweets = [];
  
    const { query } = req;
    const urlPage = Number(query.page);
  
    if (urlPage <= 0) return res.status(400).send('Informe uma página válida!');
  
    allTweets = [...serverTwetts].reverse();
  
    if (allTweets) {
      if (!urlPage) {
        pageTweets = addAvatarToTweets(allTweets.slice(0, 10));
        return res.send(pageTweets);
      }
  
      if (allTweets.length > 10) {
        dividedTweets = divideTweets(allTweets, 10);
  
        if (dividedTweets) {
          pageTweets = addAvatarToTweets(dividedTweets[urlPage]);
  
          if (pageTweets) return res.send(pageTweets);
        }
        return res.send([]);
      }
  
      pageTweets = addAvatarToTweets(allTweets);
  
      return res.send(pageTweets);
    }
  });

app.listen(PORT, () => console.log(`rodando servidor na porta ${PORT}`))