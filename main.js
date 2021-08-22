const cheerio = require("cheerio");
const {fetch} = require("./scrapers/index.js");
const {MD5} = require("./lib/md5");
let config = require("./config/config.json")
let trainings = require('./config/trainings.json');

const baseURL = config.scrapper.baseUrl;

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
                let rootPath = config.scrapper.downloader.outVideo.rootPath
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
                }
            } else {
                console.log(`No video on ${url}`)
            }
        } while ((matched = regex.exec(bodyHtml)) !== null)
    })
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

