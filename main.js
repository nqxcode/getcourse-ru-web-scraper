const cheerio = require("cheerio");
require('dotenv').config({ path: __dirname + '/.env' })
const {fetch} = require(__dirname + "/scraper/fetch.js");
const {MD5} = require(__dirname + "/lib/md5");
let config = require(__dirname + "/config/config.json")
let trainings = require(__dirname + `/config/trainings/${process.env.SCRAPPER_TRAINING_CONFIG_DIR}/trainings.json`);

const baseURL = process.env.SCRAPPER_BASE_URL;

let reject = function (error) {
    console.log(error);
    console.log('Retry for ' + this.url);

    let context = {url: this.url, outVideoDir: this.outVideoDir}

    fetch(this.url).then(resolve.bind(context), reject.bind(context))
};

let resolve = function (html) {
    let url = this.url
    let outVideoDir = this.outVideoDir

    const $ = cheerio.load(html);
    let lessonTitle = $("h2").first().text();
    let patterns = config.scrapper.parser.patterns;

    let videoTotal = 0
    patterns.forEach(pattern => {
        let regex = new RegExp(pattern, config.scrapper.parser.flags)
        let bodyHtml = $('body').html()

        let videoUrls = {}
        let matched = regex.exec(bodyHtml);
        let videoNumber = 1;
        do {
            if (matched && typeof matched['groups'] !== 'undefined' && typeof matched['groups']['url'] !== 'undefined') {
                let videoUrl = matched['groups']['url']
                let videoUrlHash = MD5(videoUrl);

                let videoName = lessonTitle.trim().replace(/\.$/, '') + (videoNumber > 1 ? `-${videoNumber}` : '');
                let videoExtension = config.scrapper.downloader.outVideo.extension
                let rootPath = process.env.SCRAPPER_DOWNLOAD_PATH
                let relativePath = outVideoDir

                rootPath += rootPath.endsWith("/") ? "" : "/"
                relativePath += relativePath.endsWith("/") ? "" : "/"

                let outVideoPath = `${rootPath}${relativePath}${videoName}.${videoExtension}`

                if (videoUrls[videoUrlHash] === undefined) {
                    let cmd = config.scrapper.downloader.cmdTemplate
                        .replace('{videoUrl}', videoUrl)
                        .replace('{outVideoPath}', outVideoPath)

                    console.log(cmd)
                    videoUrls[videoUrlHash] = videoUrl
                    videoNumber++
                    videoTotal++
                }
            }
        } while ((matched = regex.exec(bodyHtml)) !== null)
    })

    if (videoTotal === 0) {
        console.log(`No video on ${url}`)
    }
};

let trainingIndex = 0;
let fetchAll = function (training) {
    console.log(`Training ${trainingIndex + 1} from ${trainings.length}: "${training.title}"`)

    let outVideoDir = training.title
        .replace(/[^a-zA-Zа-яА-Я0-9-_.,]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\.\s+/g, '/')
    let paths = training.paths

    let requests = paths.map(path => {
        let url = baseURL + path;
        let context = {url: url, outVideoDir: outVideoDir}
        return fetch(url).then(resolve.bind(context), reject.bind(context))
    })

    Promise.all(requests).then(() => {
        let training = trainings[++trainingIndex]
        if (!training) {
            return
        }
        fetchAll(training)
    });
}

fetchAll(trainings[0])

