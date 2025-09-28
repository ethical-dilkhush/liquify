# Liquify Image Generator

Transform your images into surreal liquid art using OpenAI's image editing API. This project creates stunning liquid-form transformations with glowing neon effects.

## Features

- Upload any image format
- AI-powered liquid transformation
- Futuristic neon aesthetic
- Real-time processing feedback
- Clean, responsive interface

## Project Structure

\`\`\`
liquify-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── pages/
│   │   └── index.js
│   ├── package.json
│   └── next.config.js
└── README.md
\`\`\`

## Run Locally

### Backend

\`\`\`bash
cd backend
npm install
node server.js
\`\`\`

The backend will run on http://localhost:3001

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The frontend will run on http://localhost:3000

Open http://localhost:3000 in your browser to use the application.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
OPENAI_API_KEY=your_openai_api_key_here
TRANSFORMATION_PROMPT=Transform the subject into a surreal glowing liquid form, as if melting into a flowing neon river. The object/text/logo should appear as if made of liquid energy, dripping and merging into streams that extend outward in glowing turquoise and cyan hues. Add fluid swirls, mist, and wave-like patterns in the background. The style should be futuristic fantasy digital art, cinematic lighting, high detail, with a dark teal and neon cyan color palette, emphasizing the liquified transformation.
\`\`\`

**Note**: The `TRANSFORMATION_PROMPT` is now stored securely in environment variables instead of being hardcoded in the API route.

## How It Works

1. Upload an image through the web interface
2. The backend processes the image using OpenAI's image editing API
3. A specialized prompt transforms the image into liquid form
4. The result is displayed with a glowing neon border effect

## API Endpoint

- `POST /api/convert` - Accepts an image file and returns the liquified version

## Technologies Used

- **Frontend**: Next.js, React
- **Backend**: Express.js, Multer
- **AI**: OpenAI Image Editing API
- **Styling**: Inline CSS with neon theme
