# 1. Lightweight Node.js base image
FROM node:18-alpine

# 2. Container ke andar working directory set karein
WORKDIR /app

# 3. Dependencies cache optimize karne ke liye pehle package files copy karein
COPY package*.json ./

# 4. Packages install karein
RUN npm install

# 5. Baaki saara backend code copy karein
COPY . .

# 6. Backend port expose karein (Agar aapka port 5000 hai)
EXPOSE 5000

# 7. Server start command
CMD ["node", "Server.js"]