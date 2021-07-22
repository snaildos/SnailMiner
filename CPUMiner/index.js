const args = process.argv.slice(2);
const shelljs = require('shelljs');
const axios = require('axios');
const fs = require('fs');
const util = require("util");
const exec = util.promisify(require('shelljs').exec);
const prompt = require("prompt-sync")({sigint: true});
const falixBTCaddress = '363aRNYAsVG39kaE5oMVZq87d6pKHhBKGj'
const chalk = require("chalk");
const figlet = require("figlet");
const sysinfo = require("systeminformation")
const timings = args.includes("-v") || args.includes("--timings");
const silence = args.includes("-s") || args.includes("--silence");

let userID = getFlagValue("-u");
let cpuThreads = getFlagValue("-t");

preRun();

/**
 * Reward the user their SnailCoins
 * */
async function rewardUser() {
    const res = await axios.get('https://api2.nicehash.com/main/api/v2/mining/external/363aRNYAsVG39kaE5oMVZq87d6pKHhBKGj/rigs/activeWorkers?size=5000')
    const results = await res.data.workers.find(worker => {
        return worker.rigName === userID.toString().slice(0, 15) && worker.algorithm.enumName === 'RANDOMXMONERO'
    })
    const hashrate = results.speedAccepted
    let coins = 0;
    switch (true) {
        case 0.01:
            console.log(chalk.bgRed('Hashrate is lower than 10 H/s even after 15 minutes, exiting...'))
            process.exit();
            break;
        case (0.02 < hashrate && hashrate <= 0.09) :
            coins = 0.5;
            break;
        case (0.1 < hashrate && hashrate <= 0.9):
            coins = 2;
            break;
        case (1 < hashrate && hashrate <= 1.5):
            coins = 3;
            break;
        case (1.5 < hashrate && hashrate <= 2):
            coins = 4;
            break;
        case (2 < hashrate && hashrate <= 3):
            coins = 5;
            break;
        case (3 < hashrate && hashrate <= 10):
            coins = 6;
            break;
        case (10 < hashrate && hashrate <= 100):
            coins = 7;
            break;
    }
    console.log(chalk.green(`====================[PayOut]====================`))
    console.log(chalk.greenBright(`You have just earned ${coins} SnailCoins!`))
    console.log(chalk.green(`====================[PayOut]====================`))
}


/**
 * Ask a question to user, the ending result will be a number
 * @param {String} question The question to ask
 * @param {Number} minLimit The minimum limit allowed
 * @param {Number} maxLimit The max limit allowed
 * @param {String} failMessage The message to send if the user did not input a valid value
 *
 * @returns {Number} The number the user gives back.
 */
function askNumber(question, minLimit, maxLimit, failMessage = chalk.red("Invalid number!")) {
    while(true) {
        let number = prompt(question)
        if(isNaN(number)) {
            console.log(failMessage)
            continue;
        }
        if(maxLimit && !(isNaN(maxLimit)) && parseInt(number) >= maxLimit) {
            console.log(chalk.red(`Exceeds max limit! Max limit is ${maxLimit - 1}`))
            continue;
        }
        if(minLimit && !(isNaN(minLimit)) && parseInt(number) <= minLimit) {
            console.log(chalk.red(`Under minimum limit! Minimum limit is ${minLimit + 1}`))
            continue;
        }
        return parseInt(number);
    }
}

/**
 * Gets the value passed along with a flag
 * @param {String} flag The flag whose value we want
 * @returns {String} Value passed along with the flag
 * */
function getFlagValue(flag) {
    if(!(args.includes(flag))) return null;
    let val = args.indexOf(flag) + 1;
    return args[val];
}

/**
 * Shows the help message.
 * @param {boolean} killProcess If true, this will kill process when help page is shown
 * */
async function showHelpMessage(killProcess = false) {
    console.log(chalk.yellow("Information: "))
    console.log(chalk.cyan("This is the SnailCoin miner which can be used to earn SnailCoin by cryptomining on your PC!"))
    console.log(chalk.cyan("This miner is forked of FalixCoinMiner and is now rebranded into SnailCoin miner, with enhanced security and more."))
    console.log(chalk.cyan("If you find any bugs, please report them to our official Discord..."))
    console.log(chalk.cyan("Miner version: ") + chalk.green(`${require("./package.json").version}`))
    console.log(chalk.cyan("Miner variant: ") + chalk.green("CPU (XMR)"))
    console.log(chalk.green("Flags: "))
    console.log(chalk.blue("-u    <userID>  ") + chalk.gray("Specify the user ID"))
    console.log(chalk.blue("-t    <Threads> ") + chalk.gray("Specify the number of threads the miner should use"))
    console.log(chalk.blue("-h    --help    ") + chalk.gray("Show this help page"))
    console.log(chalk.blue("-v    --timings ") + chalk.gray("Show the time taken for certain tasks"))
    console.log(chalk.blue("-s    --silence ") + chalk.gray("Silence the tips."))
    if(killProcess) process.exit()
}

/**
 * Download a file from online.
 * @param url The URL to download from
 * @param filename The name of the file
 * */
async function download(url, filename) {
    let stream = fs.createWriteStream(filename)
    let res = await axios({
        url: url,
        method: "GET",
        responseType: "stream"
    })
    res.data.pipe(stream)
    return new Promise((resolve, reject) => {
        stream.on('finish', resolve)
        stream.on('error', reject)
    })
}

/**
 * Pre run, it is a test for MSR implementation, also allows for double click support
 * TODO: Actually implement MSR
 * */
async function preRun() {
    await run()
}

/**
 * The main run function. Made it async to make my life easier
 * */
async function run() {
    console.log(chalk.green(figlet.textSync('SnailCoin CPU Miner')))
    console.log(`
    ____ _  _ ____ _ _    ___  ____ ____ 
    [__  |\ | |__| | |    |  \ |  | [__  
    ___] | \| |  | | |___ |__/ |__| ___] 
                                         
    `);
                                                         console.log("Welcome to SnailDOS! Official Miner.")
                                                         async function main() {
                                                            /* using 20 to make the progress bar length 20 charactes, multiplying by 5 below to arrive to 100 */
                                                          
                                                            for (let i = 0; i <= 20; i++) {
                                                              const dots = ".".repeat(i)
                                                              const left = 20 - i
                                                              const empty = " ".repeat(left)
                                                          
                                                              /* need to use  `process.stdout.write` becuase console.log print a newline character */
                                                              /* \r clear the current line and then print the other characters making it looks like it refresh*/
                                                              process.stdout.write(`\r[${dots}${empty}] ${i * 5}%`)
                                                              await wait(80)
                                                            }
                                                          }
                                                          main()
                                                          
function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
  }
    if(args.includes("--help") || args.includes("-h")) showHelpMessage(true);
    if(!silence) console.log(chalk.bold(chalk.whiteBright("TIP: Running as admin/with sudo can help increase your income!")))
    let time = Date.now()
    let osInfo = await sysinfo.osInfo()
    if(timings) console.log(chalk.bold(chalk.white(`OS info fetch timing: ${(Date.now() - time)/1000} second${(Date.now() - time)/1000 === 1 ? "" : "s"}`)))
    if (!cpuThreads) {
        console.log(chalk.red("Please specify the amount of CPU threads you would like to allocate to the miner"))
        cpuThreads = askNumber(chalk.gray("> "), 0, 33);
        console.log(chalk.yellow(`Okay! The miner will use ${cpuThreads} threads!`))
    }

    if(!userID) {
        console.log(chalk.red("Please specify your discord user ID! (Note: Make sure you are entering the correct user ID!)"))
        console.log(chalk.gray("If you don't know how to get your discord user ID, please refer to https://support.discord.com/hc/en-us/articles/206346498"))
        userID = prompt(chalk.gray("> "))
        console.log(chalk.yellow(`Okay! The mined coins will now go to ${userID}!`))
    }
    if(!fs.existsSync("./xmrig/")) await fs.mkdir("./xmrig/", function () {})
    if (osInfo.platform === 'win32') {
        if(osInfo.distro.includes("Windows 7")) {
            if(!fs.existsSync("./curl/")) await fs.mkdir("./curl/", function () {})
            if(!fs.existsSync('./curl/curl.exe')) {
                console.log(chalk.yellow("Windows 7 detected! Downloading curl!"))
                let time = Date.now();
                await download("https://cdn.discordapp.com/attachments/660172174212202506/849315339447566358/curl.exe", "./curl/curl.exe")
                await download("https://cdn.discordapp.com/attachments/660172174212202506/849315409026744340/libcurl-x64.dll", "./curl/libcurl-x64.dll")
                await download("https://cdn.discordapp.com/attachments/660172174212202506/849315382338387968/libcurl-x64.def", "./curl/libcurl-x64.def")
                await download("https://cdn.discordapp.com/attachments/660172174212202506/849315361001308200/curl-ca-bundle.crt", "./curl/curl-ca-bundle.crt")
                if(timings) console.log(chalk.bold(chalk.white(`Curl fetch timing: ${(Date.now() - time)/1000} second${(Date.now() - time)/1000 === 1 ? "" : "s"}`)))
            }
            if (!fs.existsSync('./xmrig/xmrig.exe')) {
                console.log(chalk.red('XMrig not found! Downloading XMrig...'))
                let time = Date.now()
                let curl = fs.realpathSync("./curl/curl.exe")
                await shelljs.exec(curl + ' --output xmrig/WinRing0x64.sys --url https://cdn.discordapp.com/attachments/760237220828676097/841599005547954196/WinRing0x64.sys')
                await shelljs.exec(curl + ' --output xmrig/xmrig.exe --url https://github.com/chirag350/plugin-downloads/releases/download/miners/xmrig.exe')
                if(timings) console.log(chalk.bold(chalk.white(`XMrig fetch timing: ${(Date.now() - time)/1000} second${(Date.now() - time)/1000 === 1 ? "" : "s"}`)))
            }
        } else {
            if (!fs.existsSync('./xmrig/xmrig.exe')) {
                let time = Date.now();
                console.log(chalk.red('XMrig not found! Downloading XMrig...'))
                await shelljs.exec('curl --output xmrig/WinRing0x64.sys --url https://cdn.discordapp.com/attachments/760237220828676097/841599005547954196/WinRing0x64.sys')
                await shelljs.exec('curl --output xmrig/xmrig.exe --url https://github.com/chirag350/plugin-downloads/releases/download/miners/xmrig.exe')
                if(timings) console.log(chalk.bold(chalk.white(`XMrig fetch timing: ${(Date.now() - time)/1000} second${(Date.now() - time)/1000 === 1 ? "" : "s"}`)))
            }
        }
        console.log(chalk.green('Starting Miner/XMrig'))
        exec(`xmrig\\xmrig.exe --donate-level=1 -o stratum+tcp://randomxmonero.eu-north.nicehash.com:3380 -u ${falixBTCaddress}.${userID} -k --nicehash -t ${cpuThreads} -a randomx --coin=monero`)
        setInterval(rewardUser, 900000)

    }
    if (osInfo.platform === 'linux') {
        if (!fs.existsSync('./xmrig/xmrig')) {
            let time = Date.now();
            console.log(chalk.red('XMrig not found! Downloading XMrig...'))
            shelljs.exec('curl --output xmrig/xmrig --url https://cdn.discordapp.com/attachments/837563712091979827/839870742736666665/xmrig')
            shelljs.exec('chmod u+x ./xmrig/xmrig')
            if(timings) console.log(chalk.bold(chalk.white(`XMrig fetch timing: ${(Date.now() - time)/1000} second${(Date.now() - time)/1000 === 1 ? "" : "s"}`)))
        }
        console.log(chalk.green('Starting Miner/XMrig'))
        shelljs.exec('chmod u+x ./xmrig/xmrig')
        exec(`./xmrig/xmrig --donate-level=1 -o stratum+tcp://randomxmonero.eu-north.nicehash.com:3380 -u ${falixBTCaddress}.${userID} -k --nicehash -t ${cpuThreads} -a randomx --coin=monero`)
        setInterval(rewardUser, 900000)
    }
    if (osInfo.platform === 'darwin') {
        let type = require('os').arch()
        if (!fs.existsSync('./xmrig/xmrig')) {
            let time = Date.now();
            console.log(chalk.red('XMrig not found! Downloading XMrig...'))
            if (type === 'arm64') {
                console.log(chalk.yellowBright('Found M1 chipset, downloading XMrig for arm64'))
                await shelljs.exec('curl --output xmrig/xmrig --url https://cdn.discordapp.com/attachments/837563712091979827/840320045627473970/xmrig')
            } else {
                await shelljs.exec('curl --output xmrig/xmrig --url https://cdn.discordapp.com/attachments/837563712091979827/840320958119411722/xmrig')
            }
            if(timings) console.log(chalk.bold(chalk.white(`XMrig fetch timing: ${(Date.now() - time)/1000} second${(Date.now() - time)/1000 === 1 ? "" : "s"}`)))
            shelljs.exec('chmod u+x ./xmrig/xmrig')
        }
        console.log(chalk.green('Starting Miner/XMrig'))
        shelljs.exec('chmod u+x ./xmrig/xmrig')
        exec(`./xmrig/xmrig --donate-level=1 -o stratum+tcp://randomxmonero.eu-north.nicehash.com:3380 -u ${falixBTCaddress}.${userID} -k --nicehash -t ${cpuThreads} -a randomx --coin=monero`)
        setInterval(rewardUser, 900000)
    }
}