---
title: "[pt-BR] - Formas básicas de se proteger de ataques de bots de AI"
pubDate: "Jan 03 2026"
description: "Um relato real e um guia prático, em camadas, para reduzir riscos frente a ataques automatizados cada vez mais sofisticados impulsionados por AI."
heroImage: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0"
category: "security, ai, web"
---

## Disclaimer

Sou desenvolvedor de software há quase 12 anos. Se somar o período em que ainda não atuava profissionalmente, chego fácil a 15–16 anos de experiência. Nesse tempo, trabalhei em diversos produtos e stacks diferentes. Dito isso, o objetivo deste texto não é alarmar, mas compartilhar uma experiência real e algumas práticas de segurança que considero importantes, especialmente no contexto atual, em que ataques automatizados potencializados por AI estão cada vez mais sofisticados, adaptativos e difíceis de distinguir de comportamentos legítimos.

## O ocorrido

Na sexta‑feira, por volta das 21h20, eu estava revisando algumas anotações para o dia seguinte antes de dormir. Nesse meio tempo, alguns conhecidos começaram a compartilhar um link de um site chamado *moltbot chuck*, aparentemente criado ou operado por bots.

Por curiosidade técnica (e com cautela), abri uma VM isolada para analisar o comportamento do site. Logo ao acessar, percebi que ele estava anormalmente lento. Bastou abrir a aba de *Network* do browser para notar algo estranho: inúmeras tentativas de acesso ao gerenciador de senhas do navegador.

Essas tentativas falharam — felizmente, uso um gerenciador de senhas dedicado (NordPass, nesse caso), o que adicionou uma camada importante de proteção. Após não obter sucesso, o comportamento do site mudou: passou a tentar interagir agressivamente com qualquer campo de texto disponível na página (inputs de e‑mail, senha, formulários genéricos etc.).

Nesse ponto, optei por encerrar tudo. Apesar da VM estar isolada, com portas bem definidas e alguns controles de segurança ativos, preferi não subestimar o risco. Reiniciei e resetei completamente o meu computador.

<div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
  <figure style="flex: 1; min-width: 250px; max-width: 400px; text-align: center;">
    <img src="https://res.cloudinary.com/dje6m1lab/image/upload/v1770071289/IMG_0002_oxjwtd.png" alt="Verificando via AI" style="max-height: 400px; width: auto;" />
    <figcaption>Verificando via AI</figcaption>
  </figure>
  <figure style="flex: 1; min-width: 250px; max-width: 400px; text-align: center;">
    <img src="https://res.cloudinary.com/dje6m1lab/image/upload/v1770071289/IMG_5598_yerrkm.jpg" alt="Via VM" style="max-height: 400px; width: auto;" />
    <figcaption>Via VM</figcaption>
  </figure>
</div>

## Por que tomar uma atitude tão drástica?

Simples: segurança. Eu acredito fortemente que não devemos subestimar a capacidade de um atacante, especialmente quando estamos lidando com automações, scripts e agentes potencialmente alimentados por modelos de AI.

Mesmo tendo backups, protocolos e camadas de defesa, escolhi o caminho mais conservador. No processo, identifiquei inclusive pontos de melhoria na minha própria estratégia de backup — algo que todo incidente acaba revelando.

A seguir, deixo algumas recomendações práticas. Nada aqui é bala de prata, mas a combinação dessas medidas reduz bastante a superfície de ataque e ajuda a mitigar riscos.

---

## Layer 1 – Básico (o mínimo indispensável)

* **Use um gerenciador de senhas dedicado**
  Evite confiar apenas no gerenciador embutido do navegador. Ferramentas como 1Password, Bitwarden, NordPass etc. isolam melhor os segredos e dificultam exfiltração automática.

* **Nunca reutilize senhas**
  Parece óbvio, mas ainda é extremamente comum. Bots exploram vazamentos antigos em ataques de *credential stuffing*.

* **Mantenha o sistema e o browser atualizados**
  Muitas explorações dependem de falhas já corrigidas. Atualização é defesa passiva e barata.

* **Desconfie de links, mesmo quando vêm de conhecidos**
  Pessoas também são vetores de ataque. Um conhecido pode apenas ter compartilhado algo sem entender o risco.

* **Use extensões com critério**
  Quanto menos extensões, menor a superfície de ataque. Extensões têm acesso privilegiado ao browser.

* **Rotacione credenciais periodicamente**
  Especialmente senhas, tokens de API e acessos administrativos. Rotação reduz impacto caso alguma credencial seja comprometida silenciosamente.

---

## Layer 2 – Médio (para quem já trabalha com tecnologia)

* **Utilize VMs ou browsers isolados para testes**
  Sites suspeitos devem ser acessados em ambientes descartáveis, sem acesso a contas pessoais.

* **Desative autofill de e‑mail e dados sensíveis**
  Bots frequentemente tentam explorar autofill para capturar informações.

* **Use DNS com bloqueio de malware e phishing**
  Serviços como NextDNS, AdGuard DNS ou Pi‑hole ajudam a barrar domínios maliciosos antes mesmo do carregamento.

* **Ative MFA em absolutamente tudo que for possível**
  Preferencialmente com app autenticador ou chave física. Evite SMS; são métodos consideravelmente mais vulneráveis e, em alguns casos, fáceis de burlar.

* **Monitore comportamento anômalo no browser**
  Uso excessivo de CPU, muitas requisições em background e interações estranhas com inputs são sinais de alerta.

* **Tenha ao menos um modelo de ameaça básico em mente**
  Identifique quais ativos são mais críticos, quem poderia se beneficiar deles e quais vetores de ataque são mais prováveis. Segurança sem contexto vira apenas checklist.

---

## Layer 3 – Intermediário/Avançado (defesa em profundidade)

* **Separe ambientes pessoais e profissionais**
  Idealmente, use perfis de SO ou até máquinas diferentes para trabalho, testes e uso pessoal.

* **Aplique o princípio do menor privilégio**
  Usuários, aplicações, serviços e até extensões devem ter apenas as permissões estritamente necessárias.

* **Implemente backups versionados e offline**
  Backup não é só nuvem. Tenha ao menos uma cópia offline e testada.

* **Use firewall local com regras explícitas**
  Controle conexões de saída, não apenas de entrada.

* **Utilize proxy para controle e inspeção de tráfego**
  Centralize, inspecione e limite o tráfego de aplicações e ambientes de teste para melhorar visibilidade e bloqueio de comportamentos suspeitos.

* **Considere o uso de servidores locais (on‑premise)**
  Máquinas físicas em casa, bem configuradas, podem reduzir exposição direta à internet e oferecer maior controle sobre tráfego, logs e isolamento.

* **Considere EDR ou ferramentas de monitoramento**
  Especialmente se você lida com código, infraestrutura ou dados sensíveis.

* **Centralize logs e revise eventos periodicamente**
  Logs de sistema, firewall, proxy e aplicações ajudam a identificar padrões anômalos e facilitam resposta a incidentes.

* **Assuma que o browser é um alvo prioritário**
  Hoje, o browser é praticamente um sistema operacional. Trate‑o como tal.

* **Tenha um plano mínimo de resposta a incidentes**
  Saiba quando isolar uma máquina, revogar ou rotacionar credenciais, analisar logs e restaurar backups.

---

## Considerações finais

Ataques automatizados não são novidade, mas o nível de sofisticação aumentou muito com o uso de AI. Hoje, bots não apenas executam scripts estáticos: eles aprendem padrões, adaptam estratégias, simulam comportamento humano e ajustam ataques quase em tempo real.

Não é sobre paranoia, é sobre postura defensiva. Segurança não é um produto, é um processo contínuo. Quanto mais cedo você adota boas práticas, menor o impacto quando algo inesperado acontece.

Se este texto fizer ao menos uma pessoa repensar como acessa links aleatórios ou como organiza suas camadas de proteção, então ele já cumpriu seu papel.

### Referências

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
