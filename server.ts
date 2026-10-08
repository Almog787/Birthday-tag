import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Helper API: Generate customized birthday greeting message in Hebrew
  app.post('/api/generate-greeting', async (req, res) => {
    try {
      const { name, style = 'festive' } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'שם חסר' });
      }

      let wish = `יום הולדת שמח ל${name}! 🎉🎂`;

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI();
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `צור ברכת יום הולדת חגיגית, קצרה ושמחה בעברית עבור ${name}. סגנון: ${style}. עד 8 מילים, עם אימוג'י רלוונטי.`
                  }
                ]
              }
            ]
          });
          if (response.text) {
            wish = response.text.trim();
          }
        } catch (geminiErr: any) {
          console.warn('Gemini API notice:', geminiErr?.message);
        }
      }

      res.json({ success: true, wish });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Birthday Tag Designer Server running on http://localhost:${PORT}`);
  });
}

startServer();
