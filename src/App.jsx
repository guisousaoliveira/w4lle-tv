import { useState, useEffect } from 'react';
import { SidebarClose, SidebarOpen, Maximize, Minimize } from 'lucide-react'; 
import { ChannelList } from './components/ChannelList';
import { MosaicGrid } from './components/MosaicGrid';
import { Controls } from './components/Controls';
import { BASE_URL } from './data/channels';
import './index.css';

export default function App() {
  
  // 1. INICIALIZAÇÃO INTELIGENTE (Carrega do LocalStorage)
  const [mosaicSlots, setMosaicSlots] = useState(() => {
    // Tenta pegar o que estava salvo
    const saved = localStorage.getItem('w4lle_slots');
    // Se existir, converte de volta para objeto. Se não, usa o padrão vazio.
    return saved ? JSON.parse(saved) : { 1: null, 2: null, 3: null, 4: null };
  });

  const [activeSlot, setActiveSlot] = useState(1);
  const [isEditing, setIsEditing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 2. SALVAMENTO AUTOMÁTICO (Sempre que mudar os canais)
  useEffect(() => {
    localStorage.setItem('w4lle_slots', JSON.stringify(mosaicSlots));
  }, [mosaicSlots]);

  // --- Lógica de Fullscreen ---
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.log(e));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // --- Lógica de Canais ---
  const handlePlayChannel = (channelIdOrUrl, isCustom = false) => {
    const fullUrl = isCustom ? channelIdOrUrl : `${BASE_URL}${channelIdOrUrl}`;

    if (!isEditing) {
      alert("Clique em EDITAR para mudar canais!");
      return;
    }

    const isDuplicate = Object.values(mosaicSlots).includes(fullUrl);
    if (isDuplicate) {
      alert("⚠️ Canal já aberto em outra tela!");
      return;
    }

    setMosaicSlots(prev => ({ ...prev, [activeSlot]: fullUrl }));
    setActiveSlot(prev => (prev % 4) + 1);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {!sidebarOpen && (
        <>
          <button 
            className="floating-btn pos-menu" 
            onClick={() => setSidebarOpen(true)}
            title="Abrir Menu"
          >
            <SidebarOpen size={24} />
          </button>
          <button 
            className="floating-btn pos-fullscreen" 
            onClick={toggleFullScreen}
            title={isFullScreen ? "Sair da Tela Cheia" : "Tela Cheia"}
          >
            {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </>
      )}

      <aside 
        className={sidebarOpen ? '' : 'closed'}
        style={{ 
          width: '280px', 
          background: 'var(--bg-panel)', 
          display: 'flex', flexDirection: 'column', borderRight: '1px solid #333' 
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h1 style={{ color: 'var(--primary)', margin: 0, letterSpacing: '2px', fontSize: '1.5rem' }}>W4LLE TV</h1>
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
            >
              <SidebarClose size={20} />
            </button>
          </div>
          
          <Controls isEditing={isEditing} setIsEditing={setIsEditing} />
        </div>
        
        <ChannelList onSelectChannel={handlePlayChannel} />
      </aside>

      <main style={{ flex: 1, background: 'black', position: 'relative' }}>
        <MosaicGrid 
          slots={mosaicSlots} 
          setMosaicSlots={setMosaicSlots}
          activeSlot={activeSlot} 
          setActiveSlot={setActiveSlot}
          isEditing={isEditing} 
        />
      </main>
    </div>
  );
}