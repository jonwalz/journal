# Neobrutalism Remix Application

A modern web application built with Remix, featuring a Neobrutalism design system with server-side theme persistence.

## 🎨 Features

- Server-side persisted dark/light theme
- Neobrutalism-styled UI components
- Responsive sidebar navigation
- Breadcrumb navigation
- Mobile-first design
- Comprehensive UI component library
- Type-safe development
- Feature-based architecture

## 🛠 Tech Stack

- [Remix](https://remix.run/docs) - Full stack web framework
- [React](https://reactjs.org/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- Custom UI Component Library
- Server-side theme persistence

## 🏗 Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📦 Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## 📁 Project Structure

```
app/
├── actions/         # Server actions (e.g., theme setting)
├── components/      # React components
│   ├── ui/         # Base UI components
│   ├── Article/    # Content components
│   ├── Breadcrumb/ # Navigation components
│   └── Sidebar/    # Layout components
├── config/         # Application configuration
├── constants/      # Shared constants
├── features/       # Feature-based modules
│   └── theme/      # Theme management
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts
├── lib/           # Utility libraries
├── routes/        # Application routes
├── services/      # External service integrations
├── styles/        # Global styles
│   └── theme/     # Theme configuration
├── types/         # TypeScript definitions
└── utils/         # Utility functions
```

## 🎯 Key Components

- **ThemeProvider**: Manages application theming with server-side persistence
- **MainLayout**: Core layout with responsive sidebar
- **Breadcrumb**: Navigation breadcrumb component
- **UI Components**: Comprehensive set of Neobrutalism-styled components
  - Alerts
  - Avatar
  - Buttons
  - Cards
  - Dialog
  - Dropdown Menu
  - Input fields
  - Sheets
  - And more...

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT
