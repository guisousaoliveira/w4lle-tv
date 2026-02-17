import { Monitor, X } from 'lucide-react';
// Importamos os dados para poder buscar o nome do canal
import { channelGroups, BASE_URL } from '../data/channels'; 

export function MosaicGrid({ slots, setMosaicSlots, activeSlot, setActiveSlot, isEditing }) {
  
  const activeScreens = Object.entries(slots).filter(([_, url]) => url !== null);
  const count = activeScreens.length;
  const lastActiveSlotId = count > 0 ? activeScreens[activeScreens.length - 1][0] : null;

  // --- FUNÇÃO PARA DESCOBRIR O NOME DO CANAL ---
  const getChannelName = (url) => {
    if (!url) return null;

    // 1. Se for um canal padrão (da nossa lista)
    if (url.startsWith(BASE_URL)) {
      const id = url.replace(BASE_URL, '');
      
      // Procura em todos os grupos
      for (const group of channelGroups) {
        const found = group.channels.find(c => c.id === id);
        if (found) return found.name;
      }
      return id; // Se não achar o nome, mostra o ID mesmo
    }

    // 2. Se for link externo (Youtube/Twitch)
    if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('twitch')) return 'Twitch';
    
    return 'Link Externo';
  };

  const clearSlot = (e, slotId) => {
    e.stopPropagation();
    setMosaicSlots(prev => ({ ...prev, [slotId]: null }));
  };

  const getGridStyle = () => {
    if (isEditing) return { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
    if (count === 1) return { display: 'flex' };
    if (count === 2) return { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' };
    return { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
  };

  return (
    <div style={{ width: '100%', height: '100%', gap: '2px', background: '#000', ...getGridStyle() }}>
      {[1, 2, 3, 4].map(slotId => {
        const url = slots[slotId];
        const isActive = activeSlot === slotId;
        const showSlot = isEditing || url; 
        
        if (!showSlot) return null;

        const spanFullWidth = !isEditing && count === 3 && String(slotId) === lastActiveSlotId;
        const channelName = getChannelName(url); // Pega o nome aqui

        return (
          <div 
            key={slotId}
            onClick={() => setActiveSlot(slotId)}
            className={`mosaic-slot ${isEditing ? 'editing' : 'viewing'} ${isActive ? 'active' : ''}`}
            style={{ 
              cursor: 'pointer',
              gridColumn: spanFullWidth ? '1 / -1' : 'auto',
              position: 'relative'
            }}
          >
            {isEditing && (
              <div style={{ 
                position: 'absolute', top: '5px', left: '5px', right: '5px',
                display: 'flex', justifyContent: 'space-between', zIndex: 20 
              }}>
                {/* ETIQUETA COM O NOME DO CANAL */}
                <div 
                  className={`slot-label ${isActive ? 'active' : ''}`} 
                  style={{ position: 'static', display: 'flex', gap: '5px', alignItems: 'center' }}
                >
                  <span>TELA {slotId}</span>
                  {channelName && (
                    <span style={{ opacity: 0.7, fontWeight: 'normal', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '5px' }}>
                      {channelName}
                    </span>
                  )}
                </div>
                
                {url && (
                  <button 
                    onClick={(e) => clearSlot(e, slotId)}
                    style={{
                      background: '#ff4444', border: 'none', borderRadius: '4px',
                      color: 'white', padding: '4px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                    }}
                    title="Limpar tela"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                )}
              </div>
            )}
            
            {url && (
              <iframe 
                src={url} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                allowFullScreen 
                allow="encrypted-media; autoplay"
                referrerPolicy="no-referrer"
              />
            )}
            
            {!url && isEditing && (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                <Monitor size={48} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}