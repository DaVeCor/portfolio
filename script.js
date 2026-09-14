// Reloj digital
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').innerText = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

// Menú inicio y fondo
function toggleStartMenu() {
  document.getElementById('start-menu').classList.toggle('active');
}
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.start-wrapper');
  if (!wrapper.contains(e.target)) {
    document.getElementById('start-menu').classList.remove('active');
  }
});

let isBliss = true;
function toggleWallpaper() {
  const wp = document.getElementById('desktop-wallpaper');
  isBliss = !isBliss;
  wp.style.backgroundImage = isBliss
    ? "url('https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png')"
    : "none";
}

// ========================================================
// CONTROL DE VENTANAS Y ESTADOS
// ========================================================
let highestZ = 30;

const windowState = {
  'win-about': 'open',
  'win-events': 'closed',
  'win-explorer': 'closed',
  'win-cli': 'closed',
  'win-mines': 'closed',
  'win-contact': 'closed',
  'win-notepad': 'closed'
};

function bringToFront(win) {
  highestZ++;
  win.style.zIndex = highestZ;
}

function openWindow(id) {
  const win = document.getElementById(id);
  win.style.display = 'flex';
  windowState[id] = 'open';
  bringToFront(win);
  updateTaskbar();
  if (id === 'win-cli') focusTerminal();
  if (id === 'win-mines' && !minesInitialized) initMinesweeper();
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  windowState[id] = 'minimized';
  updateTaskbar();
}

function closeWindow(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  windowState[id] = 'closed';
  updateTaskbar();
}

function handleTaskbarClick(id) {
  const win = document.getElementById(id);
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

// Redimensionado de ventanas desde esquina
document.querySelectorAll('.resizer').forEach(resizer => {
  resizer.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    const win = resizer.closest('.resizable-win');
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

// Splitters arrastrables
const eventsSplitter = document.getElementById('events-splitter');
const eventDetailBox = document.getElementById('event-detail-text');

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

const explorerSplitter = document.getElementById('explorer-splitter');
const explorerTreePane = document.getElementById('explorer-tree-pane');

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

// ========================================================
// ICONOS DE ESCRITORIO ARRASTRABLES (DRAG & DROP)
// ========================================================
let activeDraggedIcon = null;

document.querySelectorAll('.draggable-icon').forEach(icon => {
  icon.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Solo clic izquierdo

    // Seleccionar visualmente
    document.querySelectorAll('.draggable-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');

    const shiftX = e.clientX - icon.getBoundingClientRect().left;
    const shiftY = e.clientY - icon.getBoundingClientRect().top;
    const desktopRect = document.getElementById('desktop').getBoundingClientRect();

    function onMouseMove(e) {
      let newX = e.clientX - desktopRect.left - shiftX;
      let newY = e.clientY - desktopRect.top - shiftY;

      // Limitar dentro del escritorio
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

// Deseleccionar iconos al pulsar en fondo
document.getElementById('desktop').addEventListener('mousedown', (e) => {
  if (e.target.id === 'desktop') {
    document.querySelectorAll('.draggable-icon').forEach(i => i.classList.remove('selected'));
  }
});

// Alinear iconos en cuadrícula vertical
function autoArrangeIcons() {
  const icons = document.querySelectorAll('.draggable-icon');
  let topOffset = 20;
  icons.forEach(ic => {
    ic.style.left = '24px';
    ic.style.top = topOffset + 'px';
    topOffset += 100;
  });
}

// ========================================================
// CONTROL DEL BOTÓN DERECHO (MENÚ CONTEXTUAL RETRO)
// ========================================================
const contextMenu = document.getElementById('retro-context-menu');
let contextTargetIcon = null;

document.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // Cancela el menú contextual de Chrome/Edge

  const clickedIcon = e.target.closest('.draggable-icon');
  contextTargetIcon = clickedIcon;

  const btnOpen = document.getElementById('ctx-open');
  if (clickedIcon) {
    btnOpen.style.display = 'block';
    document.querySelectorAll('.draggable-icon').forEach(i => i.classList.remove('selected'));
    clickedIcon.classList.add('selected');
  } else {
    btnOpen.style.display = 'none';
  }

  // Posicionar menú
  let posX = e.clientX;
  let posY = e.clientY;
  if (posX + 190 > window.innerWidth) posX = window.innerWidth - 190;
  if (posY + 160 > window.innerHeight) posY = window.innerHeight - 160;

  contextMenu.style.left = posX + 'px';
  contextMenu.style.top = posY + 'px';
  contextMenu.style.display = 'flex';
});

document.addEventListener('click', (e) => {
  if (!contextMenu.contains(e.target)) {
    hideContextMenu();
  }
});

function hideContextMenu() {
  contextMenu.style.display = 'none';
}

function ctxMenuAction(action) {
  hideContextMenu();
  if (action === 'open' && contextTargetIcon) {
    contextTargetIcon.dispatchEvent(new MouseEvent('dblclick'));
  } else if (action === 'arrange') {
    autoArrangeIcons();
  }
}

// Visor de sucesos
const eventLogs = {
  mc: "<strong>ID Suceso: 1004 - Mejora Continua IT (CL Grupo Industrial)</strong><br>" +
      "Periodo: Octubre 2024 - Actualidad.<br>" +
      "• Definición e implantación del marco integral de optimización IT[cite: 1].<br>" +
      "• Estandarización de documentación técnica y repositorios en Confluence[cite: 1].<br>" +
      "• Automatizaciones mediante PowerShell y agentes de IA (cruce de horas/tickets y pasarelas a ERP)[cite: 1].",
  infra: "<strong>ID Suceso: 1003 - Ingeniero de Infraestructuras TI (CL Grupo Industrial)</strong><br>" +
         "Periodo: Abril 2012 - Octubre 2024.<br>" +
         "• Administración de entorno para +3.000 usuarios, 15 sedes, +150 servidores y +200 máquinas virtuales en Nutanix/VMware[cite: 1].<br>" +
         "• Diseño de Landing Zone corporativa en Azure (VPNs, redes híbridas, peering)[cite: 1].<br>" +
         "• Ciberseguridad: Fortinet, Check Point, CrowdStrike y DR satelital[cite: 1].",
  dev: "<strong>ID Suceso: 1002 - Analista / Programador (CL Grupo Industrial)</strong><br>" +
       "Periodo: Abril 2001 - Abr 2012.<br>" +
       "• Desarrollo de aplicaciones internas en VB6, VB.NET, C# y ASP.NET[cite: 1].<br>" +
       "• Modelado y optimización de bases de datos relacionales en Microsoft SQL Server[cite: 1].",
  support: "<strong>ID Suceso: 1001 - Soporte Técnico (CL Grupo Industrial)</strong><br>" +
           "Periodo: Abril 1999 - Abr 2001.<br>" +
           "• Microinformática, redes locales y despliegue de puestos[cite: 1]."
};

function showEventDetail(key) {
  document.getElementById('event-detail-text').innerHTML = eventLogs[key];
}

// Explorador de archivos
const vfs = {
  name: "C:\\PROYECTOS",
  children: {
    "Azure_Landing_Zone": {
      type: "dir",
      children: {
        "arquitectura_red.txt": {
          type: "file",
          content: "PROYECTO: Landing Zone Corporativa en Azure[cite: 1]\n\n- Arquitectura híbrida para migración de entornos on-premise a Cloud[cite: 1].\n- Redes virtuales, conectividad privada, peering y seguridad perimetral[cite: 1].\n- VPN P2S/S2S con autenticación basada en certificados[cite: 1]."
        },
        "deploy.ps1": {
          type: "file",
          content: "# Script Provisioning[cite: 1]\nConnect-AzAccount\nNew-AzVirtualNetwork -Name 'VNet-Hub-Prod' -ResourceGroupName 'RG-Core' -Location 'westeurope'[cite: 1]"
        }
      }
    },
    "Resiliencia_Disaster_Recovery": {
      type: "dir",
      children: {
        "plan_contingencia.txt": {
          type: "file",
          content: "DISASTER RECOVERY Y CONTINUIDAD OPERATIVA[cite: 1]\n\n- Clústeres hiperconvergentes Nutanix y VMware (+200 VMs)[cite: 1].\n- Contingencia de comunicaciones con failover automatizado a enlace satelital[cite: 1].\n- Política de respaldo 3-2-1-1-0 con Veeam Backup[cite: 1, 6]."
        }
      }
    },
    "Automatizacion_IA": {
      type: "dir",
      children: {
        "agentes_workflows.txt": {
          type: "file",
          content: "AUTOMATIZACIÓN CON POWERSHELL E IA[cite: 1]\n\n- Skill de IA para cruce inteligente de calendarios y tickets[cite: 1].\n- Workflows de aprobación automatizados con doble factor[cite: 1].\n- Pasarelas para conectar modelos LLM con ERPs corporativos[cite: 1]."
        }
      }
    },
    "Seguridad_IAM": {
      type: "dir",
      children: {
        "hardening_iso27001.txt": {
          type: "file",
          content: "SEGURIDAD DE IDENTIDADES (ISO 27001)[cite: 1]\n\n- Acceso Condicional y Single Sign-On (SSO) en Microsoft Entra ID[cite: 1].\n- Hardening periódico de Active Directory[cite: 1].\n- Plan PAM en 2 fases y segmentación OT/IT[cite: 1]."
        }
      }
    },
    "LEAME.txt": {
      type: "file",
      content: "Explorador de Proyectos de David Vellarino[cite: 1].\nRepositorio oficial GitHub: https://github.com/DaVeCor\nHaz doble clic en las carpetas para entrar y en los archivos para abrirlos."
    }
  }
};

let currentFolderPath = [];
let navHistory = [];

function getFolderByPath(pathArr) {
  let cur = vfs;
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
  treeRoot.innerHTML = '';
  const rootLi = document.createElement('li');
  rootLi.innerHTML = `💽 <strong>C:\\PROYECTOS</strong>`;
  rootLi.onclick = () => navigateTo([]);
  renderTree(rootLi, vfs, []);
  treeRoot.appendChild(rootLi);
}

function renderExplorerFiles() {
  const filesPanel = document.getElementById('explorer-files');
  filesPanel.innerHTML = '';
  const cur = getFolderByPath(currentFolderPath);

  const fullPath = "C:\\PROYECTOS" + (currentFolderPath.length ? "\\" + currentFolderPath.join("\\") : "");
  document.getElementById('address-bar').value = fullPath;
  document.getElementById('explorer-title').innerText = "Explorando - " + fullPath;

  const entries = Object.keys(cur.children || {});
  document.getElementById('status-items').innerText = `${entries.length} objeto(s)`;

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
  document.getElementById('notepad-title').innerText = name + " - Bloc de notas";
  document.getElementById('notepad-content').value = content;
  openWindow('win-notepad');
}

initExplorerTree();
renderExplorerFiles();

// Consola MS-DOS Prompt
const hiddenInput = document.getElementById('dos-hidden-input');
const typedText = document.getElementById('typed-text');
const historyContainer = document.getElementById('history-container');
const termContainer = document.getElementById('terminal-container');

function focusTerminal() {
  hiddenInput.focus();
}

function syncTerminalInput() {
  typedText.innerText = hiddenInput.value;
}

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
    cmdDiv.innerHTML = `<span style="font-weight:bold;">C:\\USERS\\DAVID&gt;</span> ${raw}`;
    historyContainer.appendChild(cmdDiv);

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
                           "  GITHUB         - Abre el perfil de GitHub (DaVeCor)\n" +
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
        outDiv.innerText = "Repositorio: https://github.com/DaVeCor";
        window.open('https://github.com/DaVeCor', '_blank');
        break;

      case 'ver':
        outDiv.innerText = "MS-DOS Version 6.22 (Microsoft Windows 95 Release)";
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
        outDiv.innerText = "Estructura de carpetas para el volumen C:\n" +
                           "C:\\PROYECTOS\n" +
                           "├── AZURE_LANDING_ZONE\n" +
                           "│   ├── ARQUITECTURA_RED.TXT\n" +
                           "│   └── DEPLOY.PS1\n" +
                           "├── RESILIENCIA_DISASTER_RECOVERY\n" +
                           "│   └── PLAN_CONTINGENCIA.TXT\n" +
                           "├── AUTOMATIZACION_IA\n" +
                           "│   └── AGENTES_WORKFLOWS.TXT\n" +
                           "├── SEGURIDAD_IAM\n" +
                           "│   └── HARDENING_ISO27001.TXT\n" +
                           "└── LEAME.TXT";
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
        outDiv.innerText = " El volumen en la unidad C es DAVID_OS\n" +
                           " Directorio de C:\\PROYECTOS\n\n" +
                           "AZURE_LANDING_ZONE       <DIR>    2024-10-01\n" +
                           "RESILIENCIA_DISASTER_REC <DIR>    2023-05-12\n" +
                           "AUTOMATIZACION_IA        <DIR>    2024-02-18\n" +
                           "SEGURIDAD_IAM            <DIR>    2024-06-20\n" +
                           "LEAME.TXT                1.024    2026-09-01\n" +
                           "        5 archivo(s)          1.024 bytes\n" +
                           "        0 libres        128.450.560 bytes libres";
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
        historyContainer.innerHTML = '';
        hiddenInput.value = '';
        typedText.innerText = '';
        return;

      case 'exit':
        closeWindow('win-cli');
        hiddenInput.value = '';
        typedText.innerText = '';
        return;

      case 'reboot':
        location.reload();
        return;

      case '':
        break;

      default:
        outDiv.innerText = `'${raw}' no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable. Escribe HELP.`;
    }

    if (cmd !== '') historyContainer.appendChild(outDiv);
    hiddenInput.value = '';
    typedText.innerText = '';
    termContainer.scrollTop = termContainer.scrollHeight;
  }
});

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
  document.getElementById('mines-timer').innerText = '000';
  document.getElementById('mines-flag-count').innerText = '010';
  document.getElementById('mines-reset-btn').innerText = '🙂';

  const board = document.getElementById('mines-grid');
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
      document.getElementById('mines-timer').innerText = String(Math.min(mSeconds, 999)).padStart(3, '0');
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
    el.innerText = '💣';
    el.style.backgroundColor = '#ff0000';
    document.getElementById('mines-reset-btn').innerText = '😵';
    mGameOver = true;
    clearInterval(mTimer);
    mGrid.flat().forEach(item => {
      if (item.isMine) {
        const d = document.getElementById(`m-${item.r}-${item.c}`);
        d.innerText = '💣';
        d.classList.add('revealed');
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

  checkMinesWin();
}

function mToggleFlag(r, c) {
  if (mGameOver) return;
  const cell = mGrid[r][c];
  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  document.getElementById(`m-${r}-${c}`).innerText = cell.flagged ? '🚩' : '';

  let flagsUsed = 0;
  mGrid.flat().forEach(i => { if (i.flagged) flagsUsed++; });
  document.getElementById('mines-flag-count').innerText = String(M_MINES - flagsUsed).padStart(3, '0');
}

function checkMinesWin() {
  let safeLeft = 0;
  mGrid.flat().forEach(c => {
    if (!c.isMine && !c.revealed) safeLeft++;
  });

  if (safeLeft === 0) {
    mGameOver = true;
    clearInterval(mTimer);
    document.getElementById('mines-reset-btn').innerText = '😎';

    if (!bestRecord || mSeconds < bestRecord) {
      bestRecord = mSeconds;
      document.getElementById('best-user-time').innerText = `${bestRecord} seg`;
    }

    setTimeout(() => {
      alert(`¡VICTORIA!\nHas despejado el campo de minas en ${mSeconds} segundos.`);
      openWindow('win-mines-scores');
    }, 150);
  }
}