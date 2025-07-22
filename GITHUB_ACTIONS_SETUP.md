# GitHub Actions Setup Guide

## Overview
This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD) instead of Travis CI.

## Workflow Configuration

### Location
- **Workflow File:** `.github/workflows/ci.yml`
- **Triggers:** Push to main/develop branches and pull requests

### Features
- **Java 21 Environment:** Latest Ubuntu with Temurin JDK
- **Gradle Caching:** Optimized build performance
- **Service Integration:** PostgreSQL, Redis, Kafka, Zookeeper
- **Test Automation:** Unit and integration tests
- **Artifact Management:** Test reports and coverage

## How It Works

### 1. Automatic Triggers
- **Push to main:** Triggers build and test
- **Push to develop:** Triggers build and test
- **Pull Request:** Triggers build and test for review

### 2. Build Process
```yaml
1. Checkout code
2. Setup Java 21 (Temurin)
3. Setup Gradle 8.5 with caching
4. Start infrastructure services (PostgreSQL, Redis, Kafka)
5. Wait for services to be ready
6. Build application with Gradle
7. Run tests
8. Generate test reports
9. Upload artifacts
```

### 3. Service Integration
- **PostgreSQL 15:** Test database
- **Redis 7:** Cache service
- **Kafka 7.4:** Message queue
- **Zookeeper:** Kafka coordination

## Monitoring

### View Workflows
1. Go to your GitHub repository
2. Click "Actions" tab
3. View workflow runs and logs

### Build Status
- **Green Check:** Build successful
- **Red X:** Build failed
- **Yellow Circle:** Build in progress

## Troubleshooting

### Common Issues
1. **Service Connection Failures:**
   - Check service health commands
   - Verify port configurations
   - Review service dependencies

2. **Build Failures:**
   - Check Gradle logs
   - Verify Java version compatibility
   - Review test failures

3. **Cache Issues:**
   - Clear Gradle cache if needed
   - Check cache configuration

### Debug Steps
1. View workflow logs in GitHub Actions
2. Check specific step failures
3. Review environment variables
4. Verify service connectivity

## Benefits Over Travis CI

### Advantages
- **Free Tier:** Unlimited builds for public repositories
- **Better Integration:** Native GitHub integration
- **Faster Builds:** Optimized runners and caching
- **More Features:** Advanced workflow capabilities
- **Better UI:** Improved user interface and logs

### Migration Benefits
- No pricing restrictions
- Better performance
- More reliable service
- Enhanced security features 