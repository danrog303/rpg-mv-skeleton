FROM beevelop/cordova:v2023.01.1
WORKDIR /opt/rpgmvskel
COPY . .
RUN npm ci --only=production
