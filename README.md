# Goatoweenfy Image Generator

Transform your images into spooky Halloween art using OpenAI's image editing API. This project creates stunning Halloween-themed transformations with magical effects.

## Features

- Upload any image format
- AI-powered Halloween transformation
- Spooky themed aesthetic
- Real-time processing feedback
- Clean, responsive interface

## Project Structure

\`\`\`
goatoweenfy-app/
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
TRANSFORMATION_PROMPT=Transform the subject into a spooky Halloween-themed form with magical effects. Add Halloween elements like pumpkins, ghosts, bats, or eerie moonlight. The style should be Halloween fantasy digital art, atmospheric lighting, high detail, with an orange, purple, and dark color palette.
\`\`\`

**Note**: The `TRANSFORMATION_PROMPT` is now stored securely in environment variables instead of being hardcoded in the API route.

## How It Works

1. Upload an image through the web interface
2. The backend processes the image using OpenAI's image editing API
3. A specialized prompt transforms the image into Halloween art
4. The result is displayed with Halloween-themed styling

## API Endpoint

- `POST /api/convert` - Accepts an image file and returns the goatoweenfied version

## Technologies Used

- **Frontend**: Next.js, React
- **Backend**: Express.js, Multer
- **AI**: OpenAI Image Editing API
- **Styling**: Tailwind CSS with Halloween theme
