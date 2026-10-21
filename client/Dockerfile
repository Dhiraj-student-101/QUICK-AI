# 1. Base Image
FROM node:20-alpine

# 2. Working Directory
WORKDIR /app

# 3. Dependencies copy & install
COPY package*.json ./
RUN npm install

# 4. Source code copy karein
COPY . .

# 5. Frontend port (Vite ke liye 5173 ya 3000)
EXPOSE 5173

# 6. Development server start karein with host flag (taaki container ke bahar access ho sake)
CMD ["npm", "run", "dev", "--", "--host"]