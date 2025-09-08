# Base image with Java 24
FROM openjdk:24

# Metadata
LABEL authors="taman"

# Set working directory in container
WORKDIR /app

# Copy the built JAR into the container
COPY target/payments-service-0.0.1-SNAPSHOT.jar app.jar

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
