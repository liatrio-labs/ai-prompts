# AI Prompts

A collection of prompts for use in AI tools as part of day-to-day software development.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://github.com/liatrio-labs/ai-prompts/blob/main/LICENSE)

## About This Collection

This collection contains curated prompts for AI tools that support day-to-day software development activities. The prompts are organized by use case and designed to be easily integrated into various development workflows.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/liatrio-labs/ai-prompts.git
cd ai-prompts
```

### 2. Browse the Prompts

The prompts are organized in the `prompts/` directory by category:

- `development/` - Development workflow and coding prompts
- `documentation-and-research/` - Documentation, content generation, and research prompts

### 3. Use Prompts with AI Tools

**Option A: Direct Copy**
Copy prompts directly from the files into your preferred AI tool (Cursor, Claude Code, Windsurf, etc.) and customize the parameters as needed for your specific use case.

**Option B: Install with Slash Command Manager (Recommended)**
Use the [Slash Command Manager](https://github.com/liatrio-labs/slash-command-manager) to automatically install prompts for your AI coding assistant. The tool will detect your installed AI assistants and let you choose where to install:

```bash
# Install development prompts
uvx --from git+https://github.com/liatrio-labs/slash-command-manager slash-man generate \
  --github-repo liatrio-labs/ai-prompts \
  --github-branch main \
  --github-path prompts/development

# Install documentation and research prompts
uvx --from git+https://github.com/liatrio-labs/slash-command-manager slash-man generate \
  --github-repo liatrio-labs/ai-prompts \
  --github-branch main \
  --github-path prompts/documentation-and-research
```

See the [Slash Command Manager documentation](https://github.com/liatrio-labs/slash-command-manager) for more details.

## Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute new prompts and improvements
- [Code of Conduct](CODE_OF_CONDUCT.md) - Community expectations and reporting guidance

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Adding new prompts
- Improving existing prompts
- Submitting issues and feedback
- Following our commit conventions

## License

Copyright 2025 Liatrio

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
