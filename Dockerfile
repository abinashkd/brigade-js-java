FROM maven:3.6.3-openjdk-8 as MAVEN_BUILD
WORKDIR /src

RUN mvn clean package -DskipTests
FROM openjdk:8-jdk-alpine
COPY /src/target/brigade-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","dischargelistingest-0.0.1-SNAPSHOT.jar"]