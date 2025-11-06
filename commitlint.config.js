module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, missing semicolons, etc.)
        'refactor', // Code changes that neither fix a bug nor add a feature
        'perf',     // Performance improvements
        'test',     // Adding or modifying tests
        'chore',    // Changes to build process or auxiliary tools
        'revert',   // Revert a previous commit
        'ci',       // CI configuration changes
        'build'     // Changes that affect the build system or external dependencies
      ]
    ],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always']
  }
};
