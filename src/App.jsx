import React, { useState } from 'react';
import ThemeDashboard, { defaultTokens } from './components/ThemeDashboard';
import LivePreview from './components/LivePreview';

function App() {
  const [tokens, setTokens] = useState(defaultTokens);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveTime, setSaveTime] = useState(null);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('tokens', JSON.stringify(tokens));
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      const response = await fetch('http://localhost:3001/api/save-configuration', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setIsSaved(true);
        setSaveTime(Date.now());
        alert('Configuration saved successfully!\nXML and CSS generated in /public.');
      } else {
        alert('Failed to save configuration.');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving configuration. Is the backend server running?');
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <ThemeDashboard 
        tokens={tokens} 
        setTokens={setTokens} 
        onSave={handleSave} 
        logoPreview={logoPreview}
        setLogoPreview={setLogoPreview}
        setLogoFile={setLogoFile}
        isSaved={isSaved}
        saveTime={saveTime}
      />
      <LivePreview 
        tokens={tokens} 
        logoPreview={logoPreview} 
      />
    </div>
  );
}

export default App;
