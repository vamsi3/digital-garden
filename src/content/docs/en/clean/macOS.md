---
title: macOS
---

import { Aside } from '@astrojs/starlight/components';

<Aside type="caution">
Configuring your WiFi network on router to use WPA3 security has been known to cause huge network speed drops in Macbooks. Configure the network to WPA2 and check once in a while if the issue is fixed.
</Aside>

#### Settings

- Turn off Continuity/AirDrop/Handoff (System Settings > General > AirDrop & Handoff)
	- Alternatively run, `sudo ifconfig awdl0 down`

- Turn off Watch Unlock (Settings > Touch ID & Password)
- Turn off Bluetooth
- System Settings →
	- Wi-Fi → 
		- _Connected Wi-Fi Network_ → Details… →
			- Low data mode → Disable
			- Limit IP address tracking → Disable
			- TCP/IP → Configure IPv6 → Link-Local only ([Source](https://discussions.apple.com/thread/255358715?sortBy=rank))
			- Proxies → Auto proxy discovery → Disable
			- Hardware →
				- Configure → Manually
				- MTU → Custom 1500
		- Advanced... →
			- Change networks → Enable
			- Turn Wi-Fi on or off → Enable
	- Privacy & Security →
		- App Management → Enable 'Ghostty'

##### Network Locations

- System Settings → Network → `... ⌄` → Locations → Edit Locations... → `+` → _Network Location Name_

##### DNS Servers

_If router DNS setting is not possible..._

Server addresses: https://developers.cloudflare.com/1.1.1.1/setup/#1111-for-families

First create a new network location `Cloudfare DNS` if it doesn't already exist and select it. These changes below will then only apply to that network location. You can then manually flip between `Automatic` and `Cloudfare DNS` to enable or disable Cloudfare DNS use by macOS.

- System Settings → Wi-Fi → _Connected Wi-Fi Network_ → Details… → DNS → DNS Servers →
	- `2606:4700:4700::1113`
	- `2606:4700:4700::1003`
	- `1.1.1.3`
	- `1.0.0.3`

##### Procedure to find optimal MTU

First reset the MTU setting of your equipment to 1500, the maximum size it could possibly be. For PPPoE, your Max MTU should be no more than 1492 to allow space for the 8 byte PPPoE "wrapper”. 1492 + 8 = 1500. From there it is possible to experiment and find the optimal MTU value. For PPPoE, the stakes are high: if you get your MTU wrong, you may not just be sub-optimal, things like uploading files, or the loading of web pages may stall, or not work at all! The ping test we will be doing does not include the IP/ICMP header of 28 bytes. 1500 – 28 = 1472. Include the 8 byte PPPoE wrapper if your ISP uses PPPoE and you get 1500 – 28 – 8 = 1464. The reason for these numbers will be apparent very soon.

To find out if your packets are getting fragmented, we use a Ping command from the command prompt. The best value for MTU is that value just before your packets get fragmented. Add 28 to the largest packet size that does not result in fragmenting the packets (since the ping command specifies the ping packet size, not including the IP/ICMP header of 28 bytes), and this is your Max MTU setting.

```
# This will probably say 'ping: sendto: Message too long'
ping -D -s 1500 www.google.com

# This will probably say 'ping: sendto: Message too long'
ping -D -s 1473 www.google.com

# This will probably say 'ping: sendto: Message too long'
ping -D -s 1472 www.google.com

# In this case, 1472 + 28 = 1500 us the MTU setting to use
```

##### iCloud

- System Settings → iCloud →
	- Storage → Manage... → _Click each entry_ → Delete
	- Saved to iCloud → See All → _Disable all entries except Find My Mac_

#### Applications

- [Obisidian](https://obsidian.md/) - Markdown Editor
- [Alacritty](https://alacritty.org/) - Terminal
- [Mos](https://mos.caldis.me/) - Smooth scrolling
- [Logi Options+](https://www.logitech.com/en-in/software/logi-options-plus.html) - MX Master 3
- Nix - using [Determinate NIx Installer](https://determinate.systems/nix-installer/)
- [Helix](https://helix-editor.com/ - Command Line Editor
- Ghostty terminal
