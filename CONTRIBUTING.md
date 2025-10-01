# Contributing to Exam Countdown Extension

Thank you for your interest in contributing to the Exam Countdown Extension! We welcome contributions from everyone. This document provides guidelines and information on how to contribute effectively.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Style Guidelines](#style-guidelines)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [your-email@example.com](mailto:your-email@example.com).

## 🤝 How to Contribute

### Types of Contributions

- 🐛 **Bug Reports**: Report bugs and issues
- ✨ **Feature Requests**: Suggest new features or improvements
- 🛠️ **Code Contributions**: Submit pull requests with fixes or enhancements
- 📖 **Documentation**: Improve documentation, README, or code comments
- 🧪 **Testing**: Write or improve tests

### Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a new branch for your changes
4. **Make** your changes
5. **Test** your changes
6. **Commit** your changes
7. **Push** to your fork
8. **Create** a Pull Request

## 🛠️ Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- pnpm (package manager)

### Installation

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/your-username/exam-countdown-extension.git
   cd exam-countdown-extension
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start development server:

   ```bash
   pnpm dev
   ```

For Firefox development:

```bash
export TARGET_BROWSER=firefox
pnpm dev
```

## 📝 Submitting Changes

### Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Update documentation if necessary
3. Add tests for new features
4. Ensure all tests pass
5. Update the README.md if needed
6. Create a descriptive pull request title and description

### Commit Messages

Use clear, descriptive commit messages. Follow this format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:

```
feat(ui): add dark mode toggle

- Add toggle button in settings
- Implement CSS variables for theme switching
- Update popup and newtab pages

Closes #123
```

## 🐛 Reporting Issues

When reporting issues, please include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs. actual behavior
- **Screenshots** if applicable
- **Browser and version** information
- **Extension version**

## 🎨 Style Guidelines

### JavaScript/TypeScript

- Use ES6+ features
- Follow consistent naming conventions (camelCase for variables/functions)
- Use descriptive variable and function names
- Add JSDoc comments for functions

### CSS

- Use Tailwind CSS classes where possible
- Follow BEM methodology for custom classes
- Maintain consistent spacing and typography

### HTML

- Use semantic HTML elements
- Ensure accessibility (alt text, ARIA labels)
- Keep markup clean and minimal

### General

- Write self-documenting code
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic

## 🧪 Testing

- Test your changes in both Chrome and Firefox
- Verify functionality works as expected
- Check for any console errors
- Test edge cases and error handling

## 📞 Getting Help

If you need help or have questions:

- Check existing [issues](https://github.com/NovatraX/exam-countdown-extension/issues) and [discussions](https://github.com/NovatraX/exam-countdown-extension/discussions)
- Create a new issue with the "question" label
- Join our community discussions

Thank you for contributing to the Exam Countdown Extension! 🎉
