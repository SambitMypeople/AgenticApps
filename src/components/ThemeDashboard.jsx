import React, { useState } from 'react';
import { getContrastRatio, passesWCAGAA } from '../utils/colorUtils';

const defaultTokens = {
  'mp-white': '#ffffff',
  'mp-black': '#000000',
  'mp-bg': '#f8f9fa',
  'mp-body-text': '#333333',
  'mp-link-text': '#0066cc',
  'mp-primary': '#0f62fe',
  'mp-primary-hover': '#0353e9',
  'mp-button-text': '#ffffff',
  'mp-secondary': '#393939',
  'mp-secondary-hover': '#474747',
  'mp-menu-bg': '#ffffff',
  'mp-menu-font-text': '#161616',
  'mp-menu-bottom-line': '#e0e0e0',
  'mp-border': '#c6c6c6',
  'mp-header-light-bg': '#f4f4f4',
  'mp-header-dark-bg': '#262626',
  'mp-footer-bg': '#161616',
  'mp-footer-font-text': '#f4f4f4',
};

const ThemeDashboard = ({ tokens, setTokens, onSave, logoPreview, setLogoPreview, setLogoFile }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTokens((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const ContrastBadge = ({ fg, bg, label }) => {
    const ratio = getContrastRatio(tokens[fg], tokens[bg]);
    const passes = passesWCAGAA(ratio);
    return (
      <div className="flex items-center justify-between text-[14px] mt-1 p-3 bg-white rounded-xl border border-border-generic">
        <span className="text-black-500 font-roboto">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{ratio}:1</span>
          <span className={`px-3 py-1 rounded-full text-[12px] font-medium font-roboto ${passes ? 'bg-success-bg text-success-text' : 'bg-error-bg text-error-text'}`}>
            {passes ? 'PASS' : 'FAIL'}
          </span>
        </div>
      </div>
    );
  };

  const ColorInput = ({ name, label }) => (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-[16px] font-semibold text-black-default font-roboto">{label}</label>
      <div className="flex gap-3 items-center">
        <input 
          type="color" 
          name={name} 
          value={tokens[name]} 
          onChange={handleChange}
          className="w-12 h-[50px] rounded-xl cursor-pointer border-border-generic p-1 bg-white"
        />
        <input 
          type="text" 
          name={name} 
          value={tokens[name].toUpperCase()} 
          onChange={handleChange}
          className="flex-1 min-h-[50px] border border-border-generic rounded-xl px-4 text-[14px] font-roboto focus:outline-none focus:border-edit-border focus:ring-1 focus:ring-edit-border"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-page-bg border-r border-border-generic w-[450px] h-screen overflow-y-auto flex flex-col font-roboto">
      <div className="p-6 border-b border-border-generic bg-white">
        <h2 className="text-[28px] font-semibold text-black-default font-inter leading-[36px]">Theme Configurator</h2>
        <p className="text-[14px] text-black-400 mt-1 leading-[24px]">Design your custom brand theme.</p>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-8">
        {/* Logo Upload */}
        <section>
          <h3 className="text-[20px] font-medium text-black-default mb-4 font-roboto">Branding</h3>
          <div className="flex flex-col gap-3">
            <label className="text-[16px] font-semibold text-black-default font-roboto">Company Logo</label>
            {logoPreview && (
              <div className="w-full h-32 border border-border-generic rounded-xl flex items-center justify-center p-4 bg-white">
                <img src={logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoChange}
              className="text-[14px] text-black-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[14px] file:font-medium file:bg-black-50 file:text-black-default hover:file:bg-black-100 cursor-pointer"
            />
          </div>
        </section>

        {/* Global Colors */}
        <section>
          <h3 className="text-[20px] font-medium text-black-default mb-4 font-roboto">Global</h3>
          <ColorInput name="mp-bg" label="Page Background" />
          <ColorInput name="mp-body-text" label="Body Text" />
          <ColorInput name="mp-link-text" label="Link Text" />
          <ColorInput name="mp-border" label="Border Color" />
          <ColorInput name="mp-white" label="White (Base)" />
          <ColorInput name="mp-black" label="Black (Base)" />
          
          <h4 className="text-[16px] font-semibold text-black-default mt-6 mb-2 font-roboto">Contrast Check</h4>
          <ContrastBadge fg="mp-body-text" bg="mp-bg" label="Body Text vs Background" />
        </section>

        {/* Primary/Secondary */}
        <section>
          <h3 className="text-[20px] font-medium text-black-default mb-4 font-roboto">Brand Colors</h3>
          <ColorInput name="mp-primary" label="Primary Color" />
          <ColorInput name="mp-primary-hover" label="Primary Hover" />
          <ColorInput name="mp-button-text" label="Primary Button Text" />
          <ColorInput name="mp-secondary" label="Secondary Color" />
          <ColorInput name="mp-secondary-hover" label="Secondary Hover" />

          <h4 className="text-[16px] font-semibold text-black-default mt-6 mb-2 font-roboto">Contrast Check</h4>
          <ContrastBadge fg="mp-button-text" bg="mp-primary" label="Button Text vs Primary" />
        </section>

        {/* Header & Menu */}
        <section>
          <h3 className="text-[20px] font-medium text-black-default mb-4 font-roboto">Header & Menu</h3>
          <ColorInput name="mp-menu-bg" label="Top Menu Background" />
          <ColorInput name="mp-menu-font-text" label="Top Menu Text" />
          <ColorInput name="mp-menu-bottom-line" label="Top Menu Bottom Line" />
          <ColorInput name="mp-header-light-bg" label="Header Light Banner" />
          <ColorInput name="mp-header-dark-bg" label="Header Dark Banner" />

          <h4 className="text-[16px] font-semibold text-black-default mt-6 mb-2 font-roboto">Contrast Check</h4>
          <ContrastBadge fg="mp-menu-font-text" bg="mp-menu-bg" label="Menu Text vs Menu BG" />
        </section>

        {/* Footer */}
        <section>
          <h3 className="text-[20px] font-medium text-black-default mb-4 font-roboto">Footer</h3>
          <ColorInput name="mp-footer-bg" label="Footer Background" />
          <ColorInput name="mp-footer-font-text" label="Footer Text" />

          <h4 className="text-[16px] font-semibold text-black-default mt-6 mb-2 font-roboto">Contrast Check</h4>
          <ContrastBadge fg="mp-footer-font-text" bg="mp-footer-bg" label="Footer Text vs Footer BG" />
        </section>
      </div>

      <div className="p-6 border-t border-border-generic bg-white sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-3">
        <button 
          onClick={onSave}
          className="w-full bg-mp-green-700 hover:bg-mp-green-800 text-white min-h-[60px] rounded-xl text-[16px] font-medium transition-colors cursor-pointer"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export { defaultTokens };
export default ThemeDashboard;
