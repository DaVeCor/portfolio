// ========================================================
// INICIALIZACIÓN DINÁMICA DESDE data.js
// ========================================================
function initPortfolioContent() {
  document.title = PORTFOLIO_DATA.system.pageTitle;

  // 1. Título y contenido de la ventana Mi Perfil
  const aboutWinTitle = document.getElementById('about-win-title');
  if (aboutWinTitle) {
    aboutWinTitle.innerText = `${PORTFOLIO_DATA.profile.fullName} - Propiedades del Sistema`;
  }
  const aboutDynBox = document.getElementById('about-dyn-content');
  if (aboutDynBox) {
    const tableRows = PORTFOLIO_DATA.profile.components.map(c => `
      <tr>
        <td style="width: 150px;"><strong>${c.label}</strong></td>
        <td>${c.value}</td>
      </tr>
    `).join('');

    aboutDynBox.innerHTML = `
      <div>
        <div style="display: flex; gap: 14px; align-items: center; margin-bottom: 6px;">
          <div style="font-size: 38px;">💻</div>
          <div>
            <div style="font-size: 15px; font-weight: bold; color: #000080;">${PORTFOLIO_DATA.profile.fullName}</div>
            <div style="font-size: 12px; color: #222;">${PORTFOLIO_DATA.profile.role}</div>
            <div style="font-size: 11px; color: #555; margin-top: 2px;">Versión del Sistema: <strong>${PORTFOLIO_DATA.system.version} (${PORTFOLIO_DATA.system.build})</strong></div>
          </div>
        </div>
        <fieldset style="margin-bottom: 6px;">
          <legend>Resumen Ejecutivo</legend>
          <p style="font-size: 12px; margin: 3px 0 4px 0; line-height: 1.35;">
            ${PORTFOLIO_DATA.profile.summary}
          </p>
        </fieldset>
        <fieldset>
          <legend>Componentes Principales</legend>
          <table class="clean-table">${tableRows}</table>
        </fieldset>
      </div>
    `;
  }

  // 2. Visor de Sucesos
  const eventsTableBody = document.getElementById('events-top-pane');
  if (eventsTableBody) {
    eventsTableBody.innerHTML = '';
    PORTFOLIO_DATA.events.forEach(evt => {
      const row = document.createElement('div');
      row.className = 'event-row';
      row.onclick = () => showEventDetail(evt.id);
      row.innerHTML = `
        <div style="width: 70px;">${evt.type}</div>
        <div style="width: 140px;">${evt.period}</div>
        <div style="width: 180px;">${evt.company}</div>
        <div style="flex: 1;">${evt.role}</div>
      `;
      eventsTableBody.appendChild(row);
    });
  }

  // 3. Ventana Contacto.txt
  const contactBox = document.getElementById('contact-dyn-content');
  if (contactBox) {
    contactBox.value = 
`==================================================
  DATOS DE CONTACTO PROFESIONAL
==================================================

Nombre:    ${PORTFOLIO_DATA.contact.fullName}
Puesto:    ${PORTFOLIO_DATA.contact.role}
Ubicación: ${PORTFOLIO_DATA.contact.location}
Email:     ${PORTFOLIO_DATA.contact.email}
LinkedIn:  ${PORTFOLIO_DATA.contact.linkedin}
GitHub:    ${PORTFOLIO_DATA.contact.githubUrl}

Educación: ${PORTFOLIO_DATA.contact.education}
Idiomas:   ${PORTFOLIO_DATA.contact.languages}`;
  }

  // 4. Prompt MS-DOS
  const promptInd = document.getElementById('dos-prompt-indicator');
  if (promptInd) promptInd.innerText = PORTFOLIO_DATA.system.dosPrompt;
}

// Reloj digital PC & Nokia
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const clockEl = document.getElementById('clock');
  if (clockEl) clockEl.innerText = `${h}:${m}`;
  const nokiaClock = document.getElementById('nokia-clock');
  if (nokiaClock) nokiaClock.innerText = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

// Menú inicio y fondo
function toggleStartMenu() {
  const sm = document.getElementById('start-menu');
  if (sm) sm.classList.toggle('active');
}
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.start-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    const sm = document.getElementById('start-menu');
    if (sm) sm.classList.remove('active');
  }
});

let isBliss = true;
function toggleWallpaper() {
  const wp = document.getElementById('desktop-wallpaper');
  if (!wp) return;
  isBliss = !isBliss;
  wp.style.backgroundImage = isBliss
    ? "url('https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png')"
    : "none";
}

// Control de ventanas y estados (PC)
let highestZ = 30;

const windowState = {
  'win-about': 'open',
  'win-events': 'closed',
  'win-explorer': 'closed',
  'win-cli': 'closed',
  'win-mines': 'closed',
  'win-contact': 'closed',
  'win-notepad': 'closed',
  'win-mines-win': 'closed',
  'win-mines-scores': 'closed'
};

function bringToFront(win) {
  if (!win) return;
  highestZ++;
  win.style.zIndex = highestZ;
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'flex';
  windowState[id] = 'open';
  bringToFront(win);
  updateTaskbar();
  if (id === 'win-cli') focusTerminal();
  if (id === 'win-mines' && !minesInitialized) initMinesweeper();
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
  windowState[id] = 'minimized';
  updateTaskbar();
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'none';
  windowState[id] = 'closed';
  updateTaskbar();
}

function handleTaskbarClick(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (windowState[id] === 'minimized') {
    win.style.display = 'flex';
    windowState[id] = 'open';
    bringToFront(win);
  } else if (windowState[id] === 'open') {
    if (parseInt(win.style.zIndex, 10) === highestZ) {
      minimizeWindow(id);
      return;
    } else {
      bringToFront(win);
    }
  }
  updateTaskbar();
}

// Drag & Drop de ventanas
document.querySelectorAll('.win-popup').forEach(win => {
  const titleBar = win.querySelector('.title-bar');
  if (!titleBar) return;
  win.addEventListener('mousedown', () => bringToFront(win));

  titleBar.addEventListener('mousedown', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    let shiftX = e.clientX - win.getBoundingClientRect().left;
    let shiftY = e.clientY - win.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      win.style.left = pageX - shiftX + 'px';
      win.style.top = pageY - shiftY + 'px';
    }
    function onMouseMove(e) { moveAt(e.pageX, e.pageY); }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });
});

// Redimensionado de ventanas
document.querySelectorAll('.resizer').forEach(resizer => {
  resizer.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    const win = resizer.closest('.resizable-win');
    if (!win) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = parseInt(document.defaultView.getComputedStyle(win).width, 10);
    const startH = parseInt(document.defaultView.getComputedStyle(win).height, 10);

    function doResize(e) {
      win.style.width = (startW + e.clientX - startX) + 'px';
      win.style.height = (startH + e.clientY - startY) + 'px';
    }
    function stopResize() {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    }

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  });
});

// Splitters
const eventsSplitter = document.getElementById('events-splitter');
const eventDetailBox = document.getElementById('event-detail-text');

if (eventsSplitter && eventDetailBox) {
  eventsSplitter.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = eventDetailBox.offsetHeight;

    function doDragH(e) {
      const newH = startH - (e.clientY - startY);
      if (newH >= 70 && newH <= 280) eventDetailBox.style.height = newH + 'px';
    }
    function stopDragH() {
      document.removeEventListener('mousemove', doDragH);
      document.removeEventListener('mouseup', stopDragH);
    }
    document.addEventListener('mousemove', doDragH);
    document.addEventListener('mouseup', stopDragH);
  });
}

const explorerSplitter = document.getElementById('explorer-splitter');
const explorerTreePane = document.getElementById('explorer-tree-pane');

if (explorerSplitter && explorerTreePane) {
  explorerSplitter.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = explorerTreePane.offsetWidth;

    function doDragV(e) {
      const newW = startW + (e.clientX - startX);
      if (newW >= 180 && newW <= 480) explorerTreePane.style.width = newW + 'px';
    }
    function stopDragV() {
      document.removeEventListener('mousemove', doDragV);
      document.removeEventListener('mouseup', stopDragV);
    }
    document.addEventListener('mousemove', doDragV);
    document.addEventListener('mouseup', stopDragV);
  });
}

// Barra de tareas
const appCatalog = [
  { id: 'win-about', title: 'Mi Perfil', icon: '💻' },
  { id: 'win-events', title: 'Sucesos.msc', icon: '📊' },
  { id: 'win-explorer', title: 'Proyectos', icon: '📁' },
  { id: 'win-cli', title: 'MS-DOS Prompt', icon: '📟' },
  { id: 'win-mines', title: 'Buscaminas', icon: '💣' },
  { id: 'win-contact', title: 'Contacto.txt', icon: '📝' },
  { id: 'win-notepad', title: 'Bloc de notas', icon: '📄' }
];

function updateTaskbar() {
  const container = document.getElementById('taskbar-tasks');
  if (!container) return;
  container.innerHTML = '';

  appCatalog.forEach(app => {
    const st = windowState[app.id];
    if (st === 'open' || st === 'minimized') {
      const btn = document.createElement('button');
      btn.className = 'task-item' + (st === 'open' ? ' active-task' : '');
      btn.innerHTML = `<span>${app.icon}</span><span>${app.title}</span>`;
      btn.onclick = () => handleTaskbarClick(app.id);
      container.appendChild(btn);
    }
  });
}
updateTaskbar();

// Iconos arrastrables
document.querySelectorAll('.draggable-icon').forEach(icon => {
  icon.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;

    document.querySelectorAll('.draggable-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');

    const shiftX = e.clientX - icon.getBoundingClientRect().left;
    const shiftY = e.clientY - icon.getBoundingClientRect().top;
    const desktopRect = document.getElementById('desktop').getBoundingClientRect();

    function onMouseMove(e) {
      let newX = e.clientX - desktopRect.left - shiftX;
      let newY = e.clientY - desktopRect.top - shiftY;

      newX = Math.max(0, Math.min(newX, desktopRect.width - icon.offsetWidth));
      newY = Math.max(0, Math.min(newY, desktopRect.height - icon.offsetHeight));

      icon.style.left = newX + 'px';
      icon.style.top = newY + 'px';
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
});

const desktopEl = document.getElementById('desktop');
if (desktopEl) {
  desktopEl.addEventListener('mousedown', (e) => {
    if (e.target.id === 'desktop') {
      document.querySelectorAll('.draggable-icon').forEach(i => i.classList.remove('selected'));
    }
  });
}

function autoArrangeIcons() {
  const icons = document.querySelectorAll('.draggable-icon');
  let topOffset = 20;
  icons.forEach(ic => {
    ic.style.left = '24px';
    ic.style.top = topOffset + 'px';
    topOffset += 100;
  });
}

// Menú contextual
const contextMenu = document.getElementById('retro-context-menu');
let contextTargetIcon = null;

document.addEventListener('contextmenu', (e) => {
  if (e.target.classList.contains('mine-cell') || e.target.closest('#win-mines')) {
    hideContextMenu();
    return;
  }

  const clickedIcon = e.target.closest('.draggable-icon');
  const isWallpaper = e.target.id === 'desktop' || e.target.id === 'desktop-wallpaper';

  if (!clickedIcon && !isWallpaper) {
    e.preventDefault();
    hideContextMenu();
    return;
  }

  e.preventDefault();
  contextTargetIcon = clickedIcon;

  const btnOpen = document.getElementById('ctx-open');
  if (clickedIcon) {
    if (btnOpen) btnOpen.style.display = 'block';
    document.querySelectorAll('.draggable-icon').forEach(i => i.classList.remove('selected'));
    clickedIcon.classList.add('selected');
  } else {
    if (btnOpen) btnOpen.style.display = 'none';
  }

  let posX = e.clientX;
  let posY = e.clientY;
  if (posX + 190 > window.innerWidth) posX = window.innerWidth - 190;
  if (posY + 160 > window.innerHeight) posY = window.innerHeight - 160;

  if (contextMenu) {
    contextMenu.style.left = posX + 'px';
    contextMenu.style.top = posY + 'px';
    contextMenu.style.display = 'flex';
  }
});

document.addEventListener('click', (e) => {
  if (contextMenu && !contextMenu.contains(e.target)) {
    hideContextMenu();
  }
});

function hideContextMenu() {
  if (contextMenu) contextMenu.style.display = 'none';
}

function ctxMenuAction(action) {
  hideContextMenu();
  if (action === 'open' && contextTargetIcon) {
    contextTargetIcon.dispatchEvent(new MouseEvent('dblclick'));
  } else if (action === 'arrange') {
    autoArrangeIcons();
  }
}

// Visor de sucesos detalle
function showEventDetail(key) {
  const evt = PORTFOLIO_DATA.events.find(e => e.id === key);
  const box = document.getElementById('event-detail-text');
  if (box && evt) box.innerHTML = evt.detail;
}

// Explorador de archivos dinámico desde PORTFOLIO_DATA.vfs
let currentFolderPath = [];
let navHistory = [];

function getFolderByPath(pathArr) {
  let cur = PORTFOLIO_DATA.vfs;
  for (const part of pathArr) {
    if (cur.children && cur.children[part]) cur = cur.children[part];
  }
  return cur;
}

function renderTree(container, folderObj, pathArr) {
  const ul = document.createElement('ul');
  Object.keys(folderObj.children || {}).forEach(k => {
    const item = folderObj.children[k];
    if (item.type === 'dir') {
      const li = document.createElement('li');
      li.innerHTML = `📁 <span>${k}</span>`;
      li.onclick = (e) => {
        e.stopPropagation();
        navigateTo([...pathArr, k]);
      };
      renderTree(li, item, [...pathArr, k]);
      ul.appendChild(li);
    }
  });
  container.appendChild(ul);
}

function initExplorerTree() {
  const treeRoot = document.getElementById('explorer-tree');
  if (!treeRoot) return;
  treeRoot.innerHTML = '';
  const rootLi = document.createElement('li');
  rootLi.innerHTML = `💽 <strong>${PORTFOLIO_DATA.vfs.name}</strong>`;
  rootLi.onclick = () => navigateTo([]);
  renderTree(rootLi, PORTFOLIO_DATA.vfs, []);
  treeRoot.appendChild(rootLi);
}

function renderExplorerFiles() {
  const filesPanel = document.getElementById('explorer-files');
  if (!filesPanel) return;
  filesPanel.innerHTML = '';
  const cur = getFolderByPath(currentFolderPath);

  const fullPath = PORTFOLIO_DATA.vfs.name + (currentFolderPath.length ? "\\" + currentFolderPath.join("\\") : "");
  const addrBar = document.getElementById('address-bar');
  if (addrBar) addrBar.value = fullPath;
  const expTitle = document.getElementById('explorer-title');
  if (expTitle) expTitle.innerText = "Explorando - " + fullPath;

  const entries = Object.keys(cur.children || {});
  const stItems = document.getElementById('status-items');
  if (stItems) stItems.innerText = `${entries.length} objeto(s)`;

  entries.forEach(name => {
    const item = cur.children[name];
    const div = document.createElement('div');
    div.className = 'file-item';

    if (item.type === 'dir') {
      div.innerHTML = `<div class="f-icon">📁</div><span title="${name}">${name}</span>`;
      div.ondblclick = () => navigateTo([...currentFolderPath, name]);
    } else {
      const icon = name.endsWith('.ps1') ? '📜' : '📄';
      div.innerHTML = `<div class="f-icon">${icon}</div><span title="${name}">${name}</span>`;
      div.ondblclick = () => openFile(name, item.content);
    }
    filesPanel.appendChild(div);
  });
}

function navigateTo(newPath) {
  navHistory.push([...currentFolderPath]);
  currentFolderPath = newPath;
  renderExplorerFiles();
}

function navGoBack() {
  if (navHistory.length > 0) {
    currentFolderPath = navHistory.pop();
    renderExplorerFiles();
  }
}

function navGoUp() {
  if (currentFolderPath.length > 0) {
    currentFolderPath.pop();
    renderExplorerFiles();
  }
}

function openFile(name, content) {
  const npTitle = document.getElementById('notepad-title');
  if (npTitle) npTitle.innerText = name + " - Bloc de notas";
  const npContent = document.getElementById('notepad-content');
  if (npContent) npContent.value = content;
  openWindow('win-notepad');
}

// Consola MS-DOS Prompt
const hiddenInput = document.getElementById('dos-hidden-input');
const typedText = document.getElementById('typed-text');
const historyContainer = document.getElementById('history-container');
const termContainer = document.getElementById('terminal-container');

function focusTerminal() {
  if (hiddenInput) hiddenInput.focus();
}

function syncTerminalInput() {
  if (typedText && hiddenInput) typedText.innerText = hiddenInput.value;
}

if (hiddenInput) {
  hiddenInput.addEventListener('input', syncTerminalInput);
  hiddenInput.addEventListener('keyup', syncTerminalInput);

  hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = hiddenInput.value;
      const cmd = raw.trim().toLowerCase();
      const parts = cmd.split(' ');
      const baseCmd = parts[0];

      const cmdDiv = document.createElement('div');
      cmdDiv.className = 'dos-line';
      cmdDiv.innerHTML = `<span style="font-weight:bold;">${PORTFOLIO_DATA.system.dosPrompt}</span> ${raw}`;
      if (historyContainer) historyContainer.appendChild(cmdDiv);

      const outDiv = document.createElement('div');
      outDiv.className = 'dos-line';

      switch (baseCmd) {
        case 'help':
          outDiv.innerText = "Comandos MS-DOS disponibles:\n" +
                             "  DIR / LS       - Lista directorios y archivos de proyectos\n" +
                             "  VER            - Muestra la versión del sistema operativo\n" +
                             "  MEM            - Muestra el estado de la memoria disponible\n" +
                             "  IPCONFIG       - Información de red y adaptadores\n" +
                             "  PING <host>    - Comprueba la conectividad de red\n" +
                             "  TREE           - Muestra la estructura de directorios en árbol\n" +
                             "  GITHUB         - Abre el perfil de GitHub\n" +
                             "  DATE / TIME    - Consulta la fecha y hora del sistema\n" +
                             "  ECHO <texto>   - Muestra mensajes en pantalla\n" +
                             "  ABOUT          - Abre propiedades del sistema\n" +
                             "  EVENTS         - Abre el Visor de Sucesos (eventvwr.msc)\n" +
                             "  EXPLORER       - Abre el explorador de archivos\n" +
                             "  MINES          - Inicia el juego Buscaminas\n" +
                             "  CONTACT        - Información de contacto\n" +
                             "  CLS / CLEAR    - Limpia la pantalla de comandos\n" +
                             "  EXIT           - Cierra la ventana de comandos\n" +
                             "  REBOOT         - Reinicia el sistema";
          break;

        case 'github':
          outDiv.innerText = `Repositorio: ${PORTFOLIO_DATA.contact.githubUrl}`;
          window.open(PORTFOLIO_DATA.contact.githubUrl, '_blank');
          break;

        case 'ver':
          outDiv.innerText = `MS-DOS Version 6.22 (Portfolio Edition ${PORTFOLIO_DATA.system.version} - ${PORTFOLIO_DATA.system.build})`;
          break;

        case 'mem':
          outDiv.innerText = "Tipo de memoria     Total       Usada       Libre\n" +
                             "----------------  ---------   ---------   ---------\n" +
                             "Convencional           640K        112K        528K\n" +
                             "Extendida (XMS)     65,536K      14,200K     51,336K\n" +
                             "----------------  ---------   ---------   ---------\n" +
                             "Memoria total       66,176K      14,312K     51,864K\n\n" +
                             "Programa de mayor tamaño ejecutable: 528K (540,672 bytes)";
          break;

        case 'ipconfig':
          outDiv.innerText = "Configuración IP de Windows\n\n" +
                             "Adaptador Ethernet Realtek RTL8139:\n\n" +
                             "   Sufijo de conexión específica DNS : red.local\n" +
                             "   Dirección IPv4. . . . . . . . . . : 192.168.1.95\n" +
                             "   Máscara de subred . . . . . . . . : 255.255.255.0\n" +
                             "   Puerta de enlace predeterminada . : 192.168.1.1";
          break;

        case 'ping':
          const target = parts[1] || '127.0.0.1';
          outDiv.innerText = `Haciendo ping a ${target} con 32 bytes de datos:\n` +
                             `Respuesta desde ${target}: bytes=32 tiempo=12ms TTL=128\n` +
                             `Respuesta desde ${target}: bytes=32 tiempo=11ms TTL=128\n` +
                             `Respuesta desde ${target}: bytes=32 tiempo=14ms TTL=128\n` +
                             `Respuesta desde ${target}: bytes=32 tiempo=10ms TTL=128\n\n` +
                             `Estadísticas de ping para ${target}:\n` +
                             `    Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos)`;
          break;

        case 'tree':
          outDiv.innerText = `Estructura de carpetas para el volumen C:\n` +
                             `${PORTFOLIO_DATA.vfs.name}\n` +
                             `├── AZURE_LANDING_ZONE\n` +
                             `│   ├── ARQUITECTURA_RED.TXT\n` +
                             `│   └── DEPLOY.PS1\n` +
                             `├── RESILIENCIA_DISASTER_RECOVERY\n` +
                             `│   └── PLAN_CONTINGENCIA.TXT\n` +
                             `├── AUTOMATIZACION_IA\n` +
                             `│   └── AGENTES_WORKFLOWS.TXT\n` +
                             `├── SEGURIDAD_IAM\n` +
                             `│   └── HARDENING_ISO27001.TXT\n` +
                             `└── LEAME.TXT`;
          break;

        case 'date':
          outDiv.innerText = `La fecha actual es: ${new Date().toLocaleDateString('es-ES')}`;
          break;

        case 'time':
          outDiv.innerText = `La hora actual es: ${new Date().toLocaleTimeString('es-ES')}`;
          break;

        case 'echo':
          outDiv.innerText = raw.substring(5).trim();
          break;

        case 'dir':
        case 'ls':
          outDiv.innerText = ` El volumen en la unidad C es ${PORTFOLIO_DATA.system.osLabel}\n` +
                             ` Directorio de ${PORTFOLIO_DATA.vfs.name}\n\n` +
                             `AZURE_LANDING_ZONE       <DIR>    2024-10-01\n` +
                             `RESILIENCIA_DISASTER_REC <DIR>    2023-05-12\n` +
                             `AUTOMATIZACION_IA        <DIR>    2024-02-18\n` +
                             `SEGURIDAD_IAM            <DIR>    2024-06-20\n` +
                             `LEAME.TXT                1.024    2026-09-01\n` +
                             `        5 archivo(s)          1.024 bytes\n` +
                             `        0 libres        128.450.560 bytes libres`;
          break;

        case 'about':
          openWindow('win-about');
          outDiv.innerText = "Iniciando ABOUT.EXE...";
          break;

        case 'events':
          openWindow('win-events');
          outDiv.innerText = "Iniciando EVENTVWR.MSC...";
          break;

        case 'explorer':
        case 'projects':
          openWindow('win-explorer');
          outDiv.innerText = "Iniciando EXPLORER.EXE...";
          break;

        case 'mines':
          openWindow('win-mines');
          outDiv.innerText = "Iniciando MINESWEEPER.EXE...";
          break;

        case 'contact':
          openWindow('win-contact');
          outDiv.innerText = "Abriendo CONTACTO.TXT...";
          break;

        case 'cls':
        case 'clear':
          if (historyContainer) historyContainer.innerHTML = '';
          hiddenInput.value = '';
          if (typedText) typedText.innerText = '';
          return;

        case 'exit':
          closeWindow('win-cli');
          hiddenInput.value = '';
          if (typedText) typedText.innerText = '';
          return;

        case 'reboot':
          location.reload();
          return;

        case '':
          break;

        default:
          outDiv.innerText = `'${raw}' no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable. Escribe HELP.`;
      }

      if (cmd !== '' && historyContainer) historyContainer.appendChild(outDiv);
      hiddenInput.value = '';
      if (typedText) typedText.innerText = '';
      if (termContainer) termContainer.scrollTop = termContainer.scrollHeight;
    }
  });
}

// Buscaminas
let minesInitialized = false;
const M_ROWS = 9;
const M_COLS = 9;
const M_MINES = 10;
let mGrid = [];
let mGameOver = false;
let mTimer = null;
let mSeconds = 0;
let bestRecord = null;

function initMinesweeper() {
  minesInitialized = true;
  clearInterval(mTimer);
  mSeconds = 0;
  mGameOver = false;
  const timerEl = document.getElementById('mines-timer');
  if (timerEl) timerEl.innerText = '000';
  const flagEl = document.getElementById('mines-flag-count');
  if (flagEl) flagEl.innerText = '010';
  const faceBtn = document.getElementById('mines-reset-btn');
  if (faceBtn) faceBtn.innerText = '🙂';

  const board = document.getElementById('mines-grid');
  if (!board) return;
  board.innerHTML = '';
  mGrid = [];

  for (let r = 0; r < M_ROWS; r++) {
    mGrid[r] = [];
    for (let c = 0; c < M_COLS; c++) {
      mGrid[r][c] = { r, c, isMine: false, revealed: false, flagged: false, count: 0 };
    }
  }

  let placed = 0;
  while (placed < M_MINES) {
    let rr = Math.floor(Math.random() * M_ROWS);
    let cc = Math.floor(Math.random() * M_COLS);
    if (!mGrid[rr][cc].isMine) {
      mGrid[rr][cc].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < M_ROWS; r++) {
    for (let c = 0; c < M_COLS; c++) {
      if (!mGrid[r][c].isMine) {
        let cnt = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (mGrid[r + dr] && mGrid[r + dr][c + dc] && mGrid[r + dr][c + dc].isMine) cnt++;
          }
        }
        mGrid[r][c].count = cnt;
      }
    }
  }

  for (let r = 0; r < M_ROWS; r++) {
    for (let c = 0; c < M_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'mine-cell';
      cell.id = `m-${r}-${c}`;
      cell.addEventListener('click', () => mReveal(r, c));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        mToggleFlag(r, c);
      });
      board.appendChild(cell);
    }
  }

  mTimer = setInterval(() => {
    if (!mGameOver) {
      mSeconds++;
      if (timerEl) timerEl.innerText = String(Math.min(mSeconds, 999)).padStart(3, '0');
    }
  }, 1000);
}

function mReveal(r, c) {
  if (mGameOver) return;
  const cell = mGrid[r][c];
  if (cell.revealed || cell.flagged) return;

  if (cell.isMine) {
    cell.revealed = true;
    const el = document.getElementById(`m-${r}-${c}`);
    if (el) {
      el.innerText = '💣';
      el.style.backgroundColor = '#ff0000';
    }
    const faceBtn = document.getElementById('mines-reset-btn');
    if (faceBtn) faceBtn.innerText = '😵';
    mGameOver = true;
    clearInterval(mTimer);
    mGrid.flat().forEach(item => {
      if (item.isMine) {
        const d = document.getElementById(`m-${item.r}-${item.c}`);
        if (d) {
          d.innerText = '💣';
          d.classList.add('revealed');
        }
      }
    });
    return;
  }

  const queue = [[r, c]];
  cell.revealed = true;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift();
    const curCell = mGrid[currR][currC];
    const domCell = document.getElementById(`m-${currR}-${currC}`);
    if (domCell) {
      domCell.classList.add('revealed');

      if (curCell.count > 0) {
        domCell.innerText = curCell.count;
        const palette = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
        domCell.style.color = palette[curCell.count];
      } else {
        domCell.innerText = '';
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < M_ROWS && nc >= 0 && nc < M_COLS) {
              const neighbor = mGrid[nr][nc];
              if (!neighbor.revealed && !neighbor.flagged && !neighbor.isMine) {
                neighbor.revealed = true;
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  }

  checkMinesWin();
}

function mToggleFlag(r, c) {
  if (mGameOver) return;
  const cell = mGrid[r][c];
  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  const el = document.getElementById(`m-${r}-${c}`);
  if (el) el.innerText = cell.flagged ? '🚩' : '';

  let flagsUsed = 0;
  mGrid.flat().forEach(i => { if (i.flagged) flagsUsed++; });
  const flagEl = document.getElementById('mines-flag-count');
  if (flagEl) flagEl.innerText = String(M_MINES - flagsUsed).padStart(3, '0');
}

function checkMinesWin() {
  let safeLeft = 0;
  mGrid.flat().forEach(c => {
    if (!c.isMine && !c.revealed) safeLeft++;
  });

  if (safeLeft === 0) {
    mGameOver = true;
    clearInterval(mTimer);
    const faceBtn = document.getElementById('mines-reset-btn');
    if (faceBtn) faceBtn.innerText = '😎';

    if (!bestRecord || mSeconds < bestRecord) {
      bestRecord = mSeconds;
      const bestEl = document.getElementById('best-user-time');
      if (bestEl) bestEl.innerText = `${bestRecord} seg`;
    }

    const winMsg = document.getElementById('mines-win-message');
    if (winMsg) winMsg.innerText = `Has despejado el campo en ${mSeconds} segundos.`;
    openWindow('win-mines-win');
  }
}

// ========================================================
// MOTOR NOKIA 3310 & JUEGO SNAKE
// ========================================================
const nokiaMenu = [
  { id: 'about', label: '1. Mi Perfil' },
  { id: 'projects', label: '2. Proyectos (SMS)' },
  { id: 'events', label: '3. Historial/Sucesos' },
  { id: 'contact', label: '4. Agenda Contacto' },
  { id: 'snake', label: '5. 🐍 Juego: Snake' },
  { id: 'pc', label: '6. 💻 Ver modo PC' }
];

let nokiaCurrentScreen = 'menu';
let nokiaSelectedIndex = 0;
let nokiaCurrentDetailId = null;

let snakeInterval = null;
let snake = [];
let snakeDir = 'right';
let snakeNextDir = 'right';
let snakeFood = { x: 0, y: 0 };
let snakeScore = 0;
let snakeGameOver = false;
const SNAKE_COLS = 22;
const SNAKE_ROWS = 15;
const SNAKE_CELL = 10;

function startSnakeGame() {
  clearInterval(snakeInterval);
  snake = [
    { x: 6, y: 7 },
    { x: 5, y: 7 },
    { x: 4, y: 7 }
  ];
  snakeDir = 'right';
  snakeNextDir = 'right';
  snakeScore = 0;
  snakeGameOver = false;
  spawnSnakeFood();

  const title = document.getElementById('nokia-title');
  if (title) title.innerText = 'SNAKE - PTS: 0';

  drawSnake();
  snakeInterval = setInterval(updateSnake, 115);
}

function spawnSnakeFood() {
  let valid = false;
  while (!valid) {
    snakeFood.x = Math.floor(Math.random() * SNAKE_COLS);
    snakeFood.y = Math.floor(Math.random() * SNAKE_ROWS);
    valid = !snake.some(segment => segment.x === snakeFood.x && segment.y === snakeFood.y);
  }
}

function updateSnake() {
  if (snakeGameOver) return;

  const head = { ...snake[0] };
  snakeDir = snakeNextDir;

  if (snakeDir === 'up') head.y--;
  if (snakeDir === 'down') head.y++;
  if (snakeDir === 'left') head.x--;
  if (snakeDir === 'right') head.x++;

  if (
    head.x < 0 || head.x >= SNAKE_COLS ||
    head.y < 0 || head.y >= SNAKE_ROWS ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    snakeGameOver = true;
    clearInterval(snakeInterval);
    const title = document.getElementById('nokia-title');
    if (title) title.innerText = 'FIN DEL JUEGO';
    drawSnake();
    return;
  }

  snake.unshift(head);

  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore += 10;
    const title = document.getElementById('nokia-title');
    if (title) title.innerText = `SNAKE - PTS: ${snakeScore}`;
    spawnSnakeFood();
  } else {
    snake.pop();
  }

  drawSnake();
}

function drawSnake() {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#c4e538';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(163, 203, 56, 0.4)';
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= SNAKE_COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * SNAKE_CELL, 0);
    ctx.lineTo(c * SNAKE_CELL, canvas.height);
    ctx.stroke();
  }
  for (let r = 0; r <= SNAKE_ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * SNAKE_CELL);
    ctx.lineTo(canvas.width, r * SNAKE_CELL);
    ctx.stroke();
  }

  ctx.fillStyle = '#1e272e';
  ctx.fillRect(snakeFood.x * SNAKE_CELL + 2, snakeFood.y * SNAKE_CELL + 2, SNAKE_CELL - 4, SNAKE_CELL - 4);

  snake.forEach((seg, idx) => {
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(seg.x * SNAKE_CELL + 1, seg.y * SNAKE_CELL + 1, SNAKE_CELL - 2, SNAKE_CELL - 2);
    if (idx === 0) {
      ctx.fillStyle = '#c4e538';
      ctx.fillRect(seg.x * SNAKE_CELL + 3, seg.y * SNAKE_CELL + 3, 2, 2);
    }
  });

  if (snakeGameOver) {
    ctx.fillStyle = 'rgba(196, 229, 56, 0.88)';
    ctx.fillRect(15, 45, canvas.width - 30, 65);
    ctx.strokeStyle = '#1e272e';
    ctx.strokeRect(15, 45, canvas.width - 30, 65);

    ctx.fillStyle = '#1e272e';
    ctx.font = 'bold 13px Courier New, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('¡HAS CHOCADO!', canvas.width / 2, 68);
    ctx.font = 'bold 11px Courier New, monospace';
    ctx.fillText(`Puntos: ${snakeScore}`, canvas.width / 2, 84);
    ctx.fillText('Pulsa — para jugar', canvas.width / 2, 99);
  }
}

function renderNokiaScreen() {
  const content = document.getElementById('nokia-content');
  const title = document.getElementById('nokia-title');
  const leftSoft = document.getElementById('nokia-left-softkey');
  const rightSoft = document.getElementById('nokia-right-softkey');

  if (!content || !title || !leftSoft || !rightSoft) return;

  if (nokiaCurrentScreen === 'menu') {
    clearInterval(snakeInterval);
    title.innerText = 'MENÚ PRINCIPAL';
    leftSoft.innerText = 'Selec.';
    rightSoft.innerText = 'Atrás';

    content.innerHTML = '';
    nokiaMenu.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'lcd-menu-item' + (index === nokiaSelectedIndex ? ' active' : '');
      div.innerText = item.label;
      div.onclick = () => {
        nokiaSelectedIndex = index;
        nokiaPressSelect();
      };
      content.appendChild(div);
    });
  } else if (nokiaCurrentScreen === 'snake') {
    leftSoft.innerText = 'Reiniciar';
    rightSoft.innerText = 'Salir';
    content.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; height:100%;">
        <canvas id="snake-canvas" width="${SNAKE_COLS * SNAKE_CELL}" height="${SNAKE_ROWS * SNAKE_CELL}"></canvas>
      </div>
    `;

    const canvas = document.getElementById('snake-canvas');
    if (canvas) {
      let touchStartX = 0;
      let touchStartY = 0;
      canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });
      canvas.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 20) nokiaNavRight();
          else if (dx < -20) nokiaNavLeft();
        } else {
          if (dy > 20) nokiaNavDown();
          else if (dy < -20) nokiaNavUp();
        }
      }, { passive: true });
    }

    startSnakeGame();
  } else if (nokiaCurrentScreen === 'detail') {
    clearInterval(snakeInterval);
    leftSoft.innerText = 'Abrir';
    rightSoft.innerText = 'Volver';

    if (nokiaCurrentDetailId === 'about') {
      title.innerText = 'PERFIL';
      content.innerHTML = `
        <div><strong>${PORTFOLIO_DATA.profile.fullName}</strong></div>
        <div>${PORTFOLIO_DATA.profile.role}</div>
        <br>
        <div>${PORTFOLIO_DATA.profile.summary}</div>
      `;
    } else if (nokiaCurrentDetailId === 'projects') {
      title.innerText = `BANDEJA SMS (${PORTFOLIO_DATA.mobileSms.length})`;
      content.innerHTML = PORTFOLIO_DATA.mobileSms.map(sms => `
        <div><strong>${sms.title}</strong><br>${sms.text}</div><br>
      `).join('');
    } else if (nokiaCurrentDetailId === 'events') {
      title.innerText = 'HISTORIAL';
      content.innerHTML = PORTFOLIO_DATA.events.map(evt => `
        <div><strong>• ${evt.period}:</strong> ${evt.role} (${evt.company})</div><br>
      `).join('');
    } else if (nokiaCurrentDetailId === 'contact') {
      title.innerText = 'AGENDA';
      content.innerHTML = `
        <div><strong>Email:</strong> ${PORTFOLIO_DATA.contact.email}</div>
        <div><strong>Ubicación:</strong> ${PORTFOLIO_DATA.contact.location}</div>
        <div><strong>GitHub:</strong> ${PORTFOLIO_DATA.contact.github}</div>
        <div><strong>LinkedIn:</strong> ${PORTFOLIO_DATA.contact.linkedin}</div>
      `;
    }
  }
}

// Navegación D-Pad
function nokiaNavUp() {
  if (nokiaCurrentScreen === 'menu') {
    nokiaSelectedIndex = (nokiaSelectedIndex - 1 + nokiaMenu.length) % nokiaMenu.length;
    renderNokiaScreen();
  } else if (nokiaCurrentScreen === 'snake') {
    if (snakeDir !== 'down') snakeNextDir = 'up';
  } else {
    const c = document.getElementById('nokia-content');
    if (c) c.scrollTop -= 35;
  }
}

function nokiaNavDown() {
  if (nokiaCurrentScreen === 'menu') {
    nokiaSelectedIndex = (nokiaSelectedIndex + 1) % nokiaMenu.length;
    renderNokiaScreen();
  } else if (nokiaCurrentScreen === 'snake') {
    if (snakeDir !== 'up') snakeNextDir = 'down';
  } else {
    const c = document.getElementById('nokia-content');
    if (c) c.scrollTop += 35;
  }
}

function nokiaNavLeft() {
  if (nokiaCurrentScreen === 'snake') {
    if (snakeDir !== 'right') snakeNextDir = 'left';
  }
}

function nokiaNavRight() {
  if (nokiaCurrentScreen === 'snake') {
    if (snakeDir !== 'left') snakeNextDir = 'right';
  }
}

document.addEventListener('keydown', (e) => {
  if (nokiaCurrentScreen === 'snake') {
    if (e.key === 'ArrowUp' || e.key === 'w') nokiaNavUp();
    if (e.key === 'ArrowDown' || e.key === 's') nokiaNavDown();
    if (e.key === 'ArrowLeft' || e.key === 'a') nokiaNavLeft();
    if (e.key === 'ArrowRight' || e.key === 'd') nokiaNavRight();
  }
});

function nokiaPressSelect() {
  if (nokiaCurrentScreen === 'menu') {
    const selected = nokiaMenu[nokiaSelectedIndex];
    if (selected.id === 'pc') {
      switchToPCView();
      return;
    }
    if (selected.id === 'snake') {
      nokiaCurrentScreen = 'snake';
      renderNokiaScreen();
      return;
    }
    nokiaCurrentDetailId = selected.id;
    nokiaCurrentScreen = 'detail';
    renderNokiaScreen();
  } else if (nokiaCurrentScreen === 'snake') {
    startSnakeGame();
  } else if (nokiaCurrentScreen === 'detail') {
    if (nokiaCurrentDetailId === 'contact') {
      window.open(PORTFOLIO_DATA.contact.githubUrl, '_blank');
    }
  }
}

function nokiaPressBack() {
  if (nokiaCurrentScreen === 'snake' || nokiaCurrentScreen === 'detail') {
    clearInterval(snakeInterval);
    nokiaCurrentScreen = 'menu';
    renderNokiaScreen();
  }
}

function switchToNokiaView() {
  const nokia = document.getElementById('nokia-container');
  const wp = document.getElementById('desktop-wallpaper');
  const dsk = document.getElementById('desktop');
  const tb = document.getElementById('taskbar');

  if (nokia) nokia.style.setProperty('display', 'flex', 'important');
  if (wp) wp.style.setProperty('display', 'none', 'important');
  if (dsk) dsk.style.setProperty('display', 'none', 'important');
  if (tb) tb.style.setProperty('display', 'none', 'important');
  document.querySelectorAll('.win-popup').forEach(w => w.style.setProperty('display', 'none', 'important'));
  renderNokiaScreen();
}

function switchToPCView() {
  const nokia = document.getElementById('nokia-container');
  const wp = document.getElementById('desktop-wallpaper');
  const dsk = document.getElementById('desktop');
  const tb = document.getElementById('taskbar');

  if (nokia) nokia.style.removeProperty('display');
  if (wp) wp.style.removeProperty('display');
  if (dsk) dsk.style.removeProperty('display');
  if (tb) tb.style.removeProperty('display');
  document.querySelectorAll('.win-popup').forEach(w => w.style.removeProperty('display'));
  openWindow('win-about');
}

// Arranque inicial
document.addEventListener('DOMContentLoaded', () => {
  initPortfolioContent();
  initExplorerTree();
  renderExplorerFiles();
  renderNokiaScreen();
});