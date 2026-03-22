# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Team setup (important)

To avoid version mismatch errors (for example Material style import errors), everyone should use the same Node/npm versions and lockfile.

Check versions:

```bash
node -v   # expected: v24.12.0
npm -v    # expected: 11.6.x
```

If you use nvm:

```bash
nvm use
```

Install dependencies using the lockfile:

```bash
npm ci
```

If your local dependencies are broken, clean and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

PowerShell alternative:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
