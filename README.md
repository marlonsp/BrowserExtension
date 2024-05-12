
# WebGuardian - Extensão do Firefox para Proteção de Navegação

## Introdução:
WebGuardian é uma extensão para o navegador Firefox projetada para proteger sua navegação na web contra ameaças potenciais, incluindo atividades suspeitas de sequestro de navegador (hijacking) e outras práticas maliciosas. Esta extensão oferece uma camada adicional de segurança, monitorando conexões de terceiros, contagem de cookies e armazenamento local, além de detectar possíveis tentativas de hijacking e impressões digitais de canvas.

## Funcionalidades:

- Monitoramento de Conexões de Terceiros: WebGuardian rastreia e conta as conexões de terceiros feitas durante sua sessão de navegação. Isso ajuda a identificar atividades suspeitas que podem representar uma ameaça à sua privacidade e segurança.

- Contagem de Cookies: A extensão também acompanha e diferencia os cookies de primeira e terceira partes. Isso permite que você tenha uma visão clara de como os cookies estão sendo utilizados por diferentes domínios durante sua navegação.

- Detecção de Atividade de Hijacking: WebGuardian verifica se há atividades suspeitas de hijacking, como conexões em portas comumente associadas a tentativas de sequestro de navegador. Isso ajuda a identificar potenciais ameaças à segurança do navegador.

- Verificação de Armazenamento Local: A extensão também monitora o armazenamento local (localStorage e sessionStorage) e fornece informações sobre a quantidade de dados armazenados por sessão.

- Detecção de Impressões Digitais de Canvas: WebGuardian inclui a capacidade de detectar impressões digitais de canvas, uma técnica comum usada para rastrear usuários na web. Isso ajuda a proteger sua identidade e privacidade online, alertando sobre possíveis tentativas de rastreamento.

## Como Instalar:

1. Baixe o código-fonte do repositório WebGuardian no GitHub.
2. Abra o Firefox e digite "about:debugging" na barra de endereço.
3. Na página "about:debugging", clique em "This Firefox" no menu lateral esquerdo.
4. Clique em "Load Temporary Add-on" e selecione o arquivo "manifest.json" no diretório onde você baixou o código-fonte.
5. A extensão WebGuardian será carregada temporariamente no Firefox.
6. Agora você pode navegar com segurança com a proteção adicional fornecida pela extensão WebGuardian.

### Nota:
Como esta extensão é carregada temporariamente, ela será removida quando você fechar o Firefox. Se desejar usar a extensão permanentemente, você pode empacotá-la e instalá-la como uma extensão embalada. Consulte a documentação do Firefox para obter instruções sobre como fazer isso.