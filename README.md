# SnailCoin Miner
Download the miner **[here](https://github.com/snaildos/SnailMiner/releases)**.

For support or questions, join our **[Discord server](https://invite.gg/snaildos)**.

## Compiling
Must have nodeJS 12 LTS or 14 LTS
1. `npm install`
2. `npm i -g pkg`
3. `pkg .`

## Bug reporting
This is the canary branch, it is for testing purposes and may have bugs.
To report a bug you can contacting the modmail on the discord server.


## Documentation
### CPU Miner:

#### Info:

The CPU miner is based on another open source miner known as XMrig (You can learn more about it **[Here](https://github.com/xmrig/xmrig)**).

#### Flags:

    -t <Threads>           You can use this flag to specify the number of CPU threads you wish to allocate to the miner
    -u <User ID>           You can use this flag to specify your discord user ID.
    -v                     You can view the time taken by certain tasks using this flag
    --timings              Same as -v
    -s                     Silence the tips (Recommended if you are already familiar with the program)
    --silence              Same as -s

### GPU Miner:

#### Info:

The GPU miner is based on another miner known as PhoenixMiner (You can learn more about it **[Here](https://phoenixminer.info/)**).

#### Flags:
    -p <Percentage>        The percentage of your GPU which the miner should use
    -u <User ID>           You can use this flag to specify your discord user ID.
    -v                     You can view the time taken by certain tasks using this flag
    --timings              Same as -v

## Commonly asked questions

**Is this a virus?**

It is not a virus, the miner is based on XMrig (CPU miner) and PhoenixMiner (GPU miner). They are well known miners.
Your antivirus might detect it as a virus, but if you look at the details a bit closely then you will see it is reporting
it as a "miner", which is exactly what it is. You can also do a VirusTotal scan before using it if you want to see for
yourself. You can do so by clicking **[here](https://www.virustotal.com/gui/)** and then uploading the miner. All future 
releases (v2.0.0 or newer) will also contain a list of VT scans for evert variant of the miner.

**Can this harm my computer?**

Mining by itself does not harm computers, however, prolonged mining on an inadequately cooled computer can result in
damage to the hardware, however, this is not the fault of the miner itself. Mining is just a load for your CPU/GPU, just
like your favorite game or app. Any load will result in your CPU/GPU to heat up, causing the damage. We would highly
recommend monitoring your temperatures closely, and if your hardware gets too hot, stopping the miner immediately and 
either not mine or reduce the amount of resources allocated to the miner. As of v2.0.0, this can be done very easily by
just lowering the amount you set when you start the miner. We are **not** responsible for any damage to your device.
If you wish to read more about the side effects of mining, you can read more about it [here](https://salad.com/blog/does-mining-for-cryptocurrency-damage-my-gpu/)
(for GPU) or [Here](https://support.salad.com/hc/en-us/articles/360050102351-Does-CPU-Mining-Harm-My-Computer-) (for CPU).

# Credits
Forked of FalixCoin Miner
