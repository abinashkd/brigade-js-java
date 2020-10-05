FROM maven:3.6.3-openjdk-8 as MAVEN_BUILD
COPY pom.xml /build/
COPY src /build/src/
WORKDIR /build/
RUN mvn clean package -DskipTests

RUN mkdir -p /home/Azure/bin

FROM openjdk:8-jdk-alpine
COPY --from=MAVEN_BUILD /build/target/brigade-0.0.1-SNAPSHOT.jar /home/Azure/bin/

WORKDIR /home/Azure/bin
EXPOSE 8080
ENTRYPOINT ["java","-jar","brigade-0.0.1-SNAPSHOT.jar"]