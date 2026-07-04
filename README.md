# Portfolio

Personal portfolio built with Next.js, React, TypeScript, Framer Motion, Lenis, and Three.js.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- `@react-three/fiber` and `@react-three/drei`
- Lenis for smooth scrolling

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production build locally
- `npm run lint` - run ESLint

## Project Structure

- `src/app` - app router entry, layout, and global styles
- `src/components` - canvas and UI components
- `public/assets` - images used by the portfolio

## Deployment Checklist

Before pushing or deploying:

1. Run `npm run lint`
2. Run `npm run build`
3. Keep large source videos, exports, and temp media out of Git
4. Confirm all `public/assets` files used by the UI are present
5. Deploy the `main` branch to Vercel or your hosting provider

## Notes

- The repository now ignores common video formats such as `*.mp4`, `*.mov`, and `*.webm`.
- If you need to keep large media files, store them outside the repo or use an external asset host.
