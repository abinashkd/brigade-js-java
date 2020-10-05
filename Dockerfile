FROM maven:3.6.3-openjdk-8 as MAVEN_BUILD
COPY pom.xml /build/
COPY src /build/src/
WORKDIR /build/
RUN mvn clean install
COPY /build/target/brigade-0.0.1-SNAPSHOT.jar app.jar

FROM openjdk:8-jdk-alpine

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]