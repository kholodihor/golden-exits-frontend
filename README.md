# Golden Exits Frontend

![Golden Exits](https://img.shields.io/badge/Golden%20Exits-Frontend-gold)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)
![Material UI](https://img.shields.io/badge/MUI-5.13.2-007FFF?logo=mui)

A modern, responsive React application for the Golden Exits platform featuring blog posts, comments, user authentication, and e-commerce functionality.

## 🌟 Features

- **User Authentication** - Secure login and registration system
- **Blog Platform** - Read, create, and interact with blog posts
- **Comment System** - Engage with content through a robust commenting system
- **E-commerce Integration** - Browse and purchase products
- **Video Content** - Watch and interact with video content
- **News Feed** - Stay updated with the latest news
- **Responsive Design** - Optimized for all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kholodihor/golden-exits-frontend.git
   cd golden-exits-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## 🛠️ Tech Stack

- **React** - Frontend library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material UI** - Component library
- **Axios** - API requests
- **React Hook Form** - Form handling
- **SCSS Modules** - Styling
- **Vite** - Build tool

## 📁 Project Structure

```
src/
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
│   ├── blog/       # Blog-related components
│   ├── common/     # Shared components
│   └── ...
├── hooks/          # Custom React hooks
├── layouts/        # Page layouts
├── pages/          # Page components
├── redux/          # Redux store and slices
│   ├── slices/     # Redux slices for different features
│   └── store.js    # Redux store configuration
├── styles/         # Global styles
├── utils/          # Utility functions
└── App.jsx         # Main application component
```

## 🔄 State Management

The application uses Redux Toolkit for state management with the following slices:

- **auth** - User authentication state
- **posts** - Blog posts data
- **comment** - Comments functionality
- **products** - E-commerce product data
- **cart** - Shopping cart state
- **news** - News articles
- **videos** - Video content

## 🧪 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Material UI](https://mui.com/)
- [Vite](https://vitejs.dev/)
