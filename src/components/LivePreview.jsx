import React from 'react';

const LivePreview = ({ tokens, logoPreview }) => {
  // We apply the tokens as inline CSS variables to the root wrapper of the preview
  const styleVariables = Object.keys(tokens).reduce((acc, key) => {
    acc[`--${key}`] = tokens[key];
    return acc;
  }, {});

  return (
    <div className="flex-1 bg-black-50 p-8 flex justify-center items-start overflow-y-auto h-screen font-roboto">
      <div 
        className="w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden flex flex-col"
        style={{
          ...styleVariables,
          backgroundColor: 'var(--mp-bg)',
          color: 'var(--mp-body-text)'
        }}
      >
        {/* Top Menu */}
        <nav 
          className="flex justify-between items-center px-8 py-4"
          style={{
            backgroundColor: 'var(--mp-menu-bg)',
            color: 'var(--mp-menu-font-text)',
            borderBottom: '2px solid var(--mp-menu-bottom-line)'
          }}
        >
          <div className="flex items-center gap-3">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-black-200"></div>
            )}
            <span className="font-bold text-[24px] font-inter">MyCompany</span>
          </div>
          <div className="flex gap-8 font-medium text-[16px]">
            <a href="#" className="hover:opacity-70 transition-opacity">Products</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Solutions</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Pricing</a>
          </div>
        </nav>

        {/* Hero Header */}
        <header 
          className="px-12 py-24 text-center"
          style={{
            background: `linear-gradient(135deg, var(--mp-header-light-bg) 0%, var(--mp-header-dark-bg) 100%)`,
          }}
        >
          <h1 className="text-[56px] font-bold mb-6 font-serif leading-[64px] tracking-[-0.25px]" style={{ color: 'var(--mp-white)' }}>
            Build Something Amazing
          </h1>
          <p className="text-[16px] max-w-3xl mx-auto mb-10 opacity-90 leading-[26px]" style={{ color: 'var(--mp-white)' }}>
            A unified platform to configure, manage, and deploy your design system seamlessly across all environments.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              className="h-[60px] px-[24px] rounded-xl text-[16px] font-medium transition-colors"
              style={{
                backgroundColor: 'var(--mp-primary)',
                color: 'var(--mp-button-text)'
              }}
            >
              Get Started
            </button>
            <button 
              className="h-[60px] px-[24px] rounded-xl text-[16px] font-medium transition-colors"
              style={{
                backgroundColor: 'var(--mp-secondary)',
                color: 'var(--mp-white)',
                border: '2px solid var(--mp-black)'
              }}
            >
              Learn More
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-12 py-16 flex flex-col gap-12">
          <section>
            <h2 className="text-[36px] font-bold mb-4 font-serif leading-[44px] tracking-[-0.25px]">Welcome to the Dashboard</h2>
            <p className="mb-4 text-[16px] leading-[26px]">
              This is a demonstration of your configured body text color. Links will appear like <a href="#" className="font-medium hover:underline" style={{ color: 'var(--mp-link-text)' }}>this example link</a>. The contrast must be sufficient according to WCAG AA guidelines.
            </p>
          </section>

          {/* Design.md Components Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Form Inputs & Buttons */}
            <section 
              className="p-8 rounded-2xl bg-white flex flex-col gap-6"
              style={{ border: '1px solid var(--mp-border)' }}
            >
              <h3 className="text-[32px] font-semibold mb-2 font-inter leading-[40px]">Form Controls</h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-semibold font-roboto">Email Address</label>
                <input 
                  type="text" 
                  placeholder="name@example.com"
                  className="w-full min-h-[50px] rounded-xl px-[12px] border border-border-generic text-[14px] font-roboto bg-white"
                />
                <span className="text-[12px] text-black-300">We'll never share your email.</span>
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  className="flex-1 h-[50px] rounded-xl text-[14px] font-medium transition-colors"
                  style={{ backgroundColor: 'var(--mp-primary)', color: 'var(--mp-button-text)' }}
                >
                  Submit Form
                </button>
                <button 
                  className="flex-1 h-[50px] rounded-xl text-[14px] font-medium transition-colors bg-black-50 text-black-default hover:bg-black-100"
                >
                  Cancel
                </button>
              </div>
            </section>

            {/* Avatars & Tags */}
            <section 
              className="p-8 rounded-2xl bg-white flex flex-col gap-6"
              style={{ border: '1px solid var(--mp-border)' }}
            >
              <h3 className="text-[32px] font-semibold mb-2 font-inter leading-[40px]">Users & Status</h3>
              
              <div className="flex gap-4 items-center mb-4">
                {/* Large Avatar */}
                <div className="w-[80px] h-[80px] rounded-[16px] border border-border-generic flex items-center justify-center bg-black-50 relative">
                  <span className="text-[16px] font-semibold">JD</span>
                  <div className="absolute -bottom-1 -right-1 w-[14px] h-[14px] bg-success-border rounded-full border-2 border-white"></div>
                </div>
                {/* Medium Avatar */}
                <div className="w-[56px] h-[56px] rounded-[16px] border border-border-generic flex items-center justify-center bg-black-50 relative">
                  <span className="text-[16px] font-semibold">AS</span>
                  <div className="absolute -bottom-1 -right-1 w-[12px] h-[12px] bg-success-border rounded-full border-2 border-white"></div>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full bg-success-bg text-success-text text-[13px] font-medium border border-success-border">Active</span>
                <span className="px-4 py-1.5 rounded-full bg-error-bg text-error-text text-[13px] font-medium border border-error-border">Error</span>
                <span className="px-4 py-1.5 rounded-full bg-alert-bg text-alert-text text-[13px] font-medium border border-alert-border">Pending</span>
              </div>
            </section>

          </div>

          {/* Table */}
          <section className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--mp-border)' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="bg-black-50 text-[14px] font-medium p-[12px] border-b-2 border-success-border h-[50px]">Project Name ▼</th>
                  <th className="bg-black-50 text-[14px] font-medium p-[12px] border-b-2 border-success-border h-[50px]">Status</th>
                  <th className="bg-black-50 text-[14px] font-medium p-[12px] border-b-2 border-success-border h-[50px]">Date Modified</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-mp-blue-50 border-b border-border-generic group transition-colors cursor-pointer">
                  <td className="p-[16px] text-[14px] h-[50px] group-hover:border-black-300">Website Redesign</td>
                  <td className="p-[16px] text-[14px] h-[50px] group-hover:border-black-300">
                    <span className="text-success-text bg-success-bg px-2 py-1 rounded-full text-xs">Live</span>
                  </td>
                  <td className="p-[16px] text-[14px] h-[50px] group-hover:border-black-300">May 12, 2026</td>
                </tr>
                <tr className="hover:bg-mp-blue-50 border-b border-border-generic group transition-colors cursor-pointer">
                  <td className="p-[16px] text-[14px] h-[50px] group-hover:border-black-300">Mobile App V2</td>
                  <td className="p-[16px] text-[14px] h-[50px] group-hover:border-black-300">
                    <span className="text-alert-text bg-alert-bg px-2 py-1 rounded-full text-xs">In Progress</span>
                  </td>
                  <td className="p-[16px] text-[14px] h-[50px] group-hover:border-black-300">May 10, 2026</td>
                </tr>
              </tbody>
            </table>
          </section>

        </main>

        {/* Footer */}
        <footer 
          className="mt-auto px-12 py-12 text-center text-[14px]"
          style={{
            backgroundColor: 'var(--mp-footer-bg)',
            color: 'var(--mp-footer-font-text)'
          }}
        >
          <p>&copy; {new Date().getFullYear()} MyCompany Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LivePreview;
