#!/bin/bash

echo "Setting up Comgenz development environment..."

# Create necessary directories
mkdir -p client/src/{components,pages,services,utils,assets}

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install

# Return to project root
cd ..

echo "Development environment setup complete!"
echo ""
echo "To start the development server:"
echo "  cd client"
echo "  npm run start"
echo ""
echo "To build for production:"
echo "  cd client"
echo "  npm run build"