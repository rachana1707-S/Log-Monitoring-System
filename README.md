# LogPulse

LogPulse is a cloud-native distributed log monitoring platform built using
Spring Boot, Apache Kafka, Elasticsearch, React, Docker, and AWS.

Applications send logs to LogPulse through a REST API. Logs are published
to Kafka, processed asynchronously, indexed into Elasticsearch, and
displayed through a real-time monitoring dashboard.

## Tech Stack

Backend: Java, Spring Boot

Messaging: Apache Kafka

Search Engine: Elasticsearch

Frontend: React

Containerization: Docker

Cloud: AWS

AWS Services:
EC2
S3
CloudFront
ECR
CloudWatch
IAM

## Core Features

Log ingestion

Asynchronous Kafka processing

Full-text log search

Filtering by severity and service

Real-time log monitoring

Analytics dashboard

Alert rules

Cloud deployment

CI/CD