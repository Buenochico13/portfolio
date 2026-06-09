const STORAGE_KEY = "portfolio-os-state-v1";
let memoryState = null;

const defaultAppTheme = {
  background: "#f8fafc",
  borderColor: "#e2e8f0",
  borderWidth: 0,
  borderRadius: 0,
  headerEnabled: false,
  headerHeight: 180,
  headerBackground: "#0f172a",
  headerTextColor: "#ffffff",
  headerTitle: "",
  headerSubtitle: "",
  headerMediaType: "none",
  headerMediaSrc: "",
  headerMediaFit: "cover",
  headerBorderColor: "#e2e8f0",
  headerBorderWidth: 0,
};

const DATA_VERSION = 4;
const WIDGET_LAYOUT_VERSION = 4;
const SUPABASE_CONFIG_VERSION = 1;
const DEFAULT_SUPABASE_URL = "https://qygnxnftdpvxxlleekob.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_uO8RbHGxx-xL4pX6zHDsRg_y0tmCKAB";
const ACCEPT_IMAGE = "image/png,image/jpeg,image/jpg,image/heic,image/heif,.png,.jpg,.jpeg,.heic,.heif";
const ACCEPT_VIDEO = "video/mp4,.mp4";
const ACCEPT_PDF = "application/pdf,.pdf";
const ACCEPT_MEDIA = `${ACCEPT_IMAGE},${ACCEPT_VIDEO}`;
const ACCEPT_MEDIA_PDF = `${ACCEPT_MEDIA},${ACCEPT_PDF}`;

const DEFAULT_WIDGET_LAYOUT = {
  weather: { desktopX: 654, desktopY: 356, width: 390, height: 330 },
  clock: { desktopX: 1328, desktopY: 40, width: 500, height: 250 },
  todo: { desktopX: 1088, desktopY: 370, width: 650, height: 350 },
};

function coverImage(title, colorA = "#0f172a", colorB = "#2563eb") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${colorA}"/>
          <stop offset="1" stop-color="${colorB}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="560" rx="46" fill="url(#g)"/>
      <circle cx="740" cy="96" r="150" fill="rgba(255,255,255,.16)"/>
      <circle cx="110" cy="500" r="210" fill="rgba(255,255,255,.12)"/>
      <text x="58" y="442" fill="white" font-family="Arial, sans-serif" font-size="56" font-weight="800">${escapeSVG(title)}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeSVG(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const DEFAULT_APPS = [
  {
    id: "contacts",
    name: "Contacts",
    symbol: "YC",
    gradient: "linear-gradient(145deg, #22c55e, #0ea5e9)",
    dock: true,
    mobileDock: true,
    visible: true,
  },
  {
    id: "work",
    name: "France Travail",
    symbol: "FT",
    gradient: "linear-gradient(145deg, #1d4ed8, #38bdf8)",
    dock: true,
    mobileDock: true,
    visible: true,
  },
  {
    id: "education",
    name: "Parcours+",
    symbol: "P+",
    gradient: "linear-gradient(145deg, #f59e0b, #ef4444)",
    dock: false,
    mobileDock: false,
    visible: true,
  },
  {
    id: "photos",
    name: "Photos",
    symbol: "PH",
    gradient: "linear-gradient(145deg, #ec4899, #8b5cf6)",
    dock: true,
    mobileDock: true,
    visible: true,
  },
  {
    id: "safari",
    name: "Safari",
    symbol: "S",
    gradient: "linear-gradient(145deg, #06b6d4, #2563eb)",
    dock: true,
    mobileDock: true,
    visible: true,
  },
  {
    id: "store",
    name: "App Store",
    symbol: "A",
    gradient: "linear-gradient(145deg, #0ea5e9, #6366f1)",
    dock: false,
    mobileDock: false,
    visible: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    symbol: "WA",
    gradient: "linear-gradient(145deg, #22c55e, #15803d)",
    dock: false,
    mobileDock: false,
    visible: true,
  },
  {
    id: "maps",
    name: "Plans",
    symbol: "PL",
    gradient: "linear-gradient(145deg, #84cc16, #14b8a6)",
    dock: false,
    mobileDock: false,
    visible: true,
  },
  {
    id: "mail",
    name: "Mail",
    symbol: "@",
    gradient: "linear-gradient(145deg, #38bdf8, #1d4ed8)",
    dock: false,
    mobileDock: false,
    visible: true,
  },
  {
    id: "calendar",
    name: "Calendrier",
    symbol: "31",
    gradient: "linear-gradient(145deg, #f8fafc, #ef4444)",
    dock: true,
    mobileDock: true,
    visible: true,
  },
  {
    id: "settings",
    name: "Reglages",
    symbol: "*",
    gradient: "linear-gradient(145deg, #64748b, #111827)",
    dock: true,
    mobileDock: true,
    visible: true,
  },
];

const DEFAULT_WORK_EXPERIENCES = [
  {
    company: "COTY MONACO",
    logo: "",
    period: "28 avril 2025 - 28 juin 2025",
    type: "Stage",
    position: "Assistant aupres de Mme Marin",
    activities: [
      "Participation a l'amelioration des formations securite",
      "Digitalisation du registre visiteurs",
      "Analyse des procedures internes",
      "Participation a la prevention des risques",
    ],
    skills: ["Organisation", "Communication professionnelle", "Prevention des risques", "Analyse de processus", "Gestion de projet"],
  },
  {
    company: "KLEOS INVEST / JUST CLICK",
    logo: "",
    period: "17 novembre 2025 - 19 decembre 2025",
    type: "Stage",
    position: "Assistant polyvalent / communication / RH",
    activities: [
      "Participation au recrutement commercial",
      "Structuration du processus RH",
      "Mise en place d'actions de communication",
      "Participation aux campagnes marketing",
    ],
    skills: ["Recrutement", "Ressources humaines", "Communication", "Marketing", "Gestion commerciale"],
  },
];

const DEFAULT_MISSIONS_PROJECTS = [
  {
    id: "mission-formation-securite",
    title: "Formation securite",
    category: "Mission",
    cover: coverImage("Formation securite", "#0f766e", "#38bdf8"),
    context: "Mission realisee dans un contexte d'amelioration des supports de formation securite.",
    objectives: "Clarifier les consignes, rendre les supports plus accessibles et faciliter la comprehension des collaborateurs.",
    skills: ["Securite", "Organisation", "Communication", "Analyse"],
    gallery: [],
    videos: [],
    pdfs: [],
  },
  {
    id: "mission-registre-visiteurs",
    title: "Registre visiteurs QR Code",
    category: "Mission",
    cover: coverImage("Registre QR Code", "#1d4ed8", "#22c55e"),
    context: "Digitalisation d'un registre visiteurs afin de fluidifier l'accueil et le suivi.",
    objectives: "Moderniser le processus, reduire les erreurs et gagner du temps dans la gestion des passages.",
    skills: ["Digitalisation", "Processus", "Outils numeriques", "Gestion de projet"],
    gallery: [],
    videos: [],
    pdfs: [],
  },
  {
    id: "mission-recrutement-commercial",
    title: "Recrutement commercial",
    category: "Mission",
    cover: coverImage("Recrutement commercial", "#7c3aed", "#ec4899"),
    context: "Participation a la structuration d'un recrutement commercial.",
    objectives: "Clarifier le besoin, organiser les candidatures et professionnaliser le suivi RH.",
    skills: ["Recrutement", "Ressources humaines", "Communication", "Selection"],
    gallery: [],
    videos: [],
    pdfs: [],
  },
  {
    id: "mission-communication-commerciale",
    title: "Communication commerciale",
    category: "Mission",
    cover: coverImage("Communication commerciale", "#ea580c", "#facc15"),
    context: "Contribution a des actions de communication commerciale et marketing.",
    objectives: "Valoriser les offres, structurer les messages et soutenir les campagnes.",
    skills: ["Communication", "Marketing", "Commercial", "Creation de contenu"],
    gallery: [],
    videos: [],
    pdfs: [],
  },
  {
    id: "projet-job-meeting",
    title: "Job Meeting",
    category: "Projet",
    cover: coverImage("Job Meeting", "#0f172a", "#2563eb"),
    context: "Projet de rencontre professionnelle oriente alternance et opportunites.",
    objectives: "Mettre en relation, organiser l'information et faciliter l'echange.",
    skills: ["Evenementiel", "Organisation", "Communication", "Relation professionnelle"],
    gallery: [],
    videos: [],
    pdfs: [],
  },
  {
    id: "projet-mobilite-italie",
    title: "Mobilite internationale Italie",
    category: "Projet",
    cover: coverImage("Mobilite Italie", "#16a34a", "#dc2626"),
    context: "Projet autour de la mobilite internationale et de l'ouverture culturelle.",
    objectives: "Preparer une experience internationale, organiser les informations et valoriser l'adaptabilite.",
    skills: ["Mobilite", "Adaptation", "Organisation", "Communication interculturelle"],
    gallery: [],
    videos: [],
    pdfs: [],
  },
];

const DEFAULT_EDUCATION_TIMELINE = [
  {
    title: "BTS Support a l'Action Manageriale",
    organization: "Saint Vincent de Paul",
    period: "2024 - 2026",
    status: "En cours",
    logo: "",
    description:
      "Formation orientee vers l'assistance manageriale, la gestion de projet, la communication professionnelle, l'organisation administrative et l'accompagnement des equipes.",
    skills: ["Gestion administrative", "Communication", "Gestion de projet", "Organisation", "Relation professionnelle", "Travail en equipe"],
    media: [],
  },
  {
    title: "Baccalaureat STMG - Option Ressources Humaines",
    organization: "Lycee Philippe Lamour",
    period: "2023 - 2024",
    status: "Mention Bien",
    logo: "",
    description:
      "Baccalaureat STMG option Ressources Humaines, avec une approche centree sur le management, la gestion, la communication et les relations humaines au sein des organisations.",
    skills: ["Ressources humaines", "Management", "Communication", "Gestion", "Analyse d'organisation"],
    media: [],
  },
  {
    title: "BAFA - Qualification Surveillant de Baignade",
    organization: "IFAC Nimes",
    period: "2023",
    status: "Obtenu",
    logo: "",
    description:
      "Obtention du BAFA avec qualification surveillant de baignade, permettant d'encadrer des groupes, d'animer des activites et d'assurer la securite des publics accueillis.",
    skills: ["Encadrement", "Animation", "Responsabilite", "Securite", "Travail avec le public"],
    media: [],
  },
];

const DEFAULT_HOBBIES = [
  ["Jeux", "GTA V"], ["Jeux", "FC26"], ["Jeux", "Among Us"], ["Jeux", "Fortnite"],
  ["Divertissement", "La Casa de Papel"], ["Divertissement", "One Piece"], ["Divertissement", "Forrest Gump"], ["Divertissement", "Stranger Things"],
  ["Voyages", "Algerie"], ["Voyages", "Thailande"], ["Voyages", "Qatar"], ["Voyages", "Italie"], ["Voyages", "Espagne"],
  ["Passions", "Coupe du Monde"], ["Passions", "Ligue des Champions"], ["Passions", "Liga"], ["Passions", "Ligue 1"],
  ["Clubs favoris", "Real Madrid"], ["Clubs favoris", "Olympique de Marseille"],
].map(([category, title], index) => ({
  id: `hobby-${index + 1}`,
  category,
  title,
  image: coverImage(title, index % 2 ? "#0ea5e9" : "#111827", index % 3 ? "#6366f1" : "#22c55e"),
  description: `${title} fait partie de mes centres d'interet et nourrit ma curiosite.`,
  reason: "J'aime ce loisir parce qu'il combine energie, emotion et decouverte.",
  gallery: [],
}));

const DEFAULT_BLOG_ARTICLES = [
  {
    id: "article-formation-securite",
    url: "https://astuceyassinerh/ameliorer-formation-securite",
    title: "Comment ameliorer une formation securite en entreprise",
    category: "Securite & organisation",
    summary: "Une astuce pour rendre une formation obligatoire plus claire, plus utile et mieux comprise par les collaborateurs.",
    cover: coverImage("Formation securite", "#0f766e", "#0891b2"),
    content:
      "Pour ameliorer une formation securite, il est important de partir du terrain. Une formation devient plus efficace lorsqu'elle utilise des exemples concrets, des situations vecues et des supports simples.\n\nIl faut eviter les explications trop longues et privilegier les mises en situation, les rappels visuels et les quiz rapides.\n\nL'objectif n'est pas seulement de transmettre une information, mais de verifier que les collaborateurs comprennent reellement les consignes et savent les appliquer.",
    blocks: [],
  },
  {
    id: "article-recrutement-commercial",
    url: "https://astuceyassinerh/structurer-recrutement-commercial",
    title: "5 etapes pour structurer un recrutement commercial",
    category: "Ressources humaines",
    summary: "Une methode simple pour organiser un recrutement clair et eviter les erreurs de selection.",
    cover: coverImage("Recrutement commercial", "#7c3aed", "#2563eb"),
    content:
      "Un recrutement efficace commence par une definition precise du besoin.\n\nIl faut identifier les missions du poste, les competences attendues et le profil recherche. Ensuite, l'offre doit etre claire et attractive.\n\nLa selection des candidatures doit s'appuyer sur des criteres objectifs. L'entretien permet ensuite de verifier la motivation, les competences commerciales et l'adequation avec l'entreprise.\n\nEnfin, un suivi apres l'entretien permet de securiser la decision et de professionnaliser le processus.",
    blocks: [],
  },
  {
    id: "article-communication-interne",
    url: "https://astuceyassinerh/ameliorer-communication-interne",
    title: "Comment ameliorer la communication interne d'une entreprise",
    category: "Communication",
    summary: "Une astuce pour fluidifier la circulation des informations et renforcer la reactivite des equipes.",
    cover: coverImage("Communication interne", "#ea580c", "#f59e0b"),
    content:
      "Une bonne communication interne repose sur des informations claires, accessibles et diffusees au bon moment.\n\nPour l'ameliorer, il faut identifier les canaux utilises par l'equipe, eviter les doublons et centraliser les informations importantes.\n\nDes supports simples, comme un tableau de suivi, une newsletter interne ou un message recapitulatif hebdomadaire, peuvent aider a mieux organiser les echanges.\n\nL'objectif est de reduire les incomprehensions, de gagner du temps et de renforcer la coordination entre les collaborateurs.",
    blocks: [],
  },
];

const DEFAULT_TODO_ITEMS = [
  "Decouvrir mon profil dans Contacts",
  "Explorer mes experiences dans France Travail",
  "Parcourir mon parcours scolaire dans Parcours+",
  "Voir mes missions et projets dans Photos",
  "Lire mes astuces dans Safari",
  "Decouvrir mes loisirs dans App Store",
  "Demander un entretien dans Calendrier",
];

const defaultState = {
  dataVersion: DATA_VERSION,
  admin: {
    unlocked: false,
    editing: false,
    selectedAppId: "contacts",
    selectedSection: "profile",
    selectedThemeElementId: "",
    selectedInlineField: "",
    selectedInlineId: "",
    code: "Amine2230",
    loginError: "",
  },
  profile: {
    owner: "Yassin",
    title: "Assistant RH / Communication",
    summary:
      "Portfolio interactif pour presenter mon profil, mes experiences, mes missions, mes projets et mes demandes d'entretien.",
    email: "contact@yassin.dev",
    phone: "+33 6 00 00 00 00",
    location: "France",
    linkedin: "https://linkedin.com/in/yassin",
    cv: "",
    photo: "",
    banner: coverImage("Portfolio Yassin", "#0f172a", "#2563eb"),
    socialLinks: "LinkedIn|Instagram|Portfolio",
  },
  apps: structuredClone(DEFAULT_APPS),
  experiences: structuredClone(DEFAULT_WORK_EXPERIENCES),
  education: structuredClone(DEFAULT_EDUCATION_TIMELINE),
  projects: structuredClone(DEFAULT_MISSIONS_PROJECTS),
  passions: structuredClone(DEFAULT_HOBBIES),
  blogArticles: structuredClone(DEFAULT_BLOG_ARTICLES),
  reviews: [],
  contactMessages: [],
  appointments: [],
  content: {
    workTitle: "Experiences professionnelles",
    workIntro: "Synthese des stages et experiences, sans missions detaillees.",
    educationTitle: "Parcours+",
    photosTitle: "Missions et projets",
    photosIntro: "Galerie principale des missions, projets, medias et documents.",
    safariUrl: "https://astuceyassinerh",
    safariTitle: "Astuces RH, organisation et communication",
    safariBody:
      "Safari reste interne au portfolio et presente des articles utiles avec URL fictives personnalisables.",
    safariFeaturedTitle: "Article a lire",
    safariFeaturedBody:
      "Des astuces concretes pour mieux organiser, communiquer et structurer les missions RH.",
    mapsTitle: "Plans",
    mapsBody: "Localisation, zones d'intervention et disponibilite geographique.",
    mapsLabel: "France · Remote",
    mailTitle: "Mail",
    mailBody: "Formulaire professionnel pour envoyer une demande et l'enregistrer dans l'administration.",
    calendarTitle: "Calendrier",
    calendarBody: "Selectionne une date, une heure et le type d'entretien souhaite.",
    storeTitle: "App Store",
    storeIntro: "Loisirs et passions presentes comme des apps Apple.",
  },
  contentStyles: {},
  widgets: [
    {
      id: "clock",
      title: "Horloge",
      type: "clock",
      body: "",
      visible: true,
      showDate: true,
      showTimezone: true,
      textColor: "#ffffff",
      backgroundColor: "rgba(255,255,255,0.16)",
      blur: 26,
      desktopX: DEFAULT_WIDGET_LAYOUT.clock.desktopX,
      desktopY: DEFAULT_WIDGET_LAYOUT.clock.desktopY,
      width: DEFAULT_WIDGET_LAYOUT.clock.width,
      height: DEFAULT_WIDGET_LAYOUT.clock.height,
    },
    {
      id: "todo",
      title: "Notes",
      type: "todo",
      body: DEFAULT_TODO_ITEMS.join("|"),
      visible: true,
      color: "rgba(255,255,255,0.16)",
      textColor: "#ffffff",
      desktopX: DEFAULT_WIDGET_LAYOUT.todo.desktopX,
      desktopY: DEFAULT_WIDGET_LAYOUT.todo.desktopY,
      width: DEFAULT_WIDGET_LAYOUT.todo.width,
      height: DEFAULT_WIDGET_LAYOUT.todo.height,
    },
    {
      id: "weather",
      title: "Meteo",
      type: "weather",
      body: "",
      visible: true,
      city: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      unit: "celsius",
      showMinMax: true,
      useGeolocation: true,
      useGlass: true,
      backgroundColor: "rgba(255,255,255,0.16)",
      textColor: "#ffffff",
      blur: 26,
      desktopX: DEFAULT_WIDGET_LAYOUT.weather.desktopX,
      desktopY: DEFAULT_WIDGET_LAYOUT.weather.desktopY,
      width: DEFAULT_WIDGET_LAYOUT.weather.width,
      height: DEFAULT_WIDGET_LAYOUT.weather.height,
    },
  ],
  ui: {
    photoDetailId: "",
    hobbyDetailId: "",
    articleDetailId: "",
    reviewStatus: "",
    mailStatus: "",
    calendarStatus: "",
    uploadStatus: "",
  },
  forms: {
    review: { firstName: "", lastName: "", rating: "", message: "", lastSentAt: 0 },
    mail: { name: "", email: "", subject: "", message: "" },
    appointment: { date: "", time: "09:00", type: "Entretien visio", firstName: "", lastName: "", email: "", message: "" },
  },
  settings: {
    adminEmail: "contact@yassin.dev",
    widgetLayoutVersion: WIDGET_LAYOUT_VERSION,
    supabaseConfigVersion: SUPABASE_CONFIG_VERSION,
    supabaseUrl: DEFAULT_SUPABASE_URL,
    supabaseAnonKey: DEFAULT_SUPABASE_PUBLISHABLE_KEY,
    useSupabase: true,
    supabaseStatus: "Supabase configure",
    supabaseLastSync: "",
    githubRemote: "",
    desktopWallpaper: {
      type: "gradient",
      value: "radial-gradient(circle at 20% 10%, rgba(47, 148, 255, 0.42), transparent 32%), radial-gradient(circle at 78% 18%, rgba(254, 196, 87, 0.26), transparent 31%), linear-gradient(135deg, #172033 0%, #1c3754 42%, #142234 100%)",
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      opacity: 1,
      zoom: 1,
      overlayColor: "rgba(0,0,0,0)",
      glass: true,
    },
    mobileWallpaper: {
      type: "gradient",
      value: "radial-gradient(circle at 30% 12%, rgba(96, 165, 250, 0.55), transparent 32%), radial-gradient(circle at 72% 22%, rgba(45, 212, 191, 0.34), transparent 28%), linear-gradient(145deg, #08111f, #17324b 52%, #071520)",
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      opacity: 1,
      zoom: 1,
      overlayColor: "rgba(0,0,0,0)",
      glass: true,
    },
  },
  windows: [],
  activeMobileApp: null,
  mobileUnlocked: false,
};

let drag = null;
let topZ = 25;
let renderingBuilderPreview = false;
let todoChecks = loadSessionChecks();
let weatherGeoRequested = false;
let supabaseClient = null;
let supabaseSyncTimer = null;
let supabaseHydrating = false;
let supabaseBooting = true;
let publicSupabaseSyncPending = false;
let supabaseSyncInFlight = false;
let supabaseSyncPromise = null;
let state = loadState();
normalizeState();

function loadState() {
  try {
    const saved = JSON.parse(window.localStorage?.getItem(STORAGE_KEY) || "null") || memoryState;
    return saved ? mergeState(defaultState, saved) : structuredClone(defaultState);
  } catch {
    return memoryState ? mergeState(defaultState, memoryState) : structuredClone(defaultState);
  }
}

function mergeState(base, saved) {
  return {
    ...structuredClone(base),
    ...saved,
    admin: { ...base.admin, ...saved.admin },
    profile: { ...base.profile, ...saved.profile },
    content: { ...base.content, ...saved.content },
    contentStyles: { ...base.contentStyles, ...saved.contentStyles },
    ui: { ...base.ui, ...saved.ui },
    forms: {
      ...base.forms,
      ...saved.forms,
      review: { ...base.forms.review, ...saved.forms?.review },
      mail: { ...base.forms.mail, ...saved.forms?.mail },
      appointment: { ...base.forms.appointment, ...saved.forms?.appointment },
    },
    settings: {
      ...base.settings,
      ...saved.settings,
      desktopWallpaper: { ...base.settings.desktopWallpaper, ...saved.settings?.desktopWallpaper },
      mobileWallpaper: { ...base.settings.mobileWallpaper, ...saved.settings?.mobileWallpaper },
    },
  };
}

function normalizeState() {
  const savedVersion = Number(state.dataVersion || 1);
  const savedWidgetLayoutVersion = Number(state.settings?.widgetLayoutVersion || 0);
  const savedSupabaseConfigVersion = Number(state.settings?.supabaseConfigVersion || 0);
  const oldPortfolioContent = savedVersion < DATA_VERSION;
  const staleContent =
    state.content?.photosIntro?.includes("Albums de realisations") ||
    state.content?.workIntro?.includes("France Travail administrables") ||
    state.content?.storeIntro?.includes("Passions et centres d'interet presentes sous forme d'applications");
  state.dataVersion = DATA_VERSION;
  state.admin = { ...defaultState.admin, ...state.admin };
  if (savedVersion < DATA_VERSION || state.admin.code === "1234") state.admin.code = defaultState.admin.code;
  state.profile = { ...defaultState.profile, ...state.profile };
  state.content = oldPortfolioContent || staleContent ? structuredClone(defaultState.content) : { ...defaultState.content, ...state.content };
  state.ui = { ...defaultState.ui, ...state.ui };
  state.forms = {
    ...defaultState.forms,
    ...state.forms,
    review: { ...defaultState.forms.review, ...state.forms?.review },
    mail: { ...defaultState.forms.mail, ...state.forms?.mail },
    appointment: { ...defaultState.forms.appointment, ...state.forms?.appointment },
  };
  state.settings = {
    ...defaultState.settings,
    ...state.settings,
    desktopWallpaper: { ...defaultState.settings.desktopWallpaper, ...state.settings?.desktopWallpaper },
    mobileWallpaper: { ...defaultState.settings.mobileWallpaper, ...state.settings?.mobileWallpaper },
  };
  if (savedSupabaseConfigVersion < SUPABASE_CONFIG_VERSION) {
    state.settings.supabaseConfigVersion = SUPABASE_CONFIG_VERSION;
    state.settings.supabaseUrl = DEFAULT_SUPABASE_URL;
    state.settings.supabaseAnonKey = DEFAULT_SUPABASE_PUBLISHABLE_KEY;
    state.settings.useSupabase = true;
    state.settings.supabaseStatus = "Supabase configure";
  }
  if (isPublishedSite()) {
    state.settings.supabaseConfigVersion = SUPABASE_CONFIG_VERSION;
    state.settings.supabaseUrl = DEFAULT_SUPABASE_URL;
    state.settings.supabaseAnonKey = DEFAULT_SUPABASE_PUBLISHABLE_KEY;
    state.settings.useSupabase = true;
  }
  if (!state.admin.unlocked) state.admin.editing = false;

  state.apps = mergeCoreApps(state.apps);
  if (oldPortfolioContent || !Array.isArray(state.experiences) || state.experiences.some((item) => item.role || item.dates)) {
    state.experiences = structuredClone(DEFAULT_WORK_EXPERIENCES);
  }
  if (oldPortfolioContent || !Array.isArray(state.education) || state.education.some((item) => item.date || item.body)) {
    state.education = structuredClone(DEFAULT_EDUCATION_TIMELINE);
  }
  if (oldPortfolioContent || !Array.isArray(state.projects) || state.projects.some((item) => item.gradient)) {
    state.projects = structuredClone(DEFAULT_MISSIONS_PROJECTS);
  }
  if (oldPortfolioContent || !Array.isArray(state.passions) || state.passions.some((item) => typeof item === "string")) {
    state.passions = structuredClone(DEFAULT_HOBBIES);
  }
  if (!Array.isArray(state.blogArticles) || oldPortfolioContent) state.blogArticles = structuredClone(DEFAULT_BLOG_ARTICLES);
  if (!Array.isArray(state.reviews)) state.reviews = [];
  if (!Array.isArray(state.contactMessages)) state.contactMessages = [];
  if (!Array.isArray(state.appointments)) state.appointments = [];
  state.widgets = normalizeWidgets(state.widgets);
  if (savedWidgetLayoutVersion < WIDGET_LAYOUT_VERSION) {
    applyDefaultWidgetLayout();
    state.settings.widgetLayoutVersion = WIDGET_LAYOUT_VERSION;
  }
  saveState();
}

function isPublishedSite() {
  return window.location.hostname === "buenochico13.github.io";
}

function lockPublicSession() {
  state.admin = { ...state.admin, unlocked: false, editing: false, codeInput: "", loginError: "" };
  state.windows = [];
  state.activeMobileApp = null;
  state.mobileUnlocked = false;
}

function mergeCoreApps(savedApps = []) {
  const customApps = savedApps.filter((app) => !DEFAULT_APPS.some((core) => core.id === app.id));
  const merged = DEFAULT_APPS.map((core) => {
    const saved = savedApps.find((app) => app.id === core.id) || {};
    return { ...core, ...saved, name: saved.name || core.name };
  });
  return [...merged, ...customApps];
}

function normalizeWidgets(savedWidgets = []) {
  const savedWithoutQuote = savedWidgets.filter((widget) => widget.id !== "quote");
  const customWidgets = savedWithoutQuote.filter((widget) => !defaultState.widgets.some((core) => core.id === widget.id));
  const merged = defaultState.widgets.map((core) => ({ ...core, ...(savedWithoutQuote.find((widget) => widget.id === core.id) || {}) }));
  const todo = merged.find((widget) => widget.id === "todo");
  if (todo && todo.title === "Objectifs") todo.title = "Notes";
  if (todo && (!todo.body || todo.body.includes("Finaliser le portfolio"))) todo.body = DEFAULT_TODO_ITEMS.join("|");
  return [...merged, ...customWidgets];
}

function applyDefaultWidgetLayout() {
  state.widgets.forEach((widget) => {
    const layout = DEFAULT_WIDGET_LAYOUT[widget.id];
    if (!layout) return;
    Object.assign(widget, layout);
    widget.visible = true;
  });
}

function loadSessionChecks() {
  try {
    return JSON.parse(window.sessionStorage?.getItem("portfolio-os-todo-checks") || "{}");
  } catch {
    return {};
  }
}

function saveSessionChecks() {
  try {
    window.sessionStorage?.setItem("portfolio-os-todo-checks", JSON.stringify(todoChecks));
  } catch {
    // Session storage can be disabled in preview contexts.
  }
}

function saveState() {
  memoryState = structuredClone(state);
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Some preview/browser contexts disable localStorage; keep the admin usable in memory.
  }
  scheduleSupabaseSync();
}

function supabaseEnabled() {
  return Boolean(state.settings.useSupabase && state.settings.supabaseUrl && state.settings.supabaseAnonKey);
}

function getSupabaseClient() {
  if (!supabaseEnabled()) return null;
  if (!window.supabase?.createClient) {
    state.settings.supabaseStatus = "SDK Supabase indisponible. Ouvre via serveur ou verifie internet.";
    return null;
  }
  const cacheKey = `${state.settings.supabaseUrl}|${state.settings.supabaseAnonKey}`;
  if (supabaseClient?.cacheKey === cacheKey) return supabaseClient.client;
  const client = window.supabase.createClient(state.settings.supabaseUrl, state.settings.supabaseAnonKey);
  supabaseClient = { cacheKey, client };
  return client;
}

function scheduleSupabaseSync() {
  if (supabaseBooting || supabaseHydrating || !supabaseEnabled()) return;
  if (!state.admin.unlocked && !publicSupabaseSyncPending) return;
  clearTimeout(supabaseSyncTimer);
  supabaseSyncTimer = setTimeout(() => {
    syncSupabase("auto");
  }, 1200);
}

async function testSupabaseConnection() {
  const client = getSupabaseClient();
  if (!client) {
    state.settings.supabaseStatus = "Configuration Supabase incomplete.";
    saveState();
    render();
    return;
  }
  try {
    const { error } = await client.from("portfolio_state").select("id").limit(1);
    state.settings.supabaseStatus = error ? `Erreur Supabase: ${error.message}` : "Connecte a Supabase";
  } catch (error) {
    state.settings.supabaseStatus = `Erreur Supabase: ${error.message}`;
  }
  saveState();
  render();
}

async function syncSupabase(mode = "manual") {
  if (supabaseSyncPromise) {
    if (mode !== "auto") {
      state.settings.supabaseStatus = "Synchronisation deja en cours...";
      render();
      const result = await supabaseSyncPromise;
      render();
      return result;
    }
    return supabaseSyncPromise;
  }
  supabaseSyncPromise = runSupabaseSync(mode).finally(() => {
    supabaseSyncPromise = null;
  });
  return supabaseSyncPromise;
}

async function runSupabaseSync(mode = "manual") {
  const client = getSupabaseClient();
  if (!client) {
    state.settings.supabaseStatus = "Configuration Supabase incomplete.";
    render();
    return false;
  }
  clearTimeout(supabaseSyncTimer);
  supabaseSyncTimer = null;
  supabaseSyncInFlight = true;
  const syncVersion = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  state.settings.supabaseSyncVersion = syncVersion;
  state.settings.supabaseStatus = mode === "auto" ? "Synchronisation automatique en cours..." : "Synchronisation Supabase en cours...";
  if (mode !== "auto") render();
  const payload = exportSupabasePayload();
  try {
    const { data, error } = await client
      .from("portfolio_state")
      .upsert({ id: "main", payload, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select("payload, updated_at")
      .maybeSingle();
    if (error) throw error;
    if (data?.payload?.settings?.supabaseSyncVersion !== syncVersion) {
      const { data: remoteState, error: verifyError } = await client
        .from("portfolio_state")
        .select("payload")
        .eq("id", "main")
        .maybeSingle();
      if (verifyError) throw verifyError;
      if (remoteState?.payload?.settings?.supabaseSyncVersion !== syncVersion) {
        throw new Error("Verification impossible. La base n'a pas confirme la derniere version.");
      }
    }
    await Promise.all([
      syncSupabaseSingleton(client, "portfolio_settings", "main", {
        profile: state.profile,
        content: state.content,
        settings: state.settings,
        contentStyles: state.contentStyles,
      }),
      syncSupabaseOrderedCollection(client, "portfolio_apps", state.apps),
      syncSupabaseOrderedCollection(client, "portfolio_widgets", state.widgets),
      syncSupabaseOrderedCollection(client, "portfolio_experiences", state.experiences),
      syncSupabaseOrderedCollection(client, "portfolio_missions_projects", state.projects, (item) => ({ category: item.category || "" })),
      syncSupabaseOrderedCollection(client, "portfolio_education_timeline", state.education),
      syncSupabaseOrderedCollection(client, "portfolio_hobbies", state.passions, (item) => ({ category: item.category || "" })),
      syncSupabaseOrderedCollection(client, "portfolio_blog_articles", state.blogArticles),
      syncSupabaseCollection(client, "portfolio_reviews", state.reviews, (item) => ({ status: item.status || "en attente" })),
      syncSupabaseCollection(client, "portfolio_contact_messages", state.contactMessages, (item) => ({ status: item.read ? "lu" : "non lu" })),
      syncSupabaseCollection(client, "portfolio_appointments", state.appointments, (item) => ({ status: item.status || "En attente" })),
    ]);
    state.settings.supabaseLastSync = new Date().toLocaleString("fr-FR");
    state.settings.supabaseStatus = mode === "auto" ? "Synchronisation automatique OK" : "Synchronisation Supabase OK";
    publicSupabaseSyncPending = false;
    const finalPayload = exportSupabasePayload();
    const { error: finalError } = await client
      .from("portfolio_state")
      .upsert({ id: "main", payload: finalPayload, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (finalError) throw finalError;
    supabaseSyncInFlight = false;
    memoryState = structuredClone(state);
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
    if (mode !== "auto") render();
    return true;
  } catch (error) {
    supabaseSyncInFlight = false;
    state.settings.supabaseStatus = `Erreur sync: ${error.message}`;
    memoryState = structuredClone(state);
    try {
      window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Keep local state in memory if storage is unavailable.
    }
    if (mode !== "auto") render();
    return false;
  }
}

async function pullSupabaseState() {
  const client = getSupabaseClient();
  if (!client) {
    state.settings.supabaseStatus = "Configuration Supabase incomplete.";
    saveState();
    render();
    return;
  }
  try {
    const { data, error } = await client.from("portfolio_state").select("payload").eq("id", "main").maybeSingle();
    if (error) throw error;
    if (!data?.payload) {
      state.settings.supabaseStatus = "Aucun etat distant trouve.";
      saveState();
      render();
      return;
    }
    supabaseHydrating = true;
    const currentSettings = {
      supabaseUrl: state.settings.supabaseUrl,
      supabaseAnonKey: state.settings.supabaseAnonKey,
      useSupabase: state.settings.useSupabase,
      githubRemote: state.settings.githubRemote,
    };
    state = mergeState(defaultState, data.payload);
    lockPublicSession();
    state.settings = { ...state.settings, ...currentSettings, supabaseStatus: "Donnees recuperees depuis Supabase", supabaseLastSync: new Date().toLocaleString("fr-FR") };
    normalizeState();
    supabaseHydrating = false;
    render();
  } catch (error) {
    supabaseHydrating = false;
    state.settings.supabaseStatus = `Erreur recuperation: ${error.message}`;
    saveState();
    render();
  }
}

async function bootApp() {
  if (supabaseEnabled()) {
    await pullSupabaseState();
  } else {
    lockPublicSession();
    render();
  }
  supabaseBooting = false;
}

function hasPendingSupabaseSync() {
  return Boolean(supabaseSyncInFlight || supabaseSyncTimer || supabaseSyncPromise);
}

async function syncSupabaseCollection(client, table, items, meta = () => ({})) {
  if (!items?.length) return;
  const rows = items.map((item) => ({
    id: String(item.id),
    payload: item,
    ...meta(item),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await client.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

async function syncSupabaseOrderedCollection(client, table, items, meta = () => ({})) {
  if (!items?.length) return;
  const rows = items.map((item, index) => ({
    id: String(item.id || item.company || item.title || index),
    payload: item,
    sort_order: index,
    ...meta(item),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await client.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

async function syncSupabaseSingleton(client, table, id, payload) {
  const { error } = await client
    .from(table)
    .upsert({ id, payload, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) throw error;
}

function exportSupabasePayload() {
  return {
    ...structuredClone(state),
    admin: { ...state.admin, unlocked: false, editing: false, codeInput: "", loginError: "" },
    forms: structuredClone(defaultState.forms),
    windows: [],
    activeMobileApp: null,
    mobileUnlocked: false,
  };
}

function visibleApps() {
  return state.apps.filter((app) => app.visible);
}

function dockApps(context = "desktop") {
  const key = context === "mobile" ? "mobileDock" : "dock";
  const limit = context === "mobile" ? 4 : 6;
  return visibleApps().filter((app) => app[key] !== false).slice(0, limit);
}

function renderWallpaperVideo(wallpaper) {
  if (!wallpaper || wallpaper.type !== "video" || !wallpaper.value) return "";
  return `<video class="wallpaper-video" src="${escapeAttr(wallpaper.value)}" autoplay muted loop playsinline></video>`;
}

function appById(id) {
  return state.apps.find((app) => app.id === id);
}

function themeElementsFor(app) {
  if (!app.themeElements) app.themeElements = [];
  return app.themeElements;
}

function appThemeFor(app) {
  if (!app.theme) app.theme = {};
  app.theme = { ...defaultAppTheme, ...app.theme };
  return app.theme;
}

function selectedThemeElement(appId = state.admin.selectedAppId) {
  const app = appById(appId);
  if (!app) return null;
  return themeElementsFor(app).find((element) => element.id === state.admin.selectedThemeElementId) || null;
}

function themeElementById(appId, elementId) {
  const app = appById(appId);
  if (!app) return null;
  return themeElementsFor(app).find((element) => element.id === elementId) || null;
}

function inlineStyleKey(field, id = "") {
  return `${field}::${id ?? ""}`;
}

function inlineStyleFor(field, id = "") {
  const key = inlineStyleKey(field, id);
  if (!state.contentStyles) state.contentStyles = {};
  if (!state.contentStyles[key]) state.contentStyles[key] = {};
  return state.contentStyles[key];
}

function selectedInlineStyle() {
  if (!state.admin.selectedInlineField) return null;
  const field = state.admin.selectedInlineField;
  const id = state.admin.selectedInlineId || "";
  return {
    field,
    id,
    key: inlineStyleKey(field, id),
    label: inlineSelectionLabel(field, id),
    style: inlineStyleFor(field, id),
  };
}

function hasInlineStyle(style) {
  return Object.values(style || {}).some((value) => value !== "" && value !== false && value !== null && value !== undefined);
}

function inlineSelectionLabel(field, id = "") {
  const groups = {
    content: "Contenu",
    profile: "Profil",
    experience: "Experience",
    education: "Parcours",
    project: "Projet",
    passion: "Passion",
    appTheme: "Header",
  };
  const names = {
    owner: "nom",
    title: "titre",
    summary: "presentation",
    email: "email",
    phone: "telephone",
    location: "lieu",
    workTitle: "titre France Travail",
    workIntro: "intro France Travail",
    role: "poste",
    company: "entreprise",
    dates: "dates",
    details: "description",
    educationTitle: "titre Parcours",
    body: "texte",
    photosTitle: "titre Photos",
    photosIntro: "intro Photos",
    safariUrl: "URL Safari",
    safariTitle: "titre Safari",
    safariBody: "article Safari",
    safariFeaturedTitle: "titre vedette",
    safariFeaturedBody: "texte vedette",
    storeTitle: "titre App Store",
    storeIntro: "intro App Store",
    mapsTitle: "titre Plans",
    mapsBody: "texte Plans",
    mapsLabel: "label carte",
    mailTitle: "titre Mail",
    mailBody: "texte Mail",
    calendarTitle: "titre Calendrier",
    calendarBody: "texte Calendrier",
    headerTitle: "titre",
    headerSubtitle: "sous-titre",
    value: "texte",
  };
  const [group, key] = field.split(".");
  const index = id !== "" && !Number.isNaN(Number(id)) ? ` ${Number(id) + 1}` : "";
  return `${groups[group] || group}${index} - ${names[key] || key || field}`;
}

function inlineStyleText(style) {
  if (!style) return "";
  const css = [];
  const fontSize = Number(style.fontSize || 0);
  const width = Number(style.width || 0);
  const minHeight = Number(style.minHeight || 0);
  const borderWidth = Number(style.borderWidth || 0);
  const borderRadius = Number(style.borderRadius || 0);
  const padding = Number(style.padding || 0);
  const hasBox = width > 0 || minHeight > 0 || borderWidth > 0 || padding > 0 || Boolean(style.backgroundColor);

  if (style.color) css.push(`color:${style.color}`);
  if (fontSize > 0) css.push(`font-size:${fontSize}px`);
  if (style.backgroundColor) css.push(`background-color:${style.backgroundColor}`);
  if (width > 0) css.push(`width:${width}px`);
  if (minHeight > 0) css.push(`min-height:${minHeight}px`);
  if (borderWidth > 0) css.push(`border:${borderWidth}px solid ${style.borderColor || "#cbd5e1"}`);
  if (borderRadius > 0) css.push(`border-radius:${borderRadius}px`);
  if (padding > 0) css.push(`padding:${padding}px`);
  if (style.bold) css.push("font-weight:800");
  if (style.underline) css.push("text-decoration:underline");
  if (hasBox) css.push("display:inline-block");
  return css.join(";");
}

function render(options = {}) {
  const snapshot = options.preserveScroll === false ? null : captureViewState();
  const root = document.querySelector("#app");
  root.className = `portfolio-os ${state.admin.editing ? "editing" : ""}`;
  root.style = wallpaperStyle(state.settings.desktopWallpaper);
  root.innerHTML = `
    <div class="edit-banner">
      <strong>Mode edition actif</strong>
      <span>Clique directement sur les textes existants pour les modifier.</span>
      <button class="primary-button" data-action="toggle-edit">Terminer</button>
    </div>
    ${renderDesktop()}
    ${renderMobile()}
  `;
  bindEvents();
  updateClock();
  hydrateWeatherWidgets();
  if (snapshot) restoreViewState(snapshot);
}

function captureViewState() {
  const scrolls = {};
  document.querySelectorAll("[data-scroll-key]").forEach((node) => {
    scrolls[node.dataset.scrollKey] = { top: node.scrollTop, left: node.scrollLeft };
  });
  return { x: window.scrollX, y: window.scrollY, scrolls };
}

function restoreViewState(snapshot) {
  window.scrollTo(snapshot.x || 0, snapshot.y || 0);
  document.querySelectorAll("[data-scroll-key]").forEach((node) => {
    const item = snapshot.scrolls[node.dataset.scrollKey];
    if (item) {
      node.scrollTop = item.top;
      node.scrollLeft = item.left;
    }
  });
}

function wallpaperStyle(wallpaper = defaultState.settings.desktopWallpaper) {
  const value = wallpaper.value || defaultState.settings.desktopWallpaper.value;
  const background = wallpaper.type === "color" ? value : wallpaper.type === "image" ? `url("${escapeAttr(value)}") center / cover no-repeat` : value;
  return [
    `background:${background}`,
  ].join(";");
}

function renderDesktop() {
  return `
    <section class="desktop-shell">
      ${renderWallpaperVideo(state.settings.desktopWallpaper)}
      <header class="menu-bar">
        <div class="menu-left">
          <span class="apple-mark">◆</span>
          <strong>${escapeHTML(state.profile.title)}</strong>
          <span>Fichier</span>
          <span>Edition</span>
          <span>Fenetre</span>
        </div>
        <div class="menu-right">
          <span>Wi-Fi</span>
          <span>Batterie 100%</span>
          <span data-clock-short></span>
        </div>
      </header>
      <main class="desktop">
        <div class="desktop-icons">${visibleApps().map(renderAppIcon).join("")}</div>
        <aside class="desktop-widgets">${state.widgets.filter((widget) => widget.visible !== false).map((widget) => renderWidget(widget, "desktop")).join("")}</aside>
        ${state.windows.map(renderWindow).join("")}
      </main>
      <nav class="dock">${dockApps("desktop").map((app) => renderAppIcon(app, true)).join("")}</nav>
    </section>
  `;
}

function renderMobile() {
  return `
    <section class="mobile-shell ${state.mobileUnlocked ? "unlocked" : ""}" style="${wallpaperStyle(state.settings.mobileWallpaper)}">
      ${renderWallpaperVideo(state.settings.mobileWallpaper)}
      <div class="mobile-status"><span data-clock-short></span><span>5G 100%</span></div>
      <div class="lock-screen" style="${wallpaperStyle(state.settings.mobileWallpaper)}">
        <div class="lock-time" data-clock-big></div>
        <div class="notification">
          <strong>Notes</strong>
          <p>${escapeHTML(state.profile.summary)}</p>
        </div>
        <button class="unlock-hint" data-action="unlock-mobile">Deverrouiller</button>
      </div>
      <div class="home-screen">
        <div class="mobile-widgets">${mobileWidgets().map((widget) => renderWidget(widget, "mobile")).join("")}</div>
        <div class="mobile-icons">${visibleApps().map(renderAppIcon).join("")}</div>
        <nav class="mobile-dock">${dockApps("mobile").map((app) => renderAppIcon(app, true)).join("")}</nav>
      </div>
      ${state.activeMobileApp ? renderMobileApp(state.activeMobileApp) : ""}
    </section>
  `;
}

function mobileWidgets() {
  const visibleWidgets = state.widgets.filter((widget) => widget.visible !== false);
  const preferred = ["clock", "weather"]
    .map((id) => visibleWidgets.find((widget) => widget.id === id))
    .filter(Boolean);
  return [...preferred, ...visibleWidgets.filter((widget) => !preferred.includes(widget))].slice(0, 2);
}

function renderAppIcon(app, dock = false) {
  const iconStyle = appIconStyle(app);
  const iconContent = app.iconImage
    ? `<img src="${escapeAttr(app.iconImage)}" alt="" />`
    : escapeHTML(app.symbol);
  return `
    <button class="app-icon editable ${state.admin.selectedAppId === app.id ? "selected" : ""}" data-action="open-app" data-app="${app.id}" title="${app.name}">
      <span class="icon-tile" style="${iconStyle}">${iconContent}</span>
      <span class="app-label">${escapeHTML(app.name)}</span>
    </button>
  `;
}

function appIconStyle(app) {
  return [
    `background:${app.iconBackground || app.gradient}`,
    `border-radius:${Number(app.iconRadius ?? 14)}px`,
    `box-shadow:${app.iconShadow || "inset 0 1px 0 rgba(255,255,255,.34), 0 12px 28px rgba(0,0,0,.24)"}`,
    `opacity:${Number(app.iconOpacity ?? 1)}`,
    `font-size:${Number(app.iconSize ?? 27)}px`,
  ].join(";");
}

function renderWidget(widget, context = "desktop") {
  if (widget.visible === false) return "";
  const style = context === "desktop" ? widgetStyle(widget) : "";
  if (widget.type === "clock") {
    return `
      <article class="widget editable ${context === "desktop" ? "desktop-widget" : ""}" data-widget="${widget.id}" style="${style}">
        ${context === "desktop" ? widgetResizeHandle(widget) : ""}
        <h3>${escapeHTML(widget.title)}</h3>
        <div class="clock" data-clock-big></div>
        <p class="clock-date" data-clock-date></p>
        <p class="clock-zone" data-clock-zone></p>
      </article>
    `;
  }
  if (widget.type === "todo") {
    const items = widget.body.split("|").filter(Boolean);
    return `
      <article class="widget editable todo-widget ${context === "desktop" ? "desktop-widget" : ""}" data-widget="${widget.id}" style="${style}">
        ${context === "desktop" ? widgetResizeHandle(widget) : ""}
        <h3>${escapeHTML(widget.title)}</h3>
        <ul>${items.map((item, index) => {
          const key = `${widget.id}-${index}`;
          return `
            <li class="${todoChecks[key] ? "done" : ""}">
              <label>
                <input type="checkbox" data-action="toggle-todo" data-widget="${widget.id}" data-index="${index}" ${todoChecks[key] ? "checked" : ""} />
                <span>${escapeHTML(item)}</span>
              </label>
            </li>
          `;
        }).join("")}</ul>
      </article>
    `;
  }
  if (widget.type === "weather") {
    return `
      <article class="widget editable weather-widget ${context === "desktop" ? "desktop-widget" : ""}" data-widget="${widget.id}" data-weather-widget="${widget.id}" style="${style}">
        ${context === "desktop" ? widgetResizeHandle(widget) : ""}
        <h3>${escapeHTML(widget.city || widget.title || "Meteo")}</h3>
        <div class="weather-icon" data-weather-icon>--</div>
        <strong data-weather-temp>Meteo indisponible</strong>
        <p data-weather-condition></p>
        <p data-weather-minmax></p>
      </article>
    `;
  }
  return `
    <article class="widget editable ${context === "desktop" ? "desktop-widget" : ""}" data-widget="${widget.id}" style="${style}">
      ${context === "desktop" ? widgetResizeHandle(widget) : ""}
      <h3>${escapeHTML(widget.title)}</h3>
      <p>${escapeHTML(widget.body)}</p>
    </article>
  `;
}

function widgetStyle(widget) {
  const width = Number(widget.width || 330);
  const height = Number(widget.height || 118);
  const x = Number(widget.desktopX || 0);
  const y = Number(widget.desktopY || 0);
  return [
    `left:min(${x}px, calc(100% - ${width + 18}px))`,
    `top:min(${y}px, calc(100% - ${height + 18}px))`,
    `width:${width}px`,
    `min-height:${height}px`,
    `max-width:calc(100% - 36px)`,
    `max-height:calc(100% - 36px)`,
    `color:${widget.textColor || "#ffffff"}`,
    `background:${widget.backgroundColor || widget.color || "rgba(255,255,255,.16)"}`,
    `backdrop-filter:blur(${Number(widget.blur ?? 26)}px)`,
  ].join(";");
}

function widgetResizeHandle(widget) {
  return `<span class="widget-resize-handle" data-widget-resize="true" data-widget="${widget.id}" title="Redimensionner"></span>`;
}

function renderWindow(win) {
  const app = appById(win.appId);
  if (!app) return "";
  return `
    <section class="window ${win.fullscreen ? "fullscreen" : ""} ${win.minimized ? "minimized" : ""}" data-window="${win.id}" style="left:${win.x}px; top:${win.y}px; width:${win.width}px; height:${win.height}px; z-index:${win.z}">
      <header class="window-bar" data-action="drag-window" data-window="${win.id}">
        <div class="traffic">
          <button class="close" data-action="close-window" data-window="${win.id}" aria-label="Fermer"></button>
          <button class="minimize" data-action="minimize-window" data-window="${win.id}" aria-label="Reduire"></button>
          <button class="zoom" data-action="zoom-window" data-window="${win.id}" aria-label="Plein ecran"></button>
        </div>
        <div class="window-title">${escapeHTML(app.name)}</div>
      </header>
      <div class="window-body" data-scroll-key="window-body:${win.id}">${renderAppContent(app.id)}</div>
    </section>
  `;
}

function renderMobileApp(appId) {
  const app = appById(appId);
  return `
    <section class="mobile-app open">
      <div class="mobile-nav">
        <button data-action="close-mobile-app" aria-label="Retour">‹</button>
        <strong>${escapeHTML(app.name)}</strong>
        <button data-action="toggle-edit" aria-label="Edition">⋯</button>
      </div>
      ${renderAppContent(appId)}
    </section>
  `;
}

function renderAppContent(appId) {
  if (appId === "settings") return renderSettings();
  const app = appById(appId);
  return `
    <div class="app-compose" style="${appComposeStyle(app)}">
      ${renderAppHeader(app)}
      ${renderCoreAppContent(appId)}
      ${renderThemeLiveLayer(appId)}
    </div>
  `;
}

function appComposeStyle(app) {
  if (!app) return "";
  const theme = appThemeFor(app);
  return [
    `background:${theme.background}`,
    `border:${Number(theme.borderWidth || 0)}px solid ${theme.borderColor}`,
    `border-radius:${Number(theme.borderRadius || 0)}px`,
  ].join(";");
}

function renderAppHeader(app) {
  if (!app) return "";
  const theme = appThemeFor(app);
  if (!theme.headerEnabled) return "";
  const title = theme.headerTitle || app.name;
  const subtitle = theme.headerSubtitle || "Header personnalisable";
  return `
    <header class="app-custom-header" style="${appHeaderStyle(theme)}">
      ${renderHeaderMedia(theme)}
      <div class="app-header-content">
        ${inlineEditable("appTheme.headerTitle", title, "h2", app.id)}
        ${inlineEditable("appTheme.headerSubtitle", subtitle, "p", app.id)}
      </div>
    </header>
  `;
}

function appHeaderStyle(theme) {
  return [
    `min-height:${Number(theme.headerHeight || 180)}px`,
    `background:${theme.headerBackground}`,
    `color:${theme.headerTextColor}`,
    `border:${Number(theme.headerBorderWidth || 0)}px solid ${theme.headerBorderColor}`,
  ].join(";");
}

function renderHeaderMedia(theme) {
  if (!theme.headerMediaSrc || theme.headerMediaType === "none") return "";
  if (theme.headerMediaType === "video") {
    return `<video class="app-header-media" src="${escapeAttr(theme.headerMediaSrc)}" style="object-fit:${theme.headerMediaFit}" autoplay muted loop playsinline></video>`;
  }
  return `<img class="app-header-media" src="${escapeAttr(theme.headerMediaSrc)}" style="object-fit:${theme.headerMediaFit}" alt="" />`;
}

function renderCoreAppContent(appId) {
  const app = appById(appId);
  switch (appId) {
    case "contacts":
      return renderContactsApp();
    case "work":
      return renderWorkApp();
    case "education":
      return renderEducationApp();
    case "photos":
      return renderPhotosApp();
    case "safari":
      return renderSafariApp();
    case "store":
      return renderStoreApp();
    case "maps":
      return `
        <div class="app-view">
          ${inlineEditable("content.mapsTitle", state.content.mapsTitle, "h1")}
          ${inlineEditable("content.mapsBody", state.content.mapsBody, "p")}
          <div class="photo-card" style="min-height:260px;background:linear-gradient(135deg,#bfdbfe 0 20%,#86efac 20% 42%,#fde68a 42% 64%,#93c5fd 64%)">${inlineEditable("content.mapsLabel", state.content.mapsLabel)}</div>
        </div>
      `;
    case "mail":
      return renderMailApp();
    case "calendar":
      return renderCalendarApp();
    case "whatsapp":
      return renderWhatsAppApp();
    case "settings":
      return renderSettings();
    default:
      return `<div class="app-view"><h1>${app.name}</h1><p>Application prete a etre personnalisee.</p></div>`;
  }
}

function renderContactsApp() {
  const photo = state.profile.photo
    ? `<img src="${escapeAttr(state.profile.photo)}" alt="${escapeAttr(state.profile.owner)}" />`
    : escapeHTML(state.profile.owner.slice(0, 1));
  return `
    <div class="app-view contacts-app">
      <div class="profile-banner" style="background-image:url('${escapeAttr(state.profile.banner || "")}')"></div>
      <div class="profile-card">
        <div class="profile-photo editable">${photo}</div>
        <div>
          ${inlineEditable("profile.owner", state.profile.owner, "h1", "", "editable")}
          <p><strong>${inlineEditable("profile.title", state.profile.title)}</strong></p>
          ${inlineEditable("profile.summary", state.profile.summary, "p", "", "editable")}
          <div class="pill-row">
            ${inlineEditable("profile.email", state.profile.email, "span", "", "pill")}
            ${inlineEditable("profile.phone", state.profile.phone, "span", "", "pill")}
            ${inlineEditable("profile.location", state.profile.location, "span", "", "pill")}
            ${inlineEditable("profile.linkedin", state.profile.linkedin, "span", "", "pill")}
          </div>
          <div class="toolbar-row">
            ${state.profile.cv ? `<a class="ghost-link" href="${escapeAttr(state.profile.cv)}" target="_blank" rel="noreferrer">Voir le CV</a>` : `<span class="pill">CV administrable</span>`}
          </div>
        </div>
      </div>
      <section class="detail-section">
        <h3>Reseaux sociaux</h3>
        <div class="pill-row">${splitList(state.profile.socialLinks).map((item) => `<span class="pill">${escapeHTML(item)}</span>`).join("")}</div>
      </section>
    </div>
  `;
}

function renderWorkApp() {
  return `
    <div class="app-view work-app">
      ${inlineEditable("content.workTitle", state.content.workTitle, "h1")}
      ${inlineEditable("content.workIntro", state.content.workIntro, "p")}
      <div class="experience-list">${state.experiences.map((exp, index) => `
        <article class="experience-card editable">
          <div class="company-logo">${exp.logo ? `<img src="${escapeAttr(exp.logo)}" alt="" />` : escapeHTML(exp.company.slice(0, 2))}</div>
          <div>
            <div class="admin-row between">
              <div>
                <strong>${inlineEditable("experience.company", exp.company, "span", index)}</strong>
                <p>${inlineEditable("experience.period", exp.period, "span", index)} · ${inlineEditable("experience.type", exp.type, "span", index)}</p>
              </div>
              <span class="pill">${inlineEditable("experience.position", exp.position, "span", index)}</span>
            </div>
            <div class="two-column-list">
              <div>
                <h3>Activites principales</h3>
                <ul>${(exp.activities || []).slice(0, 4).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
              </div>
              <div>
                <h3>Competences acquises</h3>
                <div class="pill-row">${(exp.skills || []).map((skill) => `<span class="pill">${escapeHTML(skill)}</span>`).join("")}</div>
              </div>
            </div>
          </div>
        </article>
      `).join("")}</div>
    </div>
  `;
}

function renderPhotosApp() {
  const selected = state.projects.find((project) => project.id === state.ui.photoDetailId);
  if (selected) return renderMissionProjectDetail(selected);
  return `
    <div class="app-view">
      ${inlineEditable("content.photosTitle", state.content.photosTitle, "h1")}
      ${inlineEditable("content.photosIntro", state.content.photosIntro, "p")}
      <div class="mission-grid">${state.projects.map((project, index) => `
        <button class="mission-card editable" data-action="open-photo-detail" data-id="${project.id}">
          <img src="${escapeAttr(project.cover)}" alt="" />
          <span>${escapeHTML(project.category)}</span>
          <strong>${inlineEditable("project.title", project.title, "span", index)}</strong>
        </button>
      `).join("")}</div>
    </div>
  `;
}

function renderMissionProjectDetail(project) {
  return `
    <div class="app-view detail-view">
      <button class="ghost-button compact" data-action="close-photo-detail">Retour aux cartes</button>
      <img class="detail-hero" src="${escapeAttr(project.cover)}" alt="" />
      <div class="admin-row between">
        <div>
          <span class="pill">${escapeHTML(project.category)}</span>
          <h1>${escapeHTML(project.title)}</h1>
        </div>
      </div>
      <section class="detail-section">
        <h3>Contexte</h3>
        <p>${escapeHTML(project.context)}</p>
      </section>
      <section class="detail-section">
        <h3>Objectifs</h3>
        <p>${escapeHTML(project.objectives)}</p>
      </section>
      <section class="detail-section">
        <h3>Competences developpees</h3>
        <div class="pill-row">${(project.skills || []).map((skill) => `<span class="pill">${escapeHTML(skill)}</span>`).join("")}</div>
      </section>
      ${renderMediaStrip("Galerie photos", project.gallery, "image")}
      ${renderMediaStrip("Videos", project.videos, "video")}
      ${renderMediaStrip("Documents PDF", project.pdfs, "pdf")}
    </div>
  `;
}

function renderEducationApp() {
  return `
    <div class="app-view">
      ${inlineEditable("content.educationTitle", state.content.educationTitle, "h1")}
      <div class="timeline">${state.education.map((step, index) => `
        <article class="timeline-card editable">
          <div class="timeline-logo">${step.logo ? `<img src="${escapeAttr(step.logo)}" alt="" />` : escapeHTML(step.title.slice(0, 2))}</div>
          <div>
            <span class="pill">${inlineEditable("education.period", step.period, "span", index)} · ${inlineEditable("education.status", step.status, "span", index)}</span>
            <h2>${inlineEditable("education.title", step.title, "span", index)}</h2>
            <strong>${inlineEditable("education.organization", step.organization, "span", index)}</strong>
            ${inlineEditable("education.description", step.description, "p", index)}
            <div class="pill-row">${(step.skills || []).map((skill) => `<span class="pill">${escapeHTML(skill)}</span>`).join("")}</div>
            ${renderMediaStrip("", step.media, "image")}
          </div>
        </article>
      `).join("")}</div>
    </div>
  `;
}

function renderStoreApp() {
  const selected = state.passions.find((item) => item.id === state.ui.hobbyDetailId);
  if (selected) return renderHobbyDetail(selected);
  const categories = [...new Set(state.passions.map((item) => item.category))];
  return `
    <div class="app-view store-app">
      ${inlineEditable("content.storeTitle", state.content.storeTitle, "h1")}
      ${inlineEditable("content.storeIntro", state.content.storeIntro, "p")}
      ${categories.map((category) => `
        <section class="store-section">
          <h2>${escapeHTML(category)}</h2>
          <div class="store-list">${state.passions.filter((item) => item.category === category).map((item, index) => `
            <article class="store-row editable">
              <img src="${escapeAttr(item.image)}" alt="" />
              <div>
                <strong>${escapeHTML(item.title)}</strong>
                <p>${escapeHTML(item.description)}</p>
              </div>
              <button class="download-button" data-action="open-hobby-detail" data-id="${item.id}">Telecharger</button>
            </article>
          `).join("")}</div>
        </section>
      `).join("")}
    </div>
  `;
}

function renderHobbyDetail(item) {
  return `
    <div class="app-view detail-view">
      <button class="ghost-button compact" data-action="close-hobby-detail">Retour App Store</button>
      <img class="detail-hero" src="${escapeAttr(item.image)}" alt="" />
      <span class="pill">${escapeHTML(item.category)}</span>
      <h1>${escapeHTML(item.title)}</h1>
      <p>${escapeHTML(item.description)}</p>
      <section class="detail-section">
        <h3>Pourquoi j'aime</h3>
        <p>${escapeHTML(item.reason)}</p>
      </section>
      ${renderMediaStrip("Galerie", item.gallery, "image")}
    </div>
  `;
}

function renderSafariApp() {
  const selected = state.blogArticles.find((article) => article.id === state.ui.articleDetailId);
  if (selected) return renderArticleDetail(selected);
  return `
    <div class="app-view safari-frame">
      ${inlineEditable("content.safariUrl", state.content.safariUrl, "div", "", "address-bar")}
      ${inlineEditable("content.safariTitle", state.content.safariTitle, "h1")}
      ${inlineEditable("content.safariBody", state.content.safariBody, "p")}
      <div class="article-grid">${state.blogArticles.map((article) => `
        <button class="article-card editable" data-action="open-article-detail" data-id="${article.id}">
          <img src="${escapeAttr(article.cover)}" alt="" />
          <span>${escapeHTML(article.category)}</span>
          <strong>${escapeHTML(article.title)}</strong>
          <p>${escapeHTML(article.summary)}</p>
        </button>
      `).join("")}</div>
    </div>
  `;
}

function renderArticleDetail(article) {
  return `
    <div class="app-view safari-frame detail-view">
      <button class="ghost-button compact" data-action="close-article-detail">Retour Safari</button>
      <div class="address-bar">${escapeHTML(article.url)}</div>
      <img class="detail-hero" src="${escapeAttr(article.cover)}" alt="" />
      <span class="pill">${escapeHTML(article.category)}</span>
      <h1>${escapeHTML(article.title)}</h1>
      <p>${escapeHTML(article.summary)}</p>
      <article class="article-body">${escapeHTML(article.content).split("\n").map((line) => line ? `<p>${line}</p>` : "").join("")}</article>
      ${renderArticleBlocks(article)}
    </div>
  `;
}

function renderWhatsAppApp() {
  const approved = state.reviews.filter((review) => review.status === "valide");
  return `
    <div class="app-view whatsapp-app">
      <div class="whatsapp-header">
        <strong>Avis WhatsApp</strong>
        <span>${approved.length} avis valides</span>
      </div>
      <div class="chat-thread">
        ${approved.length ? approved.map((review) => `
          <article class="chat-bubble">
            <strong>${escapeHTML(review.firstName)} ${escapeHTML(review.lastName)}</strong>
            <span>${"★".repeat(Number(review.rating || 0))}</span>
            <p>${escapeHTML(review.message)}</p>
          </article>
        `).join("") : `<p class="muted-copy">Aucun avis valide pour le moment.</p>`}
      </div>
      <div class="review-form">
        <h3>Laisser un avis</h3>
        <div class="admin-row">
          ${renderField("Prenom", "form.review.firstName", state.forms.review.firstName)}
          ${renderField("Nom", "form.review.lastName", state.forms.review.lastName)}
          ${renderChoiceSelect("Note", "form.review.rating", state.forms.review.rating, [["", "Choisir"], ["1", "1 etoile"], ["2", "2 etoiles"], ["3", "3 etoiles"], ["4", "4 etoiles"], ["5", "5 etoiles"]])}
        </div>
        ${renderField("Message", "form.review.message", state.forms.review.message, "textarea")}
        ${state.ui.reviewStatus ? `<p class="status-copy">${escapeHTML(state.ui.reviewStatus)}</p>` : ""}
        <button class="primary-button" data-action="submit-review">Envoyer l'avis</button>
      </div>
    </div>
  `;
}

function renderMailApp() {
  return `
    <div class="app-view mail-app">
      ${inlineEditable("content.mailTitle", state.content.mailTitle, "h1")}
      ${inlineEditable("content.mailBody", state.content.mailBody, "p")}
      <div class="mail-form">
        ${renderField("Nom", "form.mail.name", state.forms.mail.name)}
        ${renderField("Email", "form.mail.email", state.forms.mail.email, "email")}
        ${renderField("Objet", "form.mail.subject", state.forms.mail.subject)}
        ${renderField("Message", "form.mail.message", state.forms.mail.message, "textarea")}
        ${state.ui.mailStatus ? `<p class="status-copy">${escapeHTML(state.ui.mailStatus)}</p>` : ""}
        <button class="primary-button" data-action="submit-mail">Envoyer le mail</button>
      </div>
      <p class="muted-copy">Connexion possible : Resend, SMTP, Mailgun ou EmailJS. Les messages sont deja enregistres dans l'administration locale.</p>
    </div>
  `;
}

function renderCalendarApp() {
  const timeOptions = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);
  return `
    <div class="app-view calendar-app">
      ${inlineEditable("content.calendarTitle", state.content.calendarTitle, "h1")}
      ${inlineEditable("content.calendarBody", state.content.calendarBody, "p")}
      <div class="calendar-form">
        <div class="admin-row">
          ${renderField("Date", "form.appointment.date", state.forms.appointment.date, "date")}
          ${renderChoiceSelect("Heure", "form.appointment.time", state.forms.appointment.time, timeOptions.map((time) => [time, time]))}
          ${renderChoiceSelect("Type", "form.appointment.type", state.forms.appointment.type, [
            ["Entretien avec le tuteur d'alternance", "Entretien avec le tuteur d'alternance"],
            ["Entretien visio", "Entretien visio"],
            ["Entretien telephonique", "Entretien telephonique"],
            ["Echange decouverte", "Echange decouverte"],
          ])}
        </div>
        <div class="admin-row">
          ${renderField("Prenom", "form.appointment.firstName", state.forms.appointment.firstName)}
          ${renderField("Nom", "form.appointment.lastName", state.forms.appointment.lastName)}
          ${renderField("Email", "form.appointment.email", state.forms.appointment.email, "email")}
        </div>
        ${renderField("Message", "form.appointment.message", state.forms.appointment.message, "textarea")}
        ${state.ui.calendarStatus ? `<p class="status-copy">${escapeHTML(state.ui.calendarStatus)}</p>` : ""}
        <button class="primary-button" data-action="submit-appointment">Envoyer la demande</button>
      </div>
    </div>
  `;
}

function renderMediaStrip(title, items = [], type = "image") {
  if (!items?.length) return "";
  return `
    <section class="detail-section media-strip">
      ${title ? `<h3>${escapeHTML(title)}</h3>` : ""}
      <div class="media-grid">${items.map((item) => {
        if (type === "video") return `<video src="${escapeAttr(item)}" controls playsinline></video>`;
        if (type === "pdf") return `<a class="pdf-card" href="${escapeAttr(item)}" target="_blank" rel="noreferrer">PDF</a>`;
        return `<img src="${escapeAttr(item)}" alt="" />`;
      }).join("")}</div>
    </section>
  `;
}

function renderArticleBlocks(article) {
  if (!article.blocks?.length) return "";
  return article.blocks.map((block) => {
    if (block.type === "image") return `<img class="detail-hero" src="${escapeAttr(block.src)}" alt="" />`;
    if (block.type === "video") return `<video class="detail-hero" src="${escapeAttr(block.src)}" controls playsinline></video>`;
    if (block.type === "pdf") return `<a class="pdf-card" href="${escapeAttr(block.src)}" target="_blank" rel="noreferrer">${escapeHTML(block.label || "Document PDF")}</a>`;
    return `<section class="detail-section"><p>${escapeHTML(block.text || "")}</p></section>`;
  }).join("");
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  return String(value || "").split("|").map((item) => item.trim()).filter(Boolean);
}

function renderThemeLiveLayer(appId) {
  const app = appById(appId);
  if (!app) return "";
  const elements = themeElementsFor(app);
  if (!elements.length) return "";
  return `
    <section class="theme-live-layer" aria-label="Elements personnalises">
      ${elements.map((element) => renderThemeElement(element, appId, false)).join("")}
    </section>
  `;
}

function inlineEditable(field, value, tag = "span", id = "", className = "") {
  const idString = String(id ?? "");
  const style = inlineStyleFor(field, id);
  const styled = hasInlineStyle(style);
  const enabled = state.admin.unlocked && (state.admin.editing || renderingBuilderPreview);
  const selected = enabled && state.admin.selectedInlineField === field && String(state.admin.selectedInlineId ?? "") === idString;
  const classes = [className, styled ? "styled-inline" : "", enabled ? "direct-editable" : "", selected ? "selected-inline" : ""]
    .filter(Boolean)
    .join(" ");
  const attrs = enabled
    ? `contenteditable="true" spellcheck="false" data-inline-field="${field}" data-id="${idString}" title="Modifier directement"`
    : "";
  const styleAttr = styled ? `style="${escapeAttr(inlineStyleText(style))}"` : "";
  return `<${tag} class="${classes}" ${attrs} ${styleAttr}>${escapeHTML(value ?? "")}</${tag}>`;
}

function renderThemeElement(element, appId, builderMode = false) {
  const selected = state.admin.selectedThemeElementId === element.id;
  const style = themeElementStyle(element);
  const attrs = builderMode
    ? `data-action="select-theme-element" data-app="${appId}" data-element="${element.id}" data-theme-drag="true"`
    : "";
  const className = `theme-element ${builderMode ? "theme-builder-element" : "theme-live-element"} ${selected ? "selected" : ""}`;
  let content = "";
  if (element.type === "image") {
    content = element.src
      ? `<img src="${escapeAttr(element.src)}" alt="${escapeAttr(element.alt || element.content || "Image")}" />`
      : `<span class="empty-media">Image</span>`;
  } else if (element.type === "video") {
    content = element.src
      ? `<video src="${escapeAttr(element.src)}" controls playsinline></video>`
      : `<span class="empty-media">Video</span>`;
  } else if (element.type === "title") {
    content = `<h2>${escapeHTML(element.content || "Titre")}</h2>`;
  } else {
    content = `<p>${escapeHTML(element.content || "Texte")}</p>`;
  }
  const resize = builderMode
    ? `<span class="theme-resize-handle" data-theme-resize="true" data-app="${appId}" data-element="${element.id}" title="Redimensionner"></span>`
    : "";
  return `<div class="${className}" style="${style}" ${attrs}>${content}${resize}</div>`;
}

function themeElementStyle(element) {
  const background = element.highlight
    ? element.highlightColor || "#fef08a"
    : element.backgroundColor || "transparent";
  return [
    `left:${Number(element.x || 0)}px`,
    `top:${Number(element.y || 0)}px`,
    `width:${Number(element.width || 220)}px`,
    `height:${Number(element.height || 90)}px`,
    `color:${element.color || "#0f172a"}`,
    `font-size:${Number(element.fontSize || 18)}px`,
    `font-weight:${element.bold ? 800 : 500}`,
    `text-decoration:${element.underline ? "underline" : "none"}`,
    `background:${background}`,
    `border:${Number(element.borderWidth || 0)}px solid ${element.borderColor || "transparent"}`,
    `border-radius:${Number(element.borderRadius ?? 12)}px`,
    `padding:${Number(element.padding ?? 10)}px`,
    `filter:blur(${Number(element.blur || 0)}px)`,
    `z-index:${Number(element.z || 1)}`,
  ].join(";");
}

function renderSettings() {
  const selected = appById(state.admin.selectedAppId) || state.apps[0];
  if (!state.admin.unlocked) {
    return `
      <div class="app-view admin-login">
        <div class="lock-card">
          <span class="lock-icon">⌘</span>
          <h1>Acces administrateur</h1>
          <p>Entre le code admin pour modifier le portfolio, les apps, les widgets et les contenus.</p>
          <div class="field">
            <label>Code d'acces</label>
            <input data-field="admin.codeInput" type="password" inputmode="numeric" placeholder="Code admin" autocomplete="current-password" />
          </div>
          ${state.admin.loginError ? `<p class="form-error">${state.admin.loginError}</p>` : ""}
          <button class="primary-button" data-action="admin-login">Deverrouiller</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="app-view settings-grid">
      <aside class="settings-list">
        <button data-action="admin-logout">Verrouiller admin</button>
        <button data-action="toggle-edit">${state.admin.editing ? "Desactiver edition visuelle" : "Activer edition visuelle"}</button>
        ${renderAdminTab("profile", "Profil")}
        ${renderAdminTab("apps", "Applications")}
        ${renderAdminTab("builder", "Constructeur")}
        ${renderAdminTab("widgets", "Widgets")}
        ${renderAdminTab("content", "Contenus")}
        ${renderAdminTab("reviews", "Avis WhatsApp")}
        ${renderAdminTab("messages", "Messages")}
        ${renderAdminTab("appointments", "Rendez-vous")}
        ${renderAdminTab("wallpapers", "Fonds")}
        ${renderAdminTab("security", "Acces")}
      </aside>
      <section>
        <h1>Reglages</h1>
        <p>Admin actif. Toutes les modifications sont sauvegardees automatiquement dans ce navigateur et pretes a etre reliees a Supabase.</p>
        ${renderAdminSection(selected)}
      </section>
    </div>
  `;
}

function renderAdminTab(section, label) {
  const active = state.admin.selectedSection === section ? "active" : "";
  return `<button class="${active}" data-action="select-section" data-section="${section}">${label}</button>`;
}

function renderAdminSection(selected) {
  if (state.admin.selectedSection === "apps") return renderAppsAdmin(selected);
  if (state.admin.selectedSection === "builder") {
    const builderApp = selected.id === "settings" ? state.apps.find((app) => app.id !== "settings") || selected : selected;
    state.admin.selectedAppId = builderApp.id;
    return renderThemeBuilderAdmin(builderApp);
  }
  if (state.admin.selectedSection === "widgets") return renderWidgetsAdmin();
  if (state.admin.selectedSection === "content") return renderContentAdmin();
  if (state.admin.selectedSection === "reviews") return renderReviewsAdmin();
  if (state.admin.selectedSection === "messages") return renderMessagesAdmin();
  if (state.admin.selectedSection === "appointments") return renderAppointmentsAdmin();
  if (state.admin.selectedSection === "wallpapers") return renderWallpapersAdmin();
  if (state.admin.selectedSection === "security") return renderSecurityAdmin();
  return renderProfileAdmin();
}

function renderProfileAdmin() {
  return `
    <div class="admin-panel">
      <h2>Profil Contacts</h2>
      ${state.ui.uploadStatus ? `<p class="admin-status">${escapeHTML(state.ui.uploadStatus)}</p>` : ""}
      <div class="admin-row">
        <div class="field">
          <label>Importer photo de profil</label>
          <input type="file" data-file="profile.photo" accept="${ACCEPT_IMAGE}" />
        </div>
        <div class="field">
          <label>Importer banniere</label>
          <input type="file" data-file="profile.banner" accept="${ACCEPT_MEDIA}" />
        </div>
        <div class="field">
          <label>Importer CV</label>
          <input type="file" data-file="profile.cv" accept="${ACCEPT_PDF}" />
        </div>
      </div>
      ${renderField("Nom du proprietaire", "profile.owner", state.profile.owner)}
      ${renderField("Titre du portfolio", "profile.title", state.profile.title)}
      ${renderField("Email", "profile.email", state.profile.email)}
      ${renderField("Telephone", "profile.phone", state.profile.phone)}
      ${renderField("Localisation", "profile.location", state.profile.location)}
      ${renderField("LinkedIn", "profile.linkedin", state.profile.linkedin)}
      ${renderField("CV URL / fichier importe", "profile.cv", state.profile.cv)}
      ${renderField("Reseaux sociaux (separes par |)", "profile.socialLinks", state.profile.socialLinks)}
      ${renderField("Presentation", "profile.summary", state.profile.summary, "textarea")}
    </div>
  `;
}

function renderAppsAdmin(selected) {
  return `
    <div class="admin-panel">
      <div class="admin-row between">
        <h2>Applications</h2>
        <button class="primary-button" data-action="new-app">Ajouter une app</button>
      </div>
      <div class="admin-app-picker">
        ${state.apps.map((app) => `
          <button class="${selected.id === app.id ? "active" : ""}" data-action="select-app" data-app="${app.id}">
            <span class="mini-icon" style="background:${app.gradient}">${escapeHTML(app.symbol)}</span>
            ${escapeHTML(app.name)}
          </button>
        `).join("")}
      </div>
      <h3>Application selectionnee</h3>
      ${renderField("Nom", "app.name", selected.name, "text", selected.id)}
      ${renderField("Symbole / icone texte", "app.symbol", selected.symbol, "text", selected.id)}
      ${renderField("Couleur CSS", "app.gradient", selected.gradient, "text", selected.id)}
      ${renderField("Couleur de fond icone", "app.iconBackground", selected.iconBackground || selected.gradient, "text", selected.id)}
      ${renderField("Image icone", "app.iconImage", selected.iconImage || "", "text", selected.id)}
      <div class="field">
        <label>Importer image icone</label>
        <input type="file" data-file="app.iconImage" data-id="${selected.id}" accept="${ACCEPT_IMAGE}" />
      </div>
      <div class="admin-row">
        ${renderField("Taille icone", "app.iconSize", selected.iconSize ?? 27, "number", selected.id)}
        ${renderField("Arrondi", "app.iconRadius", selected.iconRadius ?? 14, "number", selected.id)}
        ${renderField("Opacite", "app.iconOpacity", selected.iconOpacity ?? 1, "number", selected.id)}
      </div>
      <div class="admin-row">
        ${renderSelect("Dans le dock", "app.dock", selected.dock, selected.id)}
        ${renderSelect("Dans le dock mobile (4 max)", "app.mobileDock", selected.mobileDock, selected.id)}
        ${renderSelect("Visible", "app.visible", selected.visible, selected.id)}
      </div>
      <div class="toolbar-row">
        <button class="ghost-button" data-action="duplicate-app" data-app="${selected.id}">Dupliquer</button>
        <button class="danger-button" data-action="delete-app" data-app="${selected.id}" ${selected.id === "settings" ? "disabled" : ""}>Supprimer</button>
      </div>
    </div>
  `;
}

function renderThemeBuilderAdmin(selected) {
  const elements = themeElementsFor(selected);
  const theme = appThemeFor(selected);
  const active = state.admin.selectedThemeElementId ? selectedThemeElement(selected.id) : null;
  const inlineSelection = active ? null : selectedInlineStyle();
  return `
    <div class="admin-panel theme-builder-panel">
      <div class="admin-row between">
        <div>
          <h2>Constructeur de theme</h2>
          <p>${escapeHTML(selected.name)}</p>
        </div>
        <div class="toolbar-row">
          <button class="primary-button compact" data-action="add-theme-element" data-type="title">Titre</button>
          <button class="primary-button compact" data-action="add-theme-element" data-type="text">Texte</button>
          <button class="primary-button compact" data-action="add-theme-element" data-type="image">Image</button>
          <button class="primary-button compact" data-action="add-theme-element" data-type="video">Video</button>
        </div>
      </div>
      <div class="admin-app-picker">
        ${state.apps.filter((app) => app.id !== "settings").map((app) => `
          <button class="${selected.id === app.id ? "active" : ""}" data-action="select-builder-app" data-app="${app.id}">
            <span class="mini-icon" style="background:${app.gradient}">${escapeHTML(app.symbol)}</span>
            ${escapeHTML(app.name)}
          </button>
        `).join("")}
      </div>
      ${renderAppThemeEditor(selected, theme)}
      <div class="theme-builder-layout">
        <section class="theme-canvas-wrap">
          <div class="theme-canvas" data-app="${selected.id}">
            ${renderBuilderBasePreview(selected)}
            ${elements.map((element) => renderThemeElement(element, selected.id, true)).join("")}
          </div>
        </section>
        <aside class="theme-props">
          ${active ? renderThemeElementEditor(active, selected.id) : inlineSelection ? renderInlineStyleEditor(inlineSelection) : renderThemeBuilderEmptyState()}
        </aside>
      </div>
    </div>
  `;
}

function renderBuilderBasePreview(app) {
  renderingBuilderPreview = true;
  const header = renderAppHeader(app);
  const content = renderCoreAppContent(app.id);
  renderingBuilderPreview = false;
  return `
    <div class="theme-base-preview" data-scroll-key="theme-base-preview:${app.id}" style="${appComposeStyle(app)}">
      ${header}
      ${content}
    </div>
  `;
}

function renderAppThemeEditor(app, theme) {
  return `
    <details class="theme-section" open>
      <summary>Theme global et header</summary>
      <div class="admin-row">
        ${renderField("Fond application", "appTheme.background", theme.background, "color", app.id)}
        ${renderField("Bordure application", "appTheme.borderColor", theme.borderColor, "color", app.id)}
        ${renderField("Epaisseur bordure", "appTheme.borderWidth", theme.borderWidth, "number", app.id)}
        ${renderField("Rayon bordure", "appTheme.borderRadius", theme.borderRadius, "number", app.id)}
      </div>
      <div class="admin-row">
        ${renderSelect("Header actif", "appTheme.headerEnabled", theme.headerEnabled, app.id)}
        ${renderField("Hauteur header", "appTheme.headerHeight", theme.headerHeight, "number", app.id)}
        ${renderField("Fond header", "appTheme.headerBackground", theme.headerBackground, "color", app.id)}
        ${renderField("Texte header", "appTheme.headerTextColor", theme.headerTextColor, "color", app.id)}
      </div>
      <div class="admin-row">
        ${renderField("Titre header", "appTheme.headerTitle", theme.headerTitle || app.name, "text", app.id)}
        ${renderField("Sous-titre header", "appTheme.headerSubtitle", theme.headerSubtitle, "text", app.id)}
      </div>
      <div class="admin-row">
        ${renderChoiceSelect("Media header", "appTheme.headerMediaType", theme.headerMediaType, [["none", "Aucun"], ["image", "Image"], ["video", "Video"]], app.id)}
        ${renderChoiceSelect("Cadrage", "appTheme.headerMediaFit", theme.headerMediaFit, [["cover", "Remplir"], ["contain", "Contenir"], ["fill", "Etirer"]], app.id)}
        ${renderField("Bordure header", "appTheme.headerBorderColor", theme.headerBorderColor, "color", app.id)}
        ${renderField("Epaisseur header", "appTheme.headerBorderWidth", theme.headerBorderWidth, "number", app.id)}
      </div>
      ${renderField("URL image/video header", "appTheme.headerMediaSrc", theme.headerMediaSrc, "text", app.id)}
      <div class="field">
        <label>Importer image/video header</label>
        <input type="file" data-file="appTheme.headerMediaSrc" data-id="${app.id}" accept="${ACCEPT_MEDIA}" />
      </div>
    </details>
  `;
}

function renderThemeElementEditor(element, appId) {
  const isMedia = ["image", "video"].includes(element.type);
  return `
    <h3>Element selectionne</h3>
    <div class="pill-row">
      <span class="pill">${escapeHTML(element.type)}</span>
      <span class="pill">x ${Number(element.x || 0)} · y ${Number(element.y || 0)}</span>
    </div>
    ${!isMedia ? renderField("Texte", "theme.content", element.content, "textarea", element.id) : renderField("Legende", "theme.content", element.content, "text", element.id)}
    ${isMedia ? `
      ${renderField("URL image/video", "theme.src", element.src, "text", element.id)}
      <div class="field">
        <label>Importer un fichier</label>
        <input type="file" data-file="theme.src" data-id="${element.id}" accept="${element.type === "image" ? ACCEPT_IMAGE : ACCEPT_VIDEO}" />
      </div>
      ${renderField("Texte alternatif", "theme.alt", element.alt, "text", element.id)}
    ` : ""}
    <div class="admin-row">
      ${renderField("X", "theme.x", element.x, "number", element.id)}
      ${renderField("Y", "theme.y", element.y, "number", element.id)}
      ${renderField("Largeur", "theme.width", element.width, "number", element.id)}
      ${renderField("Hauteur", "theme.height", element.height, "number", element.id)}
    </div>
    <div class="admin-row">
      ${renderField("Taille texte", "theme.fontSize", element.fontSize, "number", element.id)}
      ${renderField("Couleur texte", "theme.color", element.color, "color", element.id)}
      ${renderField("Fond bloc", "theme.backgroundColor", element.backgroundColor, "color", element.id)}
      ${renderField("Couleur surlignage", "theme.highlightColor", element.highlightColor, "color", element.id)}
      ${renderField("Flou", "theme.blur", element.blur, "number", element.id)}
    </div>
    <div class="admin-row">
      ${renderSelect("Gras", "theme.bold", element.bold, element.id)}
      ${renderSelect("Souligner", "theme.underline", element.underline, element.id)}
      ${renderSelect("Surligner", "theme.highlight", element.highlight, element.id)}
    </div>
    <div class="admin-row">
      ${renderField("Bordure bloc", "theme.borderColor", element.borderColor, "color", element.id)}
      ${renderField("Epaisseur bordure", "theme.borderWidth", element.borderWidth, "number", element.id)}
      ${renderField("Rayon bordure", "theme.borderRadius", element.borderRadius, "number", element.id)}
      ${renderField("Marge interne", "theme.padding", element.padding, "number", element.id)}
    </div>
    <div class="toolbar-row">
      <button class="ghost-button" data-action="duplicate-theme-element" data-app="${appId}" data-element="${element.id}">Dupliquer</button>
      <button class="danger-button" data-action="delete-theme-element" data-app="${appId}" data-element="${element.id}">Supprimer</button>
    </div>
  `;
}

function renderInlineStyleEditor(selection) {
  const style = selection.style;
  return `
    <h3>Element existant</h3>
    <p class="muted-copy">${escapeHTML(selection.label)}</p>
    <div class="pill-row">
      <span class="pill">contenu deja defini</span>
      <span class="pill">style sauvegarde</span>
    </div>
    <div class="admin-row">
      ${renderField("Taille texte", "inlineStyle.fontSize", style.fontSize || "", "number", selection.key)}
      ${renderField("Couleur texte", "inlineStyle.color", style.color || "#0f172a", "color", selection.key)}
      ${renderField("Fond zone", "inlineStyle.backgroundColor", style.backgroundColor || "#ffffff", "color", selection.key)}
    </div>
    <div class="admin-row">
      ${renderField("Largeur zone", "inlineStyle.width", style.width || "", "number", selection.key)}
      ${renderField("Hauteur zone", "inlineStyle.minHeight", style.minHeight || "", "number", selection.key)}
      ${renderField("Marge interne", "inlineStyle.padding", style.padding || "", "number", selection.key)}
    </div>
    <div class="admin-row">
      ${renderField("Couleur bordure", "inlineStyle.borderColor", style.borderColor || "#cbd5e1", "color", selection.key)}
      ${renderField("Epaisseur bordure", "inlineStyle.borderWidth", style.borderWidth || "", "number", selection.key)}
      ${renderField("Rayon bordure", "inlineStyle.borderRadius", style.borderRadius || "", "number", selection.key)}
    </div>
    <div class="admin-row">
      ${renderSelect("Gras", "inlineStyle.bold", style.bold, selection.key)}
      ${renderSelect("Souligner", "inlineStyle.underline", style.underline, selection.key)}
    </div>
    <div class="toolbar-row">
      <button class="ghost-button" data-action="reset-inline-style" data-style-key="${escapeAttr(selection.key)}">Retirer le style</button>
    </div>
  `;
}

function renderThemeBuilderEmptyState() {
  return `
    <h3>Selection</h3>
    <p>Choisis un titre, un texte ou un champ deja visible dans l'aperçu pour modifier sa taille, sa couleur, son fond et ses bordures.</p>
    <p>Tu peux aussi ajouter un nouveau titre, texte, image ou video avec les boutons du constructeur.</p>
  `;
}

function renderWidgetsAdmin() {
  return `
    <div class="admin-panel">
      <div class="admin-row between">
        <h2>Widgets</h2>
        <button class="primary-button" data-action="new-widget">Ajouter un widget</button>
      </div>
      <div class="admin-stack">
        ${state.widgets.map((widget, index) => `
          <article class="admin-editor">
            <div class="admin-row between">
              <strong>${escapeHTML(widget.title)}</strong>
              <div class="toolbar-row">
                <button class="ghost-button compact" data-action="duplicate-widget" data-index="${index}">Dupliquer</button>
                <button class="danger-button compact" data-action="delete-widget" data-index="${index}">Supprimer</button>
              </div>
            </div>
            ${renderField("Titre", "widget.title", widget.title, "text", index)}
            ${renderField("Contenu", "widget.body", widget.body, "textarea", index)}
            ${renderWidgetType(widget.type, index)}
            <div class="admin-row">
              ${renderSelect("Visible", "widget.visible", widget.visible !== false, index)}
              ${renderField("Position X desktop", "widget.desktopX", widget.desktopX || 0, "number", index)}
              ${renderField("Position Y desktop", "widget.desktopY", widget.desktopY || 0, "number", index)}
              ${renderField("Largeur", "widget.width", widget.width || 330, "number", index)}
              ${renderField("Hauteur", "widget.height", widget.height || 118, "number", index)}
            </div>
            <div class="admin-row">
              ${renderField("Couleur fond", "widget.backgroundColor", widget.backgroundColor || widget.color || "rgba(255,255,255,0.16)", "text", index)}
              ${renderField("Couleur texte", "widget.textColor", widget.textColor || "#ffffff", "color", index)}
              ${renderField("Flou", "widget.blur", widget.blur ?? 26, "number", index)}
            </div>
            ${widget.type === "clock" ? `
              <div class="admin-row">
                ${renderSelect("Afficher date", "widget.showDate", widget.showDate !== false, index)}
                ${renderSelect("Afficher fuseau", "widget.showTimezone", widget.showTimezone !== false, index)}
              </div>
            ` : ""}
            ${widget.type === "weather" ? `
              <div class="admin-row">
                ${renderField("Ville", "widget.city", widget.city || "Paris", "text", index)}
                ${renderField("Latitude", "widget.latitude", widget.latitude ?? 48.8566, "number", index)}
                ${renderField("Longitude", "widget.longitude", widget.longitude ?? 2.3522, "number", index)}
                ${renderChoiceSelect("Unite", "widget.unit", widget.unit || "celsius", [["celsius", "Celsius"], ["fahrenheit", "Fahrenheit"]], index)}
                ${renderSelect("Geolocalisation", "widget.useGeolocation", widget.useGeolocation !== false, index)}
                ${renderSelect("Min / Max", "widget.showMinMax", widget.showMinMax !== false, index)}
                ${renderSelect("Effet verre", "widget.useGlass", widget.useGlass !== false, index)}
              </div>
            ` : ""}
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderContentAdmin() {
  return `
    <div class="admin-panel">
      <h2>Contenus des applications</h2>
      <h3>France Travail</h3>
      ${renderField("Titre", "content.workTitle", state.content.workTitle)}
      ${renderField("Introduction", "content.workIntro", state.content.workIntro, "textarea")}
      ${renderWorkExperienceEditors()}
      <h3>Parcours+</h3>
      ${renderField("Titre", "content.educationTitle", state.content.educationTitle)}
      ${renderEducationTimelineEditors()}
      <h3>Photos</h3>
      ${renderField("Titre", "content.photosTitle", state.content.photosTitle)}
      ${renderField("Introduction", "content.photosIntro", state.content.photosIntro, "textarea")}
      ${renderMissionProjectEditors()}
      <h3>Safari</h3>
      ${renderField("URL racine fictive", "content.safariUrl", state.content.safariUrl)}
      ${renderField("Titre", "content.safariTitle", state.content.safariTitle)}
      ${renderField("Introduction", "content.safariBody", state.content.safariBody, "textarea")}
      ${renderArticleEditors()}
      <h3>App Store</h3>
      ${renderField("Titre App Store", "content.storeTitle", state.content.storeTitle)}
      ${renderField("Texte App Store", "content.storeIntro", state.content.storeIntro, "textarea")}
      ${renderHobbyEditors()}
      <h3>Plans, Mail, Calendrier</h3>
      ${renderField("Titre Plans", "content.mapsTitle", state.content.mapsTitle)}
      ${renderField("Texte Plans", "content.mapsBody", state.content.mapsBody, "textarea")}
      ${renderField("Label carte", "content.mapsLabel", state.content.mapsLabel)}
      ${renderField("Titre Mail", "content.mailTitle", state.content.mailTitle)}
      ${renderField("Texte Mail", "content.mailBody", state.content.mailBody, "textarea")}
      ${renderField("Titre Calendrier", "content.calendarTitle", state.content.calendarTitle)}
      ${renderField("Texte Calendrier", "content.calendarBody", state.content.calendarBody, "textarea")}
    </div>
  `;
}

function renderWorkExperienceEditors() {
  return renderCollectionEditors("Experiences", "experience", state.experiences, [
    ["company", "Entreprise"],
    ["period", "Periode"],
    ["type", "Type"],
    ["position", "Poste"],
    ["activities", "Activites principales (separees par |)", "textarea"],
    ["skills", "Competences (separees par |)", "textarea"],
    ["logo", "Logo URL"],
  ], "experience.logo", ACCEPT_IMAGE);
}

function renderMissionProjectEditors() {
  return renderCollectionEditors("Missions et projets", "project", state.projects, [
    ["title", "Titre"],
    ["category", "Categorie"],
    ["cover", "Image couverture URL"],
    ["context", "Contexte", "textarea"],
    ["objectives", "Objectifs", "textarea"],
    ["skills", "Competences (separees par |)", "textarea"],
    ["gallery", "Galerie images URL/data (separees par |)", "textarea"],
    ["videos", "Videos URL/data (separees par |)", "textarea"],
    ["pdfs", "PDF URL/data (separes par |)", "textarea"],
  ], "project.cover", ACCEPT_MEDIA_PDF);
}

function renderEducationTimelineEditors() {
  return renderCollectionEditors("Chronologie scolaire", "education", state.education, [
    ["title", "Nom"],
    ["organization", "Etablissement / organisme"],
    ["period", "Periode"],
    ["status", "Statut / mention"],
    ["logo", "Logo URL"],
    ["description", "Description", "textarea"],
    ["skills", "Competences (separees par |)", "textarea"],
    ["media", "Medias (separes par |)", "textarea"],
  ], "education.logo", ACCEPT_MEDIA_PDF);
}

function renderHobbyEditors() {
  return renderCollectionEditors("Loisirs et passions", "passion", state.passions, [
    ["title", "Titre"],
    ["category", "Categorie"],
    ["image", "Image URL"],
    ["description", "Description", "textarea"],
    ["reason", "Pourquoi j'aime", "textarea"],
    ["gallery", "Galerie optionnelle (separee par |)", "textarea"],
  ], "passion.image", ACCEPT_IMAGE);
}

function renderArticleEditors() {
  return renderCollectionEditors("Articles Safari", "article", state.blogArticles, [
    ["url", "URL fictive"],
    ["title", "Titre"],
    ["category", "Categorie"],
    ["summary", "Resume", "textarea"],
    ["cover", "Image couverture URL"],
    ["content", "Contenu", "textarea"],
  ], "article.cover", ACCEPT_MEDIA_PDF);
}

function renderCollectionEditors(title, type, items, fields, fileField = "", accept = ACCEPT_IMAGE) {
  return `
    <div class="admin-row between">
      <strong>${title}</strong>
      <button class="ghost-button compact" data-action="add-list-item" data-list="${type}">Ajouter</button>
    </div>
    <div class="admin-stack">
      ${items.map((item, index) => `
        <article class="admin-editor">
          <div class="admin-row between">
            <strong>${escapeHTML(item.title || item.company || `${title} ${index + 1}`)}</strong>
            <div class="toolbar-row">
              <button class="ghost-button compact" data-action="move-list-item" data-list="${type}" data-index="${index}" data-direction="-1">Monter</button>
              <button class="ghost-button compact" data-action="move-list-item" data-list="${type}" data-index="${index}" data-direction="1">Descendre</button>
              <button class="danger-button compact" data-action="delete-list-item" data-list="${type}" data-index="${index}">Supprimer</button>
            </div>
          </div>
          ${fileField ? `
            <div class="field">
              <label>Importer media principal</label>
              <input type="file" data-file="${fileField}" data-id="${index}" accept="${accept}" />
            </div>
          ` : ""}
          ${type === "project" ? `
            <div class="admin-row">
              <div class="field"><label>Ajouter image galerie</label><input type="file" data-file="project.gallery" data-id="${index}" accept="${ACCEPT_IMAGE}" multiple /></div>
              <div class="field"><label>Ajouter video</label><input type="file" data-file="project.videos" data-id="${index}" accept="${ACCEPT_VIDEO}" multiple /></div>
              <div class="field"><label>Ajouter PDF</label><input type="file" data-file="project.pdfs" data-id="${index}" accept="${ACCEPT_PDF}" multiple /></div>
            </div>
          ` : ""}
          ${type === "education" ? `<div class="field"><label>Ajouter media a l'etape</label><input type="file" data-file="education.media" data-id="${index}" accept="${ACCEPT_MEDIA_PDF}" multiple /></div>` : ""}
          ${type === "article" ? `<div class="field"><label>Ajouter bloc image/video/PDF</label><input type="file" data-file="article.block" data-id="${index}" accept="${ACCEPT_MEDIA_PDF}" multiple /></div>` : ""}
          ${type === "passion" ? `<div class="field"><label>Ajouter image galerie</label><input type="file" data-file="passion.gallery" data-id="${index}" accept="${ACCEPT_IMAGE}" multiple /></div>` : ""}
          ${fields.map(([key, label, kind]) => renderField(label, `${type}.${key}`, Array.isArray(item[key]) ? item[key].join("|") : item[key], kind || "text", index)).join("")}
        </article>
      `).join("")}
    </div>
  `;
}

function renderSecurityAdmin() {
  return `
    <div class="admin-panel">
      <h2>Acces admin</h2>
      <p>Change le code d'acces utilise dans l'application Reglages.</p>
      ${renderField("Nouveau code", "admin.code", state.admin.code, "password")}
      <h3>Connexion Supabase</h3>
      <p>Ajoute l'URL du projet et la cle anon publique. Le site garde le mode localStorage si Supabase n'est pas active.</p>
      <div class="admin-row">
        ${renderSelect("Activer Supabase", "settings.useSupabase", state.settings.useSupabase)}
        ${renderField("URL Supabase", "settings.supabaseUrl", state.settings.supabaseUrl || "", "url")}
      </div>
      ${renderField("Cle anon publique", "settings.supabaseAnonKey", state.settings.supabaseAnonKey || "", "password")}
      <div class="toolbar-row">
        <button class="ghost-button" data-action="test-supabase">Tester Supabase</button>
        <button class="primary-button" data-action="sync-supabase">Synchroniser vers Supabase</button>
        <button class="ghost-button" data-action="pull-supabase">Recuperer depuis Supabase</button>
      </div>
      <p class="muted-copy">Statut : ${escapeHTML(state.settings.supabaseStatus || "Non connecte")}${state.settings.supabaseLastSync ? ` · Derniere sync : ${escapeHTML(state.settings.supabaseLastSync)}` : ""}</p>
      <h3>Connexion GitHub</h3>
      <p>Ajoute l'URL du repository GitHub, puis utilise les commandes indiquees dans le README pour publier le projet.</p>
      ${renderField("Remote GitHub", "settings.githubRemote", state.settings.githubRemote || "", "url")}
      <div class="toolbar-row">
        <button class="ghost-button" data-action="reset-state">Reinitialiser le portfolio</button>
      </div>
    </div>
  `;
}

function renderReviewsAdmin() {
  return `
    <div class="admin-panel">
      <h2>Avis WhatsApp</h2>
      <div class="admin-stack">${state.reviews.length ? state.reviews.map((review) => `
        <article class="admin-editor">
          <div class="admin-row between">
            <strong>${escapeHTML(review.firstName)} ${escapeHTML(review.lastName)} · ${"★".repeat(Number(review.rating || 0))}</strong>
            <span class="pill">${escapeHTML(review.status)}</span>
          </div>
          <p>${escapeHTML(review.message)}</p>
          <p class="muted-copy">${escapeHTML(review.date)}</p>
          <div class="toolbar-row">
            <button class="ghost-button compact" data-action="review-status" data-id="${review.id}" data-status="valide">Valider</button>
            <button class="ghost-button compact" data-action="review-status" data-id="${review.id}" data-status="refuse">Refuser</button>
            <button class="danger-button compact" data-action="delete-review" data-id="${review.id}">Supprimer</button>
          </div>
        </article>
      `).join("") : `<p>Aucun avis pour le moment.</p>`}</div>
    </div>
  `;
}

function renderMessagesAdmin() {
  return `
    <div class="admin-panel">
      <h2>Messages Mail</h2>
      <p>Adresse admin cible preparee : ${escapeHTML(state.settings.adminEmail)}. Connexion possible via Resend, SMTP, Mailgun ou EmailJS.</p>
      ${renderField("Adresse email administrateur", "settings.adminEmail", state.settings.adminEmail)}
      <div class="admin-stack">${state.contactMessages.length ? state.contactMessages.map((message) => `
        <article class="admin-editor ${message.read ? "" : "unread"}">
          <div class="admin-row between">
            <strong>${escapeHTML(message.subject)}</strong>
            <span class="pill">${message.read ? "Lu" : "Non lu"}</span>
          </div>
          <p><strong>${escapeHTML(message.name)}</strong> · ${escapeHTML(message.email)}</p>
          <p>${escapeHTML(message.message)}</p>
          <p class="muted-copy">${escapeHTML(message.date)}</p>
          <div class="toolbar-row">
            <button class="ghost-button compact" data-action="message-read" data-id="${message.id}">Marquer comme lu</button>
            <button class="danger-button compact" data-action="delete-message" data-id="${message.id}">Supprimer</button>
          </div>
        </article>
      `).join("") : `<p>Aucun message recu.</p>`}</div>
    </div>
  `;
}

function renderAppointmentsAdmin() {
  return `
    <div class="admin-panel">
      <h2>Demandes Calendrier</h2>
      <div class="admin-stack">${state.appointments.length ? state.appointments.map((appointment) => `
        <article class="admin-editor">
          <div class="admin-row between">
            <strong>${escapeHTML(appointment.firstName)} ${escapeHTML(appointment.lastName)} · ${escapeHTML(appointment.date)} ${escapeHTML(appointment.time)}</strong>
            <span class="pill">${escapeHTML(appointment.status)}</span>
          </div>
          <p>${escapeHTML(appointment.type)} · ${escapeHTML(appointment.email)}</p>
          <p>${escapeHTML(appointment.message || "Aucun message")}</p>
          <p class="muted-copy">Envoye le ${escapeHTML(appointment.dateSent)}</p>
          <div class="toolbar-row">
            <button class="ghost-button compact" data-action="appointment-status" data-id="${appointment.id}" data-status="Accepte">Accepter</button>
            <button class="ghost-button compact" data-action="appointment-status" data-id="${appointment.id}" data-status="Refuse">Refuser</button>
            <button class="ghost-button compact" data-action="appointment-status" data-id="${appointment.id}" data-status="Reprogramme">Reprogrammer</button>
            <button class="danger-button compact" data-action="delete-appointment" data-id="${appointment.id}">Supprimer</button>
          </div>
        </article>
      `).join("") : `<p>Aucune demande pour le moment.</p>`}</div>
    </div>
  `;
}

function renderWallpapersAdmin() {
  return `
    <div class="admin-panel">
      <h2>Fonds d'ecran</h2>
      ${renderWallpaperEditor("desktop", "Fond desktop", state.settings.desktopWallpaper)}
      ${renderWallpaperEditor("mobile", "Fond mobile", state.settings.mobileWallpaper)}
    </div>
  `;
}

function renderWallpaperEditor(target, label, wallpaper) {
  return `
    <article class="admin-editor">
      <h3>${label}</h3>
      <div class="wallpaper-preview" style="${wallpaperStyle(wallpaper)}"></div>
      <div class="admin-row">
        ${renderChoiceSelect("Type", `wallpaper.${target}.type`, wallpaper.type, [["gradient", "Degrade"], ["color", "Couleur"], ["image", "Image"], ["video", "Video"]])}
        ${renderField("Valeur CSS / URL", `wallpaper.${target}.value`, wallpaper.value, "text")}
        <div class="field">
          <label>Importer image/video</label>
          <input type="file" data-file="wallpaper.${target}" accept="${ACCEPT_MEDIA}" />
        </div>
      </div>
      <div class="admin-row">
        ${renderField("Flou", `wallpaper.${target}.blur`, wallpaper.blur, "number")}
        ${renderField("Luminosite", `wallpaper.${target}.brightness`, wallpaper.brightness, "number")}
        ${renderField("Contraste", `wallpaper.${target}.contrast`, wallpaper.contrast, "number")}
        ${renderField("Saturation", `wallpaper.${target}.saturation`, wallpaper.saturation, "number")}
        ${renderField("Opacite", `wallpaper.${target}.opacity`, wallpaper.opacity, "number")}
        ${renderField("Zoom", `wallpaper.${target}.zoom`, wallpaper.zoom, "number")}
      </div>
      <div class="admin-row">
        ${renderField("Couleur overlay", `wallpaper.${target}.overlayColor`, wallpaper.overlayColor, "text")}
        ${renderSelect("Effet verre Apple", `wallpaper.${target}.glass`, wallpaper.glass)}
      </div>
    </article>
  `;
}

function renderListEditors(title, type, items, fields) {
  return `
    <div class="admin-row between">
      <strong>${title}</strong>
      <button class="ghost-button compact" data-action="add-list-item" data-list="${type}">Ajouter</button>
    </div>
    <div class="admin-stack">
      ${items.map((item, index) => `
        <article class="admin-editor">
          <div class="admin-row between">
            <strong>${escapeHTML(item[fields[0][0]] || `${title} ${index + 1}`)}</strong>
            <button class="danger-button compact" data-action="delete-list-item" data-list="${type}" data-index="${index}">Supprimer</button>
          </div>
          ${fields.map(([key, label, kind]) => renderField(label, `${type}.${key}`, item[key], kind || "text", index)).join("")}
        </article>
      `).join("")}
    </div>
  `;
}

function renderPassionsAdmin() {
  return `
    <div class="admin-row between">
      <strong>Passions</strong>
      <button class="ghost-button compact" data-action="add-list-item" data-list="passion">Ajouter</button>
    </div>
    <div class="admin-stack">
      ${state.passions.map((passion, index) => `
        <article class="admin-editor">
          <div class="admin-row between">
            ${renderField(`Passion ${index + 1}`, "passion.value", passion, "text", index)}
            <button class="danger-button compact" data-action="delete-list-item" data-list="passion" data-index="${index}">Supprimer</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderField(label, field, value, type = "text", id = "") {
  const safeValue = value ?? "";
  if (type === "textarea") {
    return `
      <div class="field">
        <label>${label}</label>
        <textarea data-field="${field}" data-id="${id}">${escapeHTML(safeValue)}</textarea>
      </div>
    `;
  }
  return `
    <div class="field">
      <label>${label}</label>
      <input data-field="${field}" data-id="${id}" type="${type}" value="${escapeAttr(safeValue)}" />
    </div>
  `;
}

function renderSelect(label, field, value, id = "") {
  return `
    <div class="field compact-field">
      <label>${label}</label>
      <select data-field="${field}" data-id="${id}">
        <option value="true" ${value ? "selected" : ""}>Oui</option>
        <option value="false" ${!value ? "selected" : ""}>Non</option>
      </select>
    </div>
  `;
}

function renderChoiceSelect(label, field, value, options, id = "") {
  return `
    <div class="field compact-field">
      <label>${label}</label>
      <select data-field="${field}" data-id="${id}">
        ${options.map(([optionValue, optionLabel]) => `
          <option value="${escapeAttr(optionValue)}" ${value === optionValue ? "selected" : ""}>${escapeHTML(optionLabel)}</option>
        `).join("")}
      </select>
    </div>
  `;
}

function renderWidgetType(type, index) {
  return `
    <div class="field compact-field">
      <label>Type</label>
      <select data-field="widget.type" data-id="${index}">
        <option value="text" ${type === "text" ? "selected" : ""}>Texte</option>
        <option value="todo" ${type === "todo" ? "selected" : ""}>Liste</option>
        <option value="clock" ${type === "clock" ? "selected" : ""}>Horloge</option>
        <option value="weather" ${type === "weather" ? "selected" : ""}>Meteo</option>
      </select>
    </div>
  `;
}

function bindEvents() {
  const root = document.querySelector("#app");
  root.onclick = async (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget || !root.contains(actionTarget)) return;
    await handleAction({
      currentTarget: actionTarget,
      stopPropagation: () => event.stopPropagation(),
    });
  };
  document.querySelectorAll("[data-field]").forEach((field) => {
    field.addEventListener("input", handleField);
    field.addEventListener("change", handleField);
  });
  document.querySelectorAll("[data-inline-field]").forEach((field) => {
    field.addEventListener("mousedown", handleInlineSelect);
    field.addEventListener("input", handleInlineField);
    field.addEventListener("blur", handleInlineCommit);
    field.addEventListener("keydown", handleInlineKeydown);
  });
  document.querySelectorAll("[data-file]").forEach((field) => {
    field.addEventListener("change", handleFileField);
  });
  document.querySelectorAll(".window").forEach((node) => {
    node.addEventListener("mousedown", (event) => {
      if (event.target.closest("button, input, textarea, select, [data-action], [contenteditable]")) return;
      focusWindow(node.dataset.window);
    });
  });
  document.querySelectorAll("[data-action='drag-window']").forEach((bar) => {
    bar.addEventListener("mousedown", startDrag);
  });
  document.querySelectorAll("[data-theme-drag]").forEach((element) => {
    element.addEventListener("mousedown", startThemeDrag);
  });
  document.querySelectorAll("[data-theme-resize]").forEach((element) => {
    element.addEventListener("mousedown", startThemeResize);
  });
  document.querySelectorAll(".desktop-widget").forEach((element) => {
    element.addEventListener("mousedown", startWidgetDrag);
  });
  document.querySelectorAll("[data-widget-resize]").forEach((element) => {
    element.addEventListener("mousedown", startWidgetResize);
  });
  window.onmousemove = moveDrag;
  window.onmouseup = stopDrag;
}

async function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const appId = event.currentTarget.dataset.app;
  const windowId = event.currentTarget.dataset.window;
  event.stopPropagation();
  if (action === "drag-window") return;
  if (action === "open-app") return openApp(appId);
  if (action === "close-window") return closeWindow(windowId);
  if (action === "minimize-window") return setWindow(windowId, { minimized: true });
  if (action === "zoom-window") {
    const win = state.windows.find((item) => item.id === windowId);
    return setWindow(windowId, { fullscreen: !win.fullscreen });
  }
  if (action === "admin-login") {
    const input = event.currentTarget.closest(".admin-login")?.querySelector("[data-field='admin.codeInput']");
    const typedCode = String(input?.value || state.admin.codeInput || "").trim();
    const validCode = String(state.admin.code || defaultState.admin.code);
    if (typedCode === validCode) {
      state.admin.unlocked = true;
      state.admin.loginError = "";
    } else {
      state.admin.loginError = "Code incorrect.";
    }
  }
  if (action === "admin-logout") {
    state.admin.unlocked = false;
    state.admin.editing = false;
    state.admin.selectedInlineField = "";
    state.admin.selectedInlineId = "";
    state.admin.selectedThemeElementId = "";
  }
  if (action === "toggle-edit") {
    if (state.admin.unlocked) state.admin.editing = !state.admin.editing;
  }
  if (action === "select-section") state.admin.selectedSection = event.currentTarget.dataset.section;
  if (action === "select-app") state.admin.selectedAppId = appId;
  if (action === "select-builder-app") {
    state.admin.selectedAppId = appId;
    state.admin.selectedThemeElementId = "";
    state.admin.selectedInlineField = "";
    state.admin.selectedInlineId = "";
  }
  if (action === "select-theme-element") {
    state.admin.selectedThemeElementId = event.currentTarget.dataset.element;
    state.admin.selectedInlineField = "";
    state.admin.selectedInlineId = "";
  }
  if (action === "open-photo-detail") state.ui.photoDetailId = event.currentTarget.dataset.id;
  if (action === "close-photo-detail") state.ui.photoDetailId = "";
  if (action === "open-hobby-detail") state.ui.hobbyDetailId = event.currentTarget.dataset.id;
  if (action === "close-hobby-detail") state.ui.hobbyDetailId = "";
  if (action === "open-article-detail") state.ui.articleDetailId = event.currentTarget.dataset.id;
  if (action === "close-article-detail") state.ui.articleDetailId = "";
  if (action === "submit-review") submitReview();
  if (action === "submit-mail") submitMail();
  if (action === "submit-appointment") submitAppointment();
  if (action === "toggle-todo") toggleTodo(event.currentTarget.dataset.widget, event.currentTarget.dataset.index);
  if (action === "review-status") setReviewStatus(event.currentTarget.dataset.id, event.currentTarget.dataset.status);
  if (action === "delete-review") deleteReview(event.currentTarget.dataset.id);
  if (action === "message-read") setMessageRead(event.currentTarget.dataset.id);
  if (action === "delete-message") deleteMessage(event.currentTarget.dataset.id);
  if (action === "appointment-status") setAppointmentStatus(event.currentTarget.dataset.id, event.currentTarget.dataset.status);
  if (action === "delete-appointment") deleteAppointment(event.currentTarget.dataset.id);
  if (action === "test-supabase") return testSupabaseConnection();
  if (action === "sync-supabase") return syncSupabase("manual");
  if (action === "pull-supabase") return pullSupabaseState();
  if (action === "unlock-mobile") state.mobileUnlocked = true;
  if (action === "close-mobile-app") state.activeMobileApp = null;
  if (action === "new-app") addApp();
  if (action === "duplicate-app") duplicateApp(appId);
  if (action === "delete-app") deleteApp(appId);
  if (action === "add-theme-element") addThemeElement(event.currentTarget.dataset.type);
  if (action === "duplicate-theme-element") {
    duplicateThemeElement(event.currentTarget.dataset.app, event.currentTarget.dataset.element);
  }
  if (action === "delete-theme-element") {
    deleteThemeElement(event.currentTarget.dataset.app, event.currentTarget.dataset.element);
  }
  if (action === "reset-inline-style") resetInlineStyle(event.currentTarget.dataset.styleKey);
  if (action === "new-widget") addWidget();
  if (action === "duplicate-widget") duplicateWidget(Number(event.currentTarget.dataset.index));
  if (action === "delete-widget") deleteWidget(Number(event.currentTarget.dataset.index));
  if (action === "add-list-item") addListItem(event.currentTarget.dataset.list);
  if (action === "move-list-item") {
    moveListItem(event.currentTarget.dataset.list, Number(event.currentTarget.dataset.index), Number(event.currentTarget.dataset.direction));
  }
  if (action === "delete-list-item") {
    deleteListItem(event.currentTarget.dataset.list, Number(event.currentTarget.dataset.index));
  }
  if (action === "reset-state") {
    state = structuredClone(defaultState);
    memoryState = null;
    try {
      window.localStorage?.removeItem(STORAGE_KEY);
    } catch {
      // Ignore disabled storage in preview contexts.
    }
  }
  saveState();
  render();
}

function handleField(event) {
  const field = event.currentTarget.dataset.field;
  const value = event.currentTarget.value;
  const id = event.currentTarget.dataset.id;
  const shouldRefresh = event.type === "change";
  if (field === "admin.codeInput") {
    state.admin.codeInput = value;
    return;
  }
  setStateField(field, value, id);
  saveState();
  if (shouldRefresh) render();
}

function handleInlineSelect(event) {
  const node = event.currentTarget;
  state.admin.selectedInlineField = node.dataset.inlineField || "";
  state.admin.selectedInlineId = node.dataset.id || "";
  state.admin.selectedThemeElementId = "";
  saveState();

  if (node.closest(".theme-canvas")) {
    event.preventDefault();
    event.stopPropagation();
    render();
  }
}

function handleInlineField(event) {
  const field = event.currentTarget.dataset.inlineField;
  const value = event.currentTarget.textContent || "";
  const id = event.currentTarget.dataset.id;
  setStateField(field, value, id);
  saveState();
}

function handleInlineCommit() {
  render();
}

function handleInlineKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

function setStateField(field, value, id = "") {
  if (field === "admin.code") state.admin.code = value || defaultState.admin.code;
  if (field === "profile.owner") state.profile.owner = value;
  if (field === "profile.title") state.profile.title = value;
  if (field === "profile.email") state.profile.email = value;
  if (field === "profile.phone") state.profile.phone = value;
  if (field === "profile.location") state.profile.location = value;
  if (field === "profile.summary") state.profile.summary = value;
  if (field === "profile.linkedin") state.profile.linkedin = value;
  if (field === "profile.cv") state.profile.cv = value;
  if (field === "profile.photo") state.profile.photo = value;
  if (field === "profile.banner") state.profile.banner = value;
  if (field === "profile.socialLinks") state.profile.socialLinks = value;
  if (field.startsWith("form.")) {
    const [, formKey, key] = field.split(".");
    if (state.forms[formKey]) state.forms[formKey][key] = value;
  }
  if (field.startsWith("content.")) {
    const key = field.split(".")[1];
    state.content[key] = value;
  }
  if (field.startsWith("app.")) {
    const app = appById(id);
    const key = field.split(".")[1];
    if (app && ["dock", "mobileDock", "visible"].includes(key)) app[key] = value === "true";
    else if (app && ["iconSize", "iconRadius", "iconOpacity"].includes(key)) app[key] = Number(value || 0);
    else if (app) app[key] = value;
  }
  if (field.startsWith("appTheme.")) {
    const app = appById(id || state.admin.selectedAppId);
    const key = field.split(".")[1];
    if (app) {
      const theme = appThemeFor(app);
      if (["borderWidth", "borderRadius", "headerHeight", "headerBorderWidth"].includes(key)) {
        theme[key] = Number(value || 0);
      } else if (key === "headerEnabled") {
        theme[key] = value === "true";
      } else {
        theme[key] = value;
      }
    }
  }
  if (field.startsWith("inlineStyle.")) {
    if (!state.contentStyles) state.contentStyles = {};
    if (!state.contentStyles[id]) state.contentStyles[id] = {};
    const style = state.contentStyles[id];
    const key = field.split(".")[1];
    if (["fontSize", "width", "minHeight", "borderWidth", "borderRadius", "padding"].includes(key)) {
      style[key] = value === "" ? "" : Number(value || 0);
    } else if (["bold", "underline"].includes(key)) {
      style[key] = value === "true";
    } else {
      style[key] = value;
    }
  }
  if (field.startsWith("theme.")) {
    const element = selectedThemeElement();
    const key = field.split(".")[1];
    if (element) {
      if (["x", "y", "width", "height", "fontSize", "blur", "borderWidth", "borderRadius", "padding"].includes(key)) {
        element[key] = Number(value || 0);
      } else if (["bold", "underline", "highlight"].includes(key)) {
        element[key] = value === "true";
      } else {
        element[key] = value;
      }
    }
  }
  if (field.startsWith("widget.")) {
    const widget = state.widgets[Number(id)];
    const key = field.split(".")[1];
    if (widget && ["visible", "showDate", "showTimezone", "showMinMax", "useGlass", "useGeolocation"].includes(key)) widget[key] = value === "true";
    else if (widget && ["desktopX", "desktopY", "width", "height", "blur", "latitude", "longitude"].includes(key)) widget[key] = Number(value || 0);
    else if (widget) widget[key] = value;
  }
  if (field.startsWith("experience.")) {
    const item = state.experiences[Number(id)];
    const key = field.split(".")[1];
    if (item && ["activities", "skills"].includes(key)) item[key] = splitList(value);
    else if (item) item[key] = value;
  }
  if (field.startsWith("education.")) {
    const item = state.education[Number(id)];
    const key = field.split(".")[1];
    if (item && ["skills", "media"].includes(key)) item[key] = splitList(value);
    else if (item) item[key] = value;
  }
  if (field.startsWith("project.")) {
    const item = state.projects[Number(id)];
    const key = field.split(".")[1];
    if (item && ["skills", "gallery", "videos", "pdfs"].includes(key)) item[key] = splitList(value);
    else if (item) item[key] = value;
  }
  if (field.startsWith("passion.")) {
    const item = state.passions[Number(id)];
    const key = field.split(".")[1];
    if (item && ["gallery"].includes(key)) item[key] = splitList(value);
    else if (item) item[key] = value;
  }
  if (field.startsWith("article.")) {
    const item = state.blogArticles[Number(id)];
    if (item) item[field.split(".")[1]] = value;
  }
  if (field.startsWith("settings.")) {
    const key = field.split(".")[1];
    if (["useSupabase"].includes(key)) state.settings[key] = value === "true";
    else state.settings[key] = value;
  }
  if (field.startsWith("wallpaper.")) {
    const [, target, key] = field.split(".");
    const wallpaper = target === "mobile" ? state.settings.mobileWallpaper : state.settings.desktopWallpaper;
    if (["blur", "brightness", "contrast", "saturation", "opacity", "zoom"].includes(key)) wallpaper[key] = Number(value || 0);
    else if (key === "glass") wallpaper[key] = value === "true";
    else wallpaper[key] = value;
  }
}

function submitReview() {
  const review = state.forms.review;
  const now = Date.now();
  if (now - Number(review.lastSentAt || 0) < 15000) {
    state.ui.reviewStatus = "Merci de patienter avant d'envoyer un nouvel avis.";
    return;
  }
  if (!review.firstName.trim() || !review.lastName.trim() || !review.rating || !review.message.trim()) {
    state.ui.reviewStatus = "Tous les champs sont obligatoires.";
    return;
  }
  if (review.message.trim().length > 600) {
    state.ui.reviewStatus = "Le message est trop long. Limite : 600 caracteres.";
    return;
  }
  state.reviews.unshift({
    id: `review-${now}`,
    firstName: review.firstName.trim(),
    lastName: review.lastName.trim(),
    rating: Number(review.rating),
    message: review.message.trim(),
    date: new Date(now).toLocaleString("fr-FR"),
    status: "en attente",
  });
  state.forms.review = { firstName: "", lastName: "", rating: "", message: "", lastSentAt: now };
  state.ui.reviewStatus = "Avis envoye. Il apparaitra apres validation.";
  publicSupabaseSyncPending = true;
}

function submitMail() {
  const mail = state.forms.mail;
  if (!mail.name.trim() || !mail.email.trim() || !mail.subject.trim() || !mail.message.trim()) {
    state.ui.mailStatus = "Merci de remplir tous les champs.";
    return;
  }
  const now = Date.now();
  state.contactMessages.unshift({
    id: `message-${now}`,
    name: mail.name.trim(),
    email: mail.email.trim(),
    subject: mail.subject.trim(),
    message: mail.message.trim(),
    date: new Date(now).toLocaleString("fr-FR"),
    read: false,
  });
  state.forms.mail = { name: "", email: "", subject: "", message: "" };
  state.ui.mailStatus = "Message enregistre. Il pourra etre connecte a Resend, SMTP, Mailgun ou EmailJS.";
  publicSupabaseSyncPending = true;
}

function submitAppointment() {
  const appointment = state.forms.appointment;
  if (!appointment.date || !appointment.time || !appointment.type || !appointment.firstName.trim() || !appointment.lastName.trim() || !appointment.email.trim()) {
    state.ui.calendarStatus = "Merci de remplir la date, l'heure, le type d'entretien et vos coordonnees.";
    return;
  }
  const now = Date.now();
  state.appointments.unshift({
    id: `appointment-${now}`,
    ...structuredClone(appointment),
    firstName: appointment.firstName.trim(),
    lastName: appointment.lastName.trim(),
    email: appointment.email.trim(),
    message: appointment.message.trim(),
    dateSent: new Date(now).toLocaleString("fr-FR"),
    status: "En attente",
    adminNote: "",
  });
  state.forms.appointment = { ...defaultState.forms.appointment };
  state.ui.calendarStatus = "Demande envoyee et enregistree dans l'administration.";
  publicSupabaseSyncPending = true;
}

function toggleTodo(widgetId, index) {
  const key = `${widgetId}-${index}`;
  todoChecks[key] = !todoChecks[key];
  saveSessionChecks();
}

function setReviewStatus(id, status) {
  const review = state.reviews.find((item) => item.id === id);
  if (review) review.status = status;
}

function deleteReview(id) {
  state.reviews = state.reviews.filter((item) => item.id !== id);
}

function setMessageRead(id) {
  const message = state.contactMessages.find((item) => item.id === id);
  if (message) message.read = true;
}

function deleteMessage(id) {
  state.contactMessages = state.contactMessages.filter((item) => item.id !== id);
}

function setAppointmentStatus(id, status) {
  const appointment = state.appointments.find((item) => item.id === id);
  if (appointment) appointment.status = status;
}

function deleteAppointment(id) {
  state.appointments = state.appointments.filter((item) => item.id !== id);
}

async function handleFileField(event) {
  const input = event.currentTarget;
  const files = [...(input.files || [])];
  if (!files.length) return;
  const fileTarget = input.dataset.file;
  const id = input.dataset.id;
  const appendTargets = new Set(["education.media", "project.gallery", "project.videos", "project.pdfs", "passion.gallery", "article.block"]);
  const filesToImport = appendTargets.has(fileTarget) ? files : files.slice(0, 1);
  try {
    state.ui.uploadStatus = "Import en cours...";
    saveState();
    for (const file of filesToImport) {
      const result = await readFileForStorage(file);
      if (fileTarget === "appTheme.headerMediaSrc") {
        const app = appById(id || state.admin.selectedAppId);
        if (!app) return;
        const theme = appThemeFor(app);
        theme.headerMediaSrc = result;
        theme.headerMediaType = isVideoFile(file) ? "video" : "image";
        theme.headerEnabled = true;
      } else if (fileTarget === "theme.src") {
        const element = selectedThemeElement();
        if (!element) return;
        element.src = result;
        if (!element.content) element.content = file.name;
      } else {
        applyUploadedFile(fileTarget, id, result, file);
      }
    }
    const importedImages = filesToImport.filter(isImageFile).length;
    const importedVideos = filesToImport.filter(isVideoFile).length;
    const importedPdfs = filesToImport.filter(isPdfFile).length;
    state.ui.uploadStatus = [
      importedImages ? `${importedImages} image${importedImages > 1 ? "s" : ""}` : "",
      importedVideos ? `${importedVideos} video${importedVideos > 1 ? "s" : ""}` : "",
      importedPdfs ? `${importedPdfs} PDF` : "",
    ].filter(Boolean).join(", ") + " importe(s).";
    try {
      input.value = "";
    } catch {
      // The input can disappear after an async render in some mobile browsers.
    }
    saveState();
    render();
  } catch (error) {
    state.ui.uploadStatus = error?.message || "Import impossible. Essaie une image plus legere.";
    saveState();
    render();
  }
}

function readFileForStorage(file) {
  if (isHeicFile(file) || file.type === "image/svg+xml") return readFileAsDataURL(file);
  if (isImageFile(file)) return compressImageFile(file).catch(() => readFileAsDataURL(file));
  if (isVideoFile(file) && file.size > 25 * 1024 * 1024) {
    throw new Error("Video trop lourde. Limite actuelle : 25 Mo pour garder le site stable.");
  }
  if (isPdfFile(file) && file.size > 12 * 1024 * 1024) {
    throw new Error("PDF trop lourd. Limite actuelle : 12 Mo.");
  }
  if (!isVideoFile(file) && !isPdfFile(file) && file.size > 12 * 1024 * 1024) {
    throw new Error("Fichier trop lourd pour la sauvegarde. Utilise un fichier plus leger.");
  }
  return readFileAsDataURL(file);
}

function fileExtension(file) {
  return String(file.name || "").split(".").pop().toLowerCase();
}

function isHeicFile(file) {
  const ext = fileExtension(file);
  return ["heic", "heif"].includes(ext) || ["image/heic", "image/heif"].includes(file.type);
}

function isImageFile(file) {
  return file.type.startsWith("image/") || ["png", "jpg", "jpeg", "heic", "heif"].includes(fileExtension(file));
}

function isVideoFile(file) {
  return file.type.startsWith("video/") || fileExtension(file) === "mp4";
}

function isPdfFile(file) {
  return file.type === "application/pdf" || fileExtension(file) === "pdf";
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxSide = 1600;
      const ratio = Math.min(1, maxSide / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
      const width = Math.max(1, Math.round((image.naturalWidth || 1) * ratio));
      const height = Math.max(1, Math.round((image.naturalHeight || 1) * ratio));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(image.src);
        reject(new Error("Compression image indisponible."));
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(image.src);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };
    image.onerror = () => {
      URL.revokeObjectURL(image.src);
      reject(new Error("Image impossible a importer."));
    };
    image.src = URL.createObjectURL(file);
  });
}

function applyUploadedFile(fileTarget, id, result, file) {
  const index = Number(id);
  if (fileTarget.startsWith("profile.")) {
    state.profile[fileTarget.split(".")[1]] = result;
    return;
  }
  if (fileTarget === "app.iconImage") {
    const app = appById(id);
    if (app) app.iconImage = result;
    return;
  }
  if (fileTarget === "experience.logo" && state.experiences[index]) state.experiences[index].logo = result;
  if (fileTarget === "education.logo" && state.education[index]) state.education[index].logo = result;
  if (fileTarget === "education.media" && state.education[index]) state.education[index].media = [...(state.education[index].media || []), result];
  if (fileTarget === "project.cover" && state.projects[index]) state.projects[index].cover = result;
  if (fileTarget === "project.gallery" && state.projects[index]) state.projects[index].gallery = [...(state.projects[index].gallery || []), result];
  if (fileTarget === "project.videos" && state.projects[index]) state.projects[index].videos = [...(state.projects[index].videos || []), result];
  if (fileTarget === "project.pdfs" && state.projects[index]) state.projects[index].pdfs = [...(state.projects[index].pdfs || []), result];
  if (fileTarget === "passion.image" && state.passions[index]) state.passions[index].image = result;
  if (fileTarget === "passion.gallery" && state.passions[index]) state.passions[index].gallery = [...(state.passions[index].gallery || []), result];
  if (fileTarget === "article.cover" && state.blogArticles[index]) state.blogArticles[index].cover = result;
  if (fileTarget === "article.block" && state.blogArticles[index]) {
    const type = isVideoFile(file) ? "video" : isPdfFile(file) ? "pdf" : "image";
    state.blogArticles[index].blocks = [...(state.blogArticles[index].blocks || []), { type, src: result, label: file.name }];
  }
  if (fileTarget.startsWith("wallpaper.")) {
    const target = fileTarget.split(".")[1];
    const wallpaper = target === "mobile" ? state.settings.mobileWallpaper : state.settings.desktopWallpaper;
    wallpaper.value = result;
    wallpaper.type = isVideoFile(file) ? "video" : "image";
  }
}

function openApp(appId) {
  state.admin.selectedAppId = appId;
  if (matchMedia("(max-width: 760px)").matches) {
    state.mobileUnlocked = true;
    state.activeMobileApp = appId;
  } else {
    const existing = state.windows.find((win) => win.appId === appId);
    if (existing) {
      existing.minimized = false;
      existing.z = ++topZ;
    } else {
      const offset = state.windows.length * 24;
      state.windows.push({
        id: `${appId}-${Date.now()}`,
        appId,
        x: 150 + offset,
        y: 62 + offset,
        width: appId === "settings" ? 980 : 700,
        height: appId === "settings" ? 620 : 520,
        z: ++topZ,
        minimized: false,
        fullscreen: false,
      });
    }
  }
  saveState();
  render();
}

function closeWindow(id) {
  state.windows = state.windows.filter((win) => win.id !== id);
  saveState();
  render();
}

function setWindow(id, patch) {
  const win = state.windows.find((item) => item.id === id);
  Object.assign(win, patch, { z: ++topZ });
  saveState();
  render();
}

function focusWindow(id) {
  const win = state.windows.find((item) => item.id === id);
  if (!win) return;
  win.z = ++topZ;
  saveState();
  render();
}

function startDrag(event) {
  const id = event.currentTarget.dataset.window;
  const win = state.windows.find((item) => item.id === id);
  if (!win || win.fullscreen) return;
  drag = {
    kind: "window",
    id,
    startX: event.clientX,
    startY: event.clientY,
    x: win.x,
    y: win.y,
  };
}

function startThemeDrag(event) {
  event.preventDefault();
  event.stopPropagation();
  const target = event.currentTarget;
  const appId = target.dataset.app;
  const elementId = target.dataset.element;
  const element = themeElementById(appId, elementId);
  const canvas = target.closest(".theme-canvas");
  if (!element || !canvas) return;
  state.admin.selectedAppId = appId;
  state.admin.selectedThemeElementId = elementId;
  state.admin.selectedInlineField = "";
  state.admin.selectedInlineId = "";
  drag = {
    kind: "theme",
    appId,
    elementId,
    node: target,
    canvas,
    startX: event.clientX,
    startY: event.clientY,
    x: Number(element.x || 0),
    y: Number(element.y || 0),
  };
}

function startThemeResize(event) {
  event.preventDefault();
  event.stopPropagation();
  const appId = event.currentTarget.dataset.app;
  const elementId = event.currentTarget.dataset.element;
  const element = themeElementById(appId, elementId);
  const node = event.currentTarget.closest(".theme-builder-element");
  if (!element || !node) return;
  state.admin.selectedAppId = appId;
  state.admin.selectedThemeElementId = elementId;
  state.admin.selectedInlineField = "";
  state.admin.selectedInlineId = "";
  drag = {
    kind: "theme-resize",
    appId,
    elementId,
    node,
    startX: event.clientX,
    startY: event.clientY,
    width: Number(element.width || 220),
    height: Number(element.height || 90),
  };
}

function startWidgetDrag(event) {
  if (event.target.closest("button, input, textarea, select, label, [data-widget-resize]")) return;
  const widgetId = event.currentTarget.dataset.widget;
  const widget = state.widgets.find((item) => item.id === widgetId);
  if (!widget) return;
  event.preventDefault();
  drag = {
    kind: "widget",
    widgetId,
    node: event.currentTarget,
    startX: event.clientX,
    startY: event.clientY,
    x: Number(widget.desktopX || 0),
    y: Number(widget.desktopY || 0),
  };
}

function startWidgetResize(event) {
  const widgetId = event.currentTarget.dataset.widget;
  const widget = state.widgets.find((item) => item.id === widgetId);
  const node = event.currentTarget.closest(".desktop-widget");
  if (!widget || !node) return;
  event.preventDefault();
  event.stopPropagation();
  drag = {
    kind: "widget-resize",
    widgetId,
    node,
    startX: event.clientX,
    startY: event.clientY,
    width: Number(widget.width || 330),
    height: Number(widget.height || 118),
  };
}

function moveDrag(event) {
  if (!drag) return;
  if (drag.kind === "theme") {
    const element = themeElementById(drag.appId, drag.elementId);
    if (!element) return;
    const maxX = Math.max(0, drag.canvas.clientWidth - Number(element.width || 220));
    const maxY = Math.max(0, drag.canvas.clientHeight - Number(element.height || 90));
    element.x = Math.min(maxX, Math.max(0, drag.x + event.clientX - drag.startX));
    element.y = Math.min(maxY, Math.max(0, drag.y + event.clientY - drag.startY));
    drag.node.style.left = `${element.x}px`;
    drag.node.style.top = `${element.y}px`;
    return;
  }
  if (drag.kind === "theme-resize") {
    const element = themeElementById(drag.appId, drag.elementId);
    if (!element) return;
    element.width = Math.max(48, drag.width + event.clientX - drag.startX);
    element.height = Math.max(36, drag.height + event.clientY - drag.startY);
    drag.node.style.width = `${element.width}px`;
    drag.node.style.height = `${element.height}px`;
    return;
  }
  if (drag.kind === "widget") {
    const widget = state.widgets.find((item) => item.id === drag.widgetId);
    if (!widget) return;
    widget.desktopX = Math.max(0, drag.x + event.clientX - drag.startX);
    widget.desktopY = Math.max(0, drag.y + event.clientY - drag.startY);
    drag.node.style.left = `${widget.desktopX}px`;
    drag.node.style.top = `${widget.desktopY}px`;
    return;
  }
  if (drag.kind === "widget-resize") {
    const widget = state.widgets.find((item) => item.id === drag.widgetId);
    if (!widget) return;
    widget.width = Math.max(220, drag.width + event.clientX - drag.startX);
    widget.height = Math.max(100, drag.height + event.clientY - drag.startY);
    drag.node.style.width = `${widget.width}px`;
    drag.node.style.minHeight = `${widget.height}px`;
    return;
  }
  const win = state.windows.find((item) => item.id === drag.id);
  win.x = Math.max(8, drag.x + event.clientX - drag.startX);
  win.y = Math.max(40, drag.y + event.clientY - drag.startY);
  saveState();
  render();
}

function stopDrag() {
  if (["theme", "theme-resize", "widget", "widget-resize"].includes(drag?.kind)) {
    saveState();
    drag = null;
    render();
    return;
  }
  drag = null;
}

function addApp() {
  const id = `app-${Date.now()}`;
  state.apps.push({
    id,
    name: "Nouvelle app",
    symbol: "+",
    gradient: "linear-gradient(145deg, #334155, #0f172a)",
    dock: false,
    visible: true,
    themeElements: [],
    theme: { ...defaultAppTheme },
  });
  state.admin.selectedAppId = id;
  state.admin.selectedSection = "apps";
}

function duplicateApp(appId) {
  const source = appById(appId);
  if (!source) return;
  const id = `app-${Date.now()}`;
  state.apps.push({
    ...structuredClone(source),
    id,
    name: `${source.name} copie`,
    dock: false,
  });
  state.admin.selectedAppId = id;
}

function addThemeElement(type = "text") {
  const app = appById(state.admin.selectedAppId);
  if (!app || app.id === "settings") return;
  const id = `theme-${Date.now()}`;
  const defaults = {
    id,
    type,
    content: type === "title" ? "Nouveau titre" : type === "text" ? "Nouveau texte" : "",
    src: "",
    alt: "",
    x: 48,
    y: 48 + themeElementsFor(app).length * 18,
    width: type === "title" ? 340 : 260,
    height: type === "title" ? 86 : type === "text" ? 120 : 180,
    fontSize: type === "title" ? 34 : 18,
    color: "#0f172a",
    highlightColor: "#fef08a",
    backgroundColor: ["title", "text"].includes(type) ? "#ffffff" : "transparent",
    borderColor: "#cbd5e1",
    borderWidth: ["title", "text"].includes(type) ? 1 : 0,
    borderRadius: 12,
    padding: 10,
    bold: type === "title",
    underline: false,
    highlight: false,
    blur: 0,
    z: themeElementsFor(app).length + 1,
  };
  themeElementsFor(app).push(defaults);
  state.admin.selectedThemeElementId = id;
  state.admin.selectedInlineField = "";
  state.admin.selectedInlineId = "";
  state.admin.selectedSection = "builder";
}

function duplicateThemeElement(appId, elementId) {
  const app = appById(appId);
  const element = themeElementById(appId, elementId);
  if (!app || !element) return;
  const copy = {
    ...structuredClone(element),
    id: `theme-${Date.now()}`,
    x: Number(element.x || 0) + 24,
    y: Number(element.y || 0) + 24,
    z: themeElementsFor(app).length + 1,
  };
  themeElementsFor(app).push(copy);
  state.admin.selectedThemeElementId = copy.id;
  state.admin.selectedInlineField = "";
  state.admin.selectedInlineId = "";
}

function deleteThemeElement(appId, elementId) {
  const app = appById(appId);
  if (!app) return;
  app.themeElements = themeElementsFor(app).filter((element) => element.id !== elementId);
  state.admin.selectedThemeElementId = "";
}

function resetInlineStyle(key) {
  if (!key || !state.contentStyles) return;
  delete state.contentStyles[key];
  state.admin.selectedInlineField = "";
  state.admin.selectedInlineId = "";
}

function deleteApp(appId) {
  if (appId === "settings") return;
  state.apps = state.apps.filter((app) => app.id !== appId);
  state.windows = state.windows.filter((win) => win.appId !== appId);
  state.admin.selectedAppId = state.apps[0]?.id || "settings";
}

function addWidget() {
  state.widgets.push({
    id: `widget-${Date.now()}`,
    title: "Nouveau widget",
    type: "text",
    body: "Texte du widget",
    visible: true,
    desktopX: 0,
    desktopY: 0,
    width: 330,
    height: 140,
  });
  state.admin.selectedSection = "widgets";
}

function duplicateWidget(index) {
  const widget = state.widgets[index];
  if (!widget) return;
  state.widgets.push({
    ...structuredClone(widget),
    id: `widget-${Date.now()}`,
    title: `${widget.title} copie`,
    desktopY: Number(widget.desktopY || 0) + 24,
  });
  state.admin.selectedSection = "widgets";
}

function deleteWidget(index) {
  state.widgets.splice(index, 1);
}

function addListItem(list) {
  if (list === "experience") {
    state.experiences.push({
      company: "Entreprise",
      logo: "",
      period: "Periode",
      type: "Stage",
      position: "Poste",
      activities: ["Activite 1", "Activite 2", "Activite 3", "Activite 4"],
      skills: ["Competence"],
    });
  }
  if (list === "education") {
    state.education.push({
      title: "Nouvelle etape",
      organization: "Etablissement",
      period: "Periode",
      status: "Statut",
      logo: "",
      description: "Description du parcours.",
      skills: ["Competence"],
      media: [],
    });
  }
  if (list === "project") {
    state.projects.push({
      id: `project-${Date.now()}`,
      title: "Nouveau projet",
      category: "Projet",
      cover: coverImage("Nouveau projet", "#0ea5e9", "#22c55e"),
      context: "Contexte.",
      objectives: "Objectifs.",
      skills: ["Competence"],
      gallery: [],
      videos: [],
      pdfs: [],
    });
  }
  if (list === "passion") {
    state.passions.push({
      id: `hobby-${Date.now()}`,
      title: "Nouveau loisir",
      category: "Passions",
      image: coverImage("Nouveau loisir", "#111827", "#6366f1"),
      description: "Description.",
      reason: "Pourquoi j'aime ce loisir.",
      gallery: [],
    });
  }
  if (list === "article") {
    state.blogArticles.push({
      id: `article-${Date.now()}`,
      url: "https://astuceyassinerh/nouvelle-astuce",
      title: "Nouvelle astuce",
      category: "Organisation",
      summary: "Resume.",
      cover: coverImage("Nouvelle astuce", "#0f172a", "#2563eb"),
      content: "Contenu de l'article.",
      blocks: [],
    });
  }
  state.admin.selectedSection = "content";
}

function deleteListItem(list, index) {
  if (list === "experience") state.experiences.splice(index, 1);
  if (list === "education") state.education.splice(index, 1);
  if (list === "project") state.projects.splice(index, 1);
  if (list === "passion") state.passions.splice(index, 1);
  if (list === "article") state.blogArticles.splice(index, 1);
}

function moveListItem(list, index, direction) {
  const map = {
    experience: state.experiences,
    education: state.education,
    project: state.projects,
    passion: state.passions,
    article: state.blogArticles,
  };
  const items = map[list];
  if (!items) return;
  const next = index + direction;
  if (next < 0 || next >= items.length) return;
  const [item] = items.splice(index, 1);
  items.splice(next, 0, item);
}

function updateClock() {
  const now = new Date();
  const short = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const fullDate = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Paris";
  document.querySelectorAll("[data-clock-short]").forEach((node) => {
    node.textContent = short;
  });
  document.querySelectorAll("[data-clock-big]").forEach((node) => {
    node.textContent = short;
  });
  document.querySelectorAll("[data-clock-date]").forEach((node) => {
    const widget = widgetForNode(node);
    node.textContent = widget?.showDate === false ? "" : fullDate.charAt(0).toUpperCase() + fullDate.slice(1);
  });
  document.querySelectorAll("[data-clock-zone]").forEach((node) => {
    const widget = widgetForNode(node);
    node.textContent = widget?.showTimezone === false ? "" : timezone;
  });
}

function widgetForNode(node) {
  const id = node.closest("[data-widget]")?.dataset.widget;
  return state.widgets.find((widget) => widget.id === id);
}

async function hydrateWeatherWidgets() {
  const widgets = state.widgets.filter((widget) => widget.type === "weather" && widget.visible !== false);
  widgets.forEach((widget) => renderWeatherUnavailable(widget.id));
  requestWeatherGeolocation(widgets);
  for (const widget of widgets) {
    try {
      const unit = widget.unit === "fahrenheit" ? "fahrenheit" : "celsius";
      const params = new URLSearchParams({
        latitude: String(widget.latitude || 48.8566),
        longitude: String(widget.longitude || 2.3522),
        current: "temperature_2m,weather_code",
        daily: "temperature_2m_max,temperature_2m_min",
        timezone: "auto",
        temperature_unit: unit,
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!response.ok) throw new Error("weather unavailable");
      const data = await response.json();
      renderWeatherData(widget, data);
    } catch {
      renderWeatherUnavailable(widget.id);
    }
  }
}

function requestWeatherGeolocation(widgets) {
  if (weatherGeoRequested || !widgets.some((widget) => widget.useGeolocation !== false) || !navigator.geolocation) return;
  weatherGeoRequested = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.widgets.forEach((widget) => {
        if (widget.type === "weather" && widget.useGeolocation !== false) {
          widget.latitude = Number(position.coords.latitude.toFixed(4));
          widget.longitude = Number(position.coords.longitude.toFixed(4));
        }
      });
      saveState();
      hydrateWeatherWidgets();
    },
    () => {},
    { maximumAge: 1000 * 60 * 30, timeout: 5000 },
  );
}

function renderWeatherData(widget, data) {
  const temp = Math.round(Number(data.current?.temperature_2m));
  const code = Number(data.current?.weather_code);
  const min = Math.round(Number(data.daily?.temperature_2m_min?.[0]));
  const max = Math.round(Number(data.daily?.temperature_2m_max?.[0]));
  const unit = widget.unit === "fahrenheit" ? "°F" : "°C";
  document.querySelectorAll(`[data-weather-widget="${widget.id}"]`).forEach((node) => {
    node.querySelector("[data-weather-icon]").textContent = weatherIcon(code);
    node.querySelector("[data-weather-temp]").textContent = `${Number.isFinite(temp) ? temp : "--"} ${unit}`;
    node.querySelector("[data-weather-condition]").textContent = weatherLabel(code);
    node.querySelector("[data-weather-minmax]").textContent = widget.showMinMax === false || !Number.isFinite(min) || !Number.isFinite(max)
      ? ""
      : `Min. ${min} ${unit} | Max. ${max} ${unit}`;
  });
}

function renderWeatherUnavailable(id) {
  document.querySelectorAll(`[data-weather-widget="${id}"]`).forEach((node) => {
    node.querySelector("[data-weather-icon]").textContent = "--";
    node.querySelector("[data-weather-temp]").textContent = "Meteo indisponible";
    node.querySelector("[data-weather-condition]").textContent = "";
    node.querySelector("[data-weather-minmax]").textContent = "";
  });
}

function weatherIcon(code) {
  if ([0, 1].includes(code)) return "☀";
  if ([2, 3].includes(code)) return "☁";
  if ([45, 48].includes(code)) return "≋";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "☂";
  if ([71, 73, 75, 77].includes(code)) return "❄";
  if ([95, 96, 99].includes(code)) return "⚡";
  return "☀";
}

function weatherLabel(code) {
  if ([0, 1].includes(code)) return "Ensoleille";
  if ([2, 3].includes(code)) return "Nuageux";
  if ([45, 48].includes(code)) return "Brouillard";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Pluie";
  if ([71, 73, 75, 77].includes(code)) return "Neige";
  if ([95, 96, 99].includes(code)) return "Orage";
  return "Condition meteo";
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("beforeunload", (event) => {
  if (!hasPendingSupabaseSync()) return;
  event.preventDefault();
  event.returnValue = "";
});

bootApp();
setInterval(updateClock, 1000);
