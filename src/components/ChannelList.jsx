import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Play, Link as LinkIcon, Plus } from 'lucide-react';
import { channelGroups } from '../data/channels';

export function ChannelList({ onSelectChannel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customLink, setCustomLink] = useState(''); // Estado para o link
  const [openGroups, setOpenGroups] = useState({});

  useEffect(() => {
    if (searchTerm) {
      const allOpened = {};
      channelGroups.forEach(group => {
        if (group.channels.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
          allOpened[group.name] = true;
        }
      });
      setOpenGroups(allOpened);
    }
  }, [searchTerm]);

  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  // --- LÓGICA DE CONVERSÃO DE LINK ---
  const handleCustomLink = () => {
    if (!customLink) return;

    let finalUrl = customLink;

    // 1. Converte YouTube (watch?v=ID -> embed/ID)
    if (customLink.includes('youtube.com/watch?v=')) {
      const videoId = customLink.split('v=')[1].split('&')[0];
      finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } 
    // 2. Converte YouTube Short (youtu.be/ID -> embed/ID)
    else if (customLink.includes('youtu.be/')) {
      const videoId = customLink.split('youtu.be/')[1].split('?')[0];
      finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // 3. Converte Twitch (twitch.tv/USER -> player embed)
    else if (customLink.includes('twitch.tv/')) {
      const channel = customLink.split('twitch.tv/')[1];
      finalUrl = `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
    }

    // Manda pro App tocar (passando true no segundo argumento para indicar que é link direto)
    onSelectChannel(finalUrl, true);
    setCustomLink(''); // Limpa o campo
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      <div style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Busca */}
        <div style={{ 
          display: 'flex', alignItems: 'center', background: '#0f0f13', 
          border: '1px solid #333', borderRadius: '4px', padding: '8px' 
        }}>
          <Search size={16} color="#666" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Pesquisar canal..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              background: 'transparent', border: 'none', color: 'white', 
              width: '100%', outline: 'none', fontSize: '0.9rem' 
            }}
          />
        </div>

        {/* --- CAMPO DE LINK CUSTOMIZADO --- */}
        <div style={{ display: 'flex', gap: '5px' }}>
          <div style={{ 
            flex: 1, display: 'flex', alignItems: 'center', background: '#0f0f13', 
            border: '1px solid #333', borderRadius: '4px', padding: '8px' 
          }}>
            <LinkIcon size={16} color="#666" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Link Youtube/Twitch..." 
              value={customLink}
              onChange={(e) => setCustomLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomLink()}
              style={{ 
                background: 'transparent', border: 'none', color: 'white', 
                width: '100%', outline: 'none', fontSize: '0.8rem' 
              }}
            />
          </div>
          <button 
            onClick={handleCustomLink}
            className="btn-primary"
            style={{ padding: '0 12px', background: '#333' }}
            title="Adicionar à tela"
          >
            <Plus size={16} />
          </button>
        </div>

      </div>

      {/* Lista Rolável (Mantida Igual) */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {channelGroups.map((group) => {
          const filteredChannels = group.channels.filter(channel => 
            channel.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (searchTerm && filteredChannels.length === 0) return null;
          const isOpen = openGroups[group.name];

          return (
            <div key={group.name}>
              <div 
                onClick={() => toggleGroup(group.name)}
                className="group-header"
                style={{
                  padding: '12px 15px', background: '#202024', borderBottom: '1px solid #2d2d30',
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#e0e0e0'
                }}
              >
                <span>{group.name}</span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>

              {isOpen && (
                <div style={{ background: '#121214' }}>
                  {filteredChannels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => onSelectChannel(channel.id, false)} // False = não é custom link
                      className="channel-item"
                      style={{
                        width: '100%', textAlign: 'left', padding: '10px 15px 10px 25px',
                        background: 'transparent', border: 'none', borderBottom: '1px solid #1e1e1e',
                        color: '#aaa', cursor: 'pointer', fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', transition: 'all 0.2s'
                      }}
                    >
                      <Play size={12} style={{ marginRight: '8px', opacity: 0.5 }} />
                      {channel.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}