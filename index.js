const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const app = express()

const newspapers =[
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment',
        base: ''
    },
    {
        name: 'gardian',
        address: 'https://www.theguardian.com/uk/environment',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/environment/',
        base: ''
    },    
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req,res) => {
    res.json('Welcome to my climate Change News API')
})

app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    
    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticle = []

            $('a:contains("climate")',html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticle.push({
                    title,
                    url,
                    source: newspaperId
                })
            })
            res.json(specificArticle)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))