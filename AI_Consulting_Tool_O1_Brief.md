# AI-Assisted Consulting Tool Project Brief

## Project Overview
Develop an AI-powered tool to assist in problem decomposition, analysis, and solution generation for complex consulting projects, with a focus on maintaining context throughout the development process.

## Key Features
1. Problem input interface
2. LLM-driven problem decomposition
3. Interactive visualization of problem segments and dependencies
4. Data capture and management for each segment
5. Progress tracking and reporting
6. Assumption management and impact analysis
7. Integration of literature reviews and data analysis
8. Modular AI model selection

## Technical Requirements
1. Frontend: Next.js with TypeScript
2. Backend: Python
3. Deployment: Vercel
4. AI Integration: Modular design to support multiple LLMs, starting with Claude Sonnet
5. Database: Flexible schema to handle various problem types and data structures
6. API: RESTful design for communication between frontend, backend, and AI models
7. Security: Implement robust data protection and user authentication

## Architecture Considerations
1. Scalability to handle multiple concurrent users and projects
2. Flexibility to add new AI models and analysis tools
3. Efficient data storage and retrieval for large datasets
4. Real-time updates for collaborative work
5. Extensibility for future features and integrations
6. Modular design for easy maintenance and updates

## Development Approach
1. Agile methodology with iterative development cycles
2. Continuous integration and deployment
3. Comprehensive testing strategy (unit, integration, and end-to-end)

## Context Maintenance Strategies
1. Project Manifest: Create and maintain a comprehensive project manifest file
2. Consistent File Naming: Implement a clear, consistent file naming convention
3. Detailed Comments: Use extensive inline comments and docstrings
4. Session Summaries: Generate summaries at the end of each development session
5. Component-based Development: Focus on completing one component or module at a time
6. Version Control: Use Git with detailed commit messages
7. Task Checklists: Maintain a running checklist of tasks and subtasks
8. Context Prompts: Start each new session with a brief context-setting prompt
9. Modular Testing: Implement and run tests for each module as completed
10. Architecture Diagram: Keep an up-to-date architecture diagram
11. Dependency Tracking: Maintain a clear record of dependencies between components
12. Regular Refactoring: Periodically refactor and consolidate code

## Required Outputs
Please generate a detailed software architecture and project plan based on these requirements, including:
1. System components and their interactions
2. Data flow diagrams
3. API specifications
4. Database schema
5. Development milestones and timeline
6. Testing and quality assurance strategy
7. Deployment and maintenance plan
8. Strategies for implementing and maintaining context throughout development

## Additional Considerations
1. Ensure the architecture supports the context maintenance strategies
2. Design the system to be resilient to potential context loss during development
3. Incorporate mechanisms for easy context recovery and continuation of work
4. Plan for regular architecture and progress reviews to maintain alignment with project goals