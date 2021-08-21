const cheerio = require("cheerio");
const {fetch} = require("./scrapers/index.js");
const {MD5} = require("./lib/md5");

const baseURL = "https://anatomystudy.ru";

const paths = [
    "/teach/control/lesson/view?id=205326111",

]

i = 0;
let reject = (error, url) => {
    console.log(error);
    console.log('Retry for ' + url);
    fetch(url, reject, resolve);
};

let resolve = (html, url) => {
    const $ = cheerio.load(html);
    let title = $("h2").text();

    let regex = /data-master="(?<url>[^"]+)"/g
    let bodyHtml = $('body').html()

    bodyHtml = bodyHtml + bodyHtml

//    let matched = bodyHtml.match(regex)

    let videos = {}
    let matched = regex.exec(bodyHtml);
    do {
        if (matched && typeof matched['groups'] !== 'undefined' && typeof matched['groups']['url'] !== 'undefined') {
            let video = matched['groups']['url']
            let hash = MD5(video);

            if (videos[hash] === undefined) {
                let cmd = `youtube-dl --ffmpeg-location "/usr/bin/ffmpeg" "${video}" -o "${title}.mp4" &`

                console.log(cmd);
                console.log("\n");

                videos[hash] = video;
            }
        } else {
            console.log('Video url not found!');
        }
    } while((matched = regex.exec(bodyHtml)) !== null);
};

for (let i in paths) {
    fetch(baseURL + paths[i], reject, resolve)
}


