require('dotenv').config()
const express = require("express");
const SearchkitExpress = require("searchkit-express")
const bodyParser = require("body-parser");
const cors = require("cors")

const port = 4000

// initialize express
const app = express();

// support cors
app.use(cors());
app.use(bodyParser.json())

let searchkitRouter = SearchkitExpress.createRouter({
    host:process.env.ELASTIC_URL || "http://localhost:9200",
    index:'nfts',
    maxSockets:500, // defaults to 1000
    queryProcessor: function (query, req, res) {
        // Add the 'highlight' property to the query
        query = {
            ...query,
            highlight: {
                pre_tags: ['<span class="highlight">'],
                post_tags: ['</span>'],
                fields: {
                    "caption_model_vit_l_14_openai_f1": {}
                }
            }
        };
        // console.log(query);
        return query;
    }
})
app.use("/nfts", searchkitRouter)

app.listen(port, () => {
    console.log(`NFT Indexer Router listening on port ${port}`)
})
