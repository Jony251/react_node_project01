# React Node.js Project

A full-stack web application built with React for the frontend and Node.js for the backend.

## Features

- User authentication and authorization
- Responsive design with modern UI
- RESTful API integration
- Secure data management
- Centralized color system
- Dynamic content management through database
- Modular component architecture

## Technologies

### Frontend
- React.js
- React Router for navigation
- CSS Modules for styling
- Context API for state management
- Centralized color system using CSS variables

### Backend
- Node.js
- Express.js
- MySQL for database
- JWT for authentication

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd react_node_project
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd FE
npm install

# Install backend dependencies
cd ../BE
npm install
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd BE
npm run dev
```

2. Start the frontend development server:
```bash
cd FE
npm start
```

The application will be available at `http://localhost:3000`

### Production Mode

1. Build the frontend:
```bash
cd FE
npm run build
```

2. Start the production server:
```bash
cd BE
npm start
```

## Project Structure

```
react_node_project/
├── FE/                     # Frontend directory
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── styles/       # Global styles and color system
│   └── package.json      # Frontend dependencies
│
├── BE/                    # Backend directory
│   ├── database/         # Database configuration
│   ├── routes/           # API routes
│   └── package.json      # Backend dependencies
│
├── DB/                   # Database migrations and schemas
│
└── README.md             # Project documentation
```

## Color System

The project uses a centralized color system located in `FE/src/styles/colors.css`. This provides:

- Consistent theming across all components
- Easy color scheme modifications
- Support for light/dark themes
- Semantic color naming

Example usage:
```css
.myComponent {
    color: var(--text-primary);
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
}
```

## Content Management

The application uses a database-driven content management system for:
- Home page content
- Footer content
- Dynamic text elements

This allows for easy content updates without code changes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- Evgeny Nemchenko
- Leonid Shmiakin

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
