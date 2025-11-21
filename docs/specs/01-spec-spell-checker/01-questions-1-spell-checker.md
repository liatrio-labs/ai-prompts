# 01 Questions Round 1 - Spell Checker

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Spell Checker Tool Selection

Which spell checker tool should we integrate into the pre-commit configuration?

- [ ] (A) **codespell** - Fast, designed for code repositories, supports multiple languages, common in pre-commit setups
- [x] (B) **typos** - Rust-based, very fast, good for code and documentation, modern alternative
- [ ] (C) **pyspeller** - Python-based, flexible, supports custom dictionaries
- [ ] (D) **aspell** or **hunspell** - Traditional spell checkers, more comprehensive but slower
- [ ] (E) Other (describe)

**Additional Notes:**

## 2. File Types to Check

Which file types should the spell checker examine?

- [x] (A) **Markdown files only** (`*.md`) - Since this repository primarily contains Markdown prompts
- [ ] (B) **Markdown and YAML files** (`*.md`, `*.yaml`, `*.yml`) - Include configuration files
- [ ] (C) **All text-based files** - Markdown, YAML, JSON, and other text files
- [ ] (D) **Markdown files with specific exclusions** - Check all `.md` files except certain ones (specify which)
- [ ] (E) Other (describe)

**Additional Notes:**

## 3. Files to Exclude

Which files or patterns should be excluded from spell checking?

- [ ] (A) **CHANGELOG.md and LICENSE** - Already excluded from markdownlint, should we match that pattern?
- [ ] (B) **Generated files** - Any auto-generated content (if applicable)
- [ ] (C) **Technical terms in code blocks** - Exclude spell checking inside code fences (```code```)
- [ ] (D) **URLs and links** - Exclude checking URLs and web addresses
- [x] (E) Other (describe) check all markdown files, that's it.

**Additional Notes:**

## 4. Custom Dictionary Management

How should we handle technical terms, proper nouns, and repository-specific terminology?

- [ ] (A) **Create a project dictionary file** - Maintain a `.spelling` or `.dict` file with allowed terms
- [ ] (B) **Use inline ignore comments** - Allow `<!-- spell-checker:ignore -->` style comments in files
- [ ] (C) **Both dictionary file and inline ignores** - Comprehensive approach for flexibility
- [x] (D) **No custom dictionary initially** - Start with default dictionary, add terms as needed
- [ ] (E) Other (describe)

**Additional Notes:**

## 5. Behavior on Spell Check Failures

What should happen when the spell checker finds errors?

- [ ] (A) **Fail the commit** - Block commits with spelling errors, require fixes before proceeding
- [ ] (B) **Warn but allow commit** - Report errors but don't block (use `--no-verify` to skip)
- [x] (C) **Auto-fix when possible** - Automatically correct common misspellings, fail if corrections were made
- [ ] (D) **Fail with helpful suggestions** - Block commit and provide suggested corrections
- [ ] (E) Other (describe)

**Additional Notes:**

## 6. Proof Artifacts

What proof artifacts will demonstrate the spell checker is working correctly?

- [x] (A) **Pre-commit hook output** - Show spell checker running and catching errors during `git commit`
- [x] (B) **Test file with intentional misspellings** - Create a test markdown file that should be caught
- [ ] (C) **Custom dictionary validation** - Show that technical terms are properly recognized
- [ ] (D) **CI/CD integration** - Demonstrate spell checking runs in GitHub Actions workflow
- [ ] (E) Other (describe)

**Additional Notes:**
