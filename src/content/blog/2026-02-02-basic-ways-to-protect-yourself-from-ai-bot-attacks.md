---
title: "Basic ways to protect yourself from AI bot attacks"
pubDate: "Jan 03 2026"
description: "A real-world account and a practical, layered guide to reducing risks against increasingly sophisticated automated attacks powered by AI."
heroImage: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0"
category: "security, ai, web"
---

## Disclaimer

I've been a software developer for almost 12 years. If I include the time before I started working professionally, I easily reach 15–16 years of experience. During this time, I've worked on various products and different stacks. That said, the goal of this post is not to alarm anyone, but to share a real experience and some security practices I consider important, especially in the current context where AI-powered automated attacks are becoming increasingly sophisticated, adaptive, and difficult to distinguish from legitimate behavior.

## What happened

On Friday, around 9:20 PM, I was reviewing some notes for the next day before going to bed. Meanwhile, some acquaintances started sharing a link to a site called *moltbot chuck*, apparently created or operated by bots.

Out of technical curiosity (and with caution), I opened an isolated VM to analyze the site's behavior. As soon as I accessed it, I noticed it was abnormally slow. Opening the browser's *Network* tab was enough to spot something strange: numerous attempts to access the browser's password manager.

These attempts failed — fortunately, I use a dedicated password manager (NordPass, in this case), which added an important layer of protection. After failing to succeed, the site's behavior changed: it started aggressively trying to interact with any text field available on the page (email inputs, password fields, generic forms, etc.).

At that point, I decided to shut everything down. Although the VM was isolated, with well-defined ports and some active security controls, I preferred not to underestimate the risk. I restarted and completely reset my computer.

<div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
  <figure style="flex: 1; min-width: 250px; max-width: 400px; text-align: center;">
    <img src="https://res.cloudinary.com/dje6m1lab/image/upload/v1770071289/IMG_0002_oxjwtd.png" alt="Checking via AI" style="max-height: 400px; width: auto;" />
    <figcaption>Checking via AI</figcaption>
  </figure>
  <figure style="flex: 1; min-width: 250px; max-width: 400px; text-align: center;">
    <img src="https://res.cloudinary.com/dje6m1lab/image/upload/v1770071289/IMG_5598_yerrkm.jpg" alt="Via VM" style="max-height: 400px; width: auto;" />
    <figcaption>Via VM</figcaption>
  </figure>
</div>

## Why take such a drastic measure?

Simple: security. I strongly believe we should never underestimate an attacker's capabilities, especially when dealing with automations, scripts, and agents potentially powered by AI models.

Even with backups, protocols, and layers of defense in place, I chose the more conservative path. In the process, I even identified areas for improvement in my own backup strategy — something every incident ends up revealing.

Below are some practical recommendations. None of this is a silver bullet, but combining these measures significantly reduces the attack surface and helps mitigate risks.

---

## Layer 1 – Basic (the bare minimum)

* **Use a dedicated password manager**
  Avoid relying solely on your browser's built-in password manager. Tools like 1Password, Bitwarden, NordPass, etc. better isolate your secrets and make automatic exfiltration harder.

* **Never reuse passwords**
  It seems obvious, but it's still extremely common. Bots exploit old leaks in *credential stuffing* attacks.

* **Keep your system and browser updated**
  Many exploits depend on already-patched vulnerabilities. Updating is passive and cheap defense.

* **Be suspicious of links, even when they come from acquaintances**
  People are also attack vectors. An acquaintance may have simply shared something without understanding the risk.

* **Use extensions sparingly**
  The fewer extensions, the smaller the attack surface. Extensions have privileged access to the browser.

* **Rotate credentials periodically**
  Especially passwords, API tokens, and administrative access. Rotation reduces impact if a credential is silently compromised.

---

## Layer 2 – Intermediate (for those who already work with technology)

* **Use VMs or isolated browsers for testing**
  Suspicious sites should be accessed in disposable environments, without access to personal accounts.

* **Disable autofill for email and sensitive data**
  Bots frequently try to exploit autofill to capture information.

* **Use DNS with malware and phishing blocking**
  Services like NextDNS, AdGuard DNS, or Pi-hole help block malicious domains before they even load.

* **Enable MFA on absolutely everything possible**
  Preferably with an authenticator app or physical key. Avoid SMS; it's considerably more vulnerable and, in some cases, easy to bypass.

* **Monitor anomalous browser behavior**
  Excessive CPU usage, many background requests, and strange interactions with inputs are warning signs.

* **Have at least a basic threat model in mind**
  Identify which assets are most critical, who could benefit from them, and which attack vectors are most likely. Security without context becomes just a checklist.

---

## Layer 3 – Advanced (defense in depth)

* **Separate personal and professional environments**
  Ideally, use different OS profiles or even different machines for work, testing, and personal use.

* **Apply the principle of least privilege**
  Users, applications, services, and even extensions should have only the strictly necessary permissions.

* **Implement versioned and offline backups**
  Backup isn't just cloud. Have at least one offline and tested copy.

* **Use a local firewall with explicit rules**
  Control outbound connections, not just inbound ones.

* **Use a proxy for traffic control and inspection**
  Centralize, inspect, and limit traffic from applications and test environments to improve visibility and block suspicious behavior.

* **Consider using local (on-premise) servers**
  Well-configured physical machines at home can reduce direct internet exposure and offer greater control over traffic, logs, and isolation.

* **Consider EDR or monitoring tools**
  Especially if you deal with code, infrastructure, or sensitive data.

* **Centralize logs and review events periodically**
  System, firewall, proxy, and application logs help identify anomalous patterns and facilitate incident response.

* **Assume the browser is a priority target**
  Today, the browser is practically an operating system. Treat it as such.

* **Have a minimum incident response plan**
  Know when to isolate a machine, revoke or rotate credentials, analyze logs, and restore backups.

---

## Final thoughts

Automated attacks are nothing new, but the level of sophistication has increased significantly with the use of AI. Today, bots don't just execute static scripts: they learn patterns, adapt strategies, simulate human behavior, and adjust attacks almost in real time.

It's not about paranoia, it's about a defensive posture. Security is not a product, it's an ongoing process. The sooner you adopt good practices, the smaller the impact when something unexpected happens.

If this post makes at least one person rethink how they access random links or how they organize their layers of protection, then it has already served its purpose.

### References

- [2025 Imperva Bad Bot Report: How AI is Supercharging the Bot Threat](https://www.imperva.com/blog/2025-imperva-bad-bot-report-how-ai-is-supercharging-the-bot-threat/)
- [2025 Bad Bot Report (PDF)](https://www.imperva.com/resources/wp-content/uploads/sites/6/reports/2025-Bad-Bot-Report.pdf)
- [AI-Driven Bots Surpass Human Traffic - Bad Bot Report 2025](https://cpl.thalesgroup.com/about-us/newsroom/2025-imperva-bad-bot-report-ai-internet-traffic)
- [The hidden hand of AI: How bots will shape cyberthreats in 2025](https://www.humansecurity.com/learn/blog/the-hidden-hand-of-ai-how-bots-will-shape-cyberthreats-in-2025/)
- [The Growing Threat of AI-powered Cyberattacks in 2025](https://www.cyberdefensemagazine.com/the-growing-threat-of-ai-powered-cyberattacks-in-2025/)
- [Widely available AI tools signal new era of malicious bot activity](https://www.helpnetsecurity.com/2025/04/18/ai-tools-malicious-bots/)
- [What is credential stuffing?](https://nordpass.com/blog/what-is-credential-stuffing/)
- [5 cyber threats password managers protect against](https://nordpass.com/blog/threats-password-managers-protect-against/)
- [Browser-based vs. third-party password managers](https://nordpass.com/blog/browser-vs-password-manager-differences/)
- [Passkeys: The passwordless future of cybersecurity](https://nordpass.com/passkeys/)
- [Credential stuffing - Wikipedia](https://en.wikipedia.org/wiki/Credential_stuffing)
- [Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
- [Credential Stuffing Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html)
- [Windows Sandbox](https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/)
- [NextDNS - The new firewall for the modern Internet](https://nextdns.io/)
- [Pi-hole - Network-wide Ad Blocking](https://en.wikipedia.org/wiki/Pi-hole)
