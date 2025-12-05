import { useState, useEffect, FormEvent } from "react";
import {
  Activity,
  Users,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Send,
  Sparkles,
  User,
  Plus,
  Linkedin,
  Trash2,
  ChevronRight,
  Phone,
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  Star,
  HeartHandshake,
  Zap,
  Lock,
  Server,
  EyeOff,
  CheckCircle,
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import * as firebaseApp from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  where,
  limit,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

// ------------------------------------------------------------------
// KONFIGURATION
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCyFp3YNSLSkk3XpIp6-gbtgtUDv1i5ZYI",
  authDomain: "pulsecheck-app.firebaseapp.com",
  projectId: "pulsecheck-app",
  storageBucket: "pulsecheck-app.firebasestorage.app",
  messagingSenderId: "728762966444",
  appId: "1:728762966444:web:275a3e7ce6d3b9086cda09",
  measurementId: "G-G5XSHY3C1B",
};

// Initialize Firebase
const app = firebaseApp.initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ------------------------------------------------------------------
// DATA
// ------------------------------------------------------------------

const BLOG_POSTS = [
  {
    id: 1,
    title: "Warum jährliche Mitarbeitergespräche nicht mehr reichen",
    category: "HR Strategie",
    date: "28. Nov 2025",
    readTime: "4 Min",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    excerpt:
      "Die Generation Z und der Fachkräftemangel fordern neue Feedback-Rhythmen. Warum wöchentliche 'Pulse-Checks' der neue Standard sind.",
    content: `
      <p>In vielen Schweizer Arztpraxen und KMUs ist es noch Tradition: Das "Jahresgespräch". Einmal im Jahr setzen sich Chef und Mitarbeiter zusammen, füllen ein Formular aus und hoffen, dass damit alles erledigt ist. Doch die Arbeitswelt hat sich drastisch verändert.</p>
      <h3>Das Problem mit dem Jahresrhythmus</h3>
      <p>Stellen Sie sich vor, Sie würden Ihren Kontostand nur einmal im Jahr prüfen. Absurd, oder? Genauso verhält es sich mit der Teamstimmung.</p>
    `,
  },
  {
    id: 2,
    title: "Psychologische Sicherheit in der Arztpraxis",
    category: "Praxismanagement",
    date: "15. Nov 2025",
    readTime: "6 Min",
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800",
    excerpt:
      "Fehlerkultur im medizinischen Bereich ist überlebenswichtig. Wie Sie ein Umfeld schaffen, in dem Fehler offen angesprochen werden.",
    content: `
      <p>In der Medizin können Fehler tödlich sein. Paradoxerweise führt gerade der Druck, "perfekt" sein zu müssen, oft dazu, dass Fehler vertuscht werden.</p>
    `,
  },
  {
    id: 3,
    title: "Onboarding Checkliste für MPAs",
    category: "Guides",
    date: "02. Nov 2025",
    readTime: "3 Min",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800",
    excerpt:
      "Die ersten 90 Tage entscheiden über den Verbleib. Eine strukturierte Anleitung für den Start neuer Mitarbeiter.",
    content: `
      <p>Der Fachkräftemangel im Gesundheitswesen ist akut. Umso schmerzhafter ist es, wenn neue Mitarbeiter nach wenigen Monaten wieder gehen.</p>
    `,
  },
  {
    id: 4,
    title: "Die 4-Tage-Woche in der Medizin",
    category: "New Work",
    date: "10. Dez 2025",
    readTime: "5 Min",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    excerpt:
      "Ein Modell mit Zukunft oder organisatorischer Albtraum? Erfahrungen aus Schweizer Pilot-Praxen.",
    content: `
      <p>Der Ruf nach flexibleren Arbeitszeiten wird lauter. Doch wie soll eine 4-Tage-Woche funktionieren, wenn die Patientenversorgung 5 oder 6 Tage abdecken muss?</p>
      <h3>Rotation ist der Schlüssel</h3>
      <p>Erfolgreiche Praxen setzen auf rotierende Systeme, bei denen das Team in zwei Gruppen aufgeteilt wird.</p>
    `,
  },
];

// ------------------------------------------------------------------
// KOMPONENTEN
// ------------------------------------------------------------------

const Navbar = ({
  currentPage,
  setCurrentPage,
  isLoggedIn,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
}: any) => (
  <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              PulseCheck
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setCurrentPage("pricing")}
            className={`text-sm font-medium ${
              currentPage === "pricing"
                ? "text-emerald-700 font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Preise
          </button>
          <button
            onClick={() => setCurrentPage("about")}
            className={`text-sm font-medium ${
              currentPage === "about"
                ? "text-emerald-700 font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Über uns
          </button>
          <button
            onClick={() => setCurrentPage("blog")}
            className={`text-sm font-medium ${
              currentPage === "blog"
                ? "text-emerald-700 font-bold"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Blog
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage("dashboard")}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition"
                title="Abmelden"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage("login")}
                className="text-gray-600 hover:text-emerald-700 font-medium text-sm"
              >
                Einloggen
              </button>
              <button
                onClick={() => setCurrentPage("register")}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
              >
                Testen
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-500 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </div>

    {mobileMenuOpen && (
      <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-3">
        <button
          onClick={() => {
            setCurrentPage("pricing");
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left py-2 font-medium text-gray-600"
        >
          Preise
        </button>
        <button
          onClick={() => {
            setCurrentPage("about");
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left py-2 font-medium text-gray-600"
        >
          Über uns
        </button>
        <button
          onClick={() => {
            setCurrentPage("blog");
            setMobileMenuOpen(false);
          }}
          className="block w-full text-left py-2 font-medium text-gray-600"
        >
          Blog
        </button>
        {!isLoggedIn && (
          <button
            onClick={() => {
              setCurrentPage("login");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 font-medium text-emerald-700 font-bold"
          >
            Einloggen
          </button>
        )}
      </div>
    )}
  </nav>
);

const Hero = ({ setCurrentPage }: any) => (
  <div className="relative bg-gradient-to-br from-emerald-50 to-white pt-20 pb-24 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <ShieldCheck size={16} /> Datenhaltung in der Schweiz 🇨🇭
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          Das Stimmungsbild Ihrer Praxis.
          <br />
          <span className="text-emerald-600">Automatisch. Per WhatsApp.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 leading-relaxed">
          Schluss mit langweiligen Umfragen. PulseCheck sendet Ihrem Team
          wöchentlich eine WhatsApp. Unsere KI wertet die Antworten aus und
          liefert Ihnen montags einen fertigen Handlungs-Bericht.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setCurrentPage("register")}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
          >
            1 Monat kostenlos testen <ChevronRight size={20} />
          </button>
          <button
            onClick={() => setCurrentPage("funktionen")}
            className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            Funktionen ansehen
          </button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-6">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            WhatsApp statt E-Mail
          </h3>
          <p className="text-gray-500">
            Ihre Mitarbeiter antworten dort, wo sie eh sind. Keine Login-Hürden,
            keine App-Installation. Teilnahmequote &gt; 85%.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-6">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Wöchentliche KI-Berichte
          </h3>
          <p className="text-gray-500">
            Unsere KI fasst das Feedback zusammen und erkennt Trends
            ("Schichtplan sorgt für Unruhe"). Sie sparen Stunden an Analysezeit.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center text-purple-600 mb-6">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Automatisierte HR
          </h3>
          <p className="text-gray-500">
            Strukturierte Onboarding-, Probezeit- und Jahresgespräche über
            mobile Mini-Formulare. Alles an einem Ort.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Funktionen = () => (
  <div className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Mehr als nur eine Umfrage
        </h2>
        <p className="text-xl text-gray-500">
          PulseCheck ist Ihr digitales HR-Cockpit für die Arztpraxis.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            WhatsApp Automatisierung
          </h3>
          <p className="text-gray-600">
            Automatische Versendung von Umfragen via WhatsApp API.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">KI-Analyse (LLM)</h3>
          <p className="text-gray-600">
            Automatische Auswertung von Freitext-Antworten durch KI.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">HR-Gespräche</h3>
          <p className="text-gray-600">
            Digitalisierte Vorlagen für Mitarbeitergespräche.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Sicherheit = () => (
  <div className="py-20 bg-gray-50">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Datenschutz & Sicherheit
        </h2>
        <p className="text-xl text-gray-500">
          Ihre Daten gehören Ihnen. Punkt.
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex gap-6">
          <Server className="text-emerald-600 flex-shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Serverstandort Europa
            </h3>
            <p className="text-gray-600">
              Wir nutzen Google Cloud Server in der Region Europa.
            </p>
          </div>
        </div>
        <div className="p-8 border-b border-gray-100 flex gap-6">
          <Lock className="text-emerald-600 flex-shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verschlüsselung
            </h3>
            <p className="text-gray-600">
              Daten werden verschlüsselt übertragen und gespeichert.
            </p>
          </div>
        </div>
        <div className="p-8 border-b border-gray-100 flex gap-6">
          <ShieldCheck className="text-emerald-600 flex-shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              nDSG Konform
            </h3>
            <p className="text-gray-600">
              Konform mit dem Schweizer Datenschutzgesetz.
            </p>
          </div>
        </div>
        <div className="p-8 flex gap-6">
          <EyeOff className="text-emerald-600 flex-shrink-0" size={32} />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Anonymität</h3>
            <p className="text-gray-600">
              Feedback ist für den Chef anonymisiert.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Kontakt = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        date: new Date(),
      });
      setSent(true);
    } catch (error) {
      alert("Fehler beim Senden.");
    }
  };

  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Kontakt aufnehmen
        </h2>
        {sent ? (
          <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-bold mb-2">Nachricht gesendet!</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nachricht
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold"
            >
              Senden
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const About = () => (
  <div className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Über PulseCheck
        </h2>
        <p className="text-xl text-gray-500 leading-relaxed">
          Wir schliessen die Lücke zwischen "Flurfunk" und formalen
          HR-Prozessen. Entwickelt speziell für{" "}
          <strong>Schweizer KMU und Gesundheitseinrichtungen</strong>.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <div className="flex gap-5">
          <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Zap size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Mehr Zeit für Patienten
            </h3>
            <p className="text-gray-600">
              Automatisierte Erfassung der Stimmung.
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex-shrink-0 w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Schweizer Datenschutz
            </h3>
            <p className="text-gray-600">nDSG-konform, Server in Europa.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex-shrink-0 w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
            <MessageCircle size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Hohe Akzeptanz
            </h3>
            <p className="text-gray-600">Einfache Nutzung via WhatsApp.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex-shrink-0 w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600">
            <HeartHandshake size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Proaktive Führung
            </h3>
            <p className="text-gray-600">Frühwarnsystem für Unzufriedenheit.</p>
          </div>
        </div>
      </div>
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900">Das Gründerteam</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <img
            src="https://media.licdn.com/dms/image/v2/D4E03AQE_PYNJybI06A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1700120706811?e=1766016000&v=beta&t=a2t8wKPZFGo3UW5eEbj3-wOgDN95BzIiL3zqbYy3lGA"
            alt="Rahul Habibur"
            className="w-28 h-28 rounded-full mb-6 object-cover border-4 border-emerald-50"
          />
          <h4 className="text-xl font-bold text-gray-900">Rahul Habibur</h4>
          <p className="text-emerald-600 font-medium text-sm mb-4">
            Co-Founder & Product
          </p>
          <a
            href="https://www.linkedin.com/in/rahulhabibur/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium text-sm"
          >
            <Linkedin size={18} /> LinkedIn Profil
          </a>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <img
            src="https://media.licdn.com/dms/image/v2/C4D03AQExKMmaChmp_Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1621933336352?e=1766016000&v=beta&t=OVaFlGaPnznWIu0n5A0XkXcD6OhmNNXk1wDL-n6rzF0"
            alt="Dr. Arjun Thanabalasingam"
            className="w-28 h-28 rounded-full mb-6 object-cover border-4 border-blue-50"
          />
          <h4 className="text-xl font-bold text-gray-900">
            Dr. Arjun Thanabalasingam
          </h4>
          <p className="text-blue-600 font-medium text-sm mb-4">
            Co-Founder & Medicine
          </p>
          <a
            href="https://www.linkedin.com/in/dr-arjun-thanabalasingam-a1871a111/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium text-sm"
          >
            <Linkedin size={18} /> LinkedIn Profil
          </a>
        </div>
      </div>
    </div>
  </div>
);

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  if (selectedPost) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-emerald-700 font-medium mb-8 hover:underline"
          >
            <ArrowLeft size={20} /> Zurück zur Übersicht
          </button>
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8 shadow-lg"
          />
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold">
              {selectedPost.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {selectedPost.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> {selectedPost.readTime}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {selectedPost.title}
          </h1>
          <div
            className="prose prose-lg text-gray-600 max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Unser Blog</h2>
          <p className="text-gray-500 mt-4">
            Aktuelle Erkenntnisse zu Führung, HR und Praxiskultur.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer border border-gray-100 group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-emerald-700 text-sm font-semibold">
                  Artikel lesen <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Pricing = ({ setCurrentPage }: any) => (
  <div className="py-20 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900">
          Preise für jede Praxisgrösse
        </h2>
        <p className="text-gray-500 mt-4">
          Transparente Kosten. Keine versteckten Gebühren. Monatlich kündbar.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-sm font-bold shadow-sm animate-pulse">
          <Star size={18} className="fill-current" /> Spezialangebot: Alle
          Pakete 1 Monat kostenlos testen!
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
          <p className="text-gray-500 text-sm mb-6">Für kleine Praxen</p>
          <div className="text-4xl font-bold text-gray-900 mb-6">
            CHF 29
            <span className="text-lg text-gray-400 font-normal">/Monat</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Bis zu 5
              Mitarbeiter
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Wöchentlicher
              PulseCheck
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" />{" "}
              <strong>KI-Wochenberichte</strong>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Basis Dashboard
            </li>
          </ul>
          <button
            onClick={() => setCurrentPage("register")}
            className="w-full py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition"
          >
            1 Monat kostenlos testen
          </button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-emerald-600 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            BELIEBT
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Praxis Pro</h3>
          <p className="text-gray-500 text-sm mb-6">Für wachsende Teams</p>
          <div className="text-4xl font-bold text-gray-900 mb-6">
            CHF 79
            <span className="text-lg text-gray-400 font-normal">/Monat</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Bis zu 15
              Mitarbeiter
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" />{" "}
              <strong>KI-Wochenberichte</strong>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> WhatsApp
              Integration
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Onboarding Modul
            </li>
          </ul>
          <button
            onClick={() => setCurrentPage("register")}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
          >
            1 Monat kostenlos testen
          </button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Klinik / MVZ</h3>
          <p className="text-gray-500 text-sm mb-6">
            Für grosse Organisationen
          </p>
          <div className="text-4xl font-bold text-gray-900 mb-6">
            Ab CHF 149
            <span className="text-lg text-gray-400 font-normal">/Monat</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Unlimitierte
              Mitarbeiter
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Eigene Branding
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> API Zugang
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Check size={18} className="text-emerald-600" /> Persönlicher
              Support
            </li>
          </ul>
          <button
            onClick={() => setCurrentPage("kontakt")}
            className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-lg hover:border-gray-900 hover:text-gray-900 transition"
          >
            Kontakt aufnehmen
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ------------------------------------------------------------------
// RECHTSTEXTE (Schweiz) - JETZT GEFÜLLT!
// ------------------------------------------------------------------

const Impressum = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
      <div className="prose prose-lg text-gray-600">
        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          Kontaktadresse
        </h3>
        <p>
          Arvin Health Service GmbH
          <br />
          Konradstrasse 29
          <br />
          8005 Zürich
          <br />
          Schweiz
        </p>

        <p>
          <strong>E-Mail:</strong> info@pulsecheck.ch
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          Vertretungsberechtigte Personen
        </h3>
        <p>
          Rahul Habibur, Geschäftsführer
          <br />
          Dr. Arjun Thanabalasingam, Geschäftsführer
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          Handelsregistereintrag
        </h3>
        <p>
          Eingetragener Firmenname: Arvin Health Service GmbH
          <br />
          Nummer: [Wird ergänzt]
          <br />
          Handelsregisteramt: Zürich
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          Haftungsausschluss
        </h3>
        <p>
          Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen
          Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und
          Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor
          wegen Schäden materieller oder immaterieller Art, welche aus dem
          Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
          Informationen, durch Missbrauch der Verbindung oder durch technische
          Störungen entstanden sind, werden ausgeschlossen.
        </p>
        <p>
          Alle Angebote sind unverbindlich. Der Autor behält es sich
          ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne
          gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die
          Veröffentlichung zeitweise oder endgültig einzustellen.
        </p>
      </div>
    </div>
  </div>
);

const Datenschutz = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Datenschutzerklärung
      </h1>
      <div className="prose prose-lg text-gray-600">
        <p>
          Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere
          des Schweizer Datenschutzgesetzes (nDSG) und der
          EU-Datenschutzgrundverordnung (DSGVO), ist:
        </p>
        <p>
          <strong>Arvin Health Service GmbH</strong>
          <br />
          Konradstrasse 29
          <br />
          8005 Zürich
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          1. Allgemeines
        </h3>
        <p>
          Gestützt auf Artikel 13 der schweizerischen Bundesverfassung und die
          datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz,
          DSG) hat jede Person Anspruch auf Schutz ihrer Privatsphäre sowie auf
          Schutz vor Missbrauch ihrer persönlichen Daten. Wir halten diese
          Bestimmungen ein. Persönliche Daten werden streng vertraulich
          behandelt und weder an Dritte verkauft noch weitergegeben.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          2. Bearbeitung von Personendaten
        </h3>
        <p>
          Wir bearbeiten Personendaten, die für die Nutzung von PulseCheck
          notwendig sind (E-Mail, Namen der Mitarbeiter, Telefonnummern für
          WhatsApp-Versand). Diese Daten werden auf Servern von Google Firebase
          (Standort Europa) gespeichert.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          3. WhatsApp Kommunikation
        </h3>
        <p>
          Für den Versand der Umfragen nutzen wir die WhatsApp Business API (via
          Twilio). Die Telefonnummern werden ausschliesslich für den Versand der
          angeforderten Umfragen genutzt.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          4. KI-Analyse
        </h3>
        <p>
          Anonymisierte Feedback-Daten werden zur Erstellung von
          Zusammenfassungen durch Sprachmodelle (OpenAI) verarbeitet. Es werden
          dabei keine direkten Personendaten (Namen) an die KI übermittelt,
          sondern nur die reinen Feedback-Inhalte.
        </p>
      </div>
    </div>
  </div>
);

const AGB = () => (
  <div className="py-20 bg-white min-h-screen">
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Allgemeine Geschäftsbedingungen (AGB)
      </h1>
      <div className="prose prose-lg text-gray-600">
        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          1. Geltungsbereich
        </h3>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung
          der Software "PulseCheck", angeboten von der Arvin Health Service
          GmbH.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          2. Vertragsgegenstand
        </h3>
        <p>
          PulseCheck ist ein webbasiertes Tool zur Mitarbeiterbefragung via
          WhatsApp. Der Anbieter stellt dem Kunden die Software als SaaS
          (Software as a Service) zur Verfügung.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          3. Vertragslaufzeit und Kündigung
        </h3>
        <p>
          Abonnements werden monatlich oder jährlich abgeschlossen. Sie können
          jeweils zum Ende der Laufzeit gekündigt werden. Eine Rückerstattung
          für bereits bezahlte Zeiträume ist ausgeschlossen. Die Kündigung kann
          direkt im Benutzerkonto erfolgen.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          4. Gewährleistung und Haftung
        </h3>
        <p>
          Wir bemühen uns um eine höchstmögliche Verfügbarkeit (99%), können
          diese jedoch nicht garantieren. Für indirekte Schäden oder
          Folgeschäden wird, soweit gesetzlich zulässig, jede Haftung abgelehnt.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
          5. Anwendbares Recht und Gerichtsstand
        </h3>
        <p>Es gilt schweizerisches Recht. Gerichtsstand ist Zürich.</p>
      </div>
    </div>
  </div>
);

const AuthScreen = ({
  type,
  handleLogin,
  handleRegister,
  handlePasswordReset,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  setCurrentPage,
}: any) => {
  const [isResetMode, setIsResetMode] = useState(false);
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10">
        <div className="text-center mb-8">
          <div className="inline-flex bg-emerald-100 p-3 rounded-xl text-emerald-600 mb-4">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isResetMode
              ? "Passwort zurücksetzen"
              : type === "login"
              ? "Willkommen zurück"
              : "Praxis registrieren"}
          </h2>
        </div>
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            if (isResetMode) {
              e.preventDefault();
              const success = await handlePasswordReset(authEmail);
              if (success) setIsResetMode(false);
            } else {
              type === "login" ? handleLogin(e) : handleRegister(e);
            }
          }}
        >
          {authError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {authError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          </div>
          {!isResetMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>
          )}
          {!isResetMode && type === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setAuthError("");
                }}
                className="text-sm text-emerald-700 hover:underline"
              >
                Passwort vergessen?
              </button>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-200"
          >
            {isResetMode
              ? "Link senden"
              : type === "login"
              ? "Einloggen"
              : "1 Monat kostenlos starten"}
          </button>
          {isResetMode && (
            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setAuthError("");
              }}
              className="mt-2 text-sm text-gray-500 w-full text-center"
            >
              Zurück
            </button>
          )}
        </form>
        {!isResetMode && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {type === "login" ? (
              <p>
                Neu?{" "}
                <button
                  onClick={() => setCurrentPage("register")}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Registrieren
                </button>
              </p>
            ) : (
              <p>
                Konto vorhanden?{" "}
                <button
                  onClick={() => setCurrentPage("login")}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Einloggen
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({
  dashboardView,
  setDashboardView,
  currentUser,
  handleLogout,
  dashboardData,
  employees,
  newEmpName,
  setNewEmpName,
  newEmpRole,
  setNewEmpRole,
  newEmpPhone,
  setNewEmpPhone,
  handleAddEmployee,
  handleDeleteEmployee,
  handleSendWhatsappSurvey,
  aiReports,
}: any) => (
  <div className="flex min-h-screen bg-gray-50">
    <div className="w-64 bg-white border-r border-gray-200 hidden lg:block fixed h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Team Feedback</h2>
      </div>
      <div className="p-4 space-y-2">
        <button
          onClick={() => setDashboardView("overview")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
            dashboardView === "overview"
              ? "bg-emerald-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button
          onClick={() => setDashboardView("employees")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
            dashboardView === "employees"
              ? "bg-emerald-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Users size={20} /> Mitarbeiter
        </button>
      </div>
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
            {currentUser?.email?.charAt(0).toUpperCase() || "D"}
          </div>
          <div className="text-sm">
            <p className="font-bold text-gray-900 truncate w-32">
              {currentUser?.email || "Laden..."}
            </p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-500 font-medium text-sm hover:bg-red-50 rounded-lg"
        >
          <LogOut size={16} /> Abmelden
        </button>
      </div>
    </div>
    <div className="flex-1 lg:ml-64 p-8">
      {dashboardView === "overview" && (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSendWhatsappSurvey();
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm"
              >
                <Send size={16} /> Feedback anfordern
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-2">
                Aktuelle Stimmung
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {dashboardData.moodScore}
                </span>
                <span className="text-gray-400 text-lg">/ 10</span>
              </div>
              <div className="flex items-center text-emerald-700 text-sm font-medium bg-emerald-50 inline-block px-2 py-1 rounded">
                <TrendingUp size={14} className="mr-1" /> stabil
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-2">
                Teilnahmequote
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {dashboardData.participation}%
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {dashboardData.responses} Antworten erhalten
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div
                  className="bg-emerald-600 h-1.5 rounded-full"
                  style={{ width: "86%" }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-sm font-medium mb-2">
                Top Thema
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">
                {dashboardData.topTopic}
              </div>
              <div className="text-sm text-gray-500">
                Häufig im Freitext erwähnt
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b flex justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" /> KI-Berichte
              </h3>
            </div>
            {aiReports && aiReports.length > 0 ? (
              aiReports.map((r: any) => (
                <div key={r.id} className="p-6 border-b">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-sm flex items-center gap-2">
                      <Activity size={16} /> Analyse (
                      {r.date?.seconds
                        ? new Date(r.date.seconds * 1000).toLocaleDateString()
                        : "Datum unbekannt"}
                      )
                    </h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{r.summary}</p>
                  {r.actionItems && (
                    <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <h5 className="font-bold text-sm text-yellow-800 flex items-center gap-2 mb-2">
                        <User size={16} />
                        Handlungsvorschläge
                      </h5>
                      <ul className="list-disc pl-5 text-yellow-900">
                        {r.actionItems.map((item: string, i: number) => (
                          <li key={i} className="text-sm mb-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Noch keine Daten verfügbar. Starten Sie eine Umfrage!
              </div>
            )}
          </div>
        </>
      )}
      {dashboardView === "employees" && (
        <div className="max-w-4xl">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus size={18} /> Mitarbeiter hinzufügen
            </h3>
            <form onSubmit={handleAddEmployee} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                />
                <select
                  className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  value={newEmpRole}
                  onChange={(e) => setNewEmpRole(e.target.value)}
                >
                  <option value="MPA">MPA</option>
                  <option value="Arzt">Arzt</option>
                </select>
              </div>
              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Phone size={16} />
                </div>
                <input
                  type="text"
                  placeholder="WhatsApp (+41...)"
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                  value={newEmpPhone}
                  onChange={(e) => setNewEmpPhone(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {employees.map((emp: any) => (
              <div
                key={emp.id}
                className="p-4 border-b flex justify-between items-center hover:bg-gray-50"
              >
                <span>{emp.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{emp.phone}</span>
                  <button
                    className="text-gray-400 hover:text-red-500 transition"
                    onClick={() => handleDeleteEmployee(emp.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const Footer = ({ setCurrentPage }: any) => (
  <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          <Activity className="text-emerald-500" />
          <span className="font-bold text-xl">PulseCheck</span>
        </div>
        <p className="text-gray-400 text-sm">
          Einfaches Feedback & HR für das Gesundheitswesen. <br />
          Made in Switzerland 🇨🇭
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Produkt</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li
            onClick={() => setCurrentPage("pricing")}
            className="cursor-pointer hover:text-white transition"
          >
            Preise
          </li>
          <li
            onClick={() => setCurrentPage("funktionen")}
            className="cursor-pointer hover:text-white transition"
          >
            Funktionen
          </li>
          <li
            onClick={() => setCurrentPage("sicherheit")}
            className="cursor-pointer hover:text-white transition"
          >
            Sicherheit
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Unternehmen</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li
            onClick={() => setCurrentPage("about")}
            className="cursor-pointer hover:text-white transition"
          >
            Über uns
          </li>
          <li
            onClick={() => setCurrentPage("blog")}
            className="cursor-pointer hover:text-white transition"
          >
            Blog
          </li>
          <li
            onClick={() => setCurrentPage("kontakt")}
            className="cursor-pointer hover:text-white transition"
          >
            Kontakt
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Rechtliches</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li
            onClick={() => setCurrentPage("impressum")}
            className="cursor-pointer hover:text-white transition"
          >
            Impressum
          </li>
          <li
            onClick={() => setCurrentPage("datenschutz")}
            className="cursor-pointer hover:text-white transition"
          >
            Datenschutz
          </li>
          <li
            onClick={() => setCurrentPage("agb")}
            className="cursor-pointer hover:text-white transition"
          >
            AGB
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardView, setDashboardView] = useState("overview");
  const [employees, setEmployees] = useState<any[]>([]);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpPhone, setNewEmpPhone] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("MPA");
  const [aiReports, setAiReports] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setEmployees([]);
        setAiReports([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const qEmp = query(
      collection(db, "employees"),
      where("userId", "==", currentUser.uid)
    );
    const unsubEmp = onSnapshot(qEmp, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setEmployees(list);
    });
    const qAI = query(collection(db, "ai_reports"), limit(10));
    const unsubAI = onSnapshot(qAI, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.userId || data.userId === currentUser.uid) {
          list.push({ id: doc.id, ...data });
        }
      });
      list.sort((a, b) => b.date?.seconds - a.date?.seconds);
      setAiReports(list);
    });
    return () => {
      unsubEmp();
      unsubAI();
    };
  }, [currentUser]);

  const dashboardData = {
    moodScore: 7.6,
    moodChange: 0.3,
    participation: 86,
    responses: "24 / 28",
    topTopic: "Organisation",
    aiSummary: "Lade...",
    actionItems: [],
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setCurrentPage("dashboard");
    } catch (error: any) {
      setAuthError(error.message);
    }
  };
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        authEmail,
        authPassword
      );
      await sendEmailVerification(cred.user);
      alert("Bestätigungs-Email gesendet!");
      setCurrentPage("dashboard");
    } catch (error: any) {
      setAuthError(error.message);
    }
  };
  const handlePasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset Email gesendet!");
      return true;
    } catch (error: any) {
      setAuthError(error.message);
      return false;
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  // --- PHONE VALIDATION LOGIC ---
  const handleAddEmployee = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmpName) return;

    // Bereinigen: Leerzeichen und Bindestriche weg
    let cleanedPhone = newEmpPhone.replace(/[\s-]/g, "");

    // Wenn Nummer mit "0" beginnt (z.B. 079...), ersetze "0" durch "+41"
    if (cleanedPhone.startsWith("0")) {
      cleanedPhone = "+41" + cleanedPhone.substring(1);
    }
    // Wenn keine Vorwahl, füge +41 hinzu (optional, falls User 79... eingibt)
    else if (!cleanedPhone.startsWith("+")) {
      cleanedPhone = "+41" + cleanedPhone;
    }

    // Einfacher Check: Ist es lang genug?
    if (cleanedPhone.length < 10) {
      alert("Bitte gültige Nummer eingeben (z.B. 079 123 45 67).");
      return;
    }

    try {
      await addDoc(collection(db, "employees"), {
        name: newEmpName,
        role: newEmpRole,
        phone: cleanedPhone, // Gespeicherte, saubere Nummer
        status: "Eingeladen",
        userId: currentUser.uid,
        createdAt: new Date(),
      });
      setNewEmpName("");
      setNewEmpPhone("");
    } catch (e: any) {
      alert("Fehler beim Speichern: " + e.message);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm("Löschen?")) return;
    try {
      await deleteDoc(doc(db, "employees", id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSendWhatsappSurvey = async () => {
    if (!currentUser) {
      alert("Fehler: Nicht eingeloggt.");
      return;
    }

    if (
      !window.confirm(
        `Jetzt WhatsApp-Umfrage an ${employees.length} Mitarbeiter senden?`
      )
    )
      return;

    try {
      const response = await fetch("/api/send-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.uid,
        }),
      });

      if (response.ok) {
        alert("WhatsApp-Umfrage wurde gestartet!");
      } else {
        const text = await response.text();
        throw new Error(`Server antwortete mit Fehler: ${text}`);
      }
    } catch (e: any) {
      alert("Fehler: " + e.message);
    }
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="flex-grow">
        {currentPage === "home" && <Hero setCurrentPage={setCurrentPage} />}
        {currentPage === "about" && <About />}
        {currentPage === "blog" && <Blog />}
        {currentPage === "pricing" && (
          <Pricing setCurrentPage={setCurrentPage} />
        )}
        {currentPage === "impressum" && <Impressum />}
        {currentPage === "datenschutz" && <Datenschutz />}
        {currentPage === "agb" && <AGB />}
        {currentPage === "funktionen" && <Funktionen />}
        {currentPage === "sicherheit" && <Sicherheit />}
        {currentPage === "kontakt" && <Kontakt />}
        {currentPage === "login" && (
          <AuthScreen
            type="login"
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            handlePasswordReset={handlePasswordReset}
            authEmail={authEmail}
            setAuthEmail={setAuthEmail}
            authPassword={authPassword}
            setAuthPassword={setAuthPassword}
            authError={authError}
            setAuthError={setAuthError}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "register" && (
          <AuthScreen
            type="register"
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            authEmail={authEmail}
            setAuthEmail={setAuthEmail}
            authPassword={authPassword}
            setAuthPassword={setAuthPassword}
            authError={authError}
            setAuthError={setAuthError}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "dashboard" && (
          <Dashboard
            key={currentUser?.uid || "guest"}
            dashboardView={dashboardView}
            setDashboardView={setDashboardView}
            currentUser={currentUser}
            handleLogout={handleLogout}
            dashboardData={dashboardData}
            employees={employees}
            newEmpName={newEmpName}
            setNewEmpName={setNewEmpName}
            newEmpRole={newEmpRole}
            setNewEmpRole={setNewEmpRole}
            newEmpPhone={newEmpPhone}
            setNewEmpPhone={setNewEmpPhone}
            handleAddEmployee={handleAddEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
            handleSendWhatsappSurvey={handleSendWhatsappSurvey}
            aiReports={aiReports}
          />
        )}
      </div>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;
