# Contributing to Code2Project

First off, thank you for considering contributing to Code2Project! It's people like you that make Code2Project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots** if relevant
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List some examples** of how it would be used
- **Include mockups or examples** if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Write a clear commit message
6. Open a pull request

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/kaka-technology/code2project.git
cd code2project

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (when available)
npm test

# Build for production
npm run build
```

## Project Structure

```
code2project/
├── src/
│   ├── components/      # React components
│   ├── services/        # Business logic
│   ├── utils/          # Utility functions
│   ├── types.ts        # TypeScript types
│   └── constants.ts    # Constants and translations
├── assets/             # Images and static files
├── .github/            # GitHub configuration
└── public/             # Public assets
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Maintain consistency with the glassmorphism theme
- Ensure responsive design

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

#### Commit Message Format

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(analyzer): add support for dynamic imports

- Implement regex pattern for dynamic import statements
- Add tests for edge cases
- Update documentation

Closes #123
```

## Testing Guidelines

- Write tests for new features
- Ensure existing tests pass
- Aim for good code coverage
- Test edge cases and error conditions

## Documentation

- Update README.md if needed
- Add JSDoc comments for functions
- Update type definitions
- Keep documentation in sync with code

## Review Process

1. All submissions require review
2. We may suggest changes or improvements
3. Be patient and responsive to feedback
4. Once approved, your PR will be merged

## Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes
- Credited in the project

## Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in pull request comments
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Code2Project! 🎉
