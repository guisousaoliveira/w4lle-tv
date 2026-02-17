export function Controls({ isEditing, setIsEditing }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button 
        className="btn-primary"
        style={{ 
          background: isEditing ? '#00ff88' : '#333', 
          color: isEditing ? 'black' : 'white',
          border: isEditing ? 'none' : '1px solid #555',
          fontWeight: 'bold',
          padding: '10px'
        }}
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? '✅ Concluir Edição' : '✏️ Editar Mosaico'}
      </button>
    </div>
  );
}