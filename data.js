/**
 * PORTFOLIO DATABASE / CONFIGURATION
 * Modifica únicamente este archivo para personalizar todos los datos del portfolio.
 */
const PORTFOLIO_DATA = {
  // Datos Generales y Cabeceras
  system: {
    userName: "DAVID",
    version: "v1.4.0",
    build: "Build 2026.09",
    pageTitle: "David Vellarino - Portfolio",
    dosPrompt: "C:\\USERS\\DAVID>",
    osLabel: "DAVID_OS"
  },

  // Perfil Profesional (Ventana Acerca de / Propiedades)
  profile: {
    fullName: "David Vellarino Cordero",
    role: "Responsable de Mejora Continua IT & Infraestructura",
    summary: "+25 años liderando infraestructuras críticas, resiliencia operativa y automatización en entornos industriales híbridos (+3.000 usuarios, 15 sedes).",
    components: [
      { label: "Cloud / Datacenter:", value: "Azure, Nutanix, VMware vSphere" },
      { label: "Ciberseguridad:", value: "Fortinet, Check Point, Entra ID, ISO 27001" },
      { label: "Scripting:", value: "PowerShell Core, T-SQL, Integración con IA" }
    ]
  },

  // Contacto Profesional
  contact: {
    fullName: "David Vellarino Cordero",
    role: "Responsable de Mejora Continua IT",
    location: "Almendralejo (Badajoz), España",
    email: "david.vellarino@gmail.com",
    linkedin: "linkedin.com/in/david-vellarino",
    linkedinUrl: "https://www.linkedin.com/in/david-vellarino",
    github: "github.com/DaVeCor",
    githubUrl: "https://github.com/DaVeCor",
    education: "Grado en Ingeniería Informática (U.N.E.D.)",
    languages: "Español (Nativo) | Inglés B2 (Cambridge)"
  },

  // Historial Laboral / Visor de Sucesos (eventvwr.msc)
  events: [
    {
      id: "mc",
      type: "ℹ️ Info",
      period: "Oct 2024 - Act.",
      company: "CL Grupo Industrial",
      role: "Responsable Mejora Continua IT",
      detail: "<strong>ID Suceso: 1004 - Mejora Continua IT (CL Grupo Industrial)</strong><br>" +
              "Periodo: Octubre 2024 - Actualidad.<br>" +
              "• Definición e implantación del marco integral de optimización IT.<br>" +
              "• Estandarización de documentación técnica y repositorios en Confluence.<br>" +
              "• Automatizaciones mediante PowerShell y agentes de IA (cruce de horas/tickets y pasarelas a ERP)."
    },
    {
      id: "infra",
      type: "ℹ️ Info",
      period: "Abr 2012 - Oct 2024",
      company: "CL Grupo Industrial",
      role: "Ingeniero de Infraestructuras TI",
      detail: "<strong>ID Suceso: 1003 - Ingeniero de Infraestructuras TI (CL Grupo Industrial)</strong><br>" +
              "Periodo: Abril 2012 - Octubre 2024.<br>" +
              "• Administración de entorno para +3.000 usuarios, 15 sedes, +150 servidores y +200 máquinas virtuales en Nutanix/VMware.<br>" +
              "• Diseño de Landing Zone corporativa en Azure (VPNs, redes híbridas, peering).<br>" +
              "• Ciberseguridad: Fortinet, Check Point, CrowdStrike y DR satelital."
    },
    {
      id: "dev",
      type: "ℹ️ Info",
      period: "Abr 2001 - Abr 2012",
      company: "CL Grupo Industrial",
      role: "Analista / Programador .NET & SQL",
      detail: "<strong>ID Suceso: 1002 - Analista / Programador (CL Grupo Industrial)</strong><br>" +
              "Periodo: Abril 2001 - Abr 2012.<br>" +
              "• Desarrollo de aplicaciones internas en VB6, VB.NET, C# y ASP.NET.<br>" +
              "• Modelado y optimización de bases de datos relacionales en Microsoft SQL Server."
    },
    {
      id: "support",
      type: "ℹ️ Info",
      period: "Abr 1999 - Abr 2001",
      company: "CL Grupo Industrial",
      role: "Especialista Soporte Técnico",
      detail: "<strong>ID Suceso: 1001 - Soporte Técnico (CL Grupo Industrial)</strong><br>" +
              "Periodo: Abril 1999 - Abr 2001.<br>" +
              "• Microinformática, redes locales y despliegue de puestos."
    }
  ],

  // Sistema de Archivos Virtual (Explorador de Proyectos)
  vfs: {
    name: "C:\\PROYECTOS",
    children: {
      "Azure_Landing_Zone": {
        type: "dir",
        children: {
          "arquitectura_red.txt": {
            type: "file",
            content: "PROYECTO: Landing Zone Corporativa en Azure\n\n- Arquitectura híbrida para migración de entornos on-premise a Cloud.\n- Redes virtuales, conectividad privada, peering y seguridad perimetral.\n- VPN P2S/S2S con autenticación basada en certificados."
          },
          "deploy.ps1": {
            type: "file",
            content: "# Script Provisioning\nConnect-AzAccount\nNew-AzVirtualNetwork -Name 'VNet-Hub-Prod' -ResourceGroupName 'RG-Core' -Location 'westeurope'"
          }
        }
      },
      "Resiliencia_Disaster_Recovery": {
        type: "dir",
        children: {
          "plan_contingencia.txt": {
            type: "file",
            content: "DISASTER RECOVERY Y CONTINUIDAD OPERATIVA\n\n- Clústeres hiperconvergentes Nutanix y VMware (+200 VMs).\n- Contingencia de comunicaciones con failover automatizado a enlace satelital.\n- Política de respaldo 3-2-1-1-0 con Veeam Backup."
          }
        }
      },
      "Automatizacion_IA": {
        type: "dir",
        children: {
          "agentes_workflows.txt": {
            type: "file",
            content: "AUTOMATIZACIÓN CON POWERSHELL E IA\n\n- Skill de IA para cruce inteligente de calendarios y tickets.\n- Workflows de aprobación automatizados con doble factor.\n- Pasarelas para conectar modelos LLM con ERPs corporativos."
          }
        }
      },
      "Seguridad_IAM": {
        type: "dir",
        children: {
          "hardening_iso27001.txt": {
            type: "file",
            content: "SEGURIDAD DE IDENTIDADES (ISO 27001)\n\n- Acceso Condicional y Single Sign-On (SSO) en Microsoft Entra ID.\n- Hardening periódico de Active Directory.\n- Plan PAM en 2 fases y segmentación OT/IT."
          }
        }
      },
      "LEAME.txt": {
        type: "file",
        content: "Explorador de Proyectos de David Vellarino.\nRepositorio oficial GitHub: https://github.com/DaVeCor\nHaz doble clic en las carpetas para entrar y en los archivos para abrirlos."
      }
    }
  },

  // Versión Móvil: Mensajes SMS del Nokia 3310
  mobileSms: [
    { title: "1/4 [Azure LZone]", text: "Red híbrida P2S/S2S y bases de datos gestionadas." },
    { title: "2/4 [DR & Resiliencia]", text: "Clústeres Nutanix/VMware + failover satelital." },
    { title: "3/4 [IA Workflows]", text: "Agentes para imputación y flujos a ERP." },
    { title: "4/4 [ISO 27001]", text: "Hardening IAM, PAM y Entra ID." }
  ]
};