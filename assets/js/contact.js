/**
 * TERMINAL EMULATOR FOR CONTACT SECTION
 * Simulates a bash environment with interactive typing.
 */
document.addEventListener('DOMContentLoaded', () => {
    const terminalBody = document.getElementById('terminal-content');
    if (!terminalBody) return;

    const lines = [
        { type: 'cmd', text: 'whoami' },
        { type: 'out', text: 'puneeth' },
        { type: 'cmd', text: 'locate --skills' },
        { type: 'out', text: 'Found: [Java, Spring Boot, Spring WebFlux (Reactive), Microservices, Kafka, SQL]' },
        { type: 'cmd', text: 'curl -X GET /api/v1/availability' },
        { type: 'success', text: '{"status": "available", "interest": "new_opportunities"}' },
        { type: 'cmd', text: 'contact puneeth' },
        { type: 'out', text: 'Initializing secure connection...' },
        { type: 'success', text: 'Email ready: neerukondapuneeth@gmail.com' }
    ];

    let currentLine = 0;
    let currentChar = 0;
    let isTyping = false;

    function typeLine() {
        if (currentLine >= lines.length) return;

        const line = lines[currentLine];
        const lineElement = document.createElement('div');
        lineElement.className = `terminal__${line.type}`;

        if (line.type === 'cmd') {
            const prompt = document.createElement('span');
            prompt.className = 'terminal__prompt';
            prompt.textContent = 'puneeth@portfolio:~$ ';
            lineElement.appendChild(prompt);

            const cmdText = document.createElement('span');
            lineElement.appendChild(cmdText);

            terminalBody.appendChild(lineElement);

            let i = 0;
            isTyping = true;
            const typingInterval = setInterval(() => {
                cmdText.textContent += line.text[i];
                i++;
                if (i >= line.text.length) {
                    clearInterval(typingInterval);
                    isTyping = false;
                    currentLine++;
                    setTimeout(typeLine, 600);
                }
            }, 50);
        } else {
            lineElement.textContent = line.text;
            terminalBody.appendChild(lineElement);
            currentLine++;
            setTimeout(typeLine, 800);
        }

        // Auto scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Start terminal animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyping && currentLine === 0) {
                typeLine();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(terminalBody);
});
