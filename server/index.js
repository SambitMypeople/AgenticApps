import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Setup Multer for file uploads
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.post('/api/save-configuration', upload.single('logo'), (req, res) => {
  try {
    const { tokens } = req.body;
    const parsedTokens = JSON.parse(tokens);
    let logoPath = req.body.existingLogo || '';

    if (req.file) {
      logoPath = `/uploads/${req.file.filename}`;
    }

    // 1. Generate XML
    let xmlContent = `<configuration>\n  <assets>\n`;
    if (logoPath) {
      xmlContent += `    <logo path="${logoPath}" />\n`;
    }
    xmlContent += `  </assets>\n  <tokens>\n`;
    
    // Parse tokens and generate CSS string concurrently
    let cssVariables = `:root {\n`;
    for (const [key, value] of Object.entries(parsedTokens)) {
      xmlContent += `    <token name="${key}" value="${value}" />\n`;
      cssVariables += `  --${key}: ${value};\n`;
    }
    
    xmlContent += `  </tokens>\n</configuration>`;
    
    // Fallback variables
    cssVariables += `\n  /* Fallback static properties */\n`;
    cssVariables += `  --mp-font-sans-serif: 'Inter', system-ui, sans-serif;\n`;
    cssVariables += `  --mp-body-font-family: var(--mp-font-sans-serif);\n`;
    cssVariables += `  --mp-body-font-size: 16px;\n`;
    cssVariables += `  --mp-body-font-weight: 400;\n`;
    cssVariables += `  --mp-body-line-height: 1.5;\n`;
    cssVariables += `  --mp-body-text-align: left;\n`;
    cssVariables += `}\n`;

    // Save XML
    fs.writeFileSync(path.join(__dirname, '../public/theme-tokens.xml'), xmlContent);
    
    // Save CSS
    fs.writeFileSync(path.join(__dirname, '../public/variables.css'), cssVariables);

    res.json({ success: true, message: 'Configuration saved successfully', logoPath });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
