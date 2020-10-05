FROM maven:3.6.3-openjdk-8 as MAVEN_BUILD
RUN mvn clean package -DskipTests
FROM openjdk:8-jdk-alpine
COPY /target/brigade-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","dischargelistingest-0.0.1-SNAPSHOT.jar"]