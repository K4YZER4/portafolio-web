import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';
import './glass.css';
import fondoUrl from '../fondo.mp4';

const wavePaths = [
  'M-100 150 C200 10 350 300 650 155 S1050 60 1500 180',
  'M-100 161 C200 19 350 307 650 163 S1050 70 1500 185',
  'M-100 172 C200 28 350 314 650 171 S1050 80 1500 190',
  'M-100 183 C200 37 350 321 650 179 S1050 90 1500 195',
  'M-100 194 C200 46 350 328 650 187 S1050 100 1500 200',
  'M-100 205 C200 55 350 335 650 195 S1050 110 1500 205',
  'M-100 216 C200 64 350 342 650 203 S1050 120 1500 210',
  'M-100 227 C200 73 350 349 650 211 S1050 130 1500 215',
  'M-100 238 C200 82 350 356 650 219 S1050 140 1500 220',
  'M-100 249 C200 91 350 363 650 227 S1050 150 1500 225',
  'M-100 260 C200 100 350 370 650 235 S1050 160 1500 230',
  'M-100 271 C200 109 350 377 650 243 S1050 170 1500 235',
  'M-100 282 C200 118 350 384 650 251 S1050 180 1500 240',
  'M-100 293 C200 127 350 391 650 259 S1050 190 1500 245',
];

function Waves() {
  return (
    <div className="wave" aria-hidden="true">
      {[false, true].map((second) => (
        <svg key={String(second)} className={second ? 'second' : ''} viewBox="0 0 1400 500" preserveAspectRatio="none">
          {wavePaths.map((path) => <path key={path} d={path} />)}
        </svg>
      ))}
    </div>
  );
}

function Intro() {
  return (
    <section id="intro" aria-label="Entrada al explorador de archivos">
      <button className="skip" id="skip">Saltar intro →</button>
      <div className="stage" id="stage">
        <button className="entry" id="entry" aria-label="Abrir el explorador de archivos">
          <svg viewBox="0 0 120 94" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="back" x1="10" y1="10" x2="95" y2="80" gradientUnits="userSpaceOnUse"><stop stopColor="#aab3c1" /><stop offset="1" stopColor="#4b5463" /></linearGradient>
              <linearGradient id="front" x1="22" y1="28" x2="90" y2="92" gradientUnits="userSpaceOnUse"><stop stopColor="#dbe1eb" /><stop offset="1" stopColor="#7f8b9e" /></linearGradient>
            </defs>
            <path d="M8 23a8 8 0 0 1 8-8h28l10 11h49a8 8 0 0 1 8 8v43H8z" fill="url(#back)" stroke="#d8dfeb" strokeOpacity=".6" />
            <rect x="20" y="28" width="76" height="40" rx="4" fill="#dfe5ef" opacity=".6" />
            <rect x="24" y="32" width="76" height="40" rx="4" fill="#f0f3f8" opacity=".9" />
            <g className="front"><path d="M8 39a8 8 0 0 1 8-8h91a7 7 0 0 1 7 8l-7 38a8 8 0 0 1-8 7H20a8 8 0 0 1-8-7z" fill="url(#front)" stroke="#e6ebf4" strokeOpacity=".75" /><path d="M20 38h80" stroke="#fff" strokeOpacity=".4" /></g>
          </svg>
        </button>
        <svg className="cursor" viewBox="0 0 30 38" aria-hidden="true"><path d="M3 2v29l7-7 6 12 5-3-6-11 11-1z" fill="#f1f4fa" stroke="#151922" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      </div>
      <div className="entryhint">ABRIR EXPLORADOR</div>
    </section>
  );
}

function Workspace() {
  return (
    <div id="app" inert={true}>
      <header className="titlebar">
        <div className="dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="title">Horacio — personal workspace</span>
        <div className="quicksearch"><input id="searchInput" placeholder="Buscar archivos…  Ctrl K" aria-label="Buscar archivos" readOnly /></div>
        <button className="smallbtn" id="waveToggle" aria-pressed="true">Onda: ON</button>
        <button className="smallbtn replaybtn" id="replay" hidden aria-hidden="true" />
      </header>
      <div className="main">
        <nav className="rail" aria-label="Accesos del editor"><button className="active" id="filesButton" aria-label="Mostrar explorador" /><button id="searchButton" aria-label="Buscar archivos" /><button id="stackButton" aria-label="Abrir stack" /><a className="bottom" id="githubLink" href="https://github.com/K4YZER4" target="_blank" rel="noopener noreferrer" aria-label="Abrir GitHub" /></nav>
        <aside className="explorer" aria-label="Explorador"><div className="explorertitle">EXPLORADOR</div><nav className="tree" id="tree" aria-label="Archivos del portfolio" /><div className="sideprofile"><b>Horacio Alvarez Escobedo</b><br />Backend · APIs · Real-Time Systems<br />@K4YZER4</div></aside>
        <main className="editor"><Waves /><nav className="tabs" id="tabs" aria-label="Pestañas abiertas" /><div className="crumbbar"><button className="mobilemenu" id="mobilemenu" aria-label="Mostrar árbol de archivos">☰</button><nav className="crumb" id="crumb" aria-label="Ruta del archivo" /><div className="modes"><button id="preview" className="active">Vista previa</button><button id="source">Código</button></div></div><div className="editorbody" id="document" aria-label="Documento actual" /></main>
      </div>
      <footer className="status"><span>⌁ main</span><span>Workspace personal</span><div className="right"><span id="lineCount" /><span>UTF-8</span><span id="language">Markdown</span></div></footer>
    </div>
  );
}

function App() {
  useEffect(() => {
    window.history.replaceState(null, '', '#readme');
    import('../app.js').then(() => import('./hover-navigation.js'));
  }, []);

  return <><video className="background-video" src={fondoUrl} autoPlay loop muted playsInline aria-hidden="true" /><Intro /><Workspace /><dialog className="dialog" id="palette" aria-label="Buscar archivos"><div className="dialoghead"><input id="paletteQuery" placeholder="Buscar archivo o contenido…" aria-label="Buscar archivo o contenido" /><button id="closePalette" aria-label="Cerrar búsqueda">Esc</button></div><div className="results" id="results" /></dialog><div className="toast" id="toast" role="status" hidden /></>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
